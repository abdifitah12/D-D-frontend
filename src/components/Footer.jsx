import { Link } from "react-router-dom";

export default function Footer() {
  return (
     <footer className="border-t bg-white">
  <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-3 text-center md:text-left">

    {/* BRAND */}
    <div className="flex flex-col items-center md:items-start">
      <h3 className="font-display text-xl font-semibold">DND Café</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        Coffee • Cakes • Pastries.
        Freshly made with love every day.
      </p>
    </div>

    {/* QUICK LINKS */}
    <div className="flex flex-col items-center md:items-start">
      <h4 className="text-sm font-semibold mb-3 uppercase tracking-wide">
        Quick Links
      </h4>

      <ul className="space-y-2 text-sm text-slate-600">
        <li><Link to="/#products">Products</Link></li>
        <li><Link to="/#location">Location</Link></li>
        <li><Link to="/#about">About</Link></li>
        <li><Link to="/#contact">Contact</Link></li>
      </ul>
    </div>

    {/* SOCIAL + CONTACT */}
    <div className="flex flex-col items-center md:items-start">
      <h4 className="text-sm font-semibold mb-3 uppercase tracking-wide">
        Connect With Us
      </h4>

      <p className="text-sm text-slate-600 mb-4">
        +1 647 463 4557
      </p>

      <div className="flex justify-center md:justify-start gap-4 text-lg">
        {/* icons */}
      </div>
    </div>

  </div>

  <div className="border-t text-center py-4 text-xs text-slate-500">
    © {new Date().getFullYear()} DND Café · All rights reserved
  </div>
</footer>
  );
}
