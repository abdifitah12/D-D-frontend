import {
  getAdminToken,
  clearAdminAuth,
} from "../utils/adminAuth";

// LOCAL
//const API = "http://localhost:8080/api/events";

// PRODUCTION LATER
 const API = "https://dnd-cafe-ece43a569fa1.herokuapp.com/api/events";

const handleUnauthorized = () => {
  clearAdminAuth();
  window.location.replace("/admin/login");
};

// ===============================
// PUBLIC - GET ALL EVENTS
// ===============================
export const getEvents = async () => {
  const res = await fetch(API);

  if (!res.ok) {
    throw new Error("Failed to load events");
  }

  return res.json();
};

// ===============================
// PUBLIC - GET ONE EVENT
// ===============================
export const getEventById = async (id) => {
  const res = await fetch(`${API}/${id}`);

  if (!res.ok) {
    throw new Error("Failed to load event");
  }

  return res.json();
};

// ===============================
// ADMIN - CREATE EVENT
// ===============================
export const createEvent = async (event, imageFile) => {
  const token = getAdminToken();

  if (!token) {
    handleUnauthorized();
    throw new Error("Please login");
  }

  const formData = new FormData();

  formData.append("title", event.title);
  formData.append("description", event.description);
  formData.append("location", event.location);
  formData.append("date", event.date);
  formData.append("startTime", event.startTime);
  formData.append("endTime", event.endTime);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(API, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  if (res.status === 401 || res.status === 403) {
    handleUnauthorized();
    throw new Error("Login expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error("Failed to create event");
  }

  return res.json();
};

// ===============================
// ADMIN - UPDATE EVENT
// ===============================
export const updateEvent = async (id, event) => {
  const token = getAdminToken();

  if (!token) {
    handleUnauthorized();
    throw new Error("Please login");
  }

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
    }),
  });

  if (res.status === 401 || res.status === 403) {
    handleUnauthorized();
    throw new Error("Login expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error("Failed to update event");
  }

  return res.json();
};

// ===============================
// ADMIN - DELETE EVENT
// ===============================
export const deleteEvent = async (id) => {
  const token = getAdminToken();

  if (!token) {
    handleUnauthorized();
    throw new Error("Please login");
  }

  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    handleUnauthorized();
    throw new Error("Login expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error("Failed to delete event");
  }
};