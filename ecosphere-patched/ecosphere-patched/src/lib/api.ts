/**
 * EcoSphere API Client Utility
 * Handles automatic JWT injection and communication with backend endpoints.
 */

const MOCK_JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYWtoaWwiLCJlbWFpbCI6ImFha2hpbGF5YWFuaXNoYTgwNUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4ifQ";

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  // Inject appropriate JWT header mirroring the backend dependencies configuration
  headers.set("Authorization", `Bearer ${MOCK_JWT_TOKEN}`);

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`Fetch error on endpoint ${url}:`, error);
    throw error;
  }
}
