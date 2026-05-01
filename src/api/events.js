const API = "https://dnd-cafe-ece43a569fa1.herokuapp.com/api/events";

const authHeader = (username, password) => ({
  Authorization: `Basic ${btoa(`${username}:${password}`)}`,
});

export const getEvents = async (username, password) => {
  const headers =
    username && password ? { ...authHeader(username, password) } : undefined;

  const res = await fetch(API, { headers });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

export const createEvent = async (event, imageFile, username, password) => {
  const formData = new FormData();

  formData.append("title", event.title);
  formData.append("description", event.description);
  formData.append("location", event.location);
  formData.append("date", event.date);
  formData.append("time", event.time);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(API, {
    method: "POST",
    headers: {
      ...authHeader(username, password),
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
};

export const updateEvent = async (id, event, username, password) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(username, password),
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
};

export const deleteEvent = async (id, username, password) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(username, password),
    },
  });

  if (!res.ok) throw new Error("Failed to delete event");
};