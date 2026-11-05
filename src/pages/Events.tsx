import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { getEvents, type Event } from "@/api/events";
import { getEventHistory, type EventHistory } from "@/api/eventHistory";

function getYouTubeEmbedUrl(mediaUrl: string | undefined) {
  if (!mediaUrl) {
    return null;
  }

  try {
    const url = new URL(mediaUrl);
    const host = url.hostname.replace(/^www\./, "");
    let videoId: string | null = null;

    if (host === "youtu.be") {
      videoId = url.pathname.slice(1);
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      videoId =
        url.searchParams.get("v") ??
        url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ??
        null;
    }

    return videoId
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`
      : null;
  } catch {
    return null;
  }
}

interface EventCardData {
  id: number;
  title: string;
  description: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  eventDate?: string | null;
  eventTime?: string | null;
  location?: string;
  createdAt?: string;
  mediaUrl?: string;
  imageUrl?: string;
  mediaType?: string;
}

function formatEventDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

function formatEventTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    return value;
  }

  const date = new Date(2000, 0, 1, Number(match[1]), Number(match[2]));
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
}

function formatCreatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function EventCard({
  event,
  delay,
  onVideoPlay,
}: {
  event: EventCardData;
  delay: number;
  onVideoPlay: (event: SyntheticEvent<HTMLVideoElement>) => void;
}) {
  const mediaUrl = event.mediaUrl || event.imageUrl;

  return (
    <ScrollReveal delay={delay}>
      <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-lg">
        <div className="aspect-[9/16] overflow-hidden bg-primary/5">
          {event.mediaType === "youtube" ? (
            getYouTubeEmbedUrl(mediaUrl) ? (
              <iframe
                className="h-full w-full"
                src={getYouTubeEmbedUrl(mediaUrl) ?? ""}
                title={event.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : mediaUrl ? (
              <a
                className="flex h-full items-center justify-center text-primary underline"
                href={mediaUrl}
                target="_blank"
                rel="noreferrer"
              >
                Watch on YouTube
              </a>
            ) : (
              <p className="flex h-full items-center justify-center text-muted-foreground">
                Media unavailable
              </p>
            )
          ) : event.mediaType === "video" ? (
            mediaUrl ? (
              <video
                className="h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
                aria-label={event.title}
                onPlay={onVideoPlay}
                onLoadedMetadata={(videoEvent) => {
                  videoEvent.currentTarget.volume = 0.5;
                }}
              >
                <source src={mediaUrl} type="video/mp4" />
                Your browser does not support embedded videos.
              </video>
            ) : (
              <p className="flex h-full items-center justify-center text-muted-foreground">
                Media unavailable
              </p>
            )
          ) : mediaUrl ? (
            <img
              className="h-full w-full object-cover"
              src={mediaUrl}
              alt={event.title}
              loading="lazy"
            />
          ) : (
            <p className="flex h-full items-center justify-center text-muted-foreground">
              Media unavailable
            </p>
          )}
        </div>
        <div className="p-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-accent">
            DnD Cafe memories
          </p>
          <h3 className="font-serif text-2xl text-primary">{event.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
          {(event.date ||
            event.startTime ||
            event.endTime ||
            event.eventDate ||
            event.eventTime ||
            event.location) && (
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              {event.date && (
                <p>
                  <span className="font-medium text-primary">Date:</span>{" "}
                  {formatEventDate(event.date)}
                </p>
              )}
              {(event.startTime || event.endTime) && (
                <p>
                  <span className="font-medium text-primary">Time:</span>{" "}
                  {event.startTime ? formatEventTime(event.startTime) : ""}
                  {event.startTime && event.endTime ? " – " : ""}
                  {event.endTime ? formatEventTime(event.endTime) : ""}
                </p>
              )}
              {event.eventDate && (
                <p>
                  <span className="font-medium text-primary">Event date:</span>{" "}
                  {formatEventDate(event.eventDate)}
                </p>
              )}
              {event.eventTime && (
                <p>
                  <span className="font-medium text-primary">Event time:</span>{" "}
                  {formatEventTime(event.eventTime)}
                </p>
              )}
              {event.location && (
                <p>
                  <span className="font-medium text-primary">Location:</span>{" "}
                  {event.location}
                </p>
              )}
            </div>
          )}
          {event.createdAt && (
            <p className="mt-4 text-xs text-muted-foreground">
              Added {formatCreatedAt(event.createdAt)}
            </p>
          )}
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function Events() {
  const eventsSectionRef = useRef<HTMLElement>(null);
  const [eventHighlights, setEventHighlights] = useState<Event[]>([]);
  const [eventHistory, setEventHistory] = useState<EventHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getEvents()
      .then((events) => {
        if (isMounted) {
          setEventHighlights(events);
        }
      })
      .catch((fetchError: unknown) => {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to fetch events",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    getEventHistory()
      .then((history) => {
        if (isMounted) {
          setEventHistory(history);
        }
      })
      .catch((fetchError: unknown) => {
        if (isMounted) {
          setHistoryError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to fetch event history",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsHistoryLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleVideoPlay(event: SyntheticEvent<HTMLVideoElement>) {
    const currentVideo = event.currentTarget;
    eventsSectionRef.current?.querySelectorAll("video").forEach((video) => {
      if (video !== currentVideo) {
        video.pause();
      }
    });
  }

  return (
    <main ref={eventsSectionRef}>
      <section className="bg-primary pt-32 pb-24 text-center text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-6 animate-fade-up text-sm font-medium uppercase tracking-widest text-accent">
            Diriye & Delights
          </p>
          <h1 className="mb-8 animate-fade-up font-serif text-5xl md:text-7xl">
            Events & Reels
          </h1>
          <p className="animate-fade-up text-lg leading-relaxed text-primary-foreground/70 delay-200 md:text-xl">
            Behind the scenes, special moments, and everything brewing at DnD
            Cafe.
          </p>
        </div>
      </section>

      <section className="min-h-[50vh] bg-background py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
                Happening at DnD Cafe
              </p>
              <h2 className="font-serif text-4xl text-primary">Latest events</h2>
              <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                Discover the events and moments happening at our cafe.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading && (
              <p className="sm:col-span-2 text-center text-muted-foreground lg:col-span-3">
                Loading events...
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="sm:col-span-2 text-center text-destructive lg:col-span-3"
              >
                Could not load events. Make sure the backend is running on port
                8080. {error}
              </p>
            )}
            {!isLoading && !error && eventHighlights.length === 0 && (
              <p className="sm:col-span-2 text-center text-muted-foreground lg:col-span-3">
                No events are available yet.
              </p>
            )}
            {eventHighlights.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                delay={(index % 3) * 100}
                onVideoPlay={handleVideoPlay}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
                Moments worth sharing
              </p>
              <h2 className="font-serif text-4xl text-primary">Event History</h2>
              <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                Look back on the people, celebrations, and memories that have
                filled our cafe.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {isHistoryLoading && (
              <p className="sm:col-span-2 text-center text-muted-foreground lg:col-span-3">
                Loading event history...
              </p>
            )}
            {historyError && (
              <p
                role="alert"
                className="sm:col-span-2 text-center text-destructive lg:col-span-3"
              >
                Could not load event history. {historyError}
              </p>
            )}
            {!isHistoryLoading &&
              !historyError &&
              eventHistory.length === 0 && (
                <p className="sm:col-span-2 text-center text-muted-foreground lg:col-span-3">
                  No event history is available yet.
                </p>
              )}
            {eventHistory.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                delay={(index % 3) * 100}
                onVideoPlay={handleVideoPlay}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
