"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Star, Send, CheckCircle2, Camera, Loader2, X } from "lucide-react";
import { API_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "done" | "error";

export function ShareForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ name: "", country: "", review: "" });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function pickPhoto(file?: File) {
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("country", form.country);
      fd.append("review", form.review);
      fd.append("rating", String(rating));
      if (photo) fd.append("photo", photo);
      const res = await fetch(`${API_URL}/testimonials/submit/`, { method: "POST", body: fd });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Submission failed");
      }
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-card">
        <CheckCircle2 className="h-16 w-16 text-gold" />
        <h3 className="mt-4 font-serif text-2xl font-semibold text-navy">Thank you!</h3>
        <p className="mt-2 max-w-md text-muted">
          Your review has been submitted and will appear on our site once approved. We appreciate
          you sharing your journey with Survival Explore.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-8 shadow-card">
      {/* Rating */}
      <div className="text-center">
        <p className="text-sm font-medium text-navy">How would you rate your experience?</p>
        <div className="mt-3 flex justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  "h-9 w-9 transition-colors",
                  n <= (hover || rating) ? "fill-gold text-gold" : "fill-gray-200 text-gray-200"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Photo */}
      <div className="mt-6 flex flex-col items-center">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickPhoto(e.target.files?.[0])} />
        {preview ? (
          <div className="relative h-24 w-24">
            <Image src={preview} alt="you" fill sizes="96px" className="rounded-full object-cover ring-2 ring-gold/40" />
            <button
              type="button"
              onClick={() => {
                setPhoto(null);
                setPreview("");
              }}
              className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-gray-300 text-muted hover:border-gold hover:text-gold"
          >
            <Camera className="h-6 w-6" />
            <span className="text-[10px]">Add photo</span>
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your Name *"
          className="rounded-lg border border-gray-200 bg-cream px-4 py-3 text-sm focus:border-gold focus:outline-none"
        />
        <input
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          placeholder="Country / City"
          className="rounded-lg border border-gray-200 bg-cream px-4 py-3 text-sm focus:border-gold focus:outline-none"
        />
      </div>
      <textarea
        required
        rows={5}
        value={form.review}
        onChange={(e) => setForm({ ...form, review: e.target.value })}
        placeholder="Tell us about your experience… *"
        className="mt-4 w-full resize-none rounded-lg border border-gray-200 bg-cream px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />

      {status === "error" && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={status === "loading"} className="btn-gold mt-5 w-full">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Submit Review <Send className="h-4 w-4" /></>}
      </button>
      <p className="mt-3 text-center text-xs text-muted">Your review will be published after a quick review.</p>
    </form>
  );
}
