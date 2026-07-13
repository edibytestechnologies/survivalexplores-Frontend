"use client";

import { useState } from "react";
import { User, Mail, Phone, MessageCircle, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { API_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "done" | "error";

export function RegistrationForm({
  destinationId,
  destinationTitle,
}: {
  destinationId?: number;
  destinationTitle?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`${API_URL}/registrations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, destination: destinationId ?? null }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Registration failed. Please try again.");
      }
      const d = await res.json();
      setMessage(d.message || "Registration successful! Our team will contact you shortly.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-white p-10 text-center shadow-card">
        <CheckCircle2 className="h-16 w-16 text-gold" />
        <h3 className="mt-4 font-serif text-2xl font-semibold text-navy">Registration Successful!</h3>
        <p className="mt-2 max-w-md text-muted">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-8 shadow-card">
      {destinationTitle && (
        <p className="mb-6 rounded-lg bg-gold/10 px-4 py-3 text-sm text-navy">
          You are registering for <span className="font-semibold">{destinationTitle}</span>.
        </p>
      )}
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

      <div className="space-y-4">
        <Field icon={<User className="h-4 w-4 text-gold" />}>
          <input required value={form.full_name} onChange={set("full_name")} placeholder="Full Name *" className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none" />
        </Field>
        <Field icon={<Mail className="h-4 w-4 text-gold" />}>
          <input required type="email" value={form.email} onChange={set("email")} placeholder="Email Address *" className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field icon={<Phone className="h-4 w-4 text-gold" />}>
            <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="Active Phone Number *" className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none" />
          </Field>
          <Field icon={<MessageCircle className="h-4 w-4 text-gold" />}>
            <input type="tel" value={form.whatsapp} onChange={set("whatsapp")} placeholder="WhatsApp Number" className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none" />
          </Field>
        </div>
        <Field icon={<MapPin className="h-4 w-4 text-gold" />}>
          <input required value={form.address} onChange={set("address")} placeholder="Location / Address *" className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none" />
        </Field>
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-gold mt-6 w-full">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register"}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        You&apos;ll receive a confirmation and our team will reach out with the next steps.
      </p>
    </form>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-lg border border-gray-200 bg-cream px-3 focus-within:border-gold")}>
      {icon}
      {children}
    </div>
  );
}
