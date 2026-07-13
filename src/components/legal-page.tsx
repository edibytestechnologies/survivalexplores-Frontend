import { PageBanner } from "@/components/page-banner";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <>
      <PageBanner title={title} crumbs={[{ label: title }]} />
      <section className="bg-cream py-20">
        <div className="container-x max-w-3xl">
          <p className="text-sm text-muted">Last updated: {updated}</p>
          <div className="mt-8 space-y-8">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-serif text-2xl font-semibold text-navy">{s.heading}</h2>
                <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
