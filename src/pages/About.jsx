export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <h1 className="font-display text-3xl">About Us</h1>
      <p className="text-slate-700">
        We’re a neighborhood café inspired by classic bakeries. Our menu features fresh coffee,
        handcrafted cakes, and seasonal desserts—no artificial images here, just clean UI for now 😉.
      </p>
      <div className="card p-6 bg-brand.cream">
        <h2 className="font-semibold">Our Promise</h2>
        <ul className="mt-2 list-disc pl-5 text-slate-700">
          <li>Quality ingredients</li>
          <li>Small-batch baking</li>
          <li>Friendly service</li>
        </ul>
      </div>
    </div>
  );
}
