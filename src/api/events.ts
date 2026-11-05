
import { AdminApiError } from "@/api/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? ""
    : "https://dnd-cafe-ece43a569fa1.herokuapp.com");

const API = `${API_BASE_URL}/api/events`;

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  imageUrl?: string;
  mediaUrl?: string;
  mediaType?: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  image?: File;
}

export interface UpdateEventInput {
  title: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  imageUrl?: string;
  mediaUrl?: string;
  mediaType?: string;
}

async function ensureSuccess(response: Response, action: string): Promise<void> {
  if (!response.ok) {
    const detail = await response.text();
    throw new AdminApiError(
      detail || `Failed to ${action} (${response.status})`,
      response.status,
    );
  }
}

async function readEventResponse(response: Response, action: string): Promise<Event> {
  await ensureSuccess(response, action);
  return response.json() as Promise<Event>;
}

export const getEvents = async (): Promise<Event[]> => {
  const res = await fetch(API);

  if (!res.ok) {
    throw new Error(`Failed to load events (${res.status})`);
  }

  return res.json() as Promise<Event[]>;
};

export const createEvent = async (
  input: CreateEventInput,
  token: string,
): Promise<Event> => {
  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("description", input.description);
  formData.append("location", input.location);
  formData.append("date", input.date);
  formData.append("startTime", input.startTime);
  formData.append("endTime", input.endTime);

  if (input.image) {
    formData.append("image", input.image);
  }

  const response = await fetch(API, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  return readEventResponse(response, "create event");
};

export const updateEvent = async (
  id: number,
  input: UpdateEventInput,
  token: string,
): Promise<Event> => {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readEventResponse(response, "update event");
};

export const deleteEvent = async (id: number, token: string): Promise<void> => {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  await ensureSuccess(response, "delete event");
};

export const getEventById = async (id: number): Promise<Event> => {
  const res = await fetch(`${API}/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to load event (${res.status})`);
  }

  return res.json() as Promise<Event>;
};
