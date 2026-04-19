"use client"

import { jwtDecode } from "jwt-decode"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

interface User {
  sub: string
  email: string
  name?: string
  picture?: string
}

interface AuthTokenPayload extends User {
  exp?: number
}

interface AuthContextValue {
  appToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  loginWithCode: (code: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  appToken: null,
  isAuthenticated: false,
  isLoading: true,
  user: null,
  loginWithCode: async () => { },
  signOut: async () => { },
})

export function useAuth() {
  return useContext(AuthContext)
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [appToken, setAppToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Use a ref to prevent double-fetching on mount in StrictMode
  const initRef = useRef(false)

  const handleToken = (token: string) => {
    try {
      const decoded = jwtDecode<AuthTokenPayload>(token)
      if (!decoded?.sub || !decoded?.email) {
        throw new Error("Token payload is missing required fields")
      }
      setAppToken(token)
      setUser(decoded)
      localStorage.setItem("app_token", token)
    } catch (e) {
      console.error("Invalid token received", e)
      setAppToken(null)
      setUser(null)
      localStorage.removeItem("app_token")
    }
  }

  const attemptSilentRefresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        // Crucial: sends the HttpOnly refresh cookie to the backend
        credentials: "include",
      })

      if (res.ok) {
        const data = await res.json()
        handleToken(data.access_token)
      } else {
        // Clear broken state if refresh fails
        setAppToken(null)
        setUser(null)
        localStorage.removeItem("app_token")
      }
    } catch (error) {
      console.error("Silent refresh failed", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const storedToken = localStorage.getItem("app_token")
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken)
        const isExpired = decoded.exp && decoded.exp * 1000 < Date.now()

        if (!isExpired) {
          handleToken(storedToken)
          setIsLoading(false)
          return
        }
      } catch {
        // Fallthrough to refresh
      }
    }

    // Attempt a silent refresh via HttpOnly cookie
    attemptSilentRefresh()
  }, [attemptSilentRefresh])

  const loginWithCode = async (code: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/google/code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "include", // allow backend to set the HttpOnly cookie
      })

      if (!res.ok) throw new Error("Login failed")

      const data = await res.json()
      handleToken(data.access_token)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (e) {
      console.error("Logout error", e)
    } finally {
      setAppToken(null)
      setUser(null)
      localStorage.removeItem("app_token")
    }
  }

  const value: AuthContextValue = {
    appToken,
    isAuthenticated: !!appToken && !!user,
    isLoading,
    user,
    loginWithCode,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
