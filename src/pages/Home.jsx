import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { products } from "../data/products.js";

function ProductCardMini({ p }) {
  let videoSrc = null;
  if (p.id === 1) videoSrc = "/sambuusa.mp4";
  if (p.id === 2) videoSrc = "/tea.mp4";
  if (p.id === 3) videoSrc = "/latte.mp4";
  if (p.id === 4) videoSrc = "/cold.mp4";
  if (p.id === 5) videoSrc = "/banana.mp4";
  if (p.id === 6) videoSrc = "/chocolate.mp4";

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
      <div className="aspect-square">
        {videoSrc ? (
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline src={videoSrc} />
        ) : (
          <div className="h-full w-full bg-slate-100 grid place-items-center text-6xl">{p.icon}</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold">{p.name}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-black/5">{p.tag}</span>
        </div>
        <div className="mt-2 font-semibold">${p.price.toFixed(2)}</div>
        <Link to="/products" className="mt-3 inline-block rounded-xl bg-green-700 text-white px-4 py-2 font-semibold hover:opacity-90">
          View
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const location = useLocation();

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  // ✅ scroll to section when url contains #hash
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  return (
    <div id="home" className="mx-auto max-w-6xl px-4 py-10 space-y-12">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border min-h-[500px]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          playsInline
          muted={muted}
        >
          <source src="/bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />

        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
          aria-label="Toggle sound"
        >
          {muted ? "🔇" : "🔊"}
        </button>

        <div className="relative">
          <div className="grid md:grid-cols-2">
            <div className="p-10 md:p-14 text-white drop-shadow">
              <div className="inline-block rounded-2xl bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                Seasonal
              </div>

              <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
                They’re Back: <span className="underline decoration-wavy">Holiday Desserts</span>!
              </h1>

              <p className="mt-3 text-white/90">
                Order from our fan-favorite pies, cupcakes, and creamy puddings.
                Freshly made, pick-up or local delivery.
              </p>

              <div className="mt-6 flex gap-3">
                <Link to="/#products" className="rounded-xl bg-green-700 text-white px-4 py-2 font-semibold hover:opacity-90">
                  ORDER NOW
                </Link>
                <Link to="/#location" className="rounded-xl border border-white/40 bg-white/10 px-4 py-2 font-semibold hover:bg-white/20">
                  FIND A LOCATION
                </Link>
              </div>
            </div>

            <div className="min-h-[260px] md:min-h-full" />
          </div>
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section id="products" className="scroll-mt-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl">Products</h2>
          <Link to="/products" className="text-sm font-semibold underline hover:opacity-70">
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.slice(0, 6).map((p) => (
            <ProductCardMini key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* LOCATION */}
       <section
  id="location"
  className="scroll-mt-24 rounded-3xl border bg-white p-8 md:p-12"
>
  <h2 className="font-display text-3xl text-center">Visit Our Café</h2>

  <p className="mt-2 text-slate-600 text-center">
    Find your nearest D&amp;D Café for dine-in or take-out orders.
  </p>

  <div className="mt-8 grid gap-8 md:grid-cols-2 items-center">
    {/* LEFT: Address info */}
    <div className="space-y-3 text-center md:text-left">
      <h3 className="text-center font-semibold">D&amp;D Café</h3>

      <p className="text-slate-600">
        📍 2102 Kipling Ave, Etobicoke, ON M9W 4K5, Canada
      </p>

      
    </div>

    {/* RIGHT: Map */}
    <div className="h-64 w-full overflow-hidden rounded-2xl border shadow-sm">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2883.70773525015!2d-79.5698492!3d43.7166225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b3a7259520bd5%3A0x9a0c1aab782481bc!2s2102%20Kipling%20Ave%2C%20Etobicoke%2C%20ON%20M9W%204K5%2C%20Canada!5e0!3m2!1sen!2sus!4v1765940114130!5m2!1sen!2sus"
        className="h-full w-full"
        loading="lazy"
        style={{ border: 0 }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
</section>


      {/* ABOUT */}
      <section
  id="about"
  className="scroll-mt-24 rounded-3xl border bg-white p-8 md:p-12 text-center"
>
  <h2 className="font-display text-3xl">About D&amp;D Café</h2>

  <p className="mt-3 max-w-2xl mx-auto text-slate-600">
    Handcrafted desserts and freshly brewed coffee made with love and local
    ingredients. Inspired by classic bakeries and built for our local
    community.
  </p>

  <div className="mt-6 flex justify-center gap-6 text-sm text-slate-700">
    <span>☕ Fresh Coffee</span>
    <span>🍰 Handcrafted Desserts</span>
    <span>🌿 Local Ingredients</span>
  </div>
</section>


      {/* CONTACT */}
  <section
  id="contact"
  className="scroll-mt-24 rounded-3xl border bg-white p-8 md:p-12 text-center space-y-8"
>
  {/* TITLE */}
  <div>
    <h2 className="font-display text-3xl">Contact D&amp;D Café</h2>
    <p className="mt-2 text-slate-600">
      Visit us, call us, or connect with us on social media.
    </p>
  </div>

  {/* CONTACT INFO */}
  <div className="space-y-2 text-slate-700">
    <p>📞 <strong>Phone:</strong> +1 (647)4634557</p>
    <p>📍 <strong>Address:</strong> 2102 Kipling Ave, Etobicoke, ON M9W 4K5</p>
    {/* <p>✉️ <strong>Email:</strong> hello@dndcafe.com</p> */}
  </div>

  {/* SOCIAL MEDIA ICONS */}
  <div className="flex justify-center gap-4 text-2xl">
    <a
      href="https://snapchat.com/t/KbqJIrF0"
      target="_blank"
      rel="noreferrer"
      className="p-2 rounded-full hover:bg-slate-100 text-yellow-500"
      aria-label="Snapchat"
    >
      <i className="fa-brands fa-snapchat"></i>
    </a>

    <a
      href="https://www.instagram.com/dndcafe.to/"
      target="_blank"
      rel="noreferrer"
      className="p-2 rounded-full hover:bg-slate-100 text-pink-500"
      aria-label="Instagram"
    >
      <i className="fa-brands fa-instagram"></i>
    </a>

    <a
      href="https://www.tiktok.com/@dnd.cafe.to"
      target="_blank"
      rel="noreferrer"
      className="p-2 rounded-full hover:bg-slate-100 text-black"
      aria-label="TikTok"
    >
      <i className="fa-brands fa-tiktok"></i>
    </a>

    <a
      href="https://facebook.com"
      target="_blank"
      rel="noreferrer"
      className="p-2 rounded-full hover:bg-slate-100 text-blue-600"
      aria-label="Facebook"
    >
      <i className="fa-brands fa-facebook"></i>
    </a>

    <a
      href="https://wa.me/6474634557"
      target="_blank"
      rel="noreferrer"
      className="p-2 rounded-full hover:bg-slate-100 text-green-600"
      aria-label="WhatsApp"
    >
      <i className="fa-brands fa-whatsapp"></i>
    </a>
  </div>

  {/* OPENING HOURS */}
  <div className="mx-auto max-w-md text-slate-700 space-y-2">
  <h3 className="font-semibold text-lg mt-4">Opening Hours</h3>

  <div className="flex justify-between border-b pb-1">
    <span>Monday</span>
    <span>4 PM – 10 PM</span>
  </div>

  <div className="flex justify-between border-b pb-1">
    <span>Tuesday</span>
    <span>4 PM – 10 PM</span>
  </div>

  <div className="flex justify-between border-b pb-1">
    <span>Wednesday</span>
    <span>4 PM – 10 PM</span>
  </div>

  <div className="flex justify-between border-b pb-1">
    <span>Thursday</span>
    <span>4 PM – 10 PM</span>
  </div>

  <div className="flex justify-between border-b pb-1 font-semibold">
    <span>Friday</span>
    <span>4 PM – 12 AM</span>
  </div>

  <div className="flex justify-between border-b pb-1 font-semibold">
    <span>Saturday</span>
    <span>4 PM – 12 AM</span>
  </div>

  <div className="flex justify-between">
    <span>Sunday</span>
    <span>4 PM – 8 PM</span>
  </div>
</div>


  
</section>



    </div>
  );
}
