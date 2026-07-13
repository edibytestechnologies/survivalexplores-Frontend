"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Send,
  Inbox,
  History,
  Loader2,
  RefreshCw,
  Users,
  Mail,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { adminApi, adminList } from "@/lib/admin-api";
import { AdminHeader, Card, Field, Input, Textarea, Badge, EmptyState } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type Tab = "compose" | "inbox" | "sent";

interface Subscriber { id: number; email: string }
interface InboxMsg { uid: string; account: string; from: string; subject: string; date: string; unread: boolean }

function accountLabel(a?: string) {
  if (!a) return "";
  return a.split("@")[0]; // e.g. "support", "info"
}
interface SentItem { id: number; subject: string; recipient_count: number; sent_count: number; status: string; created_at: string }

function fmt(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? d : dt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminEmailPage() {
  const [tab, setTab] = useState<Tab>("compose");
  return (
    <>
      <AdminHeader title="Email" subtitle="Send notifications and read your support inbox — no need to log in to your email host." />
      <div className="mb-6 flex gap-2">
        {([["compose", "Compose", Send], ["inbox", "Inbox", Inbox], ["sent", "Sent", History]] as const).map(
          ([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                tab === key ? "bg-navy text-white shadow-md" : "bg-white text-muted shadow-sm hover:text-navy"
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          )
        )}
      </div>

      {tab === "compose" && <Compose />}
      {tab === "inbox" && <InboxView />}
      {tab === "sent" && <SentView />}
    </>
  );
}

/* -------------------- Compose -------------------- */
function Compose() {
  const [toAll, setToAll] = useState(false);
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { data: subs = [] } = useQuery({
    queryKey: ["admin-subscribers-mini"],
    queryFn: () => adminList<Subscriber>("/admin/subscribers/"),
  });

  const send = useMutation({
    mutationFn: () =>
      adminApi.post("/admin/email/send/", {
        to_all_subscribers: toAll,
        recipients,
        subject,
        message,
      }),
    onSuccess: (res) => {
      setResult(res.data.message || "Email queued.");
      setError("");
      setRecipients("");
      setSubject("");
      setMessage("");
      setToAll(false);
    },
    onError: (e: unknown) => {
      setError((e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to send.");
      setResult("");
    },
  });

  const manualCount = recipients.split(/[\n,]/).map((s) => s.trim()).filter(Boolean).length;
  const total = (toAll ? subs.length : 0) + manualCount;

  return (
    <Card className="max-w-2xl space-y-4">
      {result && (
        <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> {result}
        </p>
      )}
      {error && (
        <p className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => setToAll((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors",
          toAll ? "border-gold bg-gold/5" : "border-gray-200 hover:border-gold/50"
        )}
      >
        <span className="flex items-center gap-3">
          <Users className={cn("h-5 w-5", toAll ? "text-gold" : "text-muted")} />
          <span>
            <span className="block text-sm font-medium text-navy">Send to all subscribers</span>
            <span className="text-xs text-muted">{subs.length} newsletter subscriber(s)</span>
          </span>
        </span>
        <span className={cn("h-6 w-11 rounded-full p-0.5 transition-colors", toAll ? "bg-gold" : "bg-gray-300")}>
          <span className={cn("block h-5 w-5 rounded-full bg-white transition-transform", toAll ? "translate-x-5" : "")} />
        </span>
      </button>

      <Field label="Recipients (individual — comma or new line separated)">
        <Textarea
          rows={2}
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          placeholder="jane@example.com, john@example.com"
        />
      </Field>

      <Field label="Subject"><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Your subject line" /></Field>
      <Field label="Message"><Textarea rows={8} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message…" /></Field>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">
          {total > 0 ? `Will send to ~${total} recipient(s)` : "No recipients selected"}
        </span>
        <button
          onClick={() => send.mutate()}
          disabled={send.isPending || total === 0 || !subject || !message}
          className="btn-gold px-6 disabled:opacity-50"
        >
          {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Send</>}
        </button>
      </div>
    </Card>
  );
}

/* -------------------- Inbox -------------------- */
function InboxView() {
  const [open, setOpen] = useState<{ uid: string; account: string } | null>(null);
  const [filter, setFilter] = useState<string>("");
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-inbox"],
    queryFn: async () => (await adminApi.get("/admin/email/inbox/?limit=40")).data as { messages: InboxMsg[] },
    retry: false,
  });

  const allMsgs = data?.messages ?? [];
  const accounts = Array.from(new Set(allMsgs.map((m) => m.account)));
  const msgs = filter ? allMsgs.filter((m) => m.account === filter) : allMsgs;

  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-sm font-medium text-navy">Inbox</span>
          <button onClick={() => setFilter("")} className={cn("rounded-full px-3 py-1 text-xs font-medium", !filter ? "bg-navy text-white" : "bg-cream text-muted hover:text-navy")}>
            All
          </button>
          {accounts.map((a) => (
            <button key={a} onClick={() => setFilter(a)} className={cn("rounded-full px-3 py-1 text-xs font-medium", filter === a ? "bg-navy text-white" : "bg-cream text-muted hover:text-navy")}>
              {accountLabel(a)}
            </button>
          ))}
        </div>
        <button onClick={() => refetch()} className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline">
          <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} /> Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-muted"><Loader2 className="mx-auto h-6 w-6 animate-spin text-gold" /></div>
      ) : isError ? (
        <div className="p-8 text-center text-sm text-red-500">
          {(error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Could not connect to the mailbox."}
        </div>
      ) : msgs.length === 0 ? (
        <EmptyState text="Inbox is empty." />
      ) : (
        <ul className="divide-y divide-gray-100">
          {msgs.map((m) => (
            <li key={`${m.account}-${m.uid}`}>
              <button onClick={() => setOpen({ uid: m.uid, account: m.account })} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-cream/60">
                <span className={cn("h-2 w-2 shrink-0 rounded-full", m.unread ? "bg-gold" : "bg-transparent")} />
                <Badge color={m.account.startsWith("info") ? "navy" : "gold"}>{accountLabel(m.account)}</Badge>
                <span className="hidden w-40 shrink-0 truncate text-sm font-medium text-navy sm:block">{m.from}</span>
                <span className={cn("min-w-0 flex-1 truncate text-sm", m.unread ? "font-semibold text-navy" : "text-muted")}>{m.subject}</span>
                <span className="hidden shrink-0 text-xs text-muted sm:block">{fmt(m.date)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && <MessageModal uid={open.uid} account={open.account} onClose={() => setOpen(null)} />}
    </Card>
  );
}

function MessageModal({ uid, account, onClose }: { uid: string; account: string; onClose: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-inbox-msg", account, uid],
    queryFn: async () => (await adminApi.get(`/admin/email/inbox/${uid}/?account=${encodeURIComponent(account)}`)).data as {
      from: string; to: string; subject: string; date: string; text: string; html: string;
    },
    retry: false,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-widget" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div className="min-w-0">
            <h3 className="truncate font-serif text-lg font-semibold text-navy">{data?.subject || "Loading…"}</h3>
            {data && <p className="mt-1 text-xs text-muted">From {data.from} · {fmt(data.date)}</p>}
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5">
          {isLoading ? (
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-gold" />
          ) : data?.html ? (
            <div className="prose prose-sm max-w-none text-ink [&_a]:text-gold" dangerouslySetInnerHTML={{ __html: data.html }} />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">{data?.text || "(no content)"}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Sent -------------------- */
function SentView() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-sent-emails"],
    queryFn: () => adminList<SentItem>("/admin/sent-emails/"),
  });

  const color: Record<string, "green" | "gold" | "red" | "gray"> = {
    sent: "green", queued: "gold", partial: "gold", failed: "red",
  };

  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-white shadow-card" />;
  if (data.length === 0) return <EmptyState text="No emails sent yet." />;

  return (
    <Card className="p-0">
      <ul className="divide-y divide-gray-100">
        {data.map((s) => (
          <li key={s.id} className="flex items-center justify-between px-5 py-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 truncate font-medium text-navy">
                <Mail className="h-4 w-4 shrink-0 text-gold" /> {s.subject}
              </p>
              <p className="text-xs text-muted">{fmt(s.created_at)} · {s.sent_count}/{s.recipient_count} delivered</p>
            </div>
            <Badge color={color[s.status] ?? "gray"}>{s.status}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
