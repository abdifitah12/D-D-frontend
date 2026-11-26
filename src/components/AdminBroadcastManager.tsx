import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AdminApiError, clearAdminToken } from "@/api/auth";
import { adminOverview, controlBroadcast, decideBroadcast, type LiveOverview } from "@/api/broadcasts";

export default function AdminBroadcastManager({ token }: { token: string }) {
  const [, setLocation] = useLocation();
  const [overview, setOverview] = useState<LiveOverview | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const failed = useCallback((failure: unknown) => {
    if (failure instanceof AdminApiError && [401, 403].includes(failure.status)) { clearAdminToken(); setLocation("/admin/login"); }
    setError(failure instanceof Error ? failure.message : "Unable to update live requests.");
  }, [setLocation]);
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try { const next = await adminOverview(token, controller.signal); if (!controller.signal.aborted) { setOverview(next); setError(""); } }
      catch (failure) { if (!controller.signal.aborted) failed(failure); }
      if (!controller.signal.aborted) timer = setTimeout(poll, 5000);
    }
    void poll(); return () => { controller.abort(); clearTimeout(timer); };
  }, [token, refresh, failed]);
  async function decision(id: string, approve: boolean) {
    if (busy) return; setBusy(true); setError("");
    try { await decideBroadcast(token, id, approve); setRefresh(value => value + 1); }
    catch (failure) { failed(failure); } finally { setBusy(false); }
  }
  async function control(action: string, target?: string) {
    if (busy || !overview?.room.hostPeerId) return; setBusy(true); setError("");
    try { await controlBroadcast(token, overview.room.hostPeerId, action, target); setRefresh(value => value + 1); }
    catch (failure) { failed(failure); } finally { setBusy(false); }
  }
  const room = overview?.room;
  return <section className="mb-8 space-y-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl text-primary">Live requests & monitoring</h2><p className="mt-2 text-sm text-muted-foreground">Approve visitors to start a live broadcast, then monitor or stop it here.</p></div>
      <button type="button" onClick={() => setRefresh(value => value + 1)} className="min-h-11 rounded-full border border-border px-5 text-sm text-primary">Refresh</button></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {!overview && !error && <p role="status" className="text-sm text-muted-foreground">Loading live requests…</p>}
    {room?.hostPeerId ? <div className="space-y-4 rounded-2xl border border-border bg-secondary/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold text-primary">Live now · {room.participants.length} / {room.limit} on camera</h3>
        <div className="flex flex-wrap gap-2"><Link href="/admin/live?monitor=1" className="inline-flex min-h-11 items-center rounded-full border border-border bg-white px-5 text-sm text-primary">Monitor live</Link>
          <button type="button" disabled={busy} onClick={() => void control("end-live")} className="min-h-11 rounded-full bg-red-600 px-5 text-sm font-semibold text-white disabled:opacity-50">Stop live</button></div></div>
      {!room.watchingEnabled && <p className="text-xs text-muted-foreground">Open Monitor live to view the stream without turning on your camera.</p>}
      <ul className="space-y-3">{room.participants.map(person => <li key={person.peerId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3">
        <span className="break-words text-sm font-medium text-primary">{person.name}{person.peerId === room.hostPeerId ? " (Host)" : ""}</span>
        <div className="flex flex-wrap gap-2"><button disabled={busy} type="button" onClick={() => void control(person.audioBlocked ? "allow-mic" : "mute-guest", person.peerId)} className="min-h-11 rounded-full border border-border px-4 text-xs text-primary">{person.audioBlocked ? "Allow mic" : "Mute"}</button>
          <button disabled={busy} type="button" onClick={() => void control(person.cameraBlocked ? "allow-camera" : "camera-off", person.peerId)} className="min-h-11 rounded-full border border-border px-4 text-xs text-primary">{person.cameraBlocked ? "Allow camera" : "Camera off"}</button>
          {person.peerId !== room.hostPeerId && <button disabled={busy} type="button" onClick={() => void control("remove-guest", person.peerId)} className="min-h-11 rounded-full border border-red-200 px-4 text-xs text-red-700">Remove</button>}</div>
      </li>)}</ul>
    </div> : overview && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary/30 p-4"><p className="text-sm text-muted-foreground">No live broadcast is running.</p><Link href="/admin/live" className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">Go Live as admin</Link></div>}
    <div><h3 className="mb-3 font-semibold text-primary">Broadcast requests ({overview?.requests.length ?? 0})</h3>
      {overview?.requests.length === 0 && <p className="text-sm text-muted-foreground">No pending requests. Visitors can request to go live from the public live page.</p>}
      <ul className="space-y-3">{overview?.requests.map(request => <li key={request.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4">
        <div className="min-w-0"><p className="break-words font-semibold text-primary">{request.name}</p><p className="mt-1 break-words text-sm text-muted-foreground">{request.topic || "No topic provided"}</p><p className="mt-1 text-xs text-muted-foreground">{request.status === "APPROVED" ? "Approved · waiting for visitor to start" : "Waiting for admin approval"}</p></div>
        <div className="flex gap-2">{request.status === "PENDING" && <button type="button" disabled={busy || Boolean(room?.hostPeerId)} onClick={() => void decision(request.id, true)} className="min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50">Approve</button>}
          <button type="button" disabled={busy} onClick={() => void decision(request.id, false)} className="min-h-11 rounded-full border border-border px-5 text-sm text-primary">{request.status === "APPROVED" ? "Revoke approval" : "Decline"}</button></div>
      </li>)}</ul>
    </div>
  </section>;
}
