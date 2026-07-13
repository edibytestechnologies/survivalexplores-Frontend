"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Check, Camera, Lock } from "lucide-react";
import { customerApi, API_URL, getCustomerToken } from "@/lib/customer-api";
import { AdminHeader, Card, Field, Input } from "@/components/admin/ui";

interface Me {
  first_name: string; last_name: string; email: string;
  phone: string; whatsapp: string; address: string; avatar: string;
}

export default function ProfilePage() {
  const qc = useQueryClient();
  const { data } = useQuery<Me>({ queryKey: ["me"], queryFn: async () => (await customerApi.get("/me/")).data });
  const [form, setForm] = useState<Me | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (data) setForm(data); }, [data]);
  if (!form) return <div className="h-64 animate-pulse rounded-2xl bg-white shadow-card" />;

  const set = (k: keyof Me, v: string) => setForm((p) => (p ? { ...p, [k]: v } : p));

  async function uploadAvatar(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch(`${API_URL}/me/avatar/`, { method: "POST", headers: { Authorization: `Bearer ${getCustomerToken()}` }, body: fd });
      if (res.ok) { const d = await res.json(); set("avatar", d.url); }
    } finally { setUploading(false); }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setSaved(false);
    try {
      await customerApi.patch("/me/profile/", form);
      qc.invalidateQueries({ queryKey: ["me"] });
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  async function changePw() {
    const cur = prompt("Current password:"); if (cur === null) return;
    const nw = prompt("New password:"); if (!nw) return;
    try { await customerApi.post("/me/password/", { current_password: cur, new_password: nw }); alert("Password updated."); }
    catch { alert("Could not update password — check your current password."); }
  }

  return (
    <>
      <AdminHeader title="My Profile" subtitle="Update your details and photo." />
      <form onSubmit={save} className="max-w-2xl space-y-6">
        <Card className="space-y-5">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gold/15">
              {form.avatar ? <img src={form.avatar} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center font-serif text-2xl font-bold text-gold">{form.first_name?.[0] || "U"}</span>}
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => uploadAvatar(e.target.files?.[0])} />
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost-navy px-4 py-2 text-sm">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Camera className="h-4 w-4" /> Change photo</>}
              </button>
              <p className="mt-1 text-xs text-muted">Or paste an image URL below.</p>
            </div>
          </div>
          <Field label="Photo URL"><Input value={form.avatar} onChange={(e) => set("avatar", e.target.value)} placeholder="https://…" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name"><Input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} /></Field>
            <Field label="Last name"><Input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} /></Field>
          </div>
          <Field label="Email"><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="WhatsApp"><Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></Field>
          </div>
          <Field label="Address"><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
        </Card>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-gold px-8">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Profile"}</button>
          <button type="button" onClick={changePw} className="btn-ghost-navy px-5 py-2.5 text-sm"><Lock className="h-4 w-4" /> Change password</button>
          {saved && <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600"><Check className="h-4 w-4" /> Saved</span>}
        </div>
      </form>
    </>
  );
}
