import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnChat = req.nextUrl.pathname.startsWith("/chat")
  const isOnLogin = req.nextUrl.pathname === "/"

  // Protect /chat — redirect to login (root) if not authenticated
  if (isOnChat && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // If already logged in, redirect away from root to chat
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/chat", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/chat/:path*", "/"],
}
