import { SyntheticEvent, useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import eventVideo01 from "@/assets/event-highlight-01.mp4";
import eventVideo02 from "@/assets/event-highlight-02.mp4";
import eventVideo03 from "@/assets/event-highlight-03.mp4";
import eventVideo04 from "@/assets/event-highlight-04.mp4";
import eventVideo05 from "@/assets/event-highlight-05.mp4";
import eventVideo06 from "@/assets/event-highlight-06.mp4";
import eventPoster01 from "@/assets/event-highlight-01.jpg";
import eventPoster02 from "@/assets/event-highlight-02.jpg";
import eventPoster03 from "@/assets/event-highlight-03.jpg";
import eventPoster04 from "@/assets/event-highlight-04.jpg";
import eventPoster05 from "@/assets/event-highlight-05.jpg";
import eventPoster06 from "@/assets/event-highlight-06.jpg";

// Event titles and descriptions supplied by the café.
const EVENT_HIGHLIGHTS = [
  {
    src: eventVideo02,
    poster: eventPoster02,
    title: "DnD Cafe X 4TheWestend",
    description:
      "We were honored to serve handcrafted drinks at the 4TheWestend graduation celebration for their photography alumni. A beautiful evening celebrating creativity, growth, and community.",
  },
  {
    src: eventVideo03,
    poster: eventPoster03,
    title: "DnD Cafe X Kozy",
    description:
      "We teamed up with Australian clothing brand Kozy for a special collaboration bringing fashion, coffee, and community together during our celebrated Somali Week. A great opportunity to showcase and support both brands.",
  },
  {
    src: eventVideo05,
    poster: eventPoster05,
    title: "DnD Cafe X Girls w/ Aux",
    description:
      "We hosted a fun community get-together featuring local vendors, skincare, collectible toys, music, and of course, DnD Cafe drinks. It was all about bringing people together and creating a welcoming space for everyone.",
  },
  {
    src: eventVideo04,
    poster: eventPoster04,
    title: "DnD Cafe X Haisä",
    description:
      "We partnered with hijab brand Haisä to host a pop-up shop right inside DnD Cafe. Guests had the chance to shop their collection while discovering and supporting both brands.",
  },
  {
    src: eventVideo06,
    poster: eventPoster06,
    title: "DnD Cafe X UofT’s SSA",
    description:
      "We were proud to join the University of Toronto Somali Students’ Association as a campus vendor during their events. We served our drinks while connecting with students and celebrating Somali community on campus.",
  },
  {
    src: eventVideo01,
    poster: eventPoster01,
    title: "DnD Cafe X Somali Professionals",
    description:
      "Our founder joined a panel of young up and coming entrepreneurs to share the story behind DnD Cafe, our journey as a Somali-owned business, and how we operate. Afterwards, we served drinks in the lobby and connected with an amazing community of professionals.",
  },
];

export default function Events() {
  const eventsSectionRef = useRef<HTMLElement>(null);

  function handleVideoPlay(event: SyntheticEvent<HTMLVideoElement>) {
    const currentVideo = event.currentTarget;

    eventsSectionRef.current?.querySelectorAll("video").forEach((video) => {
      if (video !== currentVideo) {
        video.pause();
      }
    });
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-primary text-primary-foreground pt-32 pb-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-accent uppercase tracking-widest text-sm font-medium mb-6 animate-fade-up">
            Diriye & Delights
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 animate-fade-up delay-100">
            Events & Reels
          </h1>
          <p className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed animate-fade-up delay-200">
            Behind the scenes, special moments, and everything brewing at DnD Cafe.
          </p>
        </div>
      </section>

      <section ref={eventsSectionRef} className="py-20 bg-background min-h-[50vh]">
        <div className="mx-auto max-w-6xl px-6 md:px-12">

          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-accent uppercase tracking-widest text-sm font-medium mb-3">
                Moments worth sharing
              </p>
              <h2 className="font-serif text-4xl text-primary">Past events at DnD Cafe</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-5 leading-relaxed">
                Take a look back at the people, celebrations, and memories that have filled our cafe.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {EVENT_HIGHLIGHTS.map((event, i) => (
              <ScrollReveal key={event.src} delay={(i % 3) * 100}>
                <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-lg">
                  <div className="aspect-[9/16] bg-primary/5 overflow-hidden">
                    <video
                      className="h-full w-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                      poster={event.poster}
                      aria-label={event.title}
                      onPlay={handleVideoPlay}
                      ref={(element) => {
                        if (element) {
                          element.volume = 0.5;
                        }
                      }}
                      onLoadedMetadata={(event) => {
                        event.currentTarget.volume = 0.5;
                      }}
                    >
                      <source src={event.src} type="video/mp4" />
                      Your browser does not support embedded videos.
                    </video>
                  </div>
                  <div className="p-6">
                    <p className="text-accent uppercase tracking-widest text-xs font-medium mb-2">
                      DnD Cafe memories
                    </p>
                    <h3 className="font-serif text-2xl text-primary">{event.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                      {event.description}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
