export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* <h1 className="font-display text-3xl mb-6">Contact</h1>

      <form className="rounded-2xl border bg-white p-6 grid gap-4 shadow-sm">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Name</span>
          <input className="rounded-xl border px-3 py-2" placeholder="Your full name" />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            className="rounded-xl border px-3 py-2"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Message</span>
          <textarea
            className="rounded-xl border px-3 py-2 min-h-28"
            placeholder="How can we help?"
          />
        </label>

        <button type="button" className="rounded-xl bg-green-700 text-white px-4 py-2 font-semibold w-fit hover:opacity-90">
          Send (demo)
        </button>

        <p className="text-xs text-slate-500">This is UI-only — no messages are sent.</p>
      </form>
       <br/><br/> */}
       
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
    <p>📞 <strong>Phone:</strong> +1 (816) 602-7654</p>
    <p>📍 <strong>Address:</strong> 2102 Kipling Ave, Etobicoke, ON M9W 4K5</p>
    <p>✉️ <strong>Email:</strong> hello@dndcafe.com</p>
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
      href="https://wa.me/18166027654"
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
      <span>4pm – 9pm</span>
    </div>
    <div className="flex justify-between border-b pb-1">
      <span>Tuesday</span>
      <span>2pm – 9pm</span>
    </div>
    <div className="flex justify-between border-b pb-1">
      <span>Wednesday</span>
      <span>2pm – 9pm</span>
    </div>
    <div className="flex justify-between border-b pb-1">
      <span>Thursday</span>
      <span>2pm – 9pm</span>
    </div>
    <div className="flex justify-between border-b pb-1 font-semibold">
      <span>Friday</span>
      <span>4pm – 12am</span>
    </div>
    <div className="flex justify-between border-b pb-1 font-semibold">
      <span>Saturday</span>
      <span>4pm – 12am</span>
    </div>
    <div className="flex justify-between">
      <span>Sunday</span>
      <span>4pm – 9pm</span>
    </div>
  </div>

  
</section>
    </div>
    
  );
}
