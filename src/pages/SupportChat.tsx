import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ChatApiError, STAFF_CHAT_URL, clearChatSession, getMessages,
  readChatSession, sendMessage, startChat, type ChatMessage,
} from "@/api/chat";

export default function LiveChat() {
  const [session, setSession] = useState(readChatSession);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [expired, setExpired] = useState(false);
  const [connected, setConnected] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let after = 0;
    async function poll() {
      if (!session) return;
      try {
        const incoming = await getMessages(session, after, controller.signal);
        if (controller.signal.aborted) return;
        if (incoming.length) {
          after = incoming[incoming.length - 1].id;
          setMessages((current) => {
            const ids = new Set(current.map((item) => item.id));
            return [...current, ...incoming.filter((item) => !ids.has(item.id))].sort((a, b) => a.id - b.id);
          });
        }
        setConnected(true);
        setConnectionError("");
      } catch (error) {
        if (controller.signal.aborted) return;
        setConnected(false);
        setConnectionError(error instanceof Error ? error.message : "Unable to load your conversation.");
        if (error instanceof ChatApiError && error.status === 403) {
          setExpired(true);
          return;
        }
      }
      if (!controller.signal.aborted) timer = setTimeout(poll, 2000);
    }
    void poll();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [session]);

  useEffect(() => { bottom.current?.scrollIntoView({ block: "nearest" }); }, [messages]);

  async function handleStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || busy) return;
    setBusy(true);
    setSubmitError("");
    try {
      setSession(await startChat(name.trim()));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to start a conversation.");
    } finally { setBusy(false); }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !message.trim() || busy || expired) return;
    setBusy(true);
    setSubmitError("");
    try {
      const sent = await sendMessage(session, message.trim());
      setMessages((current) => current.some((item) => item.id === sent.id)
        ? current : [...current, sent].sort((a, b) => a.id - b.id));
      setMessage("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to send your message.");
      if (error instanceof ChatApiError && error.status === 403) setExpired(true);
    } finally { setBusy(false); }
  }

  function resetSession() {
    clearChatSession();
    setSession(null);
    setMessages([]);
    setConnectionError("");
    setSubmitError("");
    setExpired(false);
    setConnected(false);
  }

  return (
    <section className="min-h-[78vh] bg-background px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent">We're here to help</p>
          <h1 className="text-4xl text-primary md:text-5xl">Message DnD Cafe</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Questions about the menu, an upcoming event, or planning a visit? We'd love to hear from you.</p>
        </div>
        <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-xl md:grid-cols-[0.72fr_1.28fr]">
          <aside className="flex flex-col justify-between bg-primary p-7 text-primary-foreground md:p-9">
            <div>
              <MessageCircle className="mb-8 text-accent" size={30} />
              <h2 className="text-2xl">A warm welcome awaits.</h2>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">Send us a note and our team will reply here when available.</p>
            </div>
            <div className="mt-10 space-y-4 text-sm text-primary-foreground/70">
              <p>You can return to this conversation from the same browser.</p>
              <a href={STAFF_CHAT_URL} className="inline-block underline underline-offset-4">Staff inbox</a>
            </div>
          </aside>
          <div className="flex min-h-[480px] min-w-0 flex-col">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-7">
              <MessageCircle className="text-accent" size={22} />
              <div>
                <h2 className="font-sans text-sm font-semibold text-primary">DnD Cafe</h2>
                <p role="status" className="text-xs text-muted-foreground">{session ? connected ? "Connected" : expired ? "Session expired" : "Connecting..." : "Start a conversation"}</p>
              </div>
            </div>
            <div role="log" aria-label="Conversation" aria-live="polite" className="flex h-[340px] flex-col gap-4 overflow-y-auto bg-background/50 px-5 py-6 sm:px-7">
              {messages.length === 0 && <p className="my-auto text-center text-sm leading-relaxed text-muted-foreground">Welcome to DnD Cafe. What can we help you with today?</p>}
              {messages.map((item) => (
                <div key={item.id} className={`max-w-[85%] shrink-0 rounded-2xl px-4 py-3 text-sm leading-relaxed ${item.sender === "visitor" ? "self-end rounded-br-md bg-primary text-primary-foreground" : "self-start rounded-bl-md bg-secondary text-foreground"}`}>
                  <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{item.content}</p>
                  <span className="mt-2 block text-[10px] opacity-70">{item.sender === "visitor" ? "You" : "Cafe team"} · {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ))}
              <div ref={bottom} />
            </div>
            <div className="border-t border-border p-5 sm:px-7">
              {(connectionError || submitError) && <p role="alert" className="mb-3 text-sm text-red-700">{submitError || connectionError}</p>}
              {expired ? (
                <button onClick={resetSession} className="rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground">Start a new conversation</button>
              ) : session ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input aria-label="Write a message" placeholder="Write your message..." value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} required disabled={busy} className="h-12 rounded-full bg-background px-5" />
                  <button type="submit" aria-label="Send message" disabled={busy || !message.trim()} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"><Send size={17} /></button>
                </form>
              ) : (
                <form onSubmit={handleStart} className="space-y-3">
                  <label htmlFor="chat-name" className="text-sm font-medium text-primary">Your name</label>
                  <Input id="chat-name" autoComplete="given-name" placeholder="Enter your name" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required disabled={busy} />
                  <button type="submit" disabled={busy || !name.trim()} className="rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground disabled:opacity-50">{busy ? "Starting..." : "Start conversation"}</button>
                </form>
              )}
              <p className="mt-3 text-center text-[11px] text-muted-foreground">You can also <Link href="/contact" className="font-medium text-primary underline underline-offset-2">contact us</Link> by email.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
