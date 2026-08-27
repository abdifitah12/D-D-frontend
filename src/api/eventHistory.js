import { getAdminToken } from "../utils/adminAuth";

//const API = "http://localhost:8080/api/event-history";
// production later:
 const API = "https://dnd-cafe-ece43a569fa1.herokuapp.com/api/event-history";

// ===============================
// PUBLIC - GET HISTORY
// ===============================
export const getEventHistory = async () => {
  const res = await fetch(API);

  if (!res.ok) {
    throw new Error("Failed to fetch event history");
  }

  return res.json();
};

// ===============================
// ADMIN - CREATE HISTORY
// ===============================
export const createEventHistory = async (history, file) => {
  const token = getAdminToken();

  const formData = new FormData();

  formData.append("title", history.title);
  formData.append("description", history.description);

  if (file) {
    formData.append("file", file);
  }

  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to create event history: ${res.status}`);
  }

  return res.json();
};

// ===============================
// ADMIN - YOUTUBE
// ===============================
export const saveYoutubeVideo = async (history) => {
  const token = getAdminToken();

  const formData = new FormData();

  formData.append("title", history.title);
  formData.append("description", history.description);
  formData.append("mediaUrl", history.mediaUrl);

  const res = await fetch(`${API}/youtube`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to save YouTube video: ${res.status}`);
  }

  return res.json();
};

// ===============================
// ADMIN - DELETE ONE HISTORY ITEM
// ===============================
export const deleteEventHistory = async (id) => {
  const token = getAdminToken();

  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete event history: ${res.status}`);
  }
};