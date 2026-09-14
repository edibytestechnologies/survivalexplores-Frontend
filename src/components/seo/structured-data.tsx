import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getSiteSettings } from "@/lib/api";

function realLink(url?: string) {
  return typeof url === "string" && url.trim() !== "" && url.trim() !== "#";
}

/** Site-wide JSON-LD:
 *  - Organization/TravelAgency with the brand's social profiles (sameAs) + contact
 *  - WebSite with a sitelinks search box
 *  - SiteNavigationElement listing the key pages (helps Google surface sitelinks)
 */
export async function StructuredData() {
  const s = await getSiteSettings();

  const sameAs = [s.facebook, s.instagram, s.twitter, s.youtube, s.whatsapp, s.tiktok, s.linkedin]
    .filter(realLink)
    .map((u) => u.trim());

  const logo = realLink(s.logo) ? s.logo : `${SITE_URL}/icon.svg`;

  const nav = [
    { name: "Explore", url: `${SITE_URL}/` },
    { name: "Trips", url: `${SITE_URL}/trips` },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: "About Us", url: `${SITE_URL}/about` },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: "Contact", url: `${SITE_URL}/contact` },
  ];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "TravelAgency"],
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "Survival Explores",
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        logo,
        image: DEFAULT_OG_IMAGE,
        ...(sameAs.length ? { sameAs } : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress: s.address || "Accra",
          addressLocality: "Accra",
          addressCountry: "GH",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          ...(s.phone ? { telephone: s.phone } : {}),
          ...(s.email ? { email: s.email } : {}),
          areaServed: "Worldwide",
          availableLanguage: ["English"],
        },
        ...(s.email ? { email: s.email } : {}),
        ...(s.phone ? { telephone: s.phone } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/trips?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#nav`,
        name: `${SITE_NAME} — Main Pages`,
        itemListElement: nav.map((n, i) => ({
          "@type": "SiteNavigationElement",
          position: i + 1,
          name: n.name,
          url: n.url,
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
