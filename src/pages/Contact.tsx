import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";
import contactHeroImg from "@/assets/contact-hero.png";
import { sendContactInquiry } from "@/api/contact";

const formSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Valid email is required").max(254, "Email is too long"),
  date: z.string().max(10, "Date is invalid").optional(),
  guests: z.string().max(4, "Guest count is too large").regex(/^\d*$/, "Guest count must be a whole number").optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2_000, "Message is too long"),
});

type FormValues = z.infer<typeof formSchema>;

const CAFE_EMAIL = "dndcafe.to@gmail.com";

export default function Contact() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", date: "", guests: "", message: "" },
  });

  async function onSubmit(data: FormValues) {
    try {
      await sendContactInquiry(data);
      toast.success("Your enquiry was sent to DnD Cafe.");
      form.reset();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send your enquiry. Please try again.",
      );
    }
  }

  return (
    <>
      <section className="relative min-h-[60vh] flex flex-col justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img src={contactHeroImg} alt="Cafe exterior" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/95" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-primary-foreground">
          <p className="text-accent uppercase tracking-widest text-sm font-medium mb-6 animate-fade-up">Get in Touch</p>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 animate-fade-up delay-100">Visit Us</h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed animate-fade-up delay-200">
            Come for the coffee, stay for the vibes. We look forward to welcoming you.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 md:px-12 grid lg:grid-cols-12 gap-16">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-12">
            <ScrollReveal>
              <h2 className="font-serif text-3xl text-primary mb-6">Location & Hours</h2>
              <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                <address className="not-italic text-muted-foreground font-sans mb-8">
                  <p className="font-medium text-primary text-lg mb-2">DnD Cafe</p>
                  <p>2102 Kipling Ave Unit 10</p>
                  <p>Etobicoke, ON M9W 4K5</p>
                  <a href="tel:+14166881450" className="inline-block mt-4 text-primary hover:text-accent font-medium">
                    416-688-1450
                  </a>
                </address>

                <div className="space-y-1">
                  <p className="font-medium text-primary mb-4">Opening Hours</p>
                  <div className="hours-row"><span>Mon – Thu</span><span>5 PM – 12 AM</span></div>
                  <div className="hours-row"><span>Friday</span><span>5 PM – 1:30 AM</span></div>
                  <div className="hours-row"><span>Saturday</span><span>5 PM – 1:30 AM</span></div>
                  <div className="hours-row"><span>Sunday</span><span>5 PM – 12 AM</span></div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h2 className="font-serif text-3xl text-primary mb-4">Email Us Directly</h2>
              <a
                href={`mailto:${CAFE_EMAIL}`}
                className="inline-flex items-center gap-3 text-primary hover:text-accent transition-colors font-medium text-lg"
              >
                <i className="fa-solid fa-envelope text-accent" />
                {CAFE_EMAIL}
              </a>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <h2 className="font-serif text-3xl text-primary mb-6">Follow Us</h2>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/dndcafe.to/" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-secondary text-primary px-6 py-3 rounded-full hover:bg-accent hover:text-white transition-colors">
                  <i className="fa-brands fa-instagram" /> Instagram
                </a>
                <a href="https://www.tiktok.com/@dnd.cafe.to" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-secondary text-primary px-6 py-3 rounded-full hover:bg-accent hover:text-white transition-colors">
                  <i className="fa-brands fa-tiktok" /> TikTok
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={150}>
              <div className="bg-white rounded-2xl border border-border p-8 md:p-12 shadow-sm">
                <h2 className="font-serif text-3xl text-primary mb-2">Catering & Events</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and your enquiry will be sent directly to our team.
                </p>
                <p className="text-sm text-muted-foreground mb-8 rounded-lg bg-secondary/50 px-4 py-3">
                  Your enquiry is sent using our email service. Please do not include payment details or other sensitive information.
                </p>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="catering-name" className="text-sm font-medium text-primary">Name</label>
                      <input id="catering-name" {...form.register("name")} maxLength={100} autoComplete="name" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="Your name" />
                      {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="catering-email" className="text-sm font-medium text-primary">Your Email</label>
                      <input id="catering-email" {...form.register("email")} type="email" maxLength={254} autoComplete="email" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="your@email.com" />
                      {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="catering-date" className="text-sm font-medium text-primary">Event Date (Optional)</label>
                      <input id="catering-date" {...form.register("date")} type="date" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="catering-guests" className="text-sm font-medium text-primary">Guest Count (Optional)</label>
                      <input id="catering-guests" {...form.register("guests")} type="number" min={1} max={9999} inputMode="numeric" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="e.g. 20" />
                      {form.formState.errors.guests && <p className="text-red-500 text-xs">{form.formState.errors.guests.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="catering-message" className="text-sm font-medium text-primary">Message</label>
                    <textarea id="catering-message" {...form.register("message")} rows={5} maxLength={2000} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none" placeholder="Tell us about your event or catering needs..." />
                    {form.formState.errors.message && <p className="text-red-500 text-xs">{form.formState.errors.message.message}</p>}
                  </div>

                  <button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
                    {form.formState.isSubmitting ? "Sending..." : "Send Enquiry"} <i className="fa-solid fa-envelope text-base" />
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>
    </>
  );
}
