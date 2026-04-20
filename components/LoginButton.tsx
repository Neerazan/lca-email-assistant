"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useGoogleLogin } from "@react-oauth/google"
import { useRouter } from "next/navigation"

export default function LoginButton() {
  const { loginWithCode, isLoading } = useAuth()
  const router = useRouter()

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await loginWithCode(codeResponse.code)
      router.push("/chat")
    },
    onError: (error) => console.log("Login Failed:", error),
    flow: "auth-code",
    scope: "openid email profile https://www.googleapis.com/auth/gmail.modify",
  })

  return (
    <button
      onClick={() => login()}
      disabled={isLoading}
      className="group relative flex w-full items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-white bg-white/5 border border-white/12 hover:bg-white/10 transition-all overflow-hidden cursor-pointer disabled:opacity-50 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
    >
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10 flex items-center justify-center w-7 h-7 rounded-md bg-white shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
        <svg viewBox="0 0 18 18" className="w-4.5 h-4.5" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.8 2.71v2.25h2.91c1.7-1.57 2.69-3.89 2.69-6.6z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.25c-.81.54-1.85.86-3.05.86-2.35 0-4.33-1.59-5.03-3.72H.96v2.33C2.44 15.96 5.48 18 9 18z" />
          <path fill="#FBBC05" d="M3.97 10.69A5.41 5.41 0 0 1 3.69 9c0-.59.1-1.16.28-1.69V4.98H.96A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.96 4.02l3.01-2.33z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.43 1.33l2.57-2.57C13.46.89 11.43 0 9 0 5.48 0 2.44 2.04.96 4.98l3.01 2.33C4.67 5.17 6.65 3.58 9 3.58z" />
        </svg>
      </span>
      <span className="relative z-10 tracking-[0.01em]">{isLoading ? "Connecting..." : "Continue with Google"}</span>
    </button>
  )
}
