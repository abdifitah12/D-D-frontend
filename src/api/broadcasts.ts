import { AdminApiError } from "./auth";

const BASE = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "" : "https://dnd-cafe-ece43a569fa1.herokuapp.com")).replace(/\/$/, "");
export type BroadcastRequest = { id: string; name: string; topic: string; status: string; createdAt: string; expiresAt: string };
export type OwnBroadcast = { id: string; token: string; name: string };
export type LiveOverview = {
  requests: BroadcastRequest[];
  room: { hostPeerId: string | null; limit: number; watchingEnabled: boolean; participants: { peerId: string; name: string; audioBlocked: boolean; cameraBlocked: boolean }[] };
};
const KEY = "dnd-live-broadcast-request";
export function readOwnBroadcast(): OwnBroadcast | null {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null");
    return value && typeof value.id === "string" && typeof value.token === "string" && typeof value.name === "string" ? value : null;
  } catch { return null; }
}
export function saveOwnBroadcast(request: OwnBroadcast | null) {
  if (request) localStorage.setItem(KEY, JSON.stringify(request));
  else localStorage.removeItem(KEY);
}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(BASE + "/api/live" + path, { ...options, cache: "no-store" });
  if (!response.ok) {
    let message = response.status === 409 ? "Another live or approved request is active. Refresh and try again."
      : response.status === 403 || response.status === 401 ? "You do not have permission for this request. Sign in again if you are an admin."
      : "Unable to update live requests. Please try again.";
    try { const body = await response.json(); if (typeof body.message === "string") message = body.message; } catch { /* Keep the fallback. */ }
    throw new AdminApiError(message, response.status);
  }
  return response.json();
}
export const submitBroadcast = (name: string, topic: string) => request<{ request: BroadcastRequest; token: string }>("/requests", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, topic }),
});
export const broadcastStatus = (own: OwnBroadcast, signal: AbortSignal) => request<BroadcastRequest>("/requests/" + own.id, {
  signal, headers: { "X-Live-Request-Token": own.token },
});
export const cancelBroadcast = (own: OwnBroadcast) => request<BroadcastRequest>("/requests/" + own.id + "/cancel", {
  method: "POST", headers: { "X-Live-Request-Token": own.token },
});
export const startApprovedBroadcast = (own: OwnBroadcast) => request<{ ticket: string }>("/requests/" + own.id + "/start", {
  method: "POST", headers: { "X-Live-Request-Token": own.token },
});
export const adminOverview = (token: string, signal: AbortSignal) => request<LiveOverview>("/admin/requests", { signal, headers: { Authorization: "Bearer " + token } });
export const decideBroadcast = (token: string, id: string, approve: boolean) => request<BroadcastRequest>("/admin/requests/" + id + "/decision", {
  method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify({ approve }),
});
export const controlBroadcast = (token: string, hostPeerId: string, action: string, target?: string) => request<{ ok: boolean }>("/admin/control", {
  method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify({ action, target, hostPeerId }),
});
