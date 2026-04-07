"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type User = {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
};

export type Session = {
  access_token?: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    // Check session with the backend
    const checkSession = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/me`, {
          // ensure cookies are sent with the request
          credentials: "omit", // or "include" if the backend sets cookies across origins
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || data); // gracefully handle { user: {...} } or just user payload
          setSession(data.session || { access_token: data.access_token || "cookie-based" });
        } else {
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error("Failed to check auth session", error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [apiUrl]);

  const signInWithGoogle = useCallback(async () => {
    // Redirect to the FastAPI login endpoint
    window.location.href = `${apiUrl}/auth/login`;
  }, [apiUrl]);

  const signOut = useCallback(async () => {
    try {
      await fetch(`${apiUrl}/auth/logout`, { method: "POST" });
    } catch (e) {
      console.warn("Logout request failed", e);
    }
    setUser(null);
    setSession(null);
  }, [apiUrl]);

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
