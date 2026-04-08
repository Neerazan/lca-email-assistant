/**
 * API utilities for making authenticated requests to the FastAPI backend.
 *
 * Two variants:
 *  - fetchAPI()      → for server components / server actions (uses auth() from NextAuth)
 *  - clientFetchAPI() → for client components (requires appToken parameter)
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Client-side fetch wrapper — pass the appToken from useAuth().
 */
export async function clientFetchAPI(
  endpoint: string,
  appToken: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${appToken}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response
}

/**
 * Server-side fetch wrapper — reads appToken from session.
 * Note: After the refactor, appToken is no longer stored in the NextAuth session.
 * For server components that need authenticated API calls, consider using
 * the user's identity from auth() and making direct service calls.
 */
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const { auth } = await import("@/auth")
  const session = await auth()

  if (!session) {
    throw new Error("Not authenticated")
  }

  // For server-side calls, we can decode the JWT to get user identity
  // and use that for direct service calls, or pass through the session tokens.
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response
}
