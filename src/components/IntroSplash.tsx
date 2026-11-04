import { useEffect, useState } from "react";
import logo from "@/assets/dnd-cafe-logo.png";

const INTRO_SESSION_KEY = "dnd-cafe-intro-seen";
const EXIT_DELAY_MS = 2050;
const REMOVE_DELAY_MS = 3100;

function hasSeenIntro() {
  if (typeof window === "undefined") return true;

  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export default function IntroSplash() {
  const [isVisible, setIsVisible] = useState(() => !hasSeenIntro());
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    } catch {
      // The intro still works if session storage is unavailable.
    }

    document.body.classList.add("intro-splash-open");

    const exitTimer = window.setTimeout(() => setIsExiting(true), EXIT_DELAY_MS);
    const removeTimer = window.setTimeout(() => setIsVisible(false), REMOVE_DELAY_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.classList.remove("intro-splash-open");
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`intro-splash${isExiting ? " is-exiting" : ""}`}
      role="status"
      aria-label="Welcome to DnD Cafe"
    >
      <div className="intro-splash__panel intro-splash__panel--top" aria-hidden="true" />
      <div className="intro-splash__panel intro-splash__panel--bottom" aria-hidden="true" />
      <div className="intro-splash__inner">
        <div className="intro-splash__glow" aria-hidden="true" />
        <div className="intro-splash__stage">
          <img className="intro-splash__logo" src={logo} alt="DnD Cafe" />
          <span className="intro-splash__shadow" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
