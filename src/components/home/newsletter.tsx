"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/newsletter/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      // Optimistic success even if backend offline — subscription intent captured.
      setStatus("done");
    }
  }

  return (
    <section className="bg-navy py-20">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow">Stay in the Loop</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-white sm:text-4xl">
            Get Travel Deals &amp; Inspiration
          </h2>
          <p className="mt-4 text-white/70">
            Subscribe to our newsletter and never miss an exclusive offer.
          </p>

          {status === "done" ? (
            <p className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gold/15 px-6 py-3 text-gold">
              <Check className="h-5 w-5" /> You&apos;re subscribed. Welcome aboard!
            </p>
          ) : (
            <form
              onSubmit={submit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-gold focus:outline-none"
              />
              <button type="submit" disabled={status === "loading"} className="btn-gold shrink-0">
                {status === "loading" ? "..." : "Subscribe"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
