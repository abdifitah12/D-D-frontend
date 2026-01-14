import { products } from "../data/products.js";

function ProductCard({ p }) {
  let videoSrc = null;
  if (p.id === 1) videoSrc = "/sambuusa.mp4";
  if (p.id === 2) videoSrc = "/pie.mp4";
  if (p.id === 3) videoSrc = "/latte.mp4";
  if (p.id === 4) videoSrc = "/cold.mp4";
  if (p.id === 5) videoSrc = "/banana.mp4";
  if (p.id === 6) videoSrc = "/chocolate.mp4";

  return (
    <div className="card overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition border bg-white">
      <div className="aspect-square relative">
        {videoSrc ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src={videoSrc}
          />
        ) : (
          <div className="h-full w-full bg-slate-100 grid place-items-center text-6xl">
            <span aria-hidden="true">{p.icon}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-lg">{p.name}</h3>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/5">
            {p.tag}
          </span>
        </div>

        <div className="mt-2 font-semibold text-lg">${p.price.toFixed(2)}</div>

        <button className="mt-3 w-full rounded-xl bg-green-700 text-white py-2 font-semibold hover:opacity-90">
          Add
        </button>
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl mb-6 text-center md:text-left">
        Products
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
