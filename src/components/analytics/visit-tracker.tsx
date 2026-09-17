"use client";

import { useEffect } from "react";
import { API_URL } from "@/lib/api";

/**
 * Fires once per real site visit (this layout persists across client-side
 * navigation between public pages, so it does not re-fire on every link
 * click — only on an actual page load).
 */
export function VisitTracker() {
  useEffect(() => {
    fetch(`${API_URL}/track-visit/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname }),
      keepalive: true,
    }).catch(() => {
      // Best-effort — never let analytics affect the visitor's experience.
    });
  }, []);

  return null;
}
