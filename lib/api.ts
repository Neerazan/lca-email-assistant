/**
 * API utilities for making authenticated requests to the FastAPI backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Client-side fetch wrapper — pass the appToken from useAuth().
 * Automatically attempts to refresh the token on a 401 response and retries.
 */
export async function clientFetchAPI(
  endpoint: string,
  appToken: string | null,
  options: RequestInit = {},
  isRetry = false
): Promise<Response> {
  const headers = new Headers(options.headers || {})
  headers.set("Content-Type", "application/json")
  
  if (appToken) {
    headers.set("Authorization", `Bearer ${appToken}`)
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // If unauthorized and we haven't retried yet, try to refresh
  if (response.status === 401 && !isRetry) {
    try {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Send the HttpOnly cookie
      })

      if (refreshRes.ok) {
        const data = await refreshRes.json()
        const newAppToken = data.access_token
        
        // Save the new token so other requests can use it
        localStorage.setItem("app_token", newAppToken)
        
        // Retry the original request
        return clientFetchAPI(endpoint, newAppToken, options, true)
      }
    } catch (e) {
      console.error("Token refresh failed during fetch", e)
    }
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response
}
