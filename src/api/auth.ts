const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? ""
    : "https://dnd-cafe-ece43a569fa1.herokuapp.com");

const ADMIN_TOKEN_KEY = "dnd-cafe-admin-token";

export class AdminApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export async function loginAdmin(
  credentials: AdminCredentials,
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new AdminApiError(
      response.status >= 500
        ? "Login failed. Check your credentials and that the backend is running."
        : "Invalid username or password.",
      response.status,
    );
  }

  const result: unknown = await response.json();
  if (
    typeof result !== "object" ||
    result === null ||
    !("token" in result) ||
    typeof result.token !== "string" ||
    result.token.length === 0
  ) {
    throw new Error("The login response did not contain an admin token.");
  }

  return result.token;
}

export function getAdminToken(): string | null {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function saveAdminToken(token: string): void {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}
