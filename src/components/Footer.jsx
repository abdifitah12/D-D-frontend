import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-3">

        {/* BRAND */}
        <div>
          <h3 className="font-display text-xl font-semibold">D&amp;D Café</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Coffee • Cakes • Pastries.  
            Freshly made with love every day.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-sm font-semibold mb-3 uppercase tracking-wide">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/#products" className="hover:text-green-700 transition">
                Products
              </Link>
            </li>
            <li>
              <Link to="/#location" className="hover:text-green-700 transition">
                Location
              </Link>
            </li>
            <li>
              <Link to="/#about" className="hover:text-green-700 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/#contact" className="hover:text-green-700 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* SOCIAL + CONTACT */}
        <div>
          <h4 className="text-sm font-semibold mb-3 uppercase tracking-wide">
            Connect With Us
          </h4>

          <p className="text-sm text-slate-600 mb-4">
            +1 (816) 602-7654
          </p>

          <div className="flex gap-4 text-lg">
            <a
              href="https://snapchat.com/t/KbqJIrF0"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full hover:bg-slate-100 text-yellow-500 transition"
              aria-label="Snapchat"
            >
              <i className="fa-brands fa-snapchat"></i>
            </a>

            <a
              href="https://www.instagram.com/dndcafe.to/"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full hover:bg-slate-100 text-pink-500 transition"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>

            <a
              href="https://www.tiktok.com/@dnd.cafe.to"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full hover:bg-slate-100 text-black transition"
              aria-label="TikTok"
            >
              <i className="fa-brands fa-tiktok"></i>
            </a>

            <a
              href="https://wa.me/18166027654"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full hover:bg-slate-100 text-green-600 transition"
              aria-label="WhatsApp"
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t text-center py-4 text-xs text-slate-500">
        © {new Date().getFullYear()} D&amp;D Café · All rights reserved
      </div>
    </footer>
  );
}
