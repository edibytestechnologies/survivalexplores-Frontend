"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { API_URL } from "@/lib/api";

type Status = "idle" | "loading" | "done" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-card">
        <CheckCircle2 className="h-14 w-14 text-gold" />
        <h3 className="mt-4 font-serif text-2xl font-semibold text-navy">Message Sent!</h3>
        <p className="mt-2 text-muted">Thank you for reaching out. We&apos;ll respond shortly.</p>
        <button onClick={() => setStatus("idle")} className="btn-ghost-navy mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-8 shadow-card">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={update("name")}
          placeholder="Your Name"
          className="field"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder="Your Email"
          className="field"
        />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <input
          type="tel"
          required
          value={form.phone}
          onChange={update("phone")}
          placeholder="Your Phone Number"
          className="field"
        />
        <input
          value={form.subject}
          onChange={update("subject")}
          placeholder="Subject"
          className="field"
        />
      </div>
      <textarea
        required
        value={form.message}
        onChange={update("message")}
        placeholder="Your Message"
        rows={6}
        className="field mt-4 w-full resize-none"
      />
      {status === "error" && (
        <p className="mt-3 text-sm text-red-500">Something went wrong. Please try again.</p>
      )}
      <button type="submit" disabled={status === "loading"} className="btn-gold mt-5 w-full">
        {status === "loading" ? "Sending..." : "Send Message"}
        <Send className="h-4 w-4" />
      </button>

      <style jsx>{`
        :global(.field) {
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          background: #f8f8f8;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: #1a1a1a;
          transition: border-color 0.2s;
        }
        :global(.field:focus) {
          outline: none;
          border-color: #d8a63a;
          background: #fff;
        }
      `}</style>
    </form>
  );
}
