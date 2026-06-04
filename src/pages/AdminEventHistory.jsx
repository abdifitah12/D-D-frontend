import { useEffect, useState } from "react";
import {
  getEventHistory,
  createEventHistory,
  deleteEventHistory,
} from "../api/eventHistory";

const emptyForm = {
  title: "",
  description: "",
};

export default function AdminEventHistory() {
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getEventHistory();
      setHistory(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load history.");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createEventHistory(form, file);

      setForm(emptyForm);
      setFile(null);
      setPreview("");
      setMessage("History media uploaded successfully.");
      loadHistory();
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this history item?")) return;

    try {
      await deleteEventHistory(id);
      loadHistory();
    } catch (error) {
      console.error(error);
      setMessage("Delete failed.");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-green-50/40 px-4 py-12">
      <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[420px_1fr]">
        {/* FORM */}
        <div className="rounded-3xl border bg-white p-6 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Upload Event History
          </h1>

          <p className="mt-2 text-slate-600">
            Add photos or videos from past DND Café events.
          </p>

          {message && (
            <div className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="History title"
              className="rounded-2xl border px-4 py-3 outline-none focus:border-green-600"
              required
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows="4"
              className="rounded-2xl border px-4 py-3 outline-none focus:border-green-600"
            />

            <div className="rounded-2xl border border-dashed p-4">
              <label className="block text-sm font-semibold text-slate-700">
                Upload image or video
              </label>

              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="mt-3 block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-green-700 file:px-4 file:py-2 file:font-semibold file:text-white"
                required
              />
            </div>

            {preview && (
              <div className="overflow-hidden rounded-2xl border bg-slate-100">
                {file?.type?.startsWith("video") ? (
                  <video
                    src={preview}
                    controls
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-56 w-full object-cover"
                  />
                )}
              </div>
            )}

            <button
              type="submit"
              className="rounded-2xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
            >
              Upload History
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="grid gap-6 md:grid-cols-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border bg-white shadow-lg"
            >
                <div className="h-[650px] bg-black">
                {item.mediaType === "video" ? (
                   <video
                    src={item.mediaUrl}
                    controls
                    className="h-full w-full object-contain bg-black rounded-t-3xl"
                  />
                ) : (
                  <img
                    src={item.mediaUrl || "/event.jpg"}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

               <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {item.title}
              </h2>

              <p className="mt-2 text-slate-600">
                {item.description}
              </p>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}