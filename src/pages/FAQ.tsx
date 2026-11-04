import { Link } from "wouter";
import ScrollReveal from "@/components/ScrollReveal";

const FAQS = [
  {
    question: "What's on the menu?",
    answer: (
      <>
        <p>
          We serve specialty lattes, matcha, refreshers, coffee, Somali tea, and
          fresh desserts including banana pudding, Biscoff pudding, milk cake,
          croissants, cookies, and brownies.
        </p>
        <p className="mt-4">
          We also offer malawaax, a traditional Somali crêpe. Browse the{" "}
          <Link href="/menu" className="text-primary font-medium hover:text-accent hover:underline">
            full menu
          </Link>{" "}
          for current items and prices.
        </p>
      </>
    ),
  },
  {
    question: "When are you open?",
    answer: (
      <div className="space-y-2">
        <p>Monday to Thursday: 5:00 PM – 12:00 AM</p>
        <p>Friday and Saturday: 5:00 PM – 1:30 AM</p>
        <p>Sunday: 5:00 PM – 12:00 AM</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Hours and availability can change, so please call us at{" "}
          <a href="tel:+14166881450" className="text-primary font-medium hover:text-accent hover:underline">
            416-688-1450
          </a>{" "}
          if you are making a special trip.
        </p>
      </div>
    ),
  },
  {
    question: "How do I place an order?",
    answer: (
      <p>
        This website does not currently process online orders or payments. For
        current ordering options and availability, please call us at{" "}
        <a href="tel:+14166881450" className="text-primary font-medium hover:text-accent hover:underline">
          416-688-1450
        </a>{" "}
        or visit us in person.
      </p>
    ),
  },
  {
    question: "Where are you located?",
    answer: (
      <p>
        You can find DnD Cafe at{" "}
        <a
          href="https://www.google.com/maps/search/?api=1&query=2102+Kipling+Ave+Unit+10+Etobicoke+ON+M9W+4K5"
          target="_blank"
          rel="noreferrer"
          className="text-primary font-medium hover:text-accent hover:underline"
        >
          2102 Kipling Ave, Unit 10, Etobicoke, ON M9W 4K5
        </a>
        . We look forward to welcoming you.
      </p>
    ),
  },
  {
    question: "Do you offer catering or event bookings?",
    answer: (
      <p>
        Yes. Visit our{" "}
        <Link href="/contact" className="text-primary font-medium hover:text-accent hover:underline">
          Contact page
        </Link>{" "}
        to prepare an enquiry for catering or events. No booking is confirmed
        until our team responds directly.
      </p>
    ),
  },
  {
    question: "What does DnD stand for?",
    answer: (
      <p>
        DnD carries two meanings: <strong>Diriye &amp; Delights</strong>, our
        family name and the heart behind the cafe, and{" "}
        <strong>Do Not Disturb</strong>, the feeling we want you to enjoy when
        you settle in with us.
      </p>
    ),
  },
];

export default function FAQ() {
  return (
    <>
      <section className="bg-primary text-primary-foreground pt-32 pb-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-accent uppercase tracking-widest text-sm font-medium mb-6 animate-fade-up">
            Good to Know
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 animate-fade-up delay-100">
            Frequently Asked Questions
          </h1>
          <p className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed animate-fade-up delay-200">
            Quick answers about our menu, hours, ordering, and finding us in
            Etobicoke.
          </p>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <ScrollReveal>
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <details
                  key={faq.question}
                  open={index === 0}
                  className="group rounded-2xl border border-border bg-white shadow-sm transition-shadow open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 md:px-8 md:py-6 [&::-webkit-details-marker]:hidden">
                    <span className="font-serif text-xl md:text-2xl text-primary">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-2xl font-light text-accent transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="border-t border-border/70 px-6 pb-6 pt-5 text-muted-foreground leading-relaxed md:px-8 md:pb-8">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}