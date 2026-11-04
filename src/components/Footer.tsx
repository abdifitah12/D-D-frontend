import { Link } from "wouter";
import wordmark from "@/assets/dnd-cafe-wordmark.png";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 md:px-12 grid gap-16 md:grid-cols-12 mb-16">
        
        {/* Brand */}
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <img
              src={wordmark}
              alt="DnD Cafe logo"
              className="w-52 h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>
          <p className="text-primary-foreground/70 leading-relaxed max-w-sm mb-8 font-sans">
            Diriye & Delights. A cozy sanctuary where guests unwind and switch off from a busy world. Serving handcrafted specialty lattes and signature desserts.
          </p>
          <div className="flex gap-4">
            {[
              { icon: "fa-instagram", href: "https://www.instagram.com/dndcafe.to/", label: "Instagram" },
              { icon: "fa-tiktok", href: "https://www.tiktok.com/@dnd.cafe.to", label: "TikTok" },
              { icon: "fa-envelope", href: "mailto:dndcafe.to@gmail.com", label: "Email", solid: true },
            ].map((s) => (
              <a key={s.icon} href={s.href} target={s.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer" aria-label={s.label}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-primary-foreground/20 hover:bg-primary-foreground hover:text-primary transition-all duration-300">
                <i className={`${s.solid ? "fa-solid" : "fa-brands"} ${s.icon} text-sm`} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="md:col-span-3">
          <h4 className="font-serif text-lg mb-6">Explore</h4>
          <ul className="space-y-4">
            {[
              { label: "Home", href: "/" },
              { label: "Our Menu", href: "/menu" },
              { label: "Our Story", href: "/story" },
              { label: "Contact Us", href: "/contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours & contact */}
        <div className="md:col-span-4">
          <h4 className="font-serif text-lg mb-6">Visit Us</h4>
          <address className="not-italic text-primary-foreground/70 mb-6 space-y-1">
            <p>2102 Kipling Ave Unit 10</p>
            <p>Etobicoke, ON M9W 4K5</p>
          </address>
          <div className="space-y-2 text-primary-foreground/70 text-sm">
            <div className="flex justify-between">
              <span>Mon – Thu</span>
              <span>5 PM – 12 AM</span>
            </div>
            <div className="flex justify-between">
              <span>Fri – Sat</span>
              <span>5 PM – 1:30 AM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday</span>
              <span>5 PM – 12 AM</span>
            </div>
          </div>
          <a href="tel:+14166881450" className="inline-block mt-8 font-serif text-2xl hover:text-accent transition-colors">
            416-688-1450
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
        <p>&copy; {new Date().getFullYear()} DnD Cafe. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
          <p>Diriye & Delights — Do Not Disturb.</p>
        </div>
      </div>
    </footer>
  );
}
