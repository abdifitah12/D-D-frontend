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
    <section className="bg-gradient-to-br from-stone-50 via-white to-green-50/40 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-14">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900">Events</h1>
          <p className="mt-3 text-slate-600">
            Join us for amazing experiences at D&D Café
          </p>
        </div>

        {/* EVENTS */}
        <div className="space-y-8">
          {events.map((e) => (
            <div
              key={e.id}
              className="grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition"
            >
              {/* IMAGE */}
              <div className="h-64 md:h-full">
                  <img
                src={`http://localhost:8080${e.imageUrl}`}
                alt={e.title}
                className="w-full h-full object-cover"
                onError={(x) => (x.target.src = "/event.jpg")}
                />
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col justify-center">
                <h2 className="text-3xl font-bold">{e.title}</h2>

                <p className="mt-3 text-gray-600">{e.description}</p>

                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <p>📅 {e.date}</p>
                  <p>⏰ {formatTime(e.time)}</p>
                  <p className="text-green-600 font-semibold">
                    📍 {e.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
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

function getEventImageUrl(event) {
  return event.imageUrl || event.url || "/event.jpg";
}
