import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-12">
      {/* Hero (no images; Magnolia-like layout using shapes/gradients) */}
      <section className="relative overflow-hidden rounded-3xl border bg-brand.cream">
        <div className="grid md:grid-cols-2">
          <div className="p-10 md:p-14">
            <div className="inline-block rounded-2xl bg-brand.rose px-3 py-1 text-xs font-semibold">
              Seasonal
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              They’re Back: <span className="underline decoration-wavy">Holiday Desserts</span>!
            </h1>
            <p className="mt-3 text-slate-700">
              Order from our fan-favorite pies, cupcakes, and creamy puddings. Freshly made, pick-up or local delivery.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/products" className="btn btn-primary">ORDER NOW</Link>
              <Link to="/location" className="btn btn-ghost">FIND A LOCATION</Link>
            </div>
          </div>
          {/* Right side “visual block” that feels like an image */}
          <div className="min-h-[260px] md:min-h-full bg-gradient-to-br from-brand.rose to-brand.accent relative">
            <div className="absolute inset-8 rounded-3xl border-2 border-white/70"></div>
            <div className="absolute right-10 top-10 text-7xl">🧁</div>
            <div className="absolute left-12 bottom-10 text-8xl">☕</div>
          </div>
        </div>
      </section>

      {/* Three CTA tiles (Shipping/Pick-up/Catering vibe) */}
      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Signature Cakes", text: "Classic flavors for every celebration.", to: "/products" },
          { title: "Coffee & Lattes", text: "From bold espresso to milky smooth.", to: "/products" },
          { title: "Gift Boxes", text: "Sweet assortments for family & friends.", to: "/products" },
        ].map((c) => (
          <div key={c.title} className="card p-6">
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-1 text-slate-600">{c.text}</p>
            <Link to={c.to} className="btn btn-ghost mt-4">Explore</Link>
          </div>
        ))}
      </section>

      {/* Promo banner */}
      <section className="rounded-3xl border bg-white p-8 md:p-12 text-center">
        <h2 className="font-display text-3xl">Join our Rewards</h2>
        <p className="mt-2 text-slate-600">Earn points on every order. Get birthday treats & seasonal perks.</p>
        <Link to="/about" className="btn btn-primary mt-4">Learn More</Link>
      </section>
    </div>
  );
}
