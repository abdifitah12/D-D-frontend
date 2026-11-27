import { useEffect, useRef, useState, type FormEvent } from "react";
import { broadcastStatus, cancelBroadcast, readOwnBroadcast, saveOwnBroadcast, submitBroadcast, type BroadcastRequest, type OwnBroadcast } from "@/api/broadcasts";
import { Input } from "@/components/ui/input";

export default function BroadcastRequestForm({ onReady }: { onReady: (request: OwnBroadcast) => void }) {
  const [own, setOwn] = useState(readOwnBroadcast);
  const readyCallback = useRef(onReady);
  readyCallback.current = onReady;
  const startedRequest = useRef<string | null>(null);
  const [status, setStatus] = useState<BroadcastRequest | null>(null);
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!own) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const next = await broadcastStatus(own!, controller.signal);
        if (controller.signal.aborted) return;
        setStatus(next); setError("");
        if (next.status === "APPROVED" && startedRequest.current !== own!.id) {
          startedRequest.current = own!.id;
          readyCallback.current({ ...own!, name: next.name });
          return;
        }
        if (!["PENDING", "APPROVED"].includes(next.status)) return;
      } catch (failure) {
        if (controller.signal.aborted) return;
        setError(failure instanceof Error ? failure.message : "Unable to check your request.");
      }
      if (!controller.signal.aborted) timer = setTimeout(poll, 3000);
    }
    void poll();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [own]);
  async function submit(event: FormEvent) {
    event.preventDefault(); if (busy || !name.trim()) return;
    setBusy(true); setError("");
    try {
      const result = await submitBroadcast(name.trim(), topic.trim());
      const saved = { id: result.request.id, name: result.request.name, token: result.token };
      saveOwnBroadcast(saved); setOwn(saved); setStatus(result.request);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Unable to send request."); }
    finally { setBusy(false); }
  }
  async function cancel() {
    if (!own || busy) return; setBusy(true);
    try { await cancelBroadcast(own); reset(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Unable to cancel."); }
    finally { setBusy(false); }
  }
  function reset() { saveOwnBroadcast(null); setOwn(null); setStatus(null); setError(""); }
  const active = status && ["PENDING", "APPROVED"].includes(status.status);
  return <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
    <h2 className="text-2xl text-primary">Request to go live</h2>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Send a request to the cafe admin. When approved, your broadcast starts automatically after camera and microphone permission is granted.</p>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {!own ? <form onSubmit={submit} className="mt-5 space-y-4">
      <label className="block text-sm font-medium text-primary" htmlFor="broadcast-name">Your name</label>
      <Input id="broadcast-name" value={name} onChange={event => setName(event.target.value)} maxLength={60} autoComplete="name" required disabled={busy} />
      <label className="block text-sm font-medium text-primary" htmlFor="broadcast-topic">What would you like to share?</label>
      <Input id="broadcast-topic" value={topic} onChange={event => setTopic(event.target.value)} maxLength={160} placeholder="Your live topic (optional)" disabled={busy} />
      <button type="submit" disabled={busy || !name.trim()} className="min-h-12 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground disabled:opacity-50">{busy ? "Sending…" : "Send request to admin"}</button>
    </form> : <div className="mt-5 space-y-4">
      <p role="status" className="rounded-xl bg-secondary p-4 text-sm text-primary">{!status ? "Checking your request…" : status.status === "PENDING" ? "Request sent. Waiting for the admin to approve." : status.status === "APPROVED" ? "Approved! Starting your live broadcast..." : status.status === "DECLINED" ? "The admin declined this request. You can send a new one." : "This request has ended or expired. You can send a new one."}</p>
      {active ? <button type="button" disabled={busy} onClick={() => void cancel()} className="ml-2 min-h-12 rounded-full border border-border px-6 text-sm text-primary">Cancel request</button>
        : (status || error) && <button type="button" onClick={reset} className="min-h-12 rounded-full border border-border px-6 text-sm text-primary">New request</button>}
    </div>}
  </section>;
}
