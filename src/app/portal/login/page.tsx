"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Palmtree, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { customerLogin } from "@/lib/customer-api";
import { ForgotPassword } from "@/components/auth/forgot-password";

export default function PortalLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await customerLogin(username.trim().toLowerCase(), password);
      router.replace("/portal");
    } catch (err: unknown) {
      setError((err as { response?: { status?: number } })?.response?.status === 401 ? "Invalid email or password." : "Login failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-2">
            <Palmtree className="h-8 w-8 text-gold" />
            <span className="font-serif text-2xl font-bold text-white">Survival Explore</span>
          </div>
          <p className="text-sm text-white/60">Customer Dashboard</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-widget">
        {forgot ? (
          <ForgotPassword onBack={() => setForgot(false)} />
        ) : (
        <form onSubmit={submit}>
          <h1 className="font-serif text-2xl font-semibold text-navy">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Log in with the email &amp; password we sent you.</p>
          {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
          <label className="mt-6 block">
            <span className="text-sm font-medium text-navy">Email</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-cream px-3 focus-within:border-gold">
              <Mail className="h-4 w-4 text-gold" />
              <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus className="w-full bg-transparent py-2.5 text-sm focus:outline-none" placeholder="you@gmail.com" />
            </div>
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-navy">Password</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-cream px-3 focus-within:border-gold">
              <Lock className="h-4 w-4 text-gold" />
              <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-transparent py-2.5 text-sm focus:outline-none" placeholder="••••••••" />
              <button type="button" onClick={() => setShow((v) => !v)} tabIndex={-1} className="text-muted hover:text-navy">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </label>
          <button type="submit" disabled={loading} className="btn-gold mt-6 w-full">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}</button>
          <button type="button" onClick={() => setForgot(true)} className="mt-4 block w-full text-center text-sm text-gold hover:underline">Forgot password?</button>
          <p className="mt-3 text-center text-xs text-muted">First time? Use the password from your registration email, then set a new one.</p>
        </form>
        )}
        </div>
      </div>
    </div>
  );
}
