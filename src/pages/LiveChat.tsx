import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "wouter";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  Video,
  UserMinus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { LiveMediaConnection, MediaSession } from "@/api/live-media";

type RoomParticipant = {
  peerId: string;
  name: string;
  stream: MediaStream | null;
  audioBlocked?: boolean;
  cameraBlocked?: boolean;
  cameraMuted?: boolean;
};

type SignalMessage = {
  media?: MediaSession;
  type: string;
  peerId?: string;
  name?: string;
  hostPeerId?: string;
  requests?: { peerId: string; name: string }[];
  audioBlocked?: boolean;
  cameraBlocked?: boolean;
  participants?: Array<{ peerId: string; name: string; audioBlocked?: boolean; cameraBlocked?: boolean }>;
  fromPeer?: string;
  fromName?: string;
  payload?: RTCSessionDescriptionInit | RTCIceCandidateInit | null;
  message?: string;
};

const LIVE_ROOM_LIMIT = 10;

function liveSocketUrl(peerId: string, name: string, mode: "start" | "request"): string {
  const configuredApi = import.meta.env.VITE_API_BASE_URL;
  const base = configuredApi
    ? new URL(configuredApi, window.location.origin)
    : import.meta.env.DEV
      ? new URL(window.location.origin)
      : new URL("https://dnd-cafe-ece43a569fa1.herokuapp.com");
  base.protocol = base.protocol === "https:" ? "wss:" : "ws:";
  base.pathname = "/ws/live";
  base.search = new URLSearchParams({ peerId, name, mode }).toString();
  return base.toString();
}

function VideoTile({
  stream,
  name,
  muted = false,
  mirrored = false,
  cameraOff = false,
}: {
  stream: MediaStream | null;
  name: string;
  muted?: boolean;
  mirrored?: boolean;
  cameraOff?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video.current) video.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#241c18]">
      {stream && (
        <video
          ref={video}
          autoPlay
          playsInline
          muted={muted}
          className={`h-full w-full object-cover ${cameraOff ? "absolute inset-0 opacity-0" : ""} ${mirrored ? "-scale-x-100" : ""}`}
        />
      )}
      {(!stream || cameraOff) && (
        <div className="flex h-full items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl text-white">
            {name.slice(0, 1).toUpperCase()}
          </div>
        </div>
      )}
      <span className="absolute bottom-3 left-3 max-w-[80%] truncate rounded-full bg-black/55 px-3 py-1 text-sm text-white">
        {name}
      </span>
    </div>
  );
}

export default function LiveChat() {
  const [name, setName] = useState("");
  const [view, setView] = useState<"auto" | "browse" | "go-live">("auto");
  const [livePeople, setLivePeople] = useState<{ peerId: string; name: string }[] | null>(null);
  const [roomLimit, setRoomLimit] = useState(LIVE_ROOM_LIMIT);
  const [watchingEnabled, setWatchingEnabled] = useState(false);
  const [listedHostId, setListedHostId] = useState<string | null>(null);
  const sfuRef = useRef<LiveMediaConnection | null>(null);
  const [directoryError, setDirectoryError] = useState("");
  const [directoryRefresh, setDirectoryRefresh] = useState(0);
  const [roomState, setRoomState] = useState<"idle" | "connecting" | "waiting" | "live" | "watching">("idle");
  const [joinMode, setJoinMode] = useState<"start" | "request">("start");
  const [selfPeerId, setSelfPeerId] = useState("");
  const [hostPeerId, setHostPeerId] = useState("");
  const [joinRequests, setJoinRequests] = useState<{ peerId: string; name: string }[]>([]);
  const attemptRef = useRef(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [hostMuted, setHostMuted] = useState(false);
  const [hostCameraOff, setHostCameraOff] = useState(false);
  const [moderationNotice, setModerationNotice] = useState("");
  const [error, setError] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef(new Map<string, RTCPeerConnection>());
  const pendingIceRef = useRef(new Map<string, RTCIceCandidateInit[]>());
  const manualLeaveRef = useRef(false);
  const joinedRef = useRef(false);
  const joinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (roomState !== "idle") return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    setLivePeople(null);
    setDirectoryError("");
    async function refresh() {
      try {
        const base = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "" : "https://dnd-cafe-ece43a569fa1.herokuapp.com");
        const response = await fetch(base.replace(/\/$/, "") + "/api/live/participants", {
          signal: controller.signal, cache: "no-store",
        });
        if (!response.ok) throw new Error("Unable to load who's live. Please try again.");
        const status = await response.json();
        if (!Array.isArray(status.participants) || !status.participants.every((person: { peerId?: unknown; name?: unknown } | null) =>
          person && typeof person.peerId === "string" && typeof person.name === "string") ||
          !Number.isInteger(status.limit) || status.limit < 1) {
          throw new Error("Unable to load who's live. Please try again.");
        }
        if (controller.signal.aborted) return;
        setLivePeople(status.participants);
        setListedHostId(typeof status.hostPeerId === "string" ? status.hostPeerId : null);
        setRoomLimit(status.limit);
        setWatchingEnabled(status.watchingEnabled === true);
        setDirectoryError("");
      } catch (failure) {
        if (controller.signal.aborted) return;
        setLivePeople(null);
        setDirectoryError(failure instanceof Error ? failure.message : "Unable to load who's live.");
      }
      if (!controller.signal.aborted) timer = setTimeout(refresh, 5000);
    }
    void refresh();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [roomState, directoryRefresh]);

  function refreshHostRequests() {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "sync-requests" }));
    }
  }

  useEffect(() => {
    if (roomState !== "live" || !selfPeerId || selfPeerId !== hostPeerId) return;
    refreshHostRequests();
    const interval = setInterval(refreshHostRequests, 3000);
    return () => clearInterval(interval);
  }, [roomState, selfPeerId, hostPeerId]);

  async function connectMedia(session: MediaSession, local: MediaStream | null) {
    const activeAttempt = attemptRef.current;
    const { LiveMediaConnection } = await import("@/api/live-media");
    if (activeAttempt !== attemptRef.current) return;
    sfuRef.current?.close();
    const connection = new LiveMediaConnection({
      onStream: (identity, displayName, stream, cameraMuted) => {
        setParticipants(current => current.some(person => person.peerId === identity)
          ? current.map(person => person.peerId === identity ? { ...person, stream, cameraMuted } : person)
          : [...current, { peerId: identity, name: displayName, stream, cameraMuted }]);
      },
      onLeft: identity => setParticipants(current => current.filter(person => person.peerId !== identity)),
      onDisconnected: () => {
        leaveRoom();
        setError("The live stream ended or the media connection closed.");
      },
    });
    sfuRef.current = connection;
    await connection.connect(session, local);
  }

  async function watchLive() {
    if (roomState !== "idle") return;
    const attempt = ++attemptRef.current;
    setError(""); setView("go-live"); setRoomState("connecting");
    try {
      const base = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "" : "https://dnd-cafe-ece43a569fa1.herokuapp.com");
      const response = await fetch(base.replace(/\/$/, "") + "/api/live/watch", { method: "POST", cache: "no-store" });
      if (!response.ok) throw new Error("The live stream is unavailable. Please try again.");
      const session: { media: MediaSession; hostPeerId: string } = await response.json();
      if (attempt !== attemptRef.current) return;
      setHostPeerId(session.hostPeerId);
      await connectMedia(session.media, null);
      if (attempt !== attemptRef.current) return;
      setRoomState("watching");
    } catch (failure) {
      if (attempt !== attemptRef.current) return;
      leaveRoom();
      setError(failure instanceof Error ? failure.message : "Unable to watch this stream.");
    }
  }

  function sendSignal(message: {
    type: "offer" | "answer" | "ice";
    target: string;
    payload: RTCSessionDescriptionInit | RTCIceCandidateInit | null;
  }) {
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  function removePeer(peerId: string) {
    const peer = peersRef.current.get(peerId);
    if (peer) { peer.onconnectionstatechange = null; peer.close(); }
    peersRef.current.delete(peerId);
    pendingIceRef.current.delete(peerId);
    setParticipants((current) => current.filter((participant) => participant.peerId !== peerId));
  }

  function makePeer(peerId: string, displayName: string, audioBlocked = false, cameraBlocked = false): RTCPeerConnection {
    const existing = peersRef.current.get(peerId);
    if (existing) return existing;

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    const stream = streamRef.current;
    stream?.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({ type: "ice", target: peerId, payload: event.candidate.toJSON() });
      } else {
        sendSignal({ type: "ice", target: peerId, payload: null });
      }
    };
    peer.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (!remoteStream) return;
      setParticipants((current) => current.map((participant) =>
        participant.peerId === peerId ? { ...participant, stream: remoteStream } : participant,
      ));
    };
    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "failed" || peer.connectionState === "closed") {
        removePeer(peerId);
      }
    };

    peersRef.current.set(peerId, peer);
    setParticipants((current) => current.some((participant) => participant.peerId === peerId)
      ? current.map((participant) => participant.peerId === peerId
        ? { ...participant, name: displayName }
        : participant)
      : [...current, { peerId, name: displayName, stream: null, audioBlocked, cameraBlocked }]);
    return peer;
  }

  async function acceptSignal(message: SignalMessage) {
    const peerId = message.fromPeer;
    if (!peerId) return;
    const peer = makePeer(peerId, message.fromName || "Guest");

    if (message.type === "offer" && message.payload && "sdp" in message.payload) {
      await peer.setRemoteDescription(new RTCSessionDescription(message.payload));
      const queuedIce = pendingIceRef.current.get(peerId) || [];
      pendingIceRef.current.delete(peerId);
      for (const candidate of queuedIce) await peer.addIceCandidate(candidate);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      if (peer.localDescription) {
        sendSignal({ type: "answer", target: peerId, payload: peer.localDescription });
      }
    } else if (message.type === "answer" && message.payload && "sdp" in message.payload) {
      await peer.setRemoteDescription(new RTCSessionDescription(message.payload));
      const queuedIce = pendingIceRef.current.get(peerId) || [];
      pendingIceRef.current.delete(peerId);
      for (const candidate of queuedIce) await peer.addIceCandidate(candidate);
    } else if (message.type === "ice" && message.payload && "candidate" in message.payload) {
      if (peer.remoteDescription) {
        await peer.addIceCandidate(new RTCIceCandidate(message.payload));
      } else {
        const queued = pendingIceRef.current.get(peerId) || [];
        queued.push(message.payload);
        pendingIceRef.current.set(peerId, queued);
      }
    }
  }

  function leaveRoom() {
    sfuRef.current?.close();
    sfuRef.current = null;
    attemptRef.current++;
    setJoinRequests([]);
    setHostPeerId("");
    setSelfPeerId("");
    manualLeaveRef.current = true;
    joinedRef.current = false;
    if (joinTimeoutRef.current) clearTimeout(joinTimeoutRef.current);
    joinTimeoutRef.current = null;
    socketRef.current?.close();
    socketRef.current = null;
    peersRef.current.forEach((peer) => peer.close());
    peersRef.current.clear();
    pendingIceRef.current.clear();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setLocalStream(null);
    setParticipants([]);
    setRoomState("idle");
    setMuted(false);
    setCameraOff(false);
    setHostMuted(false);
    setHostCameraOff(false);
    setModerationNotice("");
  }

  useEffect(() => () => {
    sfuRef.current?.close();
    attemptRef.current++;
    manualLeaveRef.current = true;
    if (joinTimeoutRef.current) clearTimeout(joinTimeoutRef.current);
    socketRef.current?.close();
    peersRef.current.forEach((peer) => peer.close());
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  async function handleStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || roomState !== "idle") return;
    setError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera and microphone access requires a supported browser and a secure connection (HTTPS or localhost).");
      return;
    }

    const attempt = ++attemptRef.current;
    setRoomState("connecting");
    manualLeaveRef.current = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      if (attempt !== attemptRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      streamRef.current = stream;
      setLocalStream(stream);

      const peerId = crypto.randomUUID();
      const socket = new WebSocket(liveSocketUrl(peerId, name.trim(), joinMode));
      socketRef.current = socket;
      joinTimeoutRef.current = setTimeout(() => {
        if (!joinedRef.current) {
          setError("The live room did not respond. Check that the backend is running and try again.");
          leaveRoom();
        }
      }, 12_000);

      socket.onmessage = (eventMessage) => {
        if (socketRef.current !== socket) return;
        let data: SignalMessage;
        try {
          data = JSON.parse(String(eventMessage.data)) as SignalMessage;
        } catch {
          setError("Received an invalid live-room response.");
          leaveRoom();
          return;
        }

        if (data.type === "waiting") {
          if (joinTimeoutRef.current) clearTimeout(joinTimeoutRef.current);
          setRoomState("waiting");
          joinTimeoutRef.current = setTimeout(() => {
            setError("Your request timed out. You can request to join again.");
            leaveRoom();
          }, 60_000);
          return;
        }
        if (data.type === "request-list" && Array.isArray(data.requests)) {
          setJoinRequests(data.requests);
          return;
        }
        if (data.type === "join-request" && data.peerId) {
          const request = { peerId: data.peerId, name: data.name || "Guest" };
          setJoinRequests(current => current.some(item => item.peerId === request.peerId) ? current : [...current, request]);
          return;
        }
        if (data.type === "request-resolved") {
          setJoinRequests(current => current.filter(item => item.peerId !== data.peerId));
          return;
        }
        if (data.type === "request-error") {
          setError(data.message || "Unable to handle the join request.");
          return;
        }
        if (data.type === "guest-controls" && data.peerId) {
          setParticipants(current => current.map(member => member.peerId === data.peerId
            ? { ...member, audioBlocked: Boolean(data.audioBlocked), cameraBlocked: Boolean(data.cameraBlocked) } : member));
          if (data.peerId === peerId) {
            setHostMuted(Boolean(data.audioBlocked));
            setHostCameraOff(Boolean(data.cameraBlocked));
            if (data.audioBlocked) {
              streamRef.current?.getAudioTracks().forEach(track => { track.enabled = false; });
              setMuted(true);
            }
            if (data.cameraBlocked) {
              streamRef.current?.getVideoTracks().forEach(track => { track.enabled = false; });
              setCameraOff(true);
            }
            setModerationNotice(data.audioBlocked || data.cameraBlocked
              ? "The host has restricted your microphone or camera."
              : "The host has allowed your microphone and camera. You can turn them on when ready.");
          }
          return;
        }
        if (data.type === "removed") {
          leaveRoom();
          setError(data.message || "The host removed you from the live room.");
          return;
        }
        if (data.type === "room-ended") {
          setError(data.message || "The host ended the live room.");
          leaveRoom();
          return;
        }
        if (data.type === "error") {
          setError(data.message || "Unable to join the live room.");
          leaveRoom();
          return;
        }
        if (data.type === "joined") {
          joinedRef.current = true;
          setSelfPeerId(peerId);
          setHostPeerId(data.hostPeerId || peerId);
          if (joinTimeoutRef.current) clearTimeout(joinTimeoutRef.current);
          joinTimeoutRef.current = null;
          setRoomState("live");
          if (data.media) {
            setParticipants((data.participants || []).map(participant => ({ ...participant, stream: null })));
            void connectMedia(data.media, streamRef.current).catch(() => {
              if (attempt !== attemptRef.current) return;
              leaveRoom(); setError("Unable to connect to the media server. Please try again.");
            });
            return;
          }
          (data.participants || []).forEach((participant) => {
            makePeer(participant.peerId, participant.name, participant.audioBlocked, participant.cameraBlocked);
          });
          return;
        }
        if (data.type === "peer-joined" && data.peerId && data.peerId !== peerId) {
          if (sfuRef.current) {
            const added = { peerId: data.peerId, name: data.name || "Guest", stream: null };
            setParticipants(current => current.some(person => person.peerId === added.peerId) ? current : [...current, added]);
            return;
          }
          const peer = makePeer(data.peerId, data.name || "Guest");
          void peer.createOffer()
            .then((offer) => peer.setLocalDescription(offer))
            .then(() => {
              if (peer.localDescription) {
                sendSignal({ type: "offer", target: data.peerId!, payload: peer.localDescription });
              }
            })
            .catch(() => setError("Could not connect to a new participant. Please try rejoining."));
          return;
        }
        if (data.type === "peer-left" && data.peerId) {
          removePeer(data.peerId);
          return;
        }
        if (data.type === "offer" || data.type === "answer" || data.type === "ice") {
          if (sfuRef.current) return;
          void acceptSignal(data).catch(() => {
            setError("A video connection failed. Please leave and rejoin the room.");
          });
        }
      };

      socket.onerror = () => {
        if (socketRef.current !== socket) return;
        if (!joinedRef.current) {
          setError("Could not connect to the live room. Check that the backend is running.");
        }
      };
      socket.onclose = () => {
        if (socketRef.current !== socket) return;
        if (joinTimeoutRef.current) clearTimeout(joinTimeoutRef.current);
        joinTimeoutRef.current = null;
        if (!manualLeaveRef.current) {
          setError("The live-room connection closed. Please try joining again.");
          leaveRoom();
        }
      };
    } catch (cameraError) {
      if (attempt !== attemptRef.current) return;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setLocalStream(null);
      setRoomState("idle");
      setError(
        cameraError instanceof DOMException && cameraError.name === "NotAllowedError"
          ? "Allow camera and microphone access in your browser to join the live room."
          : cameraError instanceof Error
            ? cameraError.message
            : "Could not start your camera and microphone.",
      );
    }
  }

  function toggleMuted() {
    if (hostMuted) return;
    const next = !muted;
    streamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !next; });
    setMuted(next);
    void sfuRef.current?.mute(next).catch(() => setError("Unable to change microphone. Please try again."));
  }

  function toggleCamera() {
    if (hostCameraOff) return;
    const next = !cameraOff;
    streamRef.current?.getVideoTracks().forEach((track) => { track.enabled = !next; });
    setCameraOff(next);
    void sfuRef.current?.camera(next).catch(() => setError("Unable to change camera. Please try again."));
  }

  function decideRequest(peerId: string, decision: "approve" | "decline") {
    if (socketRef.current?.readyState !== WebSocket.OPEN) return;
    setError("");
    socketRef.current.send(JSON.stringify({ type: decision, target: peerId }));
  }

  function moderateGuest(peerId: string, action: "mute-guest" | "allow-mic" | "camera-off" | "allow-camera" | "remove-guest") {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: action, target: peerId }));
    }
  }

  function endLive() {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "end-live" }));
    }
    leaveRoom();
  }

  const someoneIsLive = Boolean(livePeople?.length);
  const entryView = view === "auto" ? (livePeople?.length === 0 ? "go-live" : "browse") : view;
  const listedHostName = livePeople?.find(person => person.peerId === listedHostId)?.name || livePeople?.[0]?.name;
  const isWatching = roomState === "watching";
  const inRoom = roomState === "live" || isWatching;
  const isHost = inRoom && hostPeerId === selfPeerId;
  const host = participants.find(participant => participant.peerId === hostPeerId);
  const guestTiles: RoomParticipant[] = isHost ? participants : [
    ...(!isWatching ? [{ peerId: selfPeerId, name: name.trim() + " (You)", stream: localStream }] : []),
    ...participants.filter(participant => participant.peerId !== hostPeerId),
  ];

  return (
    <section className="min-h-[78vh] bg-background px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto w-full max-w-7xl">
        

        {roomState === "idle" && <div className="mb-8 text-center">
          <h1 className="text-3xl text-primary sm:text-4xl">{someoneIsLive ? listedHostName + " is live" : livePeople === null ? "Live at DnD Cafe" : "Start your live room"}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{someoneIsLive ? "Watch as a guest with your camera and microphone off, or ask the host to join on camera." : livePeople === null ? "Checking the live room…" : "Go live first. Other visitors will see your room and can watch or request to join."}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3" role="group" aria-label="Live options">
            <button type="button" disabled={livePeople === null && !directoryError}
              onClick={() => { setView(someoneIsLive ? "browse" : "go-live"); setJoinMode(someoneIsLive ? "request" : "start"); }}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground disabled:opacity-50">
              <Video size={22} />{someoneIsLive ? "Show live" : "Go Live"}
            </button>
            {someoneIsLive && <button type="button" onClick={() => { setJoinMode("request"); setView("go-live"); }} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-border bg-white px-8 py-4 text-base font-semibold text-primary hover:border-accent">
              <Users size={22} />Request to join
            </button>}
            {view === "go-live" && someoneIsLive && <button type="button" onClick={() => setView("auto")} className="min-h-14 rounded-full border border-border px-6 text-sm text-primary">Back to live</button>}
          </div>
        </div>}

        {entryView === "browse" && roomState === "idle" ? (
          <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-border bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-2xl text-primary">{someoneIsLive ? "Join as a guest" : "Live room"}</h2>
                <p className="mt-2 text-sm text-muted-foreground">Watching does not turn on your camera or microphone. Only approved guests appear on camera.</p></div>
              <button type="button" onClick={() => setDirectoryRefresh(value => value + 1)} className="min-h-11 rounded-full border border-border px-5 text-sm text-primary hover:border-accent">Refresh</button>
            </div>
            {directoryError ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{directoryError}</p>
              : livePeople === null ? <p role="status" className="py-8 text-center text-muted-foreground">Checking who’s live…</p>
              : livePeople.length === 0 ? <div className="py-10 text-center"><Users className="mx-auto mb-4 text-accent" size={36} />
                  <h3 className="text-xl text-primary">No one is live yet</h3><p className="mt-2 text-sm text-muted-foreground">Be the first to start the room.</p></div>
              : <><p role="status" className="mb-4 text-sm text-muted-foreground">{livePeople.length} / {roomLimit} people live</p>
                  <ul className="grid gap-3 sm:grid-cols-2">{livePeople.map(person => <li key={person.peerId} className="flex items-center gap-3 rounded-2xl border border-border p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-primary">{person.name.slice(0, 1).toUpperCase()}</span>
                    <span className="min-w-0 flex-1 truncate font-medium text-primary">{person.name}</span><span className="flex items-center gap-1.5 text-xs text-green-700"><span className="h-2 w-2 rounded-full bg-green-500" />Live</span>
                  </li>)}</ul></>}
            {!directoryError && livePeople !== null && livePeople.length > 0 && <div className="mt-6">
              <button type="button" disabled={!watchingEnabled} onClick={() => void watchLive()} className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground disabled:opacity-50">Watch live</button>
              <p className="mt-2 text-sm text-muted-foreground">{watchingEnabled ? "Watch without a camera or microphone. Viewer spaces are separate from the 10 on-camera places." : "Watch-only streaming is not available yet."}</p>
            </div>}
            {!directoryError && livePeople !== null && <button type="button" disabled={livePeople.length >= roomLimit}
              onClick={() => { setJoinMode(livePeople.length ? "request" : "start"); setView("go-live"); }} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
              <Video size={18} />{livePeople.length >= roomLimit ? "Room is full" : livePeople.length ? "Request to join" : "Go Live"}
            </button>}
          </div>
        ) : (
        <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-xl">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${inRoom ? "animate-pulse bg-green-500" : "bg-muted-foreground/40"}`} />
              <div>
                <h2 className="font-sans text-sm font-semibold text-primary">DnD Cafe Live Room</h2>
                <p role="status" className="text-xs text-muted-foreground">
                  {roomState === "waiting" ? "Waiting for host approval" : roomState === "connecting" ? "Connecting..." : inRoom ? (isHost ? "You are hosting" : isWatching ? "Watching · camera and microphone off" : "Live now") : "Ready to join"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={17} />
              <span>{inRoom ? participants.length + (isWatching ? 0 : 1) : 0} / {LIVE_ROOM_LIMIT}</span>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {inRoom ? (
              <>
                {isHost && <div role="region" aria-label="Host join requests" aria-live="polite" className="mb-5 rounded-2xl border-2 border-accent/40 bg-secondary/40 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold text-primary">Join requests ({joinRequests.length})</h3><button type="button" onClick={refreshHostRequests} className="min-h-11 rounded-full border border-border bg-white px-4 text-sm text-primary">Refresh requests</button></div>
                  {joinRequests.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No pending requests. When a guest submits a request, their name and Accept / Decline buttons appear here.</p>
                    : <ul className="mt-3 space-y-3">{joinRequests.map(request => <li key={request.peerId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3">
                      <p className="min-w-0 break-words text-sm text-primary"><strong>{request.name}</strong> wants to join</p>
                      <div className="flex gap-2"><button type="button" disabled={participants.length + 1 >= LIVE_ROOM_LIMIT} onClick={() => decideRequest(request.peerId, "approve")} className="min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50">Accept</button>
                        <button type="button" onClick={() => decideRequest(request.peerId, "decline")} className="min-h-11 rounded-full border border-border px-5 text-sm text-primary">Decline</button></div>
                    </li>)}</ul>}
                </div>}
                <div className="relative isolate overflow-hidden rounded-2xl bg-[#241c18]">
                  <VideoTile
                    stream={isHost ? localStream : host?.stream || null}
                    name={isHost ? name.trim() + " (Host · You)" : (host?.name || "Host") + " (Host)"}
                    muted={isHost} mirrored={isHost} cameraOff={isHost ? cameraOff : Boolean(host?.cameraBlocked || host?.cameraMuted)}
                  />
                  {guestTiles.length > 0 && <div aria-label="Guests in the room" className="absolute right-2 top-2 bottom-12 z-10 flex w-[30%] max-w-60 flex-col gap-2 overflow-y-auto rounded-xl sm:right-4 sm:top-4 sm:gap-3">
                    {guestTiles.map(guest => <div key={guest.peerId} className="shrink-0 overflow-hidden rounded-xl border-2 border-white/80 shadow-lg">
                      <VideoTile stream={guest.stream} name={guest.name} muted={guest.peerId === selfPeerId || Boolean(guest.audioBlocked)} mirrored={guest.peerId === selfPeerId} cameraOff={guest.peerId === selfPeerId ? cameraOff : Boolean(guest.cameraBlocked || guest.cameraMuted)} />
                      {isHost && <div className="flex flex-wrap justify-center gap-1 bg-[#241c18] p-1.5">
                        <button type="button" aria-label={(guest.audioBlocked ? "Allow microphone for " : "Mute ") + guest.name} title={guest.audioBlocked ? "Allow guest to unmute" : "Mute guest"} onClick={() => moderateGuest(guest.peerId, guest.audioBlocked ? "allow-mic" : "mute-guest")} className="flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-white/10 px-1 text-[10px] text-white hover:bg-white/20"><MicOff size={15} />{guest.audioBlocked ? "Allow mic" : "Mute"}</button>
                        <button type="button" aria-label={(guest.cameraBlocked ? "Allow camera for " : "Disable camera for ") + guest.name} title={guest.cameraBlocked ? "Allow guest to turn camera on" : "Turn guest camera off"} onClick={() => moderateGuest(guest.peerId, guest.cameraBlocked ? "allow-camera" : "camera-off")} className="flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-white/10 px-1 text-[10px] text-white hover:bg-white/20"><CameraOff size={15} />{guest.cameraBlocked ? "Allow camera" : "Camera off"}</button>
                        <button type="button" aria-label={"Remove " + guest.name + " from live"} title="Remove guest from live" onClick={() => moderateGuest(guest.peerId, "remove-guest")} className="flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-red-600 px-1 text-[10px] text-white hover:bg-red-700"><UserMinus size={15} />Remove</button>
                      </div>}
                    </div>)}
                  </div>}
                </div>
                {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
                {participants.length === 0 && !isWatching && (
                  <p className="mt-5 text-center text-sm text-muted-foreground">
                    You’re live. Share this page so guests can request to join.
                  </p>
                )}
                {moderationNotice && <p role="status" className="mt-4 rounded-xl bg-secondary p-4 text-sm text-primary">{moderationNotice}</p>}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {!isWatching && <>
                  <button
                    type="button"
                    onClick={toggleMuted}
                    disabled={hostMuted}
                    title={hostMuted ? "Microphone muted by host" : muted ? "Unmute your microphone" : "Mute your microphone"}
                    aria-label={muted ? "Turn microphone on" : "Mute microphone"}
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${muted ? "bg-red-100 text-red-700" : "bg-secondary text-primary"}`}
                  >
                    {muted ? <MicOff size={19} /> : <Mic size={19} />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleCamera}
                    disabled={hostCameraOff}
                    title={hostCameraOff ? "Camera disabled by host" : cameraOff ? "Turn your camera on" : "Turn your camera off"}
                    aria-label={cameraOff ? "Turn camera on" : "Turn camera off"}
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${cameraOff ? "bg-red-100 text-red-700" : "bg-secondary text-primary"}`}
                  >
                    {cameraOff ? <CameraOff size={19} /> : <Camera size={19} />}
                  </button>
                  </>}
                  {isWatching && <><button type="button" onClick={() => { leaveRoom(); setJoinMode("request"); setView("go-live"); }} className="min-h-12 rounded-full border border-border px-6 text-sm text-primary">Request to join on camera</button><button type="button" onClick={() => void sfuRef.current?.startAudio()} className="min-h-12 rounded-full border border-border px-6 text-sm text-primary">Enable sound</button></>}
                  <button
                    type="button"
                    onClick={isHost ? endLive : leaveRoom}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-red-600 px-6 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <PhoneOff size={17} />
                    {isHost ? "End live for everyone" : isWatching ? "Stop watching" : "Leave room"}
                  </button>
                </div>
              </>
            ) : (
              <div className="mx-auto w-full max-w-3xl py-6">
                {localStream ? <div className="mb-6"><VideoTile stream={localStream} name="Your preview · visible only to you" muted mirrored /></div> : <div className="mb-6 flex aspect-video items-center justify-center rounded-2xl bg-[#241c18] text-primary-foreground/80">
                  <div className="text-center">
                    <Video className="mx-auto mb-3 text-accent" size={38} />
                    <p className="text-sm">Start a live room or request to join the host.</p>
                  </div>
                </div>}
                {error && (
                  <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}
                {roomState === "waiting" && <p role="status" className="mb-4 rounded-xl bg-secondary p-4 text-sm text-primary">Request sent. Waiting for the host to accept. Your preview is private until you are accepted.</p>}
                <form onSubmit={handleStart} className="space-y-3">
                  <label htmlFor="live-name" className="text-sm font-medium text-primary">Your name</label>
                  <Input
                    id="live-name"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={60}
                    required
                    disabled={roomState !== "idle"}
                  />
                  <button
                    type="submit"
                    disabled={roomState !== "idle" || !name.trim()}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {roomState === "waiting" ? "Waiting for approval..." : roomState === "connecting" ? "Connecting..." : joinMode === "request" ? "Request to join" : "Start live"}
                    {!inRoom && <Video size={17} />}
                  </button>
                </form>
                {roomState !== "idle" && <button type="button" onClick={leaveRoom} className="mt-3 min-h-11 rounded-full border border-border px-6 text-sm text-primary">Cancel request</button>}
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  The first person starts as host. Guests need the host’s approval to join, with a limit of {LIVE_ROOM_LIMIT} people. Your camera and microphone are shared only after you enter the room.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-border px-5 py-4 text-center text-xs text-muted-foreground sm:px-7">
            Need to send us a private message instead?{" "}
            <Link href="/messages" className="font-medium text-primary underline underline-offset-2">Message the cafe</Link>
            {" "}or <Link href="/contact" className="font-medium text-primary underline underline-offset-2">contact us by email</Link>.
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
