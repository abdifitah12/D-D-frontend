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
  return <section className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-3 pb-3 pt-10 text-white sm:px-5 sm:pb-5" aria-label="Live comments">
    <div className="max-w-md">
      <h3 className="sr-only">Live comments</h3>
      <div ref={list} role="log" aria-label="Comments in this live room" aria-live="polite" tabIndex={0}
        className="pointer-events-auto max-h-32 w-[78%] space-y-2 overflow-y-auto overscroll-contain rounded-lg px-1 py-2 text-sm [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:max-h-44 sm:w-full"
        onScroll={() => { if (list.current) pinned.current = list.current.scrollHeight - list.current.scrollTop - list.current.clientHeight < 40; }}>
        {comments.length === 0 ? <p className="text-white/80 drop-shadow-md">Say hello while you watch.</p>
          : comments.map(comment => <article key={comment.id} className="flex items-start gap-2 [text-shadow:0_1px_3px_rgb(0_0_0_/_90%)]">
            <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/40 text-xs font-semibold ring-1 ring-white/25">{comment.name.slice(0, 1).toUpperCase()}</span>
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{comment.name}</span>{comment.role !== "viewer" && <span className="text-[10px] capitalize text-white/75">{comment.role}</span>}</div>
              <p className="whitespace-pre-wrap break-words text-white/95">{comment.text}</p>
            </div>
          </article>)}
      </div>
      <form onSubmit={onSubmit} className="pointer-events-auto mt-2 flex items-center gap-2">
        <label htmlFor="live-comment" className="sr-only">Add a comment</label>
        <input id="live-comment" value={draft} onChange={event => onDraft(event.target.value)} maxLength={500} disabled={!connected || busy}
          placeholder={connected ? "Say something..." : "Connecting comments..."} autoComplete="off"
          className="min-h-11 min-w-0 flex-1 rounded-full border border-white/25 bg-black/35 px-4 text-base text-white backdrop-blur-sm placeholder:text-white/80 focus:border-white focus:outline-none disabled:opacity-60" />
        <button type="submit" aria-label={busy ? "Sending comment" : "Send comment"} disabled={!connected || busy || !draft.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"><Send size={19} /></button>
      </form>
      {error && <p role="alert" className="pointer-events-auto mt-2 rounded-lg bg-black/65 px-3 py-2 text-xs text-white">{error}</p>}
      {!connected && !error && <p role="status" className="sr-only">Connecting to live comments.</p>}
    </div>
  </section>;
}