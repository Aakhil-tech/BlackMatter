/**
 * EcoSphere API Client.
 * Uses the real JWT from login (localStorage), tolerates empty responses.
 */

export function getToken(): string | null {
  return localStorage.getItem("ecosphere_token");
}

export function setToken(token: string) {
  localStorage.setItem("ecosphere_token", token);
}

export function clearToken() {
  localStorage.removeItem("ecosphere_token");
  localStorage.removeItem("ecosphere_user");
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const config: RequestInit = { ...options, headers };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
    }
    // Tolerate empty bodies (204 / empty 200) so DELETE etc. don't crash.
    const text = await response.text();
    if (!text) return {} as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return {} as T;
    }
  } catch (error) {
    console.error(`Fetch error on endpoint ${url}:`, error);
    throw error;
  }
}

/** Login against the real backend /api/auth/login (OAuth2 form format). */
export async function login(email: string, password: string): Promise<{ token: string }> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || "Login failed");
  }
  const data = await res.json();
  setToken(data.access_token);
  localStorage.setItem("ecosphere_user", email);
  return { token: data.access_token };
}

export async function signup(name: string, email: string, password: string): Promise<{ token: string }> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || "Signup failed");
  }
  const data = await res.json();
  setToken(data.access_token);
  localStorage.setItem("ecosphere_user", email);
  return { token: data.access_token };
}
