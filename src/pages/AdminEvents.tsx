import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import {
  clearAdminToken,
  getAdminToken,
  AdminApiError,
} from "@/api/auth";
import { createEvent } from "@/api/events";
import {
  createEventHistory,
  createYoutubeHistory,
} from "@/api/eventHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminContentManager from "@/components/AdminContentManager";

function getTextValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getYouTubeVideoId(mediaUrl: string) {
  try {
    const url = new URL(mediaUrl);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.slice(1);
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      return (
        url.searchParams.get("v") ??
        url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ??
        ""
      );
    }
  } catch {
    return "";
  }

  return "";
}

export default function AdminEvents() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(() => getAdminToken());
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventMessage, setEventMessage] = useState<string | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);
  const [historyType, setHistoryType] = useState<"upload" | "youtube">("upload");
  const [isCreatingHistory, setIsCreatingHistory] = useState(false);
  const [historyMessage, setHistoryMessage] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation, token]);

  const handleUnauthorized = useCallback((error: unknown) => {
    if (
      error instanceof AdminApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      clearAdminToken();
      setToken(null);
      setLocation("/admin/login");
      return true;
    }

    return false;
  }, [setLocation]);

  function signOut() {
    clearAdminToken();
    setToken(null);
    setLocation("/admin/login");
  }

  async function submitEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    const form = event.currentTarget;
    const values = new FormData(form);
    const image = values.get("image");

    setIsCreatingEvent(true);
    setEventError(null);
    setEventMessage(null);

    try {
      await createEvent(
        {
          title: getTextValue(values, "title"),
          description: getTextValue(values, "description"),
          location: getTextValue(values, "location"),
          date: getTextValue(values, "date"),
          startTime: getTextValue(values, "startTime"),
          endTime: getTextValue(values, "endTime"),
          image: image instanceof File && image.size > 0 ? image : undefined,
        },
        token,
      );
      form.reset();
      setEventMessage("Event created successfully.");
      setRefreshVersion((version) => version + 1);
    } catch (submitError: unknown) {
      if (!handleUnauthorized(submitError)) {
        setEventError(
          submitError instanceof Error
            ? submitError.message
            : "Failed to create event.",
        );
      }
    } finally {
      setIsCreatingEvent(false);
    }
  }

  async function submitHistory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    const form = event.currentTarget;
    const values = new FormData(form);

    setIsCreatingHistory(true);
    setHistoryError(null);
    setHistoryMessage(null);

    try {
      const title = getTextValue(values, "title");
      const description = getTextValue(values, "description");
      const eventDate = getTextValue(values, "eventDate");
      const eventTime = getTextValue(values, "eventTime");

      if (historyType === "youtube") {
        const mediaUrl = getTextValue(values, "mediaUrl");
        if (!getYouTubeVideoId(mediaUrl)) {
          throw new Error("Enter a valid YouTube video URL.");
        }

        await createYoutubeHistory(
          { title, description, mediaUrl, eventDate, eventTime },
          token,
        );
      } else {
        const file = values.get("file");
        if (!(file instanceof File) || file.size === 0) {
          throw new Error("Choose an image or video to upload.");
        }

        await createEventHistory(
          { title, description, file, eventDate, eventTime },
          token,
        );
      }

      form.reset();
      setHistoryMessage("Event history added successfully.");
      setRefreshVersion((version) => version + 1);
    } catch (submitError: unknown) {
      if (!handleUnauthorized(submitError)) {
        setHistoryError(
          submitError instanceof Error
            ? submitError.message
            : "Failed to add event history.",
        );
      }
    } finally {
      setIsCreatingHistory(false);
    }
  }

  if (!token) {
    return null;
  }

  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
              Administration
            </p>
            <h1 className="font-serif text-4xl text-primary">
              Manage events
            </h1>
          </div>
          <Button type="button" variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <form
            className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8"
            onSubmit={submitEvent}
          >
            <div>
              <h2 className="font-serif text-2xl text-primary">Create an event</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Add event details and optionally attach a photo or video.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-event-title">Title</Label>
              <Input
                id="admin-event-title"
                name="title"
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-event-description">Description</Label>
              <Textarea
                id="admin-event-description"
                name="description"
                required
                maxLength={2000}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-event-location">Location</Label>
              <Input
                id="admin-event-location"
                name="location"
                required
                maxLength={200}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="admin-event-date">Date</Label>
                <Input
                  id="admin-event-date"
                  name="date"
                  type="date"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-event-start">Start time</Label>
                <Input
                  id="admin-event-start"
                  name="startTime"
                  type="time"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-event-end">End time</Label>
                <Input
                  id="admin-event-end"
                  name="endTime"
                  type="time"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-event-image">
                Photo or video (optional)
              </Label>
              <Input
                id="admin-event-image"
                name="image"
                type="file"
                accept="image/*,video/*"
              />
            </div>
            {eventError && (
              <p role="alert" className="text-sm text-destructive">
                {eventError}
              </p>
            )}
            {eventMessage && (
              <p role="status" className="text-sm text-primary">
                {eventMessage}
              </p>
            )}
            <Button type="submit" disabled={isCreatingEvent}>
              {isCreatingEvent ? "Creating event..." : "Create event"}
            </Button>
          </form>

          <form
            className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8"
            onSubmit={submitHistory}
          >
            <div>
              <h2 className="font-serif text-2xl text-primary">
                Add to event history
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload a photo or video, or share a YouTube video.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-history-title">Title</Label>
              <Input
                id="admin-history-title"
                name="title"
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-history-description">Description</Label>
              <Textarea
                id="admin-history-description"
                name="description"
                maxLength={2000}
                rows={3}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-history-event-date">Event date</Label>
                <Input
                  id="admin-history-event-date"
                  name="eventDate"
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-history-event-time">Event time</Label>
                <Input
                  id="admin-history-event-time"
                  name="eventTime"
                  type="time"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-history-type">Media type</Label>
              <select
                id="admin-history-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={historyType}
                onChange={(changeEvent) =>
                  setHistoryType(
                    changeEvent.target.value === "youtube" ? "youtube" : "upload",
                  )
                }
              >
                <option value="upload">Upload an image or video</option>
                <option value="youtube">YouTube video link</option>
              </select>
            </div>
            {historyType === "upload" ? (
              <div className="space-y-2">
                <Label htmlFor="admin-history-file">Photo or video</Label>
                <Input
                  id="admin-history-file"
                  name="file"
                  type="file"
                  accept="image/*,video/*"
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="admin-history-url">YouTube URL</Label>
                <Input
                  id="admin-history-url"
                  name="mediaUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
            )}
            {historyError && (
              <p role="alert" className="text-sm text-destructive">
                {historyError}
              </p>
            )}
            {historyMessage && (
              <p role="status" className="text-sm text-primary">
                {historyMessage}
              </p>
            )}
            <Button type="submit" disabled={isCreatingHistory}>
              {isCreatingHistory ? "Saving history..." : "Add to history"}
            </Button>
          </form>
        </div>
        <AdminContentManager
          token={token}
          refreshVersion={refreshVersion}
          onUnauthorized={handleUnauthorized}
        />
      </div>
    </section>
  );
}
