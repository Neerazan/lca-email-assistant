"use client"

import { SessionProvider } from "next-auth/react"
import { AuthContextProvider } from "@/contexts/AuthContext"

/**
 * AuthProvider wraps the app with both NextAuth's SessionProvider
 * and our custom AuthContext that handles backend sync.
 *
 * Hierarchy: SessionProvider → AuthContextProvider → children
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  )
}
