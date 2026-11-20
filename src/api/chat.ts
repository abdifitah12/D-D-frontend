const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "" : "https://dnd-cafe-ece43a569fa1.herokuapp.com");

export const STAFF_CHAT_URL = `${import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:8080" : API_BASE_URL)}/chat/index.html?staff=1`;
const SESSION_KEY = "dnd-chat-session";

export interface ChatSession {
  id: string;
  token: string;
}

export interface ChatMessage {
  id: number;
  sender: "visitor" | "staff";
  content: string;
  createdAt: string;
}

export class ChatApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ChatApiError";
  }
}

export function readChatSession(): ChatSession | null {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session && typeof session.id === "string" && typeof session.token === "string"
      ? session : null;
  } catch {
    return null;
  }
}

export function clearChatSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

async function chatRequest<T>(path: string, session: ChatSession | null, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/chat${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session ? { "X-Chat-Token": session.token } : {}),
    },
  });
  if (!response.ok) {
    throw new ChatApiError(response.status === 403
      ? "Your conversation has expired. Please start a new conversation."
      : "We couldn't connect to the cafe. Please try again.", response.status);
  }
  return response.json() as Promise<T>;
}

export async function startChat(name: string): Promise<ChatSession> {
  const session = await chatRequest<ChatSession>("/conversations", null, {
    method: "POST", body: JSON.stringify({ name }),
  });
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getMessages(session: ChatSession, after: number, signal: AbortSignal): Promise<ChatMessage[]> {
  return chatRequest(`/conversations/${session.id}/messages?after=${after}`, session, { signal });
}

export function sendMessage(session: ChatSession, content: string): Promise<ChatMessage> {
  return chatRequest(`/conversations/${session.id}/messages`, session, {
    method: "POST", body: JSON.stringify({ content }),
  });
}
