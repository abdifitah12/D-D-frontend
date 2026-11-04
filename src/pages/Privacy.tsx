import { useEffect } from "react";

const LAST_UPDATED = "August 23, 2026";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Notice | DnD Cafe";
  }, []);

  return (
    <>
      <section className="bg-primary text-primary-foreground pt-32 pb-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-accent uppercase tracking-widest text-sm font-medium mb-6 animate-fade-up">Your information</p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 animate-fade-up delay-100">Privacy Notice</h1>
          <p className="text-primary-foreground/75 text-lg animate-fade-up delay-200">
            A plain-language summary of how this website currently handles information.
          </p>
        </div>
      </section>

      <main className="bg-background py-20">
        <article className="mx-auto max-w-3xl px-6 space-y-12 text-muted-foreground leading-relaxed">
          <p className="text-sm">Last updated: {LAST_UPDATED}</p>

          <section>
            <h2 className="font-serif text-3xl text-primary mb-4">What this website collects</h2>
            <p>
              DnD Cafe does not offer customer accounts, online checkout, reservations, newsletter signup, or a customer database through this website.
              The catering and events form stays in your browser until you choose to send the generated email from your own email app. If you send it,
              the email may include your name, email address, event date, guest count, and message.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-primary mb-4">Service providers and external links</h2>
            <p>
              The website loads fonts from Google Fonts and icons from Font Awesome&apos;s CDN. Those providers may receive standard technical connection information,
              such as an IP address and browser details,
              when your browser requests their resources. Links to Instagram and TikTok open third-party websites governed by their own privacy notices.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-primary mb-4">Cookies and browser storage</h2>
            <p>
              This website does not currently use first-party advertising, analytics, account, or marketing cookies. It uses non-identifying session storage
              only to remember whether the opening animation has played and to start a new visit on the homepage. Your browser or third-party providers may apply
              their own settings or cookies under their policies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-primary mb-4">How information is used</h2>
            <p>
              Information you voluntarily send by email is used to respond to your catering or events inquiry.
              The website does not sell personal information or use it for behavioural advertising in its current implementation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-primary mb-4">Retention and security</h2>
            <p>
              The website itself does not maintain a customer information database. If you send DnD Cafe an email, retention is handled through the cafe&apos;s
              email practices and any provider you use to send it. We use reasonable technical safeguards for the website, but no internet transmission can be
              guaranteed completely secure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-primary mb-4">Your questions and choices</h2>
            <p>
              To ask about personal information you have sent to DnD Cafe, request access or correction, or withdraw a marketing consent if applicable,
              contact <a className="text-primary font-medium hover:underline" href="mailto:dndcafe.to@gmail.com">dndcafe.to@gmail.com</a>.
              This notice will be updated before new features such as online ordering, payments, reservations, accounts, analytics, or marketing signups are introduced.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}