/**
 * POST /api/auth/sync
 *
 * Secure server-side bridge between NextAuth and FastAPI.
 *
 * This route:
 *  1. Reads the NextAuth JWT (server-side — contains refresh_token)
 *  2. Forwards id_token, access_token, and refresh_token to FastAPI
 *  3. Returns the app_token from FastAPI to the client
 *
 * Security: The refresh_token NEVER touches the browser.
 * It flows: NextAuth JWT → this server route → FastAPI → encrypted in Supabase.
 */

import { NextResponse } from "next/server"
import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()

    const secureCookie = process.env.NODE_ENV === "production"
    const cookieName = secureCookie
      ? "__Secure-authjs.session-token"
      : "authjs.session-token"

    const tokenCookie = cookieStore.get(cookieName)

    if (!tokenCookie?.value) {
      return NextResponse.json(
        { error: "No session token found" },
        { status: 401 }
      )
    }

    const jwt = await decode({
      token: tokenCookie.value,
      secret: process.env.AUTH_SECRET!,
      salt: cookieName,
    })

    if (!jwt) {
      return NextResponse.json(
        { error: "Failed to decode session" },
        { status: 401 }
      )
    }

    const idToken = jwt.idToken as string
    const accessToken = jwt.accessToken as string
    const refreshToken = jwt.refreshToken as string | undefined

    if (!idToken) {
      return NextResponse.json(
        { error: "No id_token available" },
        { status: 400 }
      )
    }

    // Forward tokens to FastAPI backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const backendResponse = await fetch(`${apiUrl}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_token: idToken,
        access_token: accessToken || null,
        refresh_token: refreshToken || null,
      }),
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}))
      console.error("Backend sync failed:", backendResponse.status, errorData)
      return NextResponse.json(
        { error: "Backend authentication failed", detail: errorData },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()

    return NextResponse.json({ app_token: data.app_token })

  } catch (error) {
    console.error("Auth sync error:", error)
    return NextResponse.json(
      { error: "Internal sync error" },
      { status: 500 }
    )
  }
}
