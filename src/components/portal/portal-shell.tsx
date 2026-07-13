"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, CreditCard, User, LogOut, Palmtree, Menu, X, Loader2, Lock, Bell } from "lucide-react";
import { customerApi, getCustomerToken, clearCustomerTokens } from "@/lib/customer-api";
import { requestPushPermission, showNotification } from "@/components/portal/notify";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "My Trips", href: "/portal", icon: LayoutDashboard },
  { label: "Billing", href: "/portal/billing", icon: CreditCard },
  { label: "Profile", href: "/portal/profile", icon: User },
];

interface Me {
  first_name: string; email: string; avatar: string; must_change_password: boolean;
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const qc = useQueryClient();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  const isLogin = pathname === "/portal/login";

  useEffect(() => {
    if (isLogin) { setReady(true); return; }
    if (!getCustomerToken()) router.replace("/portal/login");
    else setReady(true);
  }, [isLogin, pathname, router]);

  useEffect(() => setOpen(false), [pathname]);

  const { data: me } = useQuery<Me>({
    queryKey: ["me"],
    queryFn: async () => (await customerApi.get("/me/")).data,
    enabled: ready && !isLogin,
  });

  // Ask for notifications on first entry + welcome chime
  useEffect(() => {
    if (me && !isLogin) {
      requestPushPermission().then((ok) => {
        if (ok) showNotification("Welcome back 👋", "You'll be notified about trips, bills and payments.");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.email]);

  if (isLogin) return <>{children}</>;
  if (!ready) return <div className="flex min-h-screen items-center justify-center bg-navy text-gold"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  function logout() { clearCustomerTokens(); router.replace("/portal/login"); }

  return (
    <div className="min-h-screen bg-cream">
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 transform bg-navy text-white transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <Palmtree className="h-6 w-6 text-gold" />
          <span className="font-serif text-lg font-bold">My Dashboard</span>
        </div>
        <nav className="mt-4 px-3">
          {NAV.map((item) => {
            const active = item.href === "/portal" ? pathname === "/portal" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={cn("mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-gold text-white" : "text-white/70 hover:bg-white/10 hover:text-white")}>
                <item.icon className="h-5 w-5" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-3">
          <a href="/" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white">
            <Palmtree className="h-5 w-5" /> Main Site
          </a>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-red-500/20 hover:text-white">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5">
          <button className="lg:hidden" onClick={() => setOpen((v) => !v)}>{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => requestPushPermission()} title="Enable notifications" className="text-muted hover:text-gold"><Bell className="h-5 w-5" /></button>
            <span className="hidden text-sm text-muted sm:block">{me?.email}</span>
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gold text-sm font-semibold text-white">
              {me?.avatar ? <img src={me.avatar} alt="" className="h-full w-full object-cover" /> : (me?.first_name?.[0] || "U")}
            </div>
          </div>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>

      {me?.must_change_password && <ForcePasswordReset onDone={() => qc.invalidateQueries({ queryKey: ["me"] })} />}
    </div>
  );
}

function ForcePasswordReset({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 4) return setErr("Password must be at least 4 characters.");
    if (pw !== pw2) return setErr("Passwords don't match.");
    setBusy(true); setErr("");
    try {
      await customerApi.post("/me/password/", { new_password: pw });
      onDone();
    } catch {
      setErr("Could not update password. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/80 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-widget">
        <div className="mb-2 flex items-center gap-2 text-gold"><Lock className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-wide">Security</span></div>
        <h2 className="font-serif text-2xl font-semibold text-navy">Set your password</h2>
        <p className="mt-1 text-sm text-muted">For your security, please replace the default password before continuing.</p>
        {err && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{err}</p>}
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" required className="mt-5 w-full rounded-lg border border-gray-200 bg-cream px-4 py-3 text-sm focus:border-gold focus:outline-none" />
        <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Confirm new password" required className="mt-3 w-full rounded-lg border border-gray-200 bg-cream px-4 py-3 text-sm focus:border-gold focus:outline-none" />
        <button type="submit" disabled={busy} className="btn-gold mt-6 w-full">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save & Continue"}</button>
      </form>
    </div>
  );
}
