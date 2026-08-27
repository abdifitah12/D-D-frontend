import {
  getAdminToken,
  clearAdminAuth,
} from "../utils/adminAuth";

// LOCAL
// const API = "http://localhost:8080/api/event-history";

// PRODUCTION
const API =
  "https://dnd-cafe-ece43a569fa1.herokuapp.com/api/event-history";

const handleUnauthorized = () => {
  clearAdminAuth();
  window.location.replace("/admin/login");
};

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

  if (!token) {
    handleUnauthorized();
    throw new Error("Please login");
  }

  const formData = new FormData();

  formData.append("title", history.title);
  formData.append("description", history.description || "");

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

  if (res.status === 401 || res.status === 403) {
    handleUnauthorized();
    throw new Error("Login expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(
      `Failed to create event history: ${res.status}`
    );
  }

  return res.json();
};

// ===============================
// ADMIN - SAVE YOUTUBE
// ===============================
export const saveYoutubeVideo = async (history) => {
  const token = getAdminToken();

  if (!token) {
    handleUnauthorized();
    throw new Error("Please login");
  }

  const formData = new FormData();

  formData.append("title", history.title);
  formData.append("description", history.description || "");
  formData.append("mediaUrl", history.mediaUrl);

  const res = await fetch(`${API}/youtube`, {
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
    throw new Error(
      `Failed to save YouTube video: ${res.status}`
    );
  }

  return res.json();
};

// ===============================
// ADMIN - DELETE HISTORY
// ===============================
export const deleteEventHistory = async (id) => {
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
    throw new Error(
      `Failed to delete event history: ${res.status}`
    );
  }
};