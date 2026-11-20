import { Room, RoomEvent, Track, type RemoteParticipant } from "livekit-client";

export type MediaSession = { url: string; token: string };
type Callbacks = {
  onStream: (identity: string, name: string, stream: MediaStream | null, cameraMuted: boolean) => void;
  onLeft: (identity: string) => void;
  onDisconnected: () => void;
};

/** One upload per speaker. Watchers only subscribe and never capture local devices. */
export class LiveMediaConnection {
  private readonly room = new Room({ adaptiveStream: true, dynacast: true });
  private closed = false;

  constructor(private readonly callbacks: Callbacks) {
    const refresh = (participant: RemoteParticipant) => {
      if (this.closed) return;
      const tracks = [...participant.trackPublications.values()]
        .map(publication => publication.track?.mediaStreamTrack)
        .filter((track): track is MediaStreamTrack => Boolean(track));
      const camera = [...participant.videoTrackPublications.values()]
        .find(publication => publication.source === Track.Source.Camera);
      callbacks.onStream(participant.identity, participant.name || "Guest",
        tracks.length ? new MediaStream(tracks) : null, !camera || camera.isMuted);
    };
    this.room.on(RoomEvent.TrackSubscribed, (_track, _publication, participant) => refresh(participant));
    this.room.on(RoomEvent.TrackUnsubscribed, (_track, _publication, participant) => refresh(participant));
    this.room.on(RoomEvent.TrackMuted, (_publication, participant) => {
      if (!participant.isLocal) refresh(participant as RemoteParticipant);
    });
    this.room.on(RoomEvent.TrackUnmuted, (_publication, participant) => {
      if (!participant.isLocal) refresh(participant as RemoteParticipant);
    });
    this.room.on(RoomEvent.ParticipantDisconnected, participant => { if (!this.closed) callbacks.onLeft(participant.identity); });
    this.room.on(RoomEvent.Disconnected, () => { if (!this.closed) callbacks.onDisconnected(); });
  }

  async connect(session: MediaSession, local: MediaStream | null) {
    await this.room.connect(session.url, session.token, { autoSubscribe: true });
    if (this.closed) { await this.room.disconnect(); return; }
    if (local) for (const track of local.getTracks()) {
      if (this.closed) return;
      await this.room.localParticipant.publishTrack(track, {
        source: track.kind === "audio" ? Track.Source.Microphone : Track.Source.Camera,
        simulcast: true,
        videoEncoding: { maxBitrate: 1_500_000, maxFramerate: 24 },
      });
    }
  }

  async mute(muted: boolean) { await this.room.localParticipant.setMicrophoneEnabled(!muted); }
  async camera(off: boolean) { await this.room.localParticipant.setCameraEnabled(!off); }
  async startAudio() { await this.room.startAudio(); }
  close() { this.closed = true; void this.room.disconnect(); }
}
