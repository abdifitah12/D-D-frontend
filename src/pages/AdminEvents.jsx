import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api/events";
import { clearAdminAuth, getAdminAuth, isAdminAuthenticated } from "../utils/adminAuth";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  date: "",
  time: "",
  imageUrl: "",
};

export default function AdminEvents() {
  
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const auth = getAdminAuth();

  

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents(auth.username, auth.password);
      setEvents(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setEvents([]);
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const clearForm = () => {
  setForm(emptyForm);
  setEditingId(null);
  setSelectedFileName("");
  setImageFile(null);
};

  const handleImageFileChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) {
    setSelectedFileName("");
    setImageFile(null);
    return;
  }

  if (!file.type.startsWith("image/")) {
    setError("Please choose an image file.");
    setSelectedFileName("");
    setImageFile(null);
    return;
  }

  setImageFile(file); // ✅ IMPORTANT
  setSelectedFileName(file.name);

  // (optional preview)
  const reader = new FileReader();
  reader.onload = () => {
    setForm((prev) => ({
      ...prev,
      imageUrl: reader.result,
    }));
  };
  reader.readAsDataURL(file);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateEvent(
          editingId,
          buildEventPayload(form),
          auth.username,
          auth.password,
        );
      } else {
       await createEvent(form, imageFile, auth.username, auth.password);
      }

      clearForm();
      loadEvents();
    } catch (err) {
      setError(err.message || "Failed to save event");
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      date: event.date || "",
      time: event.time || "",
      imageUrl: event.imageUrl || event.url || "",
    });
    setSelectedFileName("");
  };

  const handleDelete = async (id) => {
    setError("");

    try {
      await deleteEvent(id, auth.username, auth.password);
      loadEvents();
    } catch (err) {
      setError(err.message || "Failed to delete event");
    }
  };

  const handleLogout = () => {
    clearAdminAuth();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 lg:grid-cols-[420px_1fr]">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
              Admin Panel
            </p>
            <h1 className="text-3xl font-bold">
              {editingId ? "Edit Event" : "Create Event"}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl border px-4 py-2 font-semibold"
          >
            Logout
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="rounded-2xl border px-4 py-3"
            placeholder="Event title"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="rounded-2xl border px-4 py-3"
            placeholder="Event description"
            rows="4"
            required
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="rounded-2xl border px-4 py-3"
            placeholder="Location"
            required
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="rounded-2xl border px-4 py-3"
            required
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="rounded-2xl border px-4 py-3"
            required
          />

          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="rounded-2xl border px-4 py-3"
            placeholder="Image URL or attached image data"
          />

          <div className="rounded-2xl border border-dashed px-4 py-3">
            <label className="block text-sm font-semibold text-slate-700">
              Attach image from computer
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-green-700 file:px-4 file:py-2 file:font-semibold file:text-white"
            />
            <p className="mt-2 text-xs text-slate-500">
              {selectedFileName
                ? `Attached file: ${selectedFileName}`
                : "Attach an image file here, or paste an image URL above."}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-green-700 px-5 py-3 text-white font-semibold"
            >
              {editingId ? "Update Event" : "Create Event"}
            </button>

            <button
              type="button"
              onClick={clearForm}
              className="rounded-2xl border px-5 py-3 font-semibold"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <div>
        {loading ? (
          <div className="rounded-3xl border border-dashed bg-white p-10 text-center text-slate-600 shadow-sm">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-dashed bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-800">
              No events found yet.
            </p>
            <p className="mt-2 text-slate-600">
              Create your first event using the form on the left.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            {events.map((event) => (
              <div
                  key={event.id}
                  className="rounded-3xl border bg-white shadow-lg overflow-hidden transition hover:shadow-2xl"
                >
                <div className="h-72 md:h-80 bg-slate-100">
                 <img
                  src={`http://localhost:8080${event.imageUrl}`}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                </div>

                <div className="p-8 md:p-10">
  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
    {event.title}
  </h2>

  <p className="mt-2 text-slate-600 text-base">
    {event.description}
  </p>

  {/* INFO */}
  <div className="mt-5 space-y-2 text-sm md:text-base text-slate-700">
    <div className="flex items-center gap-2">
      <span>📍</span>
      <span className="font-semibold text-green-700">
        {event.location || "No location"}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span>📅</span>
      <span>{event.date || "No date"}</span>
    </div>

    <div className="flex items-center gap-2">
      <span>⏰</span>
      <span>{formatTime(event.time)}</span>
    </div>
  </div>

  {/* BUTTONS */}
  <div className="mt-6 flex gap-3">
    <button
      onClick={() => handleEdit(event)}
      className="rounded-2xl bg-amber-500 px-5 py-2 text-white font-semibold shadow hover:bg-amber-600 transition"
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(event.id)}
      className="rounded-2xl bg-red-600 px-5 py-2 text-white font-semibold shadow hover:bg-red-700 transition"
    >
      Delete
    </button>
  </div>
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function buildEventPayload(form) {
  return {
    ...form,
    imageUrl: form.imageUrl,
    url: form.imageUrl,
  };
}

function getEventImageUrl(event) {
  return event.imageUrl || event.url || "/event1.png";
}


function formatTime(time) {
  if (!time) return "No time";

  const [hour, minute] = time.split(":");
  let h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  return `${h}:${minute} ${ampm}`;
}
