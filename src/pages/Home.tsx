import { Link } from "wouter";
import ScrollReveal from "@/components/ScrollReveal";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

import heroImg from "@/assets/hero.png";
import storyMainImg from "@/assets/real-cafe-interior.jpeg";
import icedCaramelMacchiatoImg from "@/assets/iced-caramel-macchiato.png";
import icedMatchaImg from "@/assets/home-iced-matcha.png";
import biscoffMilkCakeNewImg from "@/assets/home-biscoff-milk-cake-new.png";
import gallery1 from "@/assets/home-gallery-01.jpeg";
import gallery2 from "@/assets/home-gallery-02.jpeg";
import gallery3 from "@/assets/home-gallery-03.jpeg";
import gallery4 from "@/assets/home-gallery-04.jpeg";

const features = [
  { img: icedMatchaImg, title: "Iced Matcha", desc: "Stone-ground green tea whisked smooth — pick your favourite flavour." },
  { img: icedCaramelMacchiatoImg, title: "Iced Caramel Macchiato", desc: "Vanilla, milk and espresso finished with a caramel drizzle over ice." },
  { img: biscoffMilkCakeNewImg, title: "Biscoff Milk Cake", desc: "Soft, milk-soaked cake topped with Biscoff crumbs and caramel drizzle." },
];

const reviews = [
  { name: "Sarah M.", text: "The vibe here is incredible. Truly a 'do not disturb' sanctuary. And the milk cake? Unmatched in Toronto." },
  { name: "David K.", text: "You can feel the family warmth the moment you walk in. DnD makes everyone feel like a regular." },
  { name: "Aisha R.", text: "Best iced caramel macchiato I've had. Period. The late-night hours are a lifesaver for studying." },
  { name: "Omar H.", text: "The banana pudding is dangerously good. Authentic, warm, and the aesthetic is absolutely premium." },
  { name: "Chloe T.", text: "My new favorite spot in Etobicoke. The service is charismatic, and the desserts are baked to perfection." },
];

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="DnD Cafe cinematic spread" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 w-full pt-20">
          <div className="max-w-2xl">
            <p className="text-accent uppercase tracking-[0.2em] text-sm font-medium mb-6 animate-fade-up">
              Diriye & Delights
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-primary-foreground leading-[1.1] mb-8 animate-fade-up delay-100">
              Unwind.<br />
              <span className="italic font-light text-accent">Do Not Disturb.</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed mb-10 max-w-lg animate-fade-up delay-200">
              Step into our cozy sanctuary in Etobicoke. Handcrafted specialty lattes, signature milk cakes, and a warm retreat from the busy world.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
              <Link href="/menu" className="bg-accent text-primary-foreground px-8 py-4 rounded-full font-medium transition-all hover:bg-accent/90 shadow-lg shadow-accent/20">
                See Full Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WELCOME / HOOYO */}
      <section className="py-24 md:py-32 bg-background">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-2xl">
                <img src={storyMainImg} alt="DnD Cafe interior" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6">Welcome to our home.</h2>
              <div className="w-16 h-px bg-accent mb-8" />
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg font-sans">
                <p>
                  DnD carries a deliberate double meaning: <strong>Diriye & Delights</strong> — celebrating our family name, warmth, and hospitality — and <strong>Do Not Disturb</strong> — a calm retreat from your busy life.
                </p>
                <p>
                  At the heart of it all is Hooyo (Mother), a mother of eight whose passion for community and connection built the foundation of our cafe. Visiting us should feel like stepping into a loved one's warm home — unhurried, intimate, and lovingly made.
                </p>
              </div>
              <div className="mt-10">
                <Link href="/story" className="text-primary font-medium border-b border-accent pb-1 hover:text-accent transition-colors inline-flex items-center gap-2">
                  Read our family story <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FEATURED ITEMS */}
      <section className="py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-accent uppercase tracking-widest text-sm font-medium mb-4">Our Signatures</p>
              <h2 className="font-serif text-4xl md:text-5xl text-primary">Crafted with care</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 150}>
                <div className="group bg-background rounded-2xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-500">
                  {f.img && <div className="relative aspect-square overflow-hidden">
                    <img src={f.img} alt={f.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>}
                  <div className="p-8">
                    <h3 className="font-serif text-2xl text-primary mb-3">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/menu" className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium transition-all hover:bg-primary/90 shadow-md">
              Explore Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <ScrollReveal>
              <h2 className="font-serif text-4xl text-primary">The DnD Aesthetic</h2>
              <p className="text-muted-foreground mt-4">Follow us <a href="https://www.instagram.com/dndcafe.to/" target="_blank" rel="noreferrer" className="text-accent hover:underline">@dndcafe.to</a></p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <Link href="/contact" className="bg-secondary text-primary px-6 py-3 rounded-full font-medium hover:bg-secondary/80 transition-colors inline-block">
                View Our Location
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[gallery1, gallery2, gallery3, gallery4].map((src, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <a href="https://www.instagram.com/dndcafe.to/" target="_blank" rel="noreferrer" className="block relative group aspect-square rounded-2xl overflow-hidden">
                  <img src={src} alt="Cafe visual" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <i className="fa-brands fa-instagram text-3xl text-white" />
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEW CAROUSEL */}
      <section className="py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <ScrollReveal>
            <div className="text-center mb-16">
              <i className="fa-solid fa-quote-right text-4xl text-accent/50 mb-6" />
              <h2 className="font-serif text-4xl md:text-5xl">Customer Love</h2>
            </div>
          </ScrollReveal>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {reviews.map((review, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_60%] lg:flex-[0_0_40%] pl-6">
                  <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-8 md:p-10 h-full">
                    <div className="flex gap-1 text-accent mb-6 text-sm">
                      {[1,2,3,4,5].map(s => <i key={s} className="fa-solid fa-star" />)}
                    </div>
                    <p className="text-lg md:text-xl font-serif italic text-primary-foreground/90 mb-8 leading-relaxed">
                      "{review.text}"
                    </p>
                    <p className="font-sans font-medium text-accent tracking-wide uppercase text-sm">
                      — {review.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}