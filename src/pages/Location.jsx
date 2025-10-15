export default function Location() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <h1 className="font-display text-3xl">Locations</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {[1,2].map((n) => (
          <div key={n} className="card p-6">
            <h3 className="font-semibold">Downtown Café #{n}</h3>
            <p className="text-sm text-slate-600 mt-1">123 Main St, Your City, ST 12345</p>
            <p className="text-sm text-slate-600">Open 7am – 6pm</p>
            {/* Map placeholder (no external images) */}
            <div className="mt-4 h-48 rounded-xl border grid place-items-center bg-[linear-gradient(45deg,#f5f5f5_25%,transparent_25%),linear-gradient(-45deg,#f5f5f5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f5f5f5_75%),linear-gradient(-45deg,transparent_75%,#f5f5f5_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] text-slate-400">
              Map Placeholder
            </div>
            <a
              className="btn btn-ghost mt-4 w-fit"
              href="https://maps.google.com"
              target="_blank" rel="noreferrer"
            >
              Open in Maps
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
