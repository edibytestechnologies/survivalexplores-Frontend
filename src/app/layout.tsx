import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Survival Explore — Explore More. Live More.",
    template: "%s | Survival Explore",
  },
  description:
    "Unforgettable journeys, authentic experiences and memories that last forever. Premium travel and tour experiences across the world.",
  keywords: ["travel", "tours", "Zanzibar", "Dubai", "Bali", "Mauritius", "luxury travel"],
  openGraph: {
    title: "Survival Explore — Explore More. Live More.",
    description: "Unforgettable journeys, authentic experiences and memories that last forever.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
