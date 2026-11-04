import { useEffect } from "react";

const LAST_UPDATED = "August 23, 2026";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Use | DnD Cafe";
  }, []);

  return (
    <>
      <section className="bg-primary text-primary-foreground pt-32 pb-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-accent uppercase tracking-widest text-sm font-medium mb-6 animate-fade-up">Website use</p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 animate-fade-up delay-100">Terms of Use</h1>
          <p className="text-primary-foreground/75 text-lg animate-fade-up delay-200">
            Practical terms for using the DnD Cafe website.
          </p>
        </div>
      </section>

      <main className="bg-background py-20">
        <article className="mx-auto max-w-3xl px-6 space-y-12 text-muted-foreground leading-relaxed">
          <p className="text-sm">Last updated: {LAST_UPDATED}</p>

          <section>
            <h2 className="font-serif text-3xl text-primary mb-4">Using this website</h2>
            <p>
              You may use this website for lawful personal and business inquiries about DnD Cafe. Please do not attempt to disrupt the website,
              interfere with its security, or use automated tools that create excessive requests.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-primary mb-4">Information and availability</h2>
            <p>
              Menu details, hours, events, and availability may change. The information on this website is provided for general information only and may occasionally be inaccurate.
              For the latest information, catering questions, or event inquiries, call <a className="text-primary font-medium hover:underline" href="tel:+14166881450">416-688-1450</a> or email <a className="text-primary font-medium hover:underline" href="mailto:dndcafe.to@gmail.com">dndcafe.to@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-primary mb-4">Inquiries and payments</h2>
            <p>
              This website does not process online orders or payment card information. Catering and event inquiries open an email draft in your own email application;
              no booking, order, or payment is confirmed until DnD Cafe confirms it directly with you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-primary mb-4">Content and links</h2>
            <p>
              The website&apos;s text, imagery, branding, and design are owned by DnD Cafe or used with permission. Please do not reuse them without permission.
              Links to third-party websites are provided for convenience; DnD Cafe does not control those services or their content.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-primary mb-4">Questions</h2>
            <p>
              For questions about these terms, contact <a className="text-primary font-medium hover:underline" href="mailto:dndcafe.to@gmail.com">dndcafe.to@gmail.com</a>.
              These terms may be updated when the website&apos;s services change.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}