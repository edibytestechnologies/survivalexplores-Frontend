"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Palmtree, Smartphone, Loader2, CheckCircle2, CreditCard } from "lucide-react";
import { API_URL } from "@/lib/api";

export default function PayLinkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "collecting" | "waiting" | "success" | "failed">("idle");
  const [error, setError] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pay-link", token],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/pay/link/${token}/`);
      if (!res.ok) throw new Error("not found");
      return res.json() as Promise<{ title: string; amount: string; status: string }>;
    },
    retry: false,
  });

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setStatus("collecting"); setError("");
    try {
      const res = await fetch(`${API_URL}/pay/link/${token}/collect/`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: phone.trim() }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Could not start payment.");
      setStatus("waiting"); poll(d.payment_id);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed."); setStatus("failed"); }
  }

  function poll(id: number, tries = 0) {
    if (tries > 40) { setStatus("failed"); setError("Timed out. If you approved it, please wait a moment."); return; }
    setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/pay/status/${id}/`);
        const d = await res.json();
        if (d.status === "success") setStatus("success");
        else if (d.status === "failed") { setStatus("failed"); setError("Payment failed or declined."); }
        else poll(id, tries + 1);
      } catch { poll(id, tries + 1); }
    }, 4000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Palmtree className="h-7 w-7 text-gold" />
          <span className="font-serif text-xl font-bold text-white">Survival Explore</span>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-widget">
          {isLoading ? (
            <div className="py-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-gold" /></div>
          ) : isError || !data ? (
            <p className="py-8 text-center text-muted">This payment link is invalid or has expired.</p>
          ) : status === "success" || data.status === "paid" ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
              <p className="mt-4 font-serif text-2xl font-semibold text-navy">Payment complete</p>
              <p className="mt-1 text-muted">Thank you! Your payment has been received.</p>
            </div>
          ) : (
            <form onSubmit={start}>
              <p className="text-sm text-muted">{data.title}</p>
              <p className="mt-1 font-serif text-4xl font-bold text-navy">GHS {data.amount}</p>
              {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
              <label className="mt-6 block">
                <span className="text-sm font-medium text-navy">Mobile money number</span>
                <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-cream px-3 focus-within:border-gold">
                  <Smartphone className="h-4 w-4 text-gold" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="0552779311" className="w-full bg-transparent py-2.5 text-sm focus:outline-none" />
                </div>
              </label>
              {status === "waiting" ? (
                <div className="mt-5 rounded-lg bg-gold/10 p-4 text-center text-sm text-navy">
                  <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-gold" />
                  Approve the prompt on your phone. Waiting for confirmation…
                </div>
              ) : (
                <button type="submit" disabled={status === "collecting"} className="btn-gold mt-6 w-full">
                  {status === "collecting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CreditCard className="h-4 w-4" /> Pay Now</>}
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
