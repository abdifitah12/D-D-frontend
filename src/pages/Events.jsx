import { useEffect, useState } from "react";
import { getEvents } from "../api/events";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-green-50/40">
      <div className="mx-auto max-w-7xl px-4 py-6">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Events
          </h1>

          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Join us for amazing experiences at DND Café
          </p>
        </div>

        {/* EVENTS */}
        <div className="space-y-10">
          {events.map((e) => (
            <div
              key={e.id}
              className="grid lg:grid-cols-2 overflow-hidden rounded-[32px] bg-white shadow-xl border border-slate-100"
            >
              {/* IMAGE */}
              <div className="relative h-[320px] md:h-[500px] overflow-hidden bg-slate-100">
                <img
                  src={e.imageUrl || "/event.jpg"}
                  alt={e.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  onError={(x) => (x.currentTarget.src = "/event.jpg")}
                />

                {/* DATE BADGE */}
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 backdrop-blur">
                  <p className="text-sm font-bold text-slate-900">
                    {e.date}
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex flex-col justify-center p-6 md:p-10">
                
                {/* BUTTON */}
                <div>
                  <a
                    href="https://www.eventbrite.ca/e/for-the-girls-for-the-culture-tickets-1989785551147?aff=oddtdtcreator&utm_source=ig&utm_medium=social&utm_content=link_in_bio#location"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-800"
                  >
                    🎟 Buy Tickets
                  </a>
                </div>

                {/* TITLE */}
                <h2 className="mt-6 text-3xl md:text-5xl font-extrabold leading-tight text-slate-900">
                  {e.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="mt-5 text-base md:text-lg leading-8 text-slate-600">
                  {e.description}
                </p>

                {/* INFO */}
                <div className="mt-8 space-y-4">

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">
                      📅
                    </div>

                    <p className="text-slate-700 font-medium">
                      {e.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">
                      ⏰
                    </div>

                    <p className="text-slate-700 font-medium">
                      {formatTime(e.startTime)} -{" "}
                      {formatTime(e.endTime)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">
                      📍
                    </div>

                    <p className="font-semibold text-green-700">
                      {e.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HISTORY BUTTON */}
        <div className="mt-10 text-center">
          <a
            href="/events/history"
            className="inline-flex rounded-full border border-green-700 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
          >
            View Event History
          </a>
        </div>
      </div>
    </section>
  );
}

function formatTime(time) {
  if (!time) return "";

  const [hour, minute] = time.split(":");

  let h = parseInt(hour, 10);

  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;

  return `${h}:${minute} ${ampm}`;
}