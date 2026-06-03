import { useEffect, useState } from "react";

import { getEventHistory } from "../api/eventHistory";
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
     <section className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-green-50/40 px-4 py-10">
  <div className="mx-auto max-w-7xl">

    {/* HEADER */}
    <div className="mb-10 text-center">
      <p className="font-semibold uppercase tracking-[0.3em] text-green-700">
        DND Café Memories
      </p>

      <h1 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900">
        Event History
      </h1>

      <p className="mt-3 text-slate-600 text-lg">
        Photos and videos from our past café events.
      </p>
    </div>

    {history.length === 0 ? (
      <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
        <p className="text-slate-600">No history uploaded yet.</p>
      </div>
    ) : (
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
                  src={getYoutubeEmbedUrl(item.mediaUrl)}
                  title={item.title}
                  className="h-[650px] w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : item.mediaType === "video" ? (
                <video
                  src={item.mediaUrl}
                  controls
                  className="h-[650px] w-full object-contain bg-black"
                />
              ) : (
                <img
                  src={item.mediaUrl || "/event.jpg"}
                  alt={item.title}
                  className="h-[650px] w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/event.jpg";
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