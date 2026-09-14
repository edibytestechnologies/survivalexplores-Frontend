import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="July 2026"
      sections={[
        { heading: "1. Bookings & Payments", body: "All bookings are subject to availability and confirmation. A deposit may be required to secure your trip, with the balance due before departure as agreed at the time of booking." },
        { heading: "2. Cancellations & Refunds", body: "Cancellation terms vary by trip and are communicated at booking. Refund eligibility depends on the timing of your cancellation and any non-refundable third-party costs." },
        { heading: "3. Travel Documents", body: "Travelers are responsible for holding valid passports, visas and any required health documentation. We provide assistance but cannot guarantee the issuance of third-party documents." },
        { heading: "4. Liability", body: "Survival Explore acts as an intermediary between travelers and service providers. We are not liable for events beyond our reasonable control, including weather, strikes or force majeure." },
        { heading: "5. Changes to Itineraries", body: "Itineraries may change due to operational or safety reasons. We will always aim to provide comparable alternatives and communicate changes promptly." },
      ]}
    />
  );
}
