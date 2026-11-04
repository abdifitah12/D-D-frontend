import ScrollReveal from "@/components/ScrollReveal";
import storyMainImg from "@/assets/real-cafe-interior.jpeg";

export default function Story() {
  return (
    <>
      <section className="bg-primary text-primary-foreground pt-32 pb-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-accent uppercase tracking-widest text-sm font-medium mb-6 animate-fade-up">Our Heritage</p>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 animate-fade-up delay-100">Our Story</h1>
          <p className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed animate-fade-up delay-200">
            A family-owned neighbourhood cafe where every detail is infused with love, warmth, and hospitality.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
          
          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={storyMainImg} alt="DnD Cafe interior" className="w-full object-cover aspect-[4/5]" />
              <div className="absolute inset-0 border border-primary/10 rounded-2xl" />
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal delay={100}>
              <h2 className="font-serif text-4xl text-primary leading-tight">
                The meaning behind<br />
                <span className="italic text-accent">DnD Cafe</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed font-sans">
                <p>
                  To us, the letters "DnD" hold a dual significance. They stand for <strong>"Diriye & Delights"</strong> — a tribute to our family name, embodying the genuine warmth, joy, and deep-rooted hospitality we bring to every interaction. 
                </p>
                <p>
                  Equally, they represent our ethos: <strong>"Do Not Disturb."</strong> In a world that never stops moving, we created a cozy sanctuary where our guests can step away from the noise, unwind, and truly be present in the moment.
                </p>
                <p>
                  Family-owned by Mohamed Ahmed, the true heart and face of our cafe is our Hooyo (Mother), a devoted mother of eight. Her philosophy is simple: when you walk through our doors, you aren't just a customer; you're a guest in our home.
                </p>
                <p>
                  Whether you're stopping by for a perfectly crafted iced caramel macchiato, indulging in our famous gourmet banana pudding, or simply finding a quiet corner to read late into the night, you are welcome here. We believe in community connection, an unwavering commitment to quality, and an environment where every sip and bite is lovingly made.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="pt-8 border-t border-border mt-8">
                <p className="font-serif text-2xl text-primary mb-2">Mohamed Ahmed</p>
                <p className="text-accent uppercase tracking-widest text-xs font-medium">Founder, DnD Cafe</p>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>
    </>
  );
}