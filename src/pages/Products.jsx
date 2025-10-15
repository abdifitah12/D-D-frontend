import { products } from "../data/products.js";

function ProductCard({ p }) {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-brand.rose to-brand.accent grid place-items-center text-6xl">
        <span aria-hidden="true">{p.icon}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{p.name}</h3>
          <span className="text-sm px-2 py-1 rounded-full bg-black/5">{p.tag}</span>
        </div>
        <div className="mt-2 text-brand-dark font-semibold">${p.price.toFixed(2)}</div>
        <button className="btn btn-primary mt-3 w-full">Add</button>
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl mb-6">Products</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
