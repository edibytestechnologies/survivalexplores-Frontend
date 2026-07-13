import { PortalShell } from "@/components/portal/portal-shell";

export const metadata = {
  title: "My Dashboard",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
