import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VisitTracker } from "@/components/analytics/visit-tracker";
import { getSiteSettings } from "@/lib/api";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <VisitTracker />
      <Navbar logoSrc={settings.logo || undefined} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
