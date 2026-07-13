"use client";

import { useState } from "react";
import { Mail, KeyRound, Lock, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { API_URL } from "@/lib/api";

/** Email-OTP password reset: request a code, then reset with the code. */
export function ForgotPassword({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await fetch(`${API_URL}/auth/password-reset/request/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const d = await res.json();
      setInfo(d.detail || "If an account exists, a code was sent.");
      setStep("otp");
    } catch { setError("Something went wrong. Try again."); }
    finally { setBusy(false); }
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await fetch(`${API_URL}/auth/password-reset/confirm/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim(), new_password: pw }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || "Invalid or expired code.");
      setStep("done");
    } catch (err) { setError(err instanceof Error ? err.message : "Failed."); }
    finally { setBusy(false); }
  }

  if (step === "done") {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h2 className="mt-3 font-serif text-xl font-semibold text-navy">Password reset</h2>
        <p className="mt-1 text-sm text-muted">You can now log in with your new password.</p>
        <button onClick={onBack} className="btn-gold mt-6 w-full">Back to login</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm text-gold hover:underline"><ArrowLeft className="h-4 w-4" /> Back to login</button>
      <h2 className="font-serif text-xl font-semibold text-navy">Reset your password</h2>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
      {info && step === "otp" && <p className="mt-3 rounded-lg bg-gold/10 px-4 py-2 text-sm text-navy">{info}</p>}

      {step === "email" ? (
        <form onSubmit={requestCode} className="mt-4 space-y-3">
          <p className="text-sm text-muted">Enter your email and we'll send a one-time code.</p>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-cream px-3 focus-within:border-gold">
            <Mail className="h-4 w-4 text-gold" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus placeholder="you@gmail.com" className="w-full bg-transparent py-2.5 text-sm focus:outline-none" />
          </div>
          <button type="submit" disabled={busy} className="btn-gold w-full">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send code"}</button>
        </form>
      ) : (
        <form onSubmit={confirm} className="mt-4 space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-cream px-3 focus-within:border-gold">
            <KeyRound className="h-4 w-4 text-gold" />
            <input value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="6-digit code" className="w-full bg-transparent py-2.5 text-sm tracking-widest focus:outline-none" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-cream px-3 focus-within:border-gold">
            <Lock className="h-4 w-4 text-gold" />
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required placeholder="New password" className="w-full bg-transparent py-2.5 text-sm focus:outline-none" />
          </div>
          <button type="submit" disabled={busy} className="btn-gold w-full">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset password"}</button>
        </form>
      )}
    </div>
  );
}
