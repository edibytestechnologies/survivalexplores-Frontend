"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, Link2, Copy, Check, CreditCard, Receipt, Users, MapPin } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { AdminHeader, Card, Field, Input, Select, Badge, EmptyState, Modal } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

interface Customer { id: number; name: string; email: string; phone: string; bills: number }
interface Bill { id: number; trip_title: string; title: string; total_amount: string; currency: string; schedule: string; status: string; balance: string; customer: { name: string; email: string }; installments: { label: string; amount: string; status: string }[] }

export default function AdminBillingPage() {
  const qc = useQueryClient();
  const [billing, setBilling] = useState<Customer | null>(null);

  const { data: customers = [] } = useQuery<Customer[]>({ queryKey: ["admin-customers"], queryFn: async () => (await adminApi.get("/admin/customers/")).data });
  const { data: bills = [], isLoading } = useQuery<Bill[]>({ queryKey: ["admin-bills"], queryFn: async () => (await adminApi.get("/admin/bills/")).data });

  const delBill = useMutation({ mutationFn: (id: number) => adminApi.delete(`/admin/bills/${id}/`), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bills"] }) });

  const color: Record<string, "green" | "gold" | "navy" | "red"> = { paid: "green", partial: "gold", pending: "navy", cancelled: "red" };

  return (
    <>
      <AdminHeader title="Billing & Payments" subtitle="Bill customers, set payment plans, and create shareable payment links." />

      <BillByTrip onDone={() => { qc.invalidateQueries({ queryKey: ["admin-bills"] }); }} />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-navy"><Receipt className="h-5 w-5 text-gold" /> Bill an Individual</h2>
          <p className="mb-4 text-sm text-muted">Select a registered customer and raise a bill. They'll be notified by email.</p>
          {customers.length === 0 ? <EmptyState text="No registered customers yet." /> : (
            <div className="max-h-72 space-y-1.5 overflow-y-auto">
              {customers.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                  <div><p className="text-sm font-medium text-navy">{c.name}</p><p className="text-xs text-muted">{c.email} · {c.bills} bill(s)</p></div>
                  <button onClick={() => setBilling(c)} className="btn-gold px-3 py-1.5 text-xs">Bill</button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <PaymentLinks customers={customers} />
      </div>

      <Card className="p-0">
        <div className="border-b border-gray-100 px-5 py-3"><span className="font-medium text-navy">All Bills</span></div>
        {isLoading ? <div className="p-8 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-gold" /></div> : bills.length === 0 ? <EmptyState text="No bills yet." /> : (
          <ul className="divide-y divide-gray-100">
            {bills.map((b) => (
              <li key={b.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-navy">{b.trip_title || b.title}</p>
                  <p className="text-xs text-muted">{b.customer.name} · {b.schedule === "installment" ? `${b.installments.length} installments` : "one-time"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right"><p className="text-sm font-semibold text-navy">{b.currency} {b.total_amount}</p><p className="text-xs text-muted">bal {b.balance}</p></div>
                  <Badge color={color[b.status] ?? "navy"}>{b.status}</Badge>
                  <button onClick={() => confirm("Delete this bill?") && delBill.mutate(b.id)} className="rounded-lg border border-gray-200 p-2 text-navy hover:border-red-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {billing && <BillModal customer={billing} onClose={() => setBilling(null)} onDone={() => { qc.invalidateQueries({ queryKey: ["admin-bills"] }); qc.invalidateQueries({ queryKey: ["admin-customers"] }); setBilling(null); }} />}
    </>
  );
}

function BillModal({ customer, onClose, onDone }: { customer: Customer; onClose: () => void; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [schedule, setSchedule] = useState("one_time");
  const [amount, setAmount] = useState("");
  const [installments, setInstallments] = useState([{ label: "Initial payment", amount: "" }, { label: "Final payment", amount: "" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const payload: Record<string, unknown> = { user: customer.id, title, trip_title: title, schedule };
      if (schedule === "one_time") payload.total_amount = amount;
      else payload.installments = installments.filter((i) => Number(i.amount) > 0);
      await adminApi.post("/admin/bills/", payload);
      onDone();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Could not create bill.");
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={`Bill ${customer.name}`}>
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        <Field label="What is this for? (trip / description)"><Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Zanzibar, Tanzania" /></Field>
        <Field label="Payment plan">
          <Select value={schedule} onChange={(e) => setSchedule(e.target.value)}>
            <option value="one_time">One-time payment</option>
            <option value="installment">Installments</option>
          </Select>
        </Field>
        {schedule === "one_time" ? (
          <Field label="Amount (GHS)"><Input required type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1200" /></Field>
        ) : (
          <div className="space-y-2">
            <span className="text-sm font-medium text-navy">Installments (dynamic — add as many as needed)</span>
            {installments.map((inst, i) => (
              <div key={i} className="flex gap-2">
                <Input value={inst.label} onChange={(e) => { const n = [...installments]; n[i].label = e.target.value; setInstallments(n); }} placeholder="Label" />
                <Input type="number" step="0.01" value={inst.amount} onChange={(e) => { const n = [...installments]; n[i].amount = e.target.value; setInstallments(n); }} placeholder="Amount" className="w-32" />
                {installments.length > 1 && <button type="button" onClick={() => setInstallments(installments.filter((_, j) => j !== i))} className="rounded-lg border border-gray-200 px-3 text-muted hover:border-red-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>}
              </div>
            ))}
            <button type="button" onClick={() => setInstallments([...installments, { label: `Installment ${installments.length + 1}`, amount: "" }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline"><Plus className="h-4 w-4" /> Add installment</button>
            <p className="text-xs text-muted">Total: GHS {installments.reduce((s, i) => s + (Number(i.amount) || 0), 0).toFixed(2)}</p>
          </div>
        )}
        <button type="submit" disabled={saving} className="btn-gold w-full">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CreditCard className="h-4 w-4" /> Create Bill & Notify</>}</button>
      </form>
    </Modal>
  );
}

interface Person { registration: number; user: number | null; name: string; email: string; has_account: boolean }
interface TripGroup { trip: string; registration_id: number | null; people: Person[] }

function BillByTrip({ onDone }: { onDone: () => void }) {
  const [trip, setTrip] = useState("");
  const [excluded, setExcluded] = useState<Set<number>>(new Set());
  const [title, setTitle] = useState("");
  const [schedule, setSchedule] = useState("one_time");
  const [amount, setAmount] = useState("");
  const [installments, setInstallments] = useState([{ label: "Initial payment", amount: "" }, { label: "Final payment", amount: "" }]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const { data: groups = [] } = useQuery<TripGroup[]>({ queryKey: ["trip-registrants"], queryFn: async () => (await adminApi.get("/admin/trip-registrants/")).data });
  const { data: destinations = [] } = useQuery<{ id: number; title: string; country: string }[]>({ queryKey: ["admin-destinations-list"], queryFn: async () => (await adminApi.get("/admin/destinations/?page_size=200")).data.results ?? (await adminApi.get("/admin/destinations/?page_size=200")).data });

  // Dropdown = every destination + any registration groups (incl. "General"), de-duped
  const tripOptions = Array.from(new Set([
    ...destinations.map((d) => d.title),
    ...groups.map((g) => g.trip),
  ])).sort();

  const group = groups.find((g) => g.trip === trip);
  const people = group?.people ?? [];
  const selectable = people.filter((p) => p.has_account);
  const selected = selectable.filter((p) => !excluded.has(p.user!));

  function toggle(uid: number) {
    const n = new Set(excluded);
    n.has(uid) ? n.delete(uid) : n.add(uid);
    setExcluded(n);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg("");
    try {
      const payload: Record<string, unknown> = { users: selected.map((p) => p.user), title: title || trip, trip_title: title || trip, schedule };
      if (schedule === "one_time") payload.total_amount = amount;
      else payload.installments = installments.filter((i) => Number(i.amount) > 0);
      const { data } = await adminApi.post("/admin/bills/bulk/", payload);
      setMsg(data.message); onDone();
      setTimeout(() => setMsg(""), 4000);
    } catch (err: unknown) {
      setMsg((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Could not bill.");
    } finally { setSaving(false); }
  }

  return (
    <Card className="mb-6 ring-1 ring-gold/30">
      <h2 className="mb-1 flex items-center gap-2 font-serif text-lg font-semibold text-navy"><Users className="h-5 w-5 text-gold" /> Bill by Trip</h2>
      <p className="mb-4 text-sm text-muted">Bill everyone who registered for a trip at once. Untick anyone you want to exclude.</p>
      {msg && <p className="mb-3 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{msg}</p>}
      <form onSubmit={submit} className="grid gap-5 lg:grid-cols-2">
        <div>
          <Field label="Choose a trip">
            <Select value={trip} onChange={(e) => { setTrip(e.target.value); setExcluded(new Set()); }}>
              <option value="">Select a trip…</option>
              {tripOptions.map((t) => {
                const g = groups.find((x) => x.trip === t);
                return <option key={t} value={t}>{t}{g ? ` (${g.people.length} registered)` : " (0 registered)"}</option>;
              })}
            </Select>
          </Field>
          {trip && !group && (
            <p className="mt-3 rounded-lg bg-cream px-4 py-3 text-sm text-muted">No one has registered for this trip yet, so there's no one to bill by trip. Use <b>Bill an Individual</b> instead, or share a <b>Payment Link</b>.</p>
          )}
          {group && (
            <div className="mt-3 max-h-56 space-y-1 overflow-y-auto rounded-lg border border-gray-100 p-2">
              {people.map((p) => (
                <label key={p.registration} className={cn("flex items-center gap-2 rounded px-2 py-1.5 text-sm", p.has_account ? "" : "opacity-50")}>
                  <input type="checkbox" disabled={!p.has_account} checked={p.has_account && !excluded.has(p.user!)} onChange={() => p.user && toggle(p.user)} className="accent-gold" />
                  <span className="flex-1 truncate"><span className="font-medium text-navy">{p.name}</span> <span className="text-muted">· {p.email}</span></span>
                  {!p.has_account && <span className="text-[10px] text-red-400">no account</span>}
                </label>
              ))}
              <p className="px-2 pt-1 text-xs text-muted">{selected.length} of {selectable.length} will be billed</p>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <Field label="What is this for?"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={trip || "Trip payment"} /></Field>
          <Field label="Payment plan"><Select value={schedule} onChange={(e) => setSchedule(e.target.value)}><option value="one_time">One-time payment</option><option value="installment">Installments</option></Select></Field>
          {schedule === "one_time" ? (
            <Field label="Amount per person (GHS)"><Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1200" /></Field>
          ) : (
            <div className="space-y-2">
              {installments.map((inst, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={inst.label} onChange={(e) => { const n = [...installments]; n[i].label = e.target.value; setInstallments(n); }} placeholder="Label" />
                  <Input type="number" step="0.01" value={inst.amount} onChange={(e) => { const n = [...installments]; n[i].amount = e.target.value; setInstallments(n); }} placeholder="Amount" className="w-28" />
                  {installments.length > 1 && <button type="button" onClick={() => setInstallments(installments.filter((_, j) => j !== i))} className="rounded-lg border border-gray-200 px-2 text-muted hover:text-red-500"><Trash2 className="h-4 w-4" /></button>}
                </div>
              ))}
              <button type="button" onClick={() => setInstallments([...installments, { label: `Installment ${installments.length + 1}`, amount: "" }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline"><Plus className="h-4 w-4" /> Add installment</button>
            </div>
          )}
          <button type="submit" disabled={saving || selected.length === 0} className="btn-gold w-full disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><MapPin className="h-4 w-4" /> Bill {selected.length} customer(s)</>}</button>
        </div>
      </form>
    </Card>
  );
}

function PaymentLinks({ customers }: { customers: Customer[] }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(""); const [amount, setAmount] = useState(""); const [user, setUser] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const { data: links = [] } = useQuery<{ id: number; token: string; title: string; amount: string; status: string }[]>({ queryKey: ["admin-links"], queryFn: async () => (await adminApi.get("/admin/payment-links/")).data });

  const create = useMutation({
    mutationFn: () => adminApi.post("/admin/payment-links/", { title, amount, user: user || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-links"] }); setTitle(""); setAmount(""); setUser(""); },
  });
  const del = useMutation({ mutationFn: (id: number) => adminApi.delete(`/admin/payment-links/${id}/`), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-links"] }) });

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  function copy(token: string) { navigator.clipboard.writeText(`${origin}/pay/${token}`); setCopied(token); setTimeout(() => setCopied(null), 2000); }

  return (
    <Card>
      <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-navy"><Link2 className="h-5 w-5 text-gold" /> Payment Links</h2>
      <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="space-y-2">
        <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's this payment for?" />
        <div className="flex gap-2">
          <Input required type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (GHS)" />
          <Select value={user} onChange={(e) => setUser(e.target.value)} className="w-40"><option value="">Anyone</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.email}</option>)}</Select>
        </div>
        <button type="submit" disabled={create.isPending} className="btn-gold w-full py-2 text-sm">{create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Link"}</button>
      </form>
      <div className="mt-4 max-h-48 space-y-1.5 overflow-y-auto">
        {links.map((l) => (
          <div key={l.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm">
            <div className="min-w-0"><p className="truncate font-medium text-navy">{l.title}</p><p className="text-xs text-muted">GHS {l.amount} · {l.status}</p></div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => copy(l.token)} className={cn("rounded-lg border border-gray-200 p-1.5", copied === l.token ? "text-emerald-600" : "text-navy hover:text-gold")}>{copied === l.token ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
              <button onClick={() => del.mutate(l.id)} className="rounded-lg border border-gray-200 p-1.5 text-navy hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
