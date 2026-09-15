// Dev goes through the Vite proxy (/api → localhost:4001), prod hits the API origin.
const API_BASE =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "https://api.fabrixproject.eu" : "/api");

// `errors` is usually { field: [msg] }, but some endpoints (registrations/with_organization)
// render a bare string — it becomes a `base` error so FormError still shows it.
type ErrorBody = { error?: string | { message?: string }; errors?: Record<string, string[]> | string };

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(status: number, data: ErrorBody) {
    // platform-back renders `{ error: "message" }`; tolerate the boilerplate's `{ error: { message } }`.
    const message = typeof data.error === "string" ? data.error : data.error?.message;
    super(message ?? "Request failed");
    this.name = "ApiError";
    this.status = status;
    this.errors = typeof data.errors === "string" ? { base: [data.errors] } : (data.errors ?? {});
  }
}

export const tokens = {
  access: () => localStorage.getItem("access_token"),
  refresh: () => localStorage.getItem("refresh_token"),
  set(access: string, refresh?: string) {
    localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);
  },
  clear() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};

// What happens once the refresh token is refused too. The client knows nothing about
// pages, so the app decides (lib/session.ts); until it does, go to /login.
let onSessionExpired: () => void = () => {
  window.location.href = "/login";
};

export function setSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler;
}

// Single in-flight refresh shared across concurrent 401s.
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refresh = tokens.refresh();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth_tokens/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    const access = json.data?.access_token ?? json.access_token;
    if (!access) return false;
    tokens.set(access); // the API only rotates the access token
    return true;
  } catch {
    return false;
  }
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = tokens.access();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function toQuery(params?: Record<string, unknown>): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    sp.append(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(method: string, path: string, body?: unknown, params?: Record<string, unknown>): Promise<T> {
  const url = `${API_BASE}${path}${toQuery(params)}`;
  const send = () => fetch(url, { method, headers: buildHeaders(), body: body ? JSON.stringify(body) : undefined });

  let res = await send();

  if (res.status === 401 && tokens.refresh() && !path.startsWith("/auth_tokens")) {
    refreshPromise ??= refreshAccessToken();
    const refreshed = await refreshPromise;
    refreshPromise = null;
    if (refreshed) {
      res = await send();
    } else {
      tokens.clear();
      onSessionExpired();
      throw new ApiError(401, { error: "Session expired" });
    }
  }

  // Empty body (204, 202, …) — parse only when there's content.
  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;

  if (!res.ok) throw new ApiError(res.status, json ?? {});
  if (json === undefined) return undefined as T;

  // Unwrap a sole `{ data }` envelope; keep `{ data, meta }` (paginated) intact.
  if (json.data !== undefined && Object.keys(json).length === 1) return json.data as T;
  return json as T;
}

export const api = {
  get: <T>(path: string, params?: Record<string, unknown>) => request<T>("GET", path, undefined, params),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string, body?: unknown) => request<T>("DELETE", path, body),
};

export interface PageMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  next_page?: number | null;
  prev_page?: number | null;
}

/** A paginated index: `{ data, meta }` is kept whole by `request` (only a sole `{ data }` is unwrapped). */
export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}
