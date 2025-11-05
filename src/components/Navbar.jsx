import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NavItem = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `px-3 py-2 rounded-lg text-sm ${
        isActive ? "bg-black/10" : "hover:bg-black/5"
      }`
    }
  >
    {label}
  </NavLink>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      {/* Announcement bar */}
      <div className="bg-brand.dark text-white text-center text-xs py-2">
        ORDER DESSERTS FOR LOCAL PICK-UP OR DELIVERY
      </div>

      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="/image3.jpg"
            alt="Cafe logo"
            className="h-12 w-12 rounded-full object-cover"
            style={{ border: "2px solid #6b8e6e" }}
          />
        </Link>

        {/* CENTER (mobile-only): brand text between logo and burger */}
        <div className="md:hidden flex-1 text-center">
          <Link
            to="/"
            className="inline-block font-display text-lg font-semibold tracking-wide text-slate-800"
          >
            D&amp;D Café
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <NavItem to="/" label="Home" />
          <NavItem to="/products" label="Products" />
          <NavItem to="/location" label="Location" />
          <NavItem to="/about" label="About" />
          <NavItem to="/contact" label="Contact" />
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
            <NavItem to="/" label="Home" onClick={() => setOpen(false)} />
            <NavItem to="/products" label="Products" onClick={() => setOpen(false)} />
            <NavItem to="/location" label="Location" onClick={() => setOpen(false)} />
            <NavItem to="/about" label="About" onClick={() => setOpen(false)} />
            <NavItem to="/contact" label="Contact" onClick={() => setOpen(false)} />
            <Link to="/products" onClick={() => setOpen(false)} className="btn btn-primary">
              ORDER NOW
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
