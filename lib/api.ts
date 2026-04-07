import { auth } from "@/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// For server components / server actions
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const session = await auth()

  if (!session?.appToken) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.appToken}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response
}
