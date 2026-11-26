import { useEffect, useRef, type FormEvent } from "react";
import { Send } from "lucide-react";

export type LiveComment = {
  id: string; clientId: string; authorId: string; name: string;
  role: "host" | "admin" | "guest" | "viewer"; text: string; createdAt: string;
};
type Props = {
  comments: LiveComment[]; draft: string; connected: boolean; busy: boolean; error: string;
  onDraft: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};
export default function LiveCommentsPanel({ comments, draft, connected, busy, error, onDraft, onSubmit }: Props) {
  const list = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  useEffect(() => { if (list.current && pinned.current) list.current.scrollTop = list.current.scrollHeight; }, [comments]);
  return <section className="mt-6 rounded-2xl border border-border bg-white p-4 sm:p-5" aria-label="Live comments">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="text-xl text-primary">Live comments</h3><p className="text-xs text-muted-foreground">Visible to everyone watching</p></div>
    <div ref={list} role="log" aria-label="Comments in this live room" aria-live="polite" className="max-h-64 space-y-3 overflow-y-auto rounded-xl bg-secondary/30 p-3 sm:p-4"
      onScroll={() => { if (list.current) pinned.current = list.current.scrollHeight - list.current.scrollTop - list.current.clientHeight < 40; }}>
      {comments.length === 0 ? <p className="py-5 text-center text-sm text-muted-foreground">No comments yet. Say hello while you watch.</p>
        : comments.map(comment => <article key={comment.id} className="rounded-xl bg-white p-3 text-sm">
          <div className="mb-1 flex flex-wrap items-center gap-2"><span className="font-semibold text-primary">{comment.name}</span><span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] capitalize text-muted-foreground">{comment.role}</span></div>
          <p className="whitespace-pre-wrap break-words text-primary">{comment.text}</p>
        </article>)}
    </div>
    <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1"><label htmlFor="live-comment" className="mb-2 block text-sm font-medium text-primary">Add a comment</label>
        <textarea id="live-comment" value={draft} onChange={event => onDraft(event.target.value)} rows={2} maxLength={500} disabled={!connected || busy}
          placeholder={connected ? "Write a comment…" : "Connecting comments…"} className="w-full resize-none rounded-xl border border-border bg-white p-3 text-base text-primary outline-none focus:border-accent disabled:opacity-60" />
      </div>
      <button type="submit" disabled={!connected || busy || !draft.trim()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} />{busy ? "Sending…" : "Send"}</button>
    </form>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    {!connected && !error && <p role="status" className="mt-2 text-xs text-muted-foreground">Connecting to live comments.</p>}
  </section>;
}
