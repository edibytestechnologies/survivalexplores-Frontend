import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Film } from "lucide-react";
import { getBlogPost } from "@/lib/api";
import { BlogGallery } from "@/components/blog/blog-gallery";

function categoryName(c: unknown): string {
  if (!c) return "Travel";
  if (typeof c === "string") return c;
  return (c as { name: string }).name;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const media = post.media ?? [];
  const videoCount = media.filter((m) => m.kind === "video").length;
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[52vh] min-h-[380px] items-end overflow-hidden">
        <Image src={post.featured_image} alt={post.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/20" />
        <div className="container-x relative pb-12">
          <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {categoryName(post.category)}
          </span>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl font-bold leading-tight text-white sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/75">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-gold" /> {post.author}
            </span>
            {date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold" /> {date}
              </span>
            )}
            {videoCount > 0 && (
              <span className="flex items-center gap-1.5">
                <Film className="h-4 w-4 text-gold" /> {videoCount} video{videoCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      <article className="bg-cream py-16">
        <div className="container-x max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <p className="mt-8 border-l-4 border-gold pl-5 text-lg font-medium leading-relaxed text-navy">
            {post.excerpt}
          </p>

          <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink/80">
            {(post.content || "").split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Modern navigable gallery of images + videos */}
          <BlogGallery media={media} title={post.title} />

          <div className="mt-14 rounded-2xl bg-navy p-8 text-center">
            <h3 className="font-serif text-2xl font-semibold text-white">Ready for your own adventure?</h3>
            <p className="mt-2 text-white/70">Explore our curated trips and start planning today.</p>
            <Link href="/trips" className="btn-gold mt-6">Explore Trips</Link>
          </div>
        </div>
      </article>
    </>
  );
}
