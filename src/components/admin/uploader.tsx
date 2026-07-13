"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2, ImageIcon, Film, Plus } from "lucide-react";
import { uploadFile } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Single image uploader — shows the actual image, not a URL          */
/* ------------------------------------------------------------------ */
export function ImageUpload({
  value,
  onChange,
  label,
  aspect = "aspect-[4/3]",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [error, setError] = useState("");

  async function handle(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    setPct(0);
    try {
      const res = await uploadFile(file, setPct);
      onChange(res.url);
    } catch (e: unknown) {
      setError((e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {label && <span className="mb-1.5 block text-sm font-medium text-navy">{label}</span>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />

      {value ? (
        <div className={cn("group relative overflow-hidden rounded-xl border border-gray-200", aspect)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-navy">
              Replace
            </button>
            <button type="button" onClick={() => onChange("")} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white">
              Remove
            </button>
          </div>
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-cream text-muted transition-colors hover:border-gold hover:text-gold",
            aspect
          )}
        >
          {busy ? (
            <>
              <Loader2 className="h-7 w-7 animate-spin" />
              <span className="text-xs">Uploading… {pct}%</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-7 w-7" />
              <span className="text-sm font-medium">Click to upload</span>
              <span className="text-xs">PNG, JPG, WEBP</span>
            </>
          )}
        </button>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Single video uploader — shows the actual playable video            */
/* ------------------------------------------------------------------ */
export function VideoUpload({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [error, setError] = useState("");

  async function handle(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    setPct(0);
    try {
      const res = await uploadFile(file, setPct);
      if (res.type !== "video") {
        setError("That file is not a video. Please choose an MP4, WebM or MOV.");
        return;
      }
      onChange(res.url);
    } catch (e: unknown) {
      setError((e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {label && <span className="mb-1.5 block text-sm font-medium text-navy">{label}</span>}
      <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handle(e.target.files?.[0])} />

      {value ? (
        <div className="group relative w-full max-w-xs overflow-hidden rounded-lg border border-gray-200 bg-black">
          <video src={value} controls playsInline className="h-32 w-full object-cover" />
          <div className="absolute right-1.5 top-1.5 flex gap-1.5">
            <button type="button" onClick={() => inputRef.current?.click()} className="rounded-md bg-white px-2 py-1 text-[11px] font-medium text-navy">
              Replace
            </button>
            <button type="button" onClick={() => onChange("")} className="rounded-md bg-red-500 px-2 py-1 text-[11px] font-medium text-white">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex w-full max-w-xs items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-cream px-4 py-3 text-left text-muted transition-colors hover:border-gold hover:text-gold"
        >
          {busy ? (
            <>
              <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
              <span className="text-xs">Uploading video… {pct}%</span>
            </>
          ) : (
            <>
              <Film className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Click to upload a video</span>
            </>
          )}
        </button>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery uploader — many images as thumbnails                        */
/* ------------------------------------------------------------------ */
export function GalleryUpload({
  items,
  onChange,
}: {
  items: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const res = await uploadFile(file);
        uploaded.push(res.url);
      }
      onChange([...items, ...uploaded]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handle(e.target.files)} />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {items.map((url, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-cream text-muted hover:border-gold hover:text-gold"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          <span className="text-[11px]">Add images</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Media uploader — images AND videos (for blog posts)                 */
/* ------------------------------------------------------------------ */
export interface MediaItem {
  kind: "image" | "video";
  url: string;
  caption?: string;
}

export function MediaUpload({
  items,
  onChange,
}: {
  items: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const next: MediaItem[] = [];
      for (const file of Array.from(files)) {
        const res = await uploadFile(file, setPct);
        next.push({ kind: res.type, url: res.url });
      }
      onChange([...items, ...next]);
    } finally {
      setBusy(false);
      setPct(0);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((m, i) => (
          <div key={i} className="group relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-black">
            {m.kind === "video" ? (
              <video src={m.url} controls className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.url} alt="" className="h-full w-full object-cover" />
            )}
            <span className="absolute left-1 top-1 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {m.kind === "video" ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
              {m.kind}
            </span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex aspect-video flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-cream text-muted hover:border-gold hover:text-gold"
        >
          {busy ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-[11px]">{pct}%</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-5 w-5" />
              <span className="text-[11px]">Add images / videos</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
