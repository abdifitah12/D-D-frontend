export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl mb-6">Contact</h1>
      {/* Static form (no backend). You can wire this to a form service later. */}
      <form className="card p-6 grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Name</span>
          <input className="rounded-xl border px-3 py-2" placeholder="Your full name" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Email</span>
          <input type="email" className="rounded-xl border px-3 py-2" placeholder="you@example.com" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Message</span>
          <textarea className="rounded-xl border px-3 py-2 min-h-28" placeholder="How can we help?" />
        </label>
        <button type="button" className="btn btn-primary w-fit">Send (demo)</button>
        <p className="text-xs text-slate-500">This is a UI-only demo — no messages are sent.</p>
      </form>
    </div>
  );
}
