import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/** Smooth-scroll helper that works across routes */
function useGoToSection(closeMenu) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (id) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (closeMenu) closeMenu(false);
    };

    if (pathname !== "/") {
      // Go Home first, then scroll after the page paints
      navigate("/");
      setTimeout(doScroll, 0);
    } else {
      doScroll();
    }
  };
}

const DesktopItem = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-3 py-2 rounded-lg text-sm hover:bg-black/5"
  >
    {label}
  </button>
);

const MobileItem = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-left px-3 py-2 rounded-lg text-sm hover:bg-black/5"
  >
    {label}
  </button>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const goTo = useGoToSection(setOpen);

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      {/* Announcement bar */}
      <div className="bg-brand.dark text-white text-center text-xs py-2">
        ORDER DESSERTS FOR LOCAL PICK-UP OR DELIVERY
      </div>

      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center shrink-0" onClick={() => goTo("home")}>
                    <img
            src="/moon.png"
            alt="Cafe logo"
            className="h-16 w-16 rounded-full object-cover shadow-lg brightness-125 contrast-110"
            style={{
              border: "2px solid #6b8e6e",
              backgroundColor: "white",
              padding: "4px",
            }}
/>

      </Link>

        {/* CENTER (mobile-only): brand text between logo and burger */}
        <div className="md:hidden flex-1 text-center">
          <Link
            to="/"
            onClick={() => goTo("home")}
            className="inline-block font-display text-lg font-semibold tracking-wide text-slate-800"
          >
            D&amp;D Café
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <DesktopItem label="Home" onClick={() => goTo("home")} />
          <DesktopItem label="Products" onClick={() => goTo("products")} />
          <DesktopItem label="Location" onClick={() => goTo("location")} />
          <DesktopItem label="About" onClick={() => goTo("about")} />
          <DesktopItem label="Contact" onClick={() => goTo("contact")} />
          <Link to="/products" className="btn btn-primary ml-2">ORDER NOW</Link>
        </div>

        {/* Right: Mobile burger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="text-xl leading-none">≡</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
            <MobileItem label="Home" onClick={() => goTo("home")} />
            <MobileItem label="Products" onClick={() => goTo("products")} />
            <MobileItem label="Location" onClick={() => goTo("location")} />
            <MobileItem label="About" onClick={() => goTo("about")} />
            <MobileItem label="Contact" onClick={() => goTo("contact")} />
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-2"
            >
              ORDER NOW
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
