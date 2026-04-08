/**
 * AuthContext — manages app-level authentication state.
 *
 * Responsibilities:
 *  - Wraps NextAuth's SessionProvider
 *  - Syncs with FastAPI backend immediately after Google login
 *  - Stores the backend-issued app_token in memory
 *  - Provides useAuth() hook for components
 *
 * Architecture:
 *  - NextAuth handles Google OAuth (session management)
 *  - FastAPI is the source of truth (identity, tokens, business logic)
 *  - This context bridges the two by calling /api/auth/sync after login
 */

"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react"
import { useSession, signOut as nextAuthSignOut } from "next-auth/react"

interface AuthContextValue {
  /** The backend-issued JWT for all API calls */
  appToken: string | null
  /** True while the backend sync is in progress */
  isSyncing: boolean
  /** True when sync was attempted but failed */
  syncFailed: boolean
  /** True when both NextAuth session AND backend sync are complete */
  isAuthenticated: boolean
  /** True while NextAuth session is loading */
  isLoading: boolean
  /** NextAuth session user info */
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
  /** Sign out from both NextAuth and clear app_token */
  signOut: () => Promise<void>
  /** Retry backend sync after a failure */
  retrySync: () => void
}

const AuthContext = createContext<AuthContextValue>({
  appToken: null,
  isSyncing: false,
  syncFailed: false,
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signOut: async () => {},
  retrySync: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  console.log("Session: ", session)
  const isLoading = status === "loading"
  const [appToken, setAppToken] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncFailed, setSyncFailed] = useState(false)

  // Use a ref to prevent duplicate sync attempts (React strict mode, fast re-renders)
  const syncAttemptedRef = useRef(false)

  const performSync = useCallback(async () => {
    if (isSyncing) return

    setIsSyncing(true)
    setSyncFailed(false)

    try {
      const res = await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error("Backend sync failed:", err)
        setSyncFailed(true)
        return
      }

      const data = await res.json()
      if (data.app_token) {
        setAppToken(data.app_token)
        // Store in sessionStorage for page refreshes within the same tab
        // (cleared when tab closes — more secure than localStorage)
        sessionStorage.setItem("app_token", data.app_token)
      } else {
        setSyncFailed(true)
      }
    } catch (error) {
      console.error("Auth sync error:", error)
      setSyncFailed(true)
    } finally {
      setIsSyncing(false)
    }
  }, [isSyncing])

  // Backend sync — fires ONCE immediately after login
  useEffect(() => {
    if (isLoading || !session) return

    // Already have a token — nothing to do
    if (appToken) return

    // Already attempted sync this mount — don't retry automatically
    if (syncAttemptedRef.current) return

    // Try to restore from sessionStorage first (e.g., page refresh)
    const stored = sessionStorage.getItem("app_token")
    if (stored) {
      setAppToken(stored)
      return
    }

    // Session exists and needs sync — do it exactly once
    if (session.needsSync) {
      syncAttemptedRef.current = true
      performSync()
    }

  }, [session, isLoading, appToken, performSync])

  const retrySync = useCallback(() => {
    syncAttemptedRef.current = false
    setSyncFailed(false)
    performSync()
  }, [performSync])

  const handleSignOut = useCallback(async () => {
    setAppToken(null)
    syncAttemptedRef.current = false
    setSyncFailed(false)
    sessionStorage.removeItem("app_token")
    await nextAuthSignOut({ redirectTo: "/" })
  }, [])

  const value: AuthContextValue = {
    appToken,
    isSyncing,
    syncFailed,
    isAuthenticated: !!session && !!appToken,
    isLoading: isLoading || isSyncing,
    user: session?.user ?? null,
    signOut: handleSignOut,
    retrySync,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
