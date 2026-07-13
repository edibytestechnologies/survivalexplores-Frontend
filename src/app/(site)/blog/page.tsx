import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play, Images, Calendar } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getBlogPosts, getSiteSettings } from "@/lib/api";
import type { BlogPost } from "@/lib/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Travel tips, destination guides and stories from the Survival Explore team.",
};

function categoryName(c: unknown): string {
  if (!c) return "Travel";
  if (typeof c === "string") return c;
  return (c as { name: string }).name;
}

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function MediaBadge({ post }: { post: BlogPost }) {
  if (post.video_count) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
        <Play className="h-3 w-3 fill-white" /> {post.video_count} video{post.video_count > 1 ? "s" : ""}
      </span>
    );
  }
  if (post.media_count) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
        <Images className="h-3 w-3" /> {post.media_count}
      </span>
    );
  }
  return null;
}

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getBlogPosts(), getSiteSettings()]);
  const [featured, ...rest] = posts;

  return (
    <>
      <PageBanner title="Travel Blog" crumbs={[{ label: "Blog" }]} image={settings.blog_banner} />

      <section className="bg-cream py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Stories & Guides" title="From the Journal" />

          {featured && (
            <Reveal className="mt-14">
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-3xl bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover lg:grid-cols-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                  <Image
                    src={featured.featured_image}
                    alt={featured.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {categoryName(featured.category)}
                    </span>
                    <MediaBadge post={featured} />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                    Featured Story
                  </span>
                  <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-navy sm:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="mt-4 text-muted">{featured.excerpt}</p>
                  <div className="mt-6 flex items-center gap-4 text-sm text-muted">
                    <span>{featured.author}</span>
                    {featured.published_at && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {fmtDate(featured.published_at)}
                      </span>
                    )}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-medium text-navy transition-colors group-hover:text-gold">
                    Read Story <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <Link href={`/blog/${p.slug}`}>
                  <article className="group h-full overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={p.featured_image}
                        alt={p.title}
                        fill
                        sizes="33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="absolute left-3 top-3 flex gap-2">
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-navy backdrop-blur">
                          {categoryName(p.category)}
                        </span>
                        <MediaBadge post={p} />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-muted">
                        <span>{p.author}</span>
                        {p.published_at && <span>· {fmtDate(p.published_at)}</span>}
                      </div>
                      <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-navy transition-colors group-hover:text-gold">
                        {p.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold">
                        Read More <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
