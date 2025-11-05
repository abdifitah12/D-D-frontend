import { Link } from "react-router-dom";
// If you keep your video in src/assets, uncomment and import like this:
// import coffeeVideo from "../assets/coffee-cake.mp4";

export default function Home() {
  return (
    <div id="home" className="mx-auto max-w-6xl px-4 py-10 space-y-12">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden rounded-3xl border min-h-[500px]">
        {/* Video background */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          {/* Option A: from public folder */}
          <source src="/coffee-cake.mp4" type="video/mp4" />
          {/* Option B: if imported from src/assets */}
          {/* <source src={coffeeVideo} type="video/mp4" /> */}
        </video>

        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />

        {/* Hero Content */}
        <div className="relative">
          <div className="grid md:grid-cols-2">
            {/* Left text side */}
            <div className="p-10 md:p-14 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
              <div className="inline-block rounded-2xl bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                Seasonal
              </div>
              <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
                They’re Back:{" "}
                <span className="underline decoration-wavy">Holiday Desserts</span>!
              </h1>
              <p className="mt-3 text-white/90">
                Order from our fan-favorite pies, cupcakes, and creamy puddings.
                Freshly made, pick-up or local delivery.
              </p>
              <div className="mt-6 flex gap-3">
                <Link to="/products" className="btn btn-primary">
                  ORDER NOW
                </Link>
                <Link to="/location" className="btn btn-ghost">
                  FIND A LOCATION
                </Link>
              </div>
            </div>

            {/* Right visual spacer (preserves layout balance) */}
            <div className="min-h-[260px] md:min-h-full" />
          </div>
        </div>
      </section>

      {/* ==================== PRODUCTS SECTION ==================== */}
      <section id="products" className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Signature Cakes",
            text: "Classic flavors for every celebration.",
            to: "/products",
          },
          {
            title: "Coffee & Lattes",
            text: "From bold espresso to milky smooth.",
            to: "/products",
          },
          {
            title: "Gift Boxes",
            text: "Sweet assortments for family & friends.",
            to: "/products",
          },
        ].map((c) => (
          <div key={c.title} className="card p-6 rounded-2xl border hover:shadow-md transition">
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-1 text-slate-600">{c.text}</p>
            <Link to={c.to} className="btn btn-ghost mt-4">
              Explore
            </Link>
          </div>
        ))}
      </section>

      {/* ==================== LOCATION SECTION ==================== */}
      <section id="location" className="rounded-3xl border bg-white p-8 md:p-12 text-center">
        <h2 className="font-display text-3xl">Visit Our Café</h2>
        <p className="mt-2 text-slate-600">
          Find your nearest D&amp;D Café for dine-in or take-out orders. Fresh desserts
          and signature coffee served daily!
        </p>
        <Link to="/location" className="btn btn-primary mt-4">
          Find a Location
        </Link>
      </section>

      {/* ==================== ABOUT SECTION ==================== */}
      <section id="about" className="rounded-3xl border bg-white p-8 md:p-12 text-center">
        <h2 className="font-display text-3xl">About D&amp;D Café</h2>
        <p className="mt-2 text-slate-600">
          At D&amp;D Café, we believe in creating joyful moments with handcrafted
          desserts and freshly brewed coffee. Every bite is made with love and
          local ingredients.
        </p>
        <Link to="/about" className="btn btn-primary mt-4">
          Learn More
        </Link>
      </section>

      {/* ==================== CONTACT / REWARDS SECTION ==================== */}
      <section id="contact" className="rounded-3xl border bg-white p-8 md:p-12 text-center">
        <h2 className="font-display text-3xl">Join our Rewards</h2>
        <p className="mt-2 text-slate-600">
          Earn points on every order. Get birthday treats & seasonal perks.
        </p>
        <Link to="/contact" className="btn btn-primary mt-4">
          Contact Us
        </Link>
      </section>
    </div>
  );
}
