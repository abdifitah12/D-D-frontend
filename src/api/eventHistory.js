//const API = "http://localhost:8080/api/event-history";
// production later:
 const API = "https://dnd-cafe-ece43a569fa1.herokuapp.com/api/event-history";

export const getEventHistory = async () => {
  const res = await fetch(API);

  if (!res.ok) {
    throw new Error("Failed to fetch event history");
  }

  return res.json();
};

export const createEventHistory = async (history, file) => {
  const formData = new FormData();

  formData.append("title", history.title);
  formData.append("description", history.description);

  if (file) {
    formData.append("file", file);
  }

  const res = await fetch(API, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to create event history");
  }

  return res.json();
};

export const saveYoutubeVideo = async (history) => {
  const formData = new FormData();

  formData.append("title", history.title);
  formData.append("description", history.description);
  formData.append("mediaUrl", history.mediaUrl);

  const res = await fetch(`${API}/youtube`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to save YouTube video");
  }

  return res.json();
};

export const deleteEventHistory = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete event history");
  }
};