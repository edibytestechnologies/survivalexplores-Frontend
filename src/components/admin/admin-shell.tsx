"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  MapPinned,
  Wrench,
  Newspaper,
  Star,
  Mail,
  Users,
  Settings,
  LogOut,
  Palmtree,
  Menu,
  X,
  ExternalLink,
  CalendarCheck,
  Send,
  ClipboardList,
  Receipt,
} from "lucide-react";
import { getToken, clearTokens, API_URL } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

function useLogo() {
  const { data } = useQuery({
    queryKey: ["site-logo"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/settings/`);
      if (!res.ok) return "";
      const s = await res.json();
      return (s.logo as string) || "";
    },
    staleTime: 30_000,
  });
  return data || "";
}

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Registrations", href: "/admin/registrations", icon: ClipboardList },
  { label: "Billing", href: "/admin/billing", icon: Receipt },
  { label: "Destinations", href: "/admin/destinations", icon: MapPinned },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Email", href: "/admin/email", icon: Send },
  { label: "Subscribers", href: "/admin/subscribers", icon: Users },
  { label: "Site & About", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const logo = useLogo();

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!getToken()) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [isLogin, pathname, router]);

  useEffect(() => setOpen(false), [pathname]);

  if (isLogin) return <>{children}</>;
  if (!ready)
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy text-gold">
        Loading dashboard…
      </div>
    );

  function logout() {
    clearTokens();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-navy text-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Survival Explore" className="h-9 w-auto object-contain" />
          ) : (
            <>
              <Palmtree className="h-6 w-6 text-gold" />
              <span className="font-serif text-lg font-bold">Survival Explore</span>
            </>
          )}
        </div>
        <nav className="mt-4 px-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-gold text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-3">
          <a
            href="/"
            target="_blank"
            className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-5 w-5" /> View Site
          </a>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-red-500/20 hover:text-white"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5">
          <button className="lg:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted">Admin</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-semibold text-white">
              A
            </div>
          </div>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
