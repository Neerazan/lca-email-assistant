"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthContextProvider } from "@/contexts/AuthContext"

/**
 * AuthProvider wraps the app with GoogleOAuthProvider 
 * and our custom AuthContext that handles manual token state.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (!clientId) {
    console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID")
    return <>{children}</>
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </GoogleOAuthProvider>
  )
}
