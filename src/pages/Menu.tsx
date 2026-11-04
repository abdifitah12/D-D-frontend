import { useState } from "react";
import { products, categories } from "@/data/products";
import ScrollReveal from "@/components/ScrollReveal";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.tag === activeCategory);

  return (
    <>
      <section className="bg-primary text-primary-foreground pt-32 pb-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-accent uppercase tracking-widest text-sm font-medium mb-6 animate-fade-up">Diriye & Delights</p>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 animate-fade-up delay-100">Our Menu</h1>
          <p className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed animate-fade-up delay-200">
            Handcrafted beverages and fresh desserts frosted by Maida. Perfect for late-night cravings or an afternoon retreat.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-pill ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => {
              return (
                <ScrollReveal key={product.id} delay={(i % 3) * 100}>
                  <div className="bg-white rounded-2xl border border-border/60 flex flex-col h-full hover:shadow-xl transition-all duration-300">
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <h3 className="font-serif text-2xl text-primary">{product.name}</h3>
                        <span className="font-sans font-medium text-accent whitespace-nowrap">
                          {product.price === null ? "POA*" : `$${product.price.toFixed(2)}`}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                        {product.description}
                      </p>
                      
                      {product.variations && product.variations.length > 0 && (
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {product.variations.map((v) => (
                              <span key={v} className="text-xs font-medium bg-secondary text-primary px-3 py-1.5 rounded-md">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="mt-12 text-center text-muted-foreground text-sm">
            <p>* POA: Price on arrival / request. Menu items and prices are subject to change.</p>
          </div>

        </div>
      </section>
    </>
  );
}
