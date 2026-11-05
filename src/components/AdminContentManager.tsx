import { useEffect, useState, type FormEvent } from "react";
import {
  deleteEvent,
  getEvents,
  updateEvent,
  type Event,
} from "@/api/events";
import {
  deleteEventHistory,
  getEventHistory,
  updateEventHistory,
  type EventHistory,
} from "@/api/eventHistory";
import { AdminApiError } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdminContentManagerProps {
  token: string;
  refreshVersion: number;
  onUnauthorized: (error: unknown) => boolean;
}

function getTextValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function ensureAdmin(error: unknown, onUnauthorized: (error: unknown) => boolean) {
  if (
    error instanceof AdminApiError &&
    (error.status === 401 || error.status === 403)
  ) {
    onUnauthorized(error);
    return true;
  }
  return false;
}

export default function AdminContentManager({
  token,
  refreshVersion,
  onUnauthorized,
}: AdminContentManagerProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [history, setHistory] = useState<EventHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editingHistoryId, setEditingHistoryId] = useState<number | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(null);

    Promise.all([getEvents(), getEventHistory()])
      .then(([loadedEvents, loadedHistory]) => {
        if (active) {
          setEvents(loadedEvents);
          setHistory(loadedHistory);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(getErrorMessage(error, "Unable to load events."));
          ensureAdmin(error, onUnauthorized);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [onUnauthorized, refreshVersion]);

  async function saveEvent(event: Event, formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const formData = new FormData(formEvent.currentTarget);
    setBusyAction(`event-${event.id}`);
    setActionError(null);

    try {
      const updated = await updateEvent(
        event.id,
        {
          title: getTextValue(formData, "title"),
          description: getTextValue(formData, "description"),
          location: getTextValue(formData, "location"),
          date: getTextValue(formData, "date"),
          startTime: getTextValue(formData, "startTime"),
          endTime: getTextValue(formData, "endTime"),
          imageUrl: getTextValue(formData, "imageUrl") || undefined,
          mediaUrl: event.mediaUrl,
          mediaType: event.mediaType,
        },
        token,
      );
      setEvents((current) =>
        current.map((item) => (item.id === event.id ? updated : item)),
      );
      setEditingEventId(null);
    } catch (error: unknown) {
      if (!ensureAdmin(error, onUnauthorized)) {
        setActionError(getErrorMessage(error, "Unable to update event."));
      }
    } finally {
      setBusyAction(null);
    }
  }

  async function removeEvent(event: Event) {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) {
      return;
    }

    setBusyAction(`event-${event.id}`);
    setActionError(null);
    try {
      await deleteEvent(event.id, token);
      setEvents((current) => current.filter((item) => item.id !== event.id));
    } catch (error: unknown) {
      if (!ensureAdmin(error, onUnauthorized)) {
        setActionError(getErrorMessage(error, "Unable to delete event."));
      }
    } finally {
      setBusyAction(null);
    }
  }

  async function saveHistory(
    item: EventHistory,
    formEvent: FormEvent<HTMLFormElement>,
  ) {
    formEvent.preventDefault();
    const formData = new FormData(formEvent.currentTarget);
    setBusyAction(`history-${item.id}`);
    setActionError(null);

    try {
      const mediaType = getTextValue(formData, "mediaType");
      if (
        mediaType !== "image" &&
        mediaType !== "video" &&
        mediaType !== "youtube"
      ) {
        throw new Error("Choose a supported media type.");
      }

      const updated = await updateEventHistory(
        item.id,
        {
          title: getTextValue(formData, "title"),
          description: getTextValue(formData, "description"),
          mediaUrl: getTextValue(formData, "mediaUrl"),
          mediaType,
          eventDate: getTextValue(formData, "eventDate") || null,
          eventTime: getTextValue(formData, "eventTime") || null,
        },
        token,
      );
      setHistory((current) =>
        current.map((entry) => (entry.id === item.id ? updated : entry)),
      );
      setEditingHistoryId(null);
    } catch (error: unknown) {
      if (!ensureAdmin(error, onUnauthorized)) {
        setActionError(getErrorMessage(error, "Unable to update event history."));
      }
    } finally {
      setBusyAction(null);
    }
  }

  async function removeHistory(item: EventHistory) {
    if (!window.confirm(`Delete "${item.title}" from event history?`)) {
      return;
    }

    setBusyAction(`history-${item.id}`);
    setActionError(null);
    try {
      await deleteEventHistory(item.id, token);
      setHistory((current) => current.filter((entry) => entry.id !== item.id));
    } catch (error: unknown) {
      if (!ensureAdmin(error, onUnauthorized)) {
        setActionError(
          getErrorMessage(error, "Unable to delete event history."),
        );
      }
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section className="mt-16">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
          Existing content
        </p>
        <h2 className="font-serif text-3xl text-primary">Edit or delete</h2>
      </div>

      {loadError && (
        <p role="alert" className="mb-6 text-sm text-destructive">
          {loadError}
        </p>
      )}
      {actionError && (
        <p role="alert" className="mb-6 text-sm text-destructive">
          {actionError}
        </p>
      )}
      {isLoading && (
        <p className="mb-6 text-muted-foreground">Loading saved content...</p>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <h3 className="font-serif text-2xl text-primary">Events</h3>
          {!isLoading && events.length === 0 && (
            <p className="text-sm text-muted-foreground">No events to manage.</p>
          )}
          {events.map((event) => (
            <article
              className="space-y-4 rounded-xl border border-border bg-white p-5 shadow-sm"
              key={event.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium text-primary">{event.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.date} · {event.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditingEventId(
                        editingEventId === event.id ? null : event.id,
                      )
                    }
                    disabled={busyAction !== null}
                  >
                    {editingEventId === event.id ? "Cancel" : "Edit"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => void removeEvent(event)}
                    disabled={busyAction !== null}
                  >
                    {busyAction === `event-${event.id}` ? "Working..." : "Delete"}
                  </Button>
                </div>
              </div>

              {editingEventId === event.id && (
                <form
                  className="space-y-4 border-t border-border pt-4"
                  onSubmit={(formEvent) => void saveEvent(event, formEvent)}
                >
                  <div className="space-y-2">
                    <Label htmlFor={`event-title-${event.id}`}>Title</Label>
                    <Input
                      id={`event-title-${event.id}`}
                      name="title"
                      defaultValue={event.title}
                      required
                      maxLength={120}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`event-description-${event.id}`}>
                      Description
                    </Label>
                    <Textarea
                      id={`event-description-${event.id}`}
                      name="description"
                      defaultValue={event.description}
                      required
                      maxLength={2000}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`event-location-${event.id}`}>Location</Label>
                    <Input
                      id={`event-location-${event.id}`}
                      name="location"
                      defaultValue={event.location}
                      required
                      maxLength={200}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor={`event-date-${event.id}`}>Date</Label>
                      <Input
                        id={`event-date-${event.id}`}
                        name="date"
                        type="date"
                        defaultValue={event.date.slice(0, 10)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`event-start-${event.id}`}>Start time</Label>
                      <Input
                        id={`event-start-${event.id}`}
                        name="startTime"
                        type="time"
                        defaultValue={event.startTime.slice(0, 5)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`event-end-${event.id}`}>End time</Label>
                      <Input
                        id={`event-end-${event.id}`}
                        name="endTime"
                        type="time"
                        defaultValue={event.endTime.slice(0, 5)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`event-image-url-${event.id}`}>
                      Image URL
                    </Label>
                    <Input
                      id={`event-image-url-${event.id}`}
                      name="imageUrl"
                      type="url"
                      defaultValue={event.imageUrl || event.mediaUrl || ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave as-is to keep the current media. Replace it with a
                      URL to change the media.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={busyAction === `event-${event.id}`}
                  >
                    {busyAction === `event-${event.id}`
                      ? "Saving..."
                      : "Save changes"}
                  </Button>
                </form>
              )}
            </article>
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="font-serif text-2xl text-primary">Event history</h3>
          {!isLoading && history.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No history items to manage.
            </p>
          )}
          {history.map((item) => (
            <article
              className="space-y-4 rounded-xl border border-border bg-white p-5 shadow-sm"
              key={item.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium text-primary">{item.title}</h4>
                  <p className="mt-1 text-sm capitalize text-muted-foreground">
                    {item.mediaType}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Event date: {item.eventDate || "Not set"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Event time: {item.eventTime?.slice(0, 5) || "Not set"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditingHistoryId(
                        editingHistoryId === item.id ? null : item.id,
                      )
                    }
                    disabled={busyAction !== null}
                  >
                    {editingHistoryId === item.id ? "Cancel" : "Edit"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => void removeHistory(item)}
                    disabled={busyAction !== null}
                  >
                    {busyAction === `history-${item.id}`
                      ? "Working..."
                      : "Delete"}
                  </Button>
                </div>
              </div>

              {editingHistoryId === item.id && (
                <form
                  className="space-y-4 border-t border-border pt-4"
                  onSubmit={(formEvent) => void saveHistory(item, formEvent)}
                >
                  <div className="space-y-2">
                    <Label htmlFor={`history-title-${item.id}`}>Title</Label>
                    <Input
                      id={`history-title-${item.id}`}
                      name="title"
                      defaultValue={item.title}
                      required
                      maxLength={120}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`history-description-${item.id}`}>
                      Description
                    </Label>
                    <Textarea
                      id={`history-description-${item.id}`}
                      name="description"
                      defaultValue={item.description}
                      maxLength={2000}
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`history-event-date-${item.id}`}>
                        Event date
                      </Label>
                      <Input
                        id={`history-event-date-${item.id}`}
                        name="eventDate"
                        type="date"
                        defaultValue={item.eventDate ?? ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`history-event-time-${item.id}`}>
                        Event time
                      </Label>
                      <Input
                        id={`history-event-time-${item.id}`}
                        name="eventTime"
                        type="time"
                        defaultValue={item.eventTime?.slice(0, 5) ?? ""}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`history-media-type-${item.id}`}>
                      Media type
                    </Label>
                    <select
                      id={`history-media-type-${item.id}`}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      name="mediaType"
                      defaultValue={item.mediaType}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="youtube">YouTube</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`history-media-url-${item.id}`}>
                      Media URL
                    </Label>
                    <Input
                      id={`history-media-url-${item.id}`}
                      name="mediaUrl"
                      type="url"
                      defaultValue={item.mediaUrl}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={busyAction === `history-${item.id}`}
                  >
                    {busyAction === `history-${item.id}`
                      ? "Saving..."
                      : "Save changes"}
                  </Button>
                </form>
              )}
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}
