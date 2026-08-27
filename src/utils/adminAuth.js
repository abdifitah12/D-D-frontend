const TOKEN_KEY = "admin-token";

export function saveAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export function clearAdminAuth() {
  localStorage.removeItem(TOKEN_KEY);
}

export function redirectToAdminLogin() {
  clearAdminAuth();
  window.location.replace("/admin/login");
}