import { AdminApiError } from "@/api/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? ""
    : "https://dnd-cafe-ece43a569fa1.herokuapp.com");

const API = `${API_BASE_URL}/api/event-history`;

export interface EventHistory {
  id: number;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video" | "youtube";
  eventDate?: string | null;
  eventTime?: string | null;
  createdAt: string;
}

export interface CreateEventHistoryInput {
  title: string;
  description: string;
  file: File;
  eventDate?: string;
  eventTime?: string;
}

export interface CreateYoutubeHistoryInput {
  title: string;
  description: string;
  mediaUrl: string;
  eventDate?: string;
  eventTime?: string;
}

export interface UpdateEventHistoryInput {
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: EventHistory["mediaType"];
  eventDate: string | null;
  eventTime: string | null;
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

async function readHistoryResponse(
  response: Response,
  action: string,
): Promise<EventHistory> {
  await ensureSuccess(response, action);
  return response.json() as Promise<EventHistory>;
}

export const getEventHistory = async (): Promise<EventHistory[]> => {
  const res = await fetch(API);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch event history (${res.status})`
    );
  }

  return res.json() as Promise<EventHistory[]>;
};

export const createEventHistory = async (
  input: CreateEventHistoryInput,
  token: string,
): Promise<EventHistory> => {
  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("description", input.description);
  formData.append("file", input.file);
  if (input.eventDate) {
    formData.append("eventDate", input.eventDate);
  }
  if (input.eventTime) {
    formData.append("eventTime", input.eventTime);
  }

  const response = await fetch(API, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  return readHistoryResponse(response, "create event history");
};

export const createYoutubeHistory = async (
  input: CreateYoutubeHistoryInput,
  token: string,
): Promise<EventHistory> => {
  const formData = new URLSearchParams({
    title: input.title,
    description: input.description,
    mediaUrl: input.mediaUrl,
  });
  if (input.eventDate) {
    formData.append("eventDate", input.eventDate);
  }
  if (input.eventTime) {
    formData.append("eventTime", input.eventTime);
  }

  const response = await fetch(`${API}/youtube`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  return readHistoryResponse(response, "create event history");
};

export const updateEventHistory = async (
  id: number,
  input: UpdateEventHistoryInput,
  token: string,
): Promise<EventHistory> => {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readHistoryResponse(response, "update event history");
};

export const deleteEventHistory = async (
  id: number,
  token: string,
): Promise<void> => {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  await ensureSuccess(response, "delete event history");
};
 
