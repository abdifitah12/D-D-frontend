import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import wordmark from "@/assets/dnd-cafe-wordmark.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "/story" },
  { label: "Contact", href: "/contact" },
  { label: "Events", href: "/events" },
  { label: "FAQs", href: "/faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="bg-primary text-primary-foreground text-center text-xs py-2 tracking-widest uppercase font-medium">
        Open daily in Etobicoke &nbsp;·&nbsp; <a href="tel:+14166881450" className="hover:text-accent transition-colors">416-688-1450</a>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav py-2" : "bg-background py-4"}`}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
          
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src={wordmark}
              alt="DnD Cafe logo"
              className="w-36 md:w-44 h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all hover:text-accent relative py-1 ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {location === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-accent rounded-full animate-fade-in" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} className="text-primary" /> : <Menu size={20} className="text-primary" />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden animate-fade-in" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-background shadow-2xl flex flex-col animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex min-w-0 items-center justify-between gap-2 p-4 border-b border-border/50">
              <Link
                href="/"
                aria-label="Go to DnD Cafe home"
                className="min-w-0 max-w-[calc(100%-3rem)]"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setOpen(false);
                  if (location !== "/") {
                    setLocation("/");
                  }
                }}
              >
                <img
                  src={wordmark}
                  alt="DnD Cafe logo"
                  className="min-w-0 w-[clamp(7rem,36vw,9rem)] h-auto object-contain object-left"
                />
              </Link>
              <button onClick={() => setOpen(false)} className="shrink-0 p-2 hover:bg-secondary rounded-full text-primary transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col p-6 gap-2 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className={`px-4 py-4 rounded-xl text-lg font-serif transition-colors ${
                    location === link.href
                      ? "bg-secondary text-primary"
                      : "hover:bg-secondary/50 text-foreground"
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="p-6 border-t border-border/50 space-y-4 bg-secondary/20">
              <a href="mailto:dndcafe.to@gmail.com"
                className="flex items-center justify-center bg-primary text-primary-foreground w-full py-4 rounded-full font-medium text-sm gap-2 hover:bg-primary/90 transition-colors">
                <i className="fa-solid fa-envelope text-base" /> Email Us
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
