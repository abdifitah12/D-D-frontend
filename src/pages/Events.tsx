import { SyntheticEvent, useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import eventHistory from "@/api/eventHistory.js";

interface ApiEvent {
  id: number;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  createdAt: string;
}

const EVENT_HIGHLIGHTS = eventHistory as ApiEvent[];

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
              <ScrollReveal key={event.id} delay={(i % 3) * 100}>
                <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-lg">
                  <div className="aspect-[9/16] bg-primary/5 overflow-hidden">
                    {event.mediaType === "video" ? (
                      <video
                        className="h-full w-full object-cover"
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={event.title}
                        onPlay={handleVideoPlay}
                        onLoadedMetadata={(videoEvent) => {
                          videoEvent.currentTarget.volume = 0.5;
                        }}
                      >
                        <source src={event.mediaUrl} type="video/mp4" />
                        Your browser does not support embedded videos.
                      </video>
                    ) : (
                      <img
                        className="h-full w-full object-cover"
                        src={event.mediaUrl}
                        alt={event.title}
                        loading="lazy"
                      />
                    )}
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
