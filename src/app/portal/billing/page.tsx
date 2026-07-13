"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, CheckCircle2, Loader2, Smartphone, Clock } from "lucide-react";
import { customerApi } from "@/lib/customer-api";
import { AdminHeader, Card, Badge, EmptyState, Modal } from "@/components/admin/ui";
import { showNotification } from "@/components/portal/notify";

interface Installment { id: number; label: string; amount: string; order: number; status: string }
interface Bill {
  id: number; title: string; trip_title: string; total_amount: string; currency: string;
  schedule: string; status: string; amount_paid: string; balance: string; installments: Installment[];
}

export default function BillingPage() {
  const qc = useQueryClient();
  const [pay, setPay] = useState<{ inst: Installment; bill: Bill } | null>(null);

  const { data = [], isLoading } = useQuery<Bill[]>({
    queryKey: ["my-bills"],
    queryFn: async () => (await customerApi.get("/me/bills/")).data,
  });

  const color: Record<string, "green" | "gold" | "navy" | "red"> = { paid: "green", partial: "gold", pending: "navy", cancelled: "red" };

  return (
    <>
      <AdminHeader title="Billing" subtitle="Your trip payments. Pay securely with mobile money." />
      {isLoading ? (
        <div className="p-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-gold" /></div>
      ) : data.length === 0 ? (
        <EmptyState text="You have no bills. Nothing to pay right now 🎉" />
      ) : (
        <div className="space-y-5">
          {data.map((b) => (
            <Card key={b.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-navy">{b.trip_title || b.title}</h3>
                  <p className="text-sm text-muted">{b.schedule === "installment" ? `${b.installments.length}-part installment` : "One-time payment"}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl font-bold text-navy">{b.currency} {b.balance}</p>
                  <p className="text-xs text-muted">balance of {b.currency} {b.total_amount}</p>
                  <Badge color={color[b.status] ?? "navy"}>{b.status}</Badge>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                {b.installments.map((inst) => (
                  <div key={inst.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      {inst.status === "paid" ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Clock className="h-5 w-5 text-gold" />}
                      <div>
                        <p className="text-sm font-medium text-navy">{inst.label}</p>
                        <p className="text-xs text-muted">{b.currency} {inst.amount}</p>
                      </div>
                    </div>
                    {inst.status === "paid" ? (
                      <span className="text-sm font-medium text-emerald-600">Paid</span>
                    ) : (
                      <button onClick={() => setPay({ inst, bill: b })} className="btn-gold px-4 py-2 text-sm">
                        <Smartphone className="h-4 w-4" /> Pay
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {pay && <PayModal inst={pay.inst} bill={pay.bill} onClose={() => setPay(null)} onPaid={() => { qc.invalidateQueries({ queryKey: ["my-bills"] }); showNotification("Payment received ✓", "Your balance has been updated."); setPay(null); }} />}
    </>
  );
}

function PayModal({ inst, bill, onClose, onPaid }: { inst: Installment; bill: Bill; onClose: () => void; onPaid: () => void }) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "collecting" | "waiting" | "success" | "failed">("idle");
  const [error, setError] = useState("");

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setStatus("collecting"); setError("");
    try {
      const { data } = await customerApi.post("/pay/installment/", { installment: inst.id, phone: phone.trim() });
      setStatus("waiting");
      poll(data.payment_id);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Could not start payment.");
      setStatus("failed");
    }
  }

  function poll(paymentId: number, tries = 0) {
    if (tries > 40) { setStatus("failed"); setError("Payment timed out. If you approved it, refresh in a moment."); return; }
    setTimeout(async () => {
      try {
        const { data } = await customerApi.get(`/pay/status/${paymentId}/`);
        if (data.status === "success") { setStatus("success"); setTimeout(onPaid, 1500); }
        else if (data.status === "failed") { setStatus("failed"); setError("Payment failed or was declined."); }
        else poll(paymentId, tries + 1);
      } catch { poll(paymentId, tries + 1); }
    }, 4000);
  }

  return (
    <Modal open onClose={status === "waiting" ? () => {} : onClose} title={`Pay ${bill.currency} ${inst.amount}`}>
      {status === "success" ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
          <p className="mt-4 font-serif text-xl font-semibold text-navy">Payment successful!</p>
        </div>
      ) : (
        <form onSubmit={start} className="space-y-4">
          <p className="text-sm text-muted">{bill.trip_title || bill.title} — {inst.label}</p>
          {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
          <label className="block">
            <span className="text-sm font-medium text-navy">Mobile money number</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-cream px-3 focus-within:border-gold">
              <Smartphone className="h-4 w-4 text-gold" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={status !== "idle" && status !== "failed"} placeholder="0552779311" className="w-full bg-transparent py-2.5 text-sm focus:outline-none" />
            </div>
          </label>
          {status === "waiting" ? (
            <div className="rounded-lg bg-gold/10 p-4 text-center text-sm text-navy">
              <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-gold" />
              Approve the prompt on your phone (dial the USSD if it doesn't pop up). Waiting for confirmation…
            </div>
          ) : (
            <button type="submit" disabled={status === "collecting"} className="btn-gold w-full">
              {status === "collecting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CreditCard className="h-4 w-4" /> Pay {bill.currency} {inst.amount}</>}
            </button>
          )}
        </form>
      )}
    </Modal>
  );
}
