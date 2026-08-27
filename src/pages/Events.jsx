import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getEvents } from "../api/events";

import {
  isAdminAuthenticated,
  clearAdminAuth,
} from "../utils/adminAuth";

export default function Events() {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();
  const loggedIn = isAdminAuthenticated();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const handleLogout = () => {
    clearAdminAuth();
    navigate("/events");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-green-50/40">
      <div className="mx-auto max-w-7xl px-4 py-6">

        {/* HEADER */}
        <div className="mb-8 text-center">

          <div className="mb-10 flex flex-wrap items-center justify-center gap-4">

            <h1 className="text-4xl font-extrabold text-slate-900 md:text-5xl">
              Events
            </h1>

            {/* EVENT HISTORY */}
            <button
              type="button"
              onClick={() => navigate("/events/history")}
              className="rounded-full border border-green-700 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
            >
              View Event History
            </button>

            {/* ADMIN LOGIN OR ADMIN CONTROLS */}
            {!loggedIn ? (
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                Admin Login
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/admin/events")}
                  className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
                >
                  Admin Panel
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-red-600 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <p className="mt-3 text-base text-slate-600 md:text-lg">
            Join us for amazing experiences at DND Café
          </p>
        </div>

        {/* EVENTS */}
        {events.length === 0 ? (
          <div className="rounded-3xl border border-dashed bg-white p-10 text-center shadow-sm">
            <p className="text-lg text-slate-600">
              No events available right now.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {events.map((event) => (
              <div
                key={event.id}
                className="grid overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-xl lg:grid-cols-2"
              >

                {/* IMAGE */}
                <div className="relative h-[320px] overflow-hidden bg-slate-100 md:h-[500px]">

                  <img
                    src={event.imageUrl || "/event.jpg"}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/event.jpg";
                    }}
                  />

                  {/* DATE BADGE */}
                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 backdrop-blur">
                    <p className="text-sm font-bold text-slate-900">
                      {event.date}
                    </p>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col justify-center p-6 md:p-10">

                  {/* BUY TICKETS */}
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
                  <h2 className="mt-6 text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                    {event.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
                    {event.description}
                  </p>

                  {/* INFO */}
                  <div className="mt-8 space-y-4">

                    {/* DATE */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">
                        📅
                      </div>

                      <p className="font-medium text-slate-700">
                        {event.date}
                      </p>
                    </div>

                    {/* TIME */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">
                        ⏰
                      </div>

                      <p className="font-medium text-slate-700">
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </p>
                    </div>

                    {/* LOCATION */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">
                        📍
                      </div>

                      <p className="font-semibold text-green-700">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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