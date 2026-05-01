const ADMIN_AUTH_KEY = "adminAuth";
const LEGACY_AUTH_FLAG = "event-auth";
const LEGACY_USER_KEY = "event-user";
const LEGACY_PASS_KEY = "event-pass";

export function saveAdminAuth(username, password) {
  const auth = JSON.stringify({ username, password });
  sessionStorage.setItem(ADMIN_AUTH_KEY, auth);
}

export function getAdminAuth() {
  const stored = sessionStorage.getItem(ADMIN_AUTH_KEY);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    }
  }

  const legacyFlag = localStorage.getItem(LEGACY_AUTH_FLAG);
  const legacyUsername = localStorage.getItem(LEGACY_USER_KEY);
  const legacyPassword = localStorage.getItem(LEGACY_PASS_KEY);

  if (legacyFlag === "true" && legacyUsername && legacyPassword) {
    saveAdminAuth(legacyUsername, legacyPassword);
    return { username: legacyUsername, password: legacyPassword };
  }

  return null;
}

export function clearAdminAuth() {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(LEGACY_AUTH_FLAG);
  localStorage.removeItem(LEGACY_USER_KEY);
  localStorage.removeItem(LEGACY_PASS_KEY);
}

export function isAdminAuthenticated() {
  const auth = getAdminAuth();
  return Boolean(auth?.username && auth?.password);
}
