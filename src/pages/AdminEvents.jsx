import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api/events";

import { createEventHistory } from "../api/eventHistory";

import { clearAdminAuth } from "../utils/adminAuth";

const emptyForm = {
  type: "event",
  title: "",
  description: "",
  location: "",
  date: "",
  startTime: "",
  endTime: "",
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

  // ===============================
  // LOAD EVENTS
  // ===============================
  const loadEvents = async () => {
    setLoading(true);

    try {
      const data = await getEvents();

      setEvents(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);

      setEvents([]);
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // ===============================
  // FORM CHANGE
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // CLEAR FORM
  // ===============================
  const clearForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSelectedFileName("");
    setImageFile(null);
    setError("");
  };

  // ===============================
  // FILE
  // ===============================
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFileName("");
      setImageFile(null);
      return;
    }

    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("video/")
    ) {
      setError("Please choose an image or video file.");
      setSelectedFileName("");
      setImageFile(null);
      return;
    }

    setImageFile(file);
    setSelectedFileName(file.name);
    setError("");
  };

  // ===============================
  // CREATE / UPDATE
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      // EVENT HISTORY
      if (form.type === "history") {
        await createEventHistory(
          {
            title: form.title,
            description: form.description,
          },
          imageFile
        );
      }

      // UPDATE EVENT
      else if (editingId) {
        await updateEvent(editingId, form);
      }

      // CREATE EVENT
      else {
        await createEvent(form, imageFile);
      }

      clearForm();

      await loadEvents();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to save event"
      );
    }
  };

  // ===============================
  // EDIT
  // ===============================
  const handleEdit = (event) => {
    setEditingId(event.id);

    setForm({
      type: "event",
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      date: event.date || "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
    });

    setSelectedFileName("");
    setImageFile(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteEvent(id);

      await loadEvents();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to delete event"
      );
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    clearAdminAuth();

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[420px_1fr]">

      {/* ==========================
          LEFT - ADMIN FORM
      ========================== */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-start justify-between gap-4">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
              Admin Panel
            </p>

            <h1 className="text-3xl font-bold">
              {form.type === "history"
                ? "Create Event History"
                : editingId
                ? "Edit Event"
                : "Create Event"}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl border px-4 py-2 font-semibold transition hover:bg-slate-100"
          >
            Logout
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-4"
        >

          {/* TYPE */}
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="rounded-2xl border px-4 py-3"
          >
            <option value="event">
              Event
            </option>

            <option value="history">
              Event History
            </option>
          </select>

          {/* TITLE */}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="rounded-2xl border px-4 py-3"
            placeholder="Title"
            required
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="rounded-2xl border px-4 py-3"
            placeholder="Description"
            rows="4"
            required
          />

          {/* EVENT FIELDS */}
          {form.type === "event" && (
            <>
              {/* LOCATION */}
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
                placeholder="Location"
                required
              />

              {/* DATE */}
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
                required
              />

              {/* START TIME */}
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
                required
              />

              {/* END TIME */}
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
                required
              />
            </>
          )}

          {/* FILE */}
          <div className="rounded-2xl border border-dashed px-4 py-3">

            <label className="block text-sm font-semibold text-slate-700">
              {form.type === "history"
                ? "Attach image or video"
                : "Attach image from computer"}
            </label>

            <input
              type="file"
              accept={
                form.type === "history"
                  ? "image/*,video/*"
                  : "image/*"
              }
              onChange={handleImageFileChange}
              className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-green-700 file:px-4 file:py-2 file:font-semibold file:text-white"
              required={
                form.type === "history"
                  ? true
                  : !editingId
              }
            />

            <p className="mt-2 text-xs text-slate-500">
              {selectedFileName
                ? `Attached file: ${selectedFileName}`
                : form.type === "history"
                ? "Upload an image or video for event history."
                : editingId
                ? "Choose a new image only if you want to replace the old image."
                : "Upload an image for the event."}
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-3">

            <button
              type="submit"
              className="rounded-2xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              {form.type === "history"
                ? "Create History"
                : editingId
                ? "Update Event"
                : "Create Event"}
            </button>

            <button
              type="button"
              onClick={clearForm}
              className="rounded-2xl border px-5 py-3 font-semibold transition hover:bg-slate-100"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/event-history"
                )
              }
              className="rounded-2xl border border-green-700 px-5 py-3 font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
            >
              Admin History
            </button>

          </div>
        </form>
      </div>

      {/* ==========================
          RIGHT - EVENT LIST
      ========================== */}
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

          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">

            {events.map((event) => (
              <div
                key={event.id}
                className="overflow-hidden rounded-3xl border bg-white shadow-lg transition hover:shadow-2xl"
              >

                {/* IMAGE */}
                <div className="h-72 bg-slate-100 md:h-80">

                  <img
                    src={
                      event.imageUrl ||
                      "/event.jpg"
                    }
                    alt={event.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/event.jpg";
                    }}
                  />

                </div>

                {/* CONTENT */}
                <div className="p-8 md:p-10">

                  <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {event.title}
                  </h2>

                  <p className="mt-2 text-base text-slate-600">
                    {event.description}
                  </p>

                  {/* INFO */}
                  <div className="mt-5 space-y-2 text-sm text-slate-700 md:text-base">

                    <div className="flex items-center gap-2">
                      <span>📍</span>

                      <span>
                        {event.location ||
                          "No location"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>📅</span>

                      <span>
                        {event.date ||
                          "No date"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>⏰</span>

                      <span>
                        {formatTime(
                          event.startTime
                        )}{" "}
                        -{" "}
                        {formatTime(
                          event.endTime
                        )}
                      </span>
                    </div>
                  </div>

                  {/* ADMIN BUTTONS */}
                  <div className="mt-6 flex flex-wrap gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(event)
                      }
                      className="rounded-2xl bg-green-700 px-5 py-2 font-semibold text-white transition hover:bg-green-800"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(event.id)
                      }
                      className="rounded-2xl bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
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

function formatTime(time) {
  if (!time) {
    return "No time";
  }

  const [hour, minute] =
    time.split(":");

  let h = parseInt(hour, 10);

  const ampm =
    h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;

  return `${h}:${minute} ${ampm}`;
}