export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-semibold">D&D Cafe</div>
          <p className="text-sm text-slate-600 mt-1">
            Coffee • Cakes • Pastries. Made fresh daily.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-2">Quick Links</div>
          <ul className="space-y-1">
            <li><a href="/products" className="hover:underline">Products</a></li>
            <li><a href="/location" className="hover:underline">Location</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-2">Hours</div>
          <p>Mon–Fri 7am–6pm<br/>Sat–Sun 8am–6pm</p>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-6">© {new Date().getFullYear()} D&D Cafe</div>
    </footer>
  );
}
