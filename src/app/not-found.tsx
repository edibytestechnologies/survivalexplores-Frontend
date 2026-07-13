import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-navy px-6 text-center">
      <div>
        <p className="font-serif text-8xl font-bold text-gold">404</p>
        <h1 className="mt-4 font-serif text-3xl font-semibold text-white">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-white/70">
          The page you&apos;re looking for has drifted off the map. Let&apos;s get you back on
          course.
        </p>
        <Link href="/" className="btn-gold mt-8">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
