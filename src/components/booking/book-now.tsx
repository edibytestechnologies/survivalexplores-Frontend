"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, User, Mail, Phone, Lock, MessageCircle, Loader2, CheckCircle2, CalendarCheck } from "lucide-react";
import { API_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "done" | "error";

interface Props {
  destinationId?: number;
  destinationTitle?: string;
  className?: string;
  label?: string;
  children?: React.ReactNode;
}

export function BookNowButton({ destinationId, destinationTitle, className, label = "Book Now", children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children ?? label}
      </button>
      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        destinationId={destinationId}
        destinationTitle={destinationTitle}
      />
    </>
  );
}

function BookingModal({
  open,
  onClose,
  destinationId,
  destinationTitle,
}: {
  open: boolean;
  onClose: () => void;
  destinationId?: number;
  destinationTitle?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "", whatsapp: "" });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStatus("idle");
      setError("");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`${API_URL}/bookings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, destination: destinationId ?? null }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Something went wrong. Please try again.");
      }
      const d = await res.json();
      setMessage(d.message || "Thank you! Our team will contact you shortly.");
      setStatus("done");
      setForm({ full_name: "", email: "", phone: "", password: "", whatsapp: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setStatus("error");
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-widget"
          >
            {/* Header */}
            <div className="relative rounded-t-2xl bg-navy px-6 py-5 text-white">
              <button onClick={onClose} className="absolute right-4 top-4 text-white/70 hover:text-white" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-gold" />
                <h2 className="font-serif text-xl font-semibold">Book Your Trip</h2>
              </div>
              <p className="mt-1 text-sm text-white/70">
                {destinationTitle ? `Reserve your spot for ${destinationTitle}.` : "Tell us how to reach you and our team will do the rest."}
              </p>
            </div>

            {status === "done" ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
                  <CheckCircle2 className="h-16 w-16 text-gold" />
                </motion.div>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-navy">Request Received!</h3>
                <p className="mt-2 text-muted">{message}</p>
                <button onClick={onClose} className="btn-gold mt-6">Done</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3 p-6">
                {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

                <IconField icon={<User className="h-4 w-4 text-gold" />}>
                  <input required value={form.full_name} onChange={set("full_name")} placeholder="Full Name" className="field-input" />
                </IconField>
                <IconField icon={<Mail className="h-4 w-4 text-gold" />}>
                  <input required type="email" value={form.email} onChange={set("email")} placeholder="Email Address" className="field-input" />
                </IconField>
                <IconField icon={<Phone className="h-4 w-4 text-gold" />}>
                  <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="Phone Number" className="field-input" />
                </IconField>
                <IconField icon={<MessageCircle className="h-4 w-4 text-gold" />}>
                  <input type="tel" value={form.whatsapp} onChange={set("whatsapp")} placeholder="WhatsApp Number" className="field-input" />
                </IconField>
                <IconField icon={<Lock className="h-4 w-4 text-gold" />}>
                  <input required type="password" value={form.password} onChange={set("password")} placeholder="Create a Password" className="field-input" />
                </IconField>

                <button type="submit" disabled={status === "loading"} className="btn-gold mt-2 w-full">
                  {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Booking Request"}
                </button>
                <p className="text-center text-xs text-muted">
                  By submitting, our staff will reach out to confirm availability &amp; payment.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function IconField({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-lg border border-gray-200 bg-cream px-3 focus-within:border-gold")}>
      {icon}
      {children}
    </div>
  );
}
