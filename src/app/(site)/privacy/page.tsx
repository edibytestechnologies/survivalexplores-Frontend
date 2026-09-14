import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      sections={[
        { heading: "Information We Collect", body: "We collect the information you provide when booking or contacting us — such as your name, email, phone number and travel preferences — to deliver and improve our services." },
        { heading: "How We Use Your Data", body: "Your information is used to process bookings, communicate with you, personalise recommendations and send updates you have opted into. We never sell your personal data." },
        { heading: "Data Security", body: "We apply appropriate technical and organisational measures to protect your data against unauthorised access, loss or misuse." },
        { heading: "Your Rights", body: "You may request access to, correction of, or deletion of your personal data at any time by contacting info@survivalexplores.com." },
        { heading: "Cookies", body: "Our website uses cookies to enhance your browsing experience and analyse traffic. You can control cookies through your browser settings." },
      ]}
    />
  );
}
