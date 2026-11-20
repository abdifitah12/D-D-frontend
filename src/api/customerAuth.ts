import { useSyncExternalStore } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "" : "https://dnd-cafe-ece43a569fa1.herokuapp.com");
const SESSION_KEY = "dnd-cafe-customer-session";
const SESSION_EVENT = "dnd-customer-session-changed";

export interface CustomerSession {
  token: string;
  customer: { username: string; email: string };
}

function parseSession(value: string | null): CustomerSession | null {
  try {
    const session = JSON.parse(value || "null");
    return typeof session?.token === "string" &&
      typeof session?.customer?.username === "string" && typeof session?.customer?.email === "string"
      ? session : null;
  } catch { return null; }
}

export function readCustomerSession(): CustomerSession | null {
  return parseSession(localStorage.getItem(SESSION_KEY));
}

function subscribe(listener: () => void) {
  window.addEventListener(SESSION_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(SESSION_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function useCustomerSession(): CustomerSession | null {
  const value = useSyncExternalStore(subscribe, () => localStorage.getItem(SESSION_KEY), () => null);
  return parseSession(value);
}

export function signOutCustomer(): void {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export async function authenticateCustomer(
  action: "register" | "login", credentials: { username: string; password: string; email?: string },
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/customers/auth/${action}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials),
    });
  } catch { throw new Error("Unable to connect. Please check your connection and try again."); }
  if (!response.ok) {
    if (response.status === 409) throw new Error("This username or email is already registered.");
    if (response.status === 401) throw new Error("Invalid username or password.");
    if (response.status === 400) throw new Error("Check your username, email, and password. Passwords need at least 8 characters and at most 72 UTF-8 bytes.");
    throw new Error("Account access is temporarily unavailable. Please try again.");
  }
  const session: CustomerSession = await response.json();
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export async function verifyCustomerSession(token: string, signal: AbortSignal): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/customers/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }, signal,
    });
    if ((response.status === 401 || response.status === 403) && readCustomerSession()?.token === token) {
      signOutCustomer();
    }
  } catch { /* A connection failure can be retried on the next page load. */ }
}
