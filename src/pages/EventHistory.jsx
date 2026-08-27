import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getEventHistory } from "../api/eventHistory";

import {
  isAdminAuthenticated,
  clearAdminAuth,
} from "../utils/adminAuth";

export default function EventHistory() {
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();
  const loggedIn = isAdminAuthenticated();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getEventHistory();

      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to load event history:",
        error
      );
    }
  };

  const handleLogout = () => {
    clearAdminAuth();

    navigate("/events/history");
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    if (url.includes("watch?v=")) {
      return url.replace(
        "watch?v=",
        "embed/"
      );
    }

    if (url.includes("youtu.be/")) {
      const videoId = url
        .split("youtu.be/")[1]
        ?.split("?")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-green-50/40 px-4 py-10">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10 text-center">

          <p className="font-semibold uppercase tracking-[0.3em] text-green-700">
            DND Café Memories
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Event History
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Photos and videos from our past café events.
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">

            {/* BACK */}
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="rounded-full border border-green-700 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
            >
              Back to Events
            </button>

            {/* LOGIN */}
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
                {/* ADMIN HISTORY */}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/event-history")
                  }
                  className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
                >
                  Admin History
                </button>

                {/* ADMIN EVENTS */}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/events")
                  }
                  className="rounded-full border border-green-700 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
                >
                  Admin Events
                </button>

                {/* LOGOUT */}
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
        </div>

        {/* EMPTY */}
        {history.length === 0 ? (
          <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">

            <p className="text-slate-600">
              No history uploaded yet.
            </p>

          </div>
        ) : (

          /* HISTORY GRID */
          <div className="grid gap-10 lg:grid-cols-2">

            {history.map((item) => (

              <div
                key={item.id}
                className="overflow-hidden rounded-[32px] bg-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                {/* MEDIA */}
                <div className="bg-black">

                  {item.mediaType === "youtube" ? (

                    <iframe
                      src={getYoutubeEmbedUrl(
                        item.mediaUrl
                      )}
                      title={item.title}
                      className="h-[650px] w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />

                  ) : item.mediaType === "video" ? (

                    <video
                      src={item.mediaUrl}
                      controls
                      className="h-[650px] w-full bg-black object-contain"
                    />

                  ) : (

                    <img
                      src={
                        item.mediaUrl ||
                        "/event.jpg"
                      }
                      alt={item.title}
                      className="h-[650px] w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/event.jpg";
                      }}
                    />
                  )}

                </div>

                {/* CONTENT */}
                <div className="p-7">

                  <div className="mb-3 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">

                    {item.mediaType === "youtube"
                      ? "YouTube Video"
                      : item.mediaType === "video"
                      ? "Event Video"
                      : "Event Photo"}

                  </div>

                  <h2 className="text-3xl font-bold text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    {item.description}
                  </p>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}