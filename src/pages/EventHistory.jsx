import { useEffect, useState } from "react";

import { getEventHistory, deleteEventHistory } from "../api/eventHistory";

export default function EventHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getEventHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load event history:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEventHistory(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("youtube.com/embed/")) return url;

    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-green-50/40 px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-green-700">
            D&amp;D Café Memories
          </p>

          <h1 className="mt-3 text-5xl font-bold text-slate-900">
            Event History
          </h1>

          <p className="mt-3 text-slate-600">
            Photos and videos from our past café events.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">No history uploaded yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-3xl border bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="h-80 overflow-hidden bg-slate-100">
                  {item.mediaType === "youtube" ? (
                    <iframe
                      src={getYoutubeEmbedUrl(item.mediaUrl)}
                      title={item.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : item.mediaType === "video" ? (
                    <video
                      src={item.mediaUrl}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.mediaUrl || "/event.jpg"}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/event.jpg";
                      }}
                    />
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-slate-600">{item.description}</p>

                  <p className="mt-3 text-sm font-semibold text-green-700">
                    {item.mediaType === "youtube"
                      ? "YouTube Video"
                      : item.mediaType === "video"
                      ? "Video"
                      : "Photo"}
                  </p>

                   <button
                onClick={() => handleDelete(item.id)}
                className="mt-4 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                🗑️ Delete
                </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}