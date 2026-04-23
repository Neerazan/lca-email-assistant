/**
 * API utilities for making authenticated requests to the FastAPI backend.
 */
import { jwtDecode } from "jwt-decode"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const APP_TOKEN_STORAGE_KEY = "app_token"
let refreshPromise: Promise<string | null> | null = null

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(APP_TOKEN_STORAGE_KEY)
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp?: number }>(token)
    if (!decoded.exp) return false
    return decoded.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

function getBestToken(appToken: string | null): string | null {
  const stored = readStoredToken()
  // Prefer the freshest token available in localStorage if it differs from stale state.
  return stored || appToken
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      })
      if (!refreshRes.ok) return null

      const data = await refreshRes.json()
      const newAppToken = data.access_token as string | undefined
      if (!newAppToken) return null

      localStorage.setItem(APP_TOKEN_STORAGE_KEY, newAppToken)
      window.dispatchEvent(
        new CustomEvent("app-token-refreshed", {
          detail: { token: newAppToken },
        })
      )
      return newAppToken
    } catch (e) {
      console.error("Token refresh failed during fetch", e)
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

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
  const headers = new Headers((options.headers as HeadersInit) || {})
  let tokenToUse = getBestToken(appToken)

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (tokenToUse && isTokenExpired(tokenToUse)) {
    tokenToUse = await refreshAccessToken()
  }

  if (tokenToUse) {
    headers.set("Authorization", `Bearer ${tokenToUse}`)
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // If unauthorized and we haven't retried yet, try to refresh
  if (response.status === 401 && !isRetry) {
    const refreshedToken = await refreshAccessToken()
    if (refreshedToken) {
      return clientFetchAPI(endpoint, refreshedToken, options, true)
    }
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response
}

export interface UploadedAttachment {
  id: string
  filename: string
  mime_type: string
  size_bytes: number
  thread_id: string | null
}

export async function uploadAttachment(
  appToken: string | null,
  file: File,
  threadId?: string
): Promise<UploadedAttachment> {
  const formData = new FormData()
  formData.append("file", file)
  if (threadId) {
    formData.append("thread_id", threadId)
  }

  const response = await clientFetchAPI("/attachments/upload", appToken, {
    method: "POST",
    body: formData,
  })

  return response.json()
}

export async function getPreferences(appToken: string, googleId: string) {
  const res = await clientFetchAPI(`/preferences/${googleId}`, appToken)
  return res.json()
}

export async function savePreferences(appToken: string, googleId: string, data: unknown) {
  const res = await clientFetchAPI(`/preferences/${googleId}`, appToken, {
    method: "PUT",
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function resetMemory(appToken: string, googleId: string) {
  const res = await clientFetchAPI(`/preferences/${googleId}/memory`, appToken, {
    method: "DELETE",
  })
  return res.json()
}

export async function deleteAccount(appToken: string, googleId: string) {
  const res = await clientFetchAPI(`/preferences/${googleId}`, appToken, {
    method: "DELETE",
  })
  return res.json()
}

