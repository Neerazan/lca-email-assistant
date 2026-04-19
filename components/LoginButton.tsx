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
      className="group relative flex w-full items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all overflow-hidden cursor-pointer disabled:opacity-50"
    >
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
        <svg viewBox="0 0 46 46" className="w-5 h-5" aria-hidden="true">
          <path fill="#4285F4" d="M23 9.5c3.45 0 6.17 1.19 8.03 2.94l5.9-5.9C33.86 3.28 28.57 1 23 1 14.7 1 7.57 5.94 4.08 13.84l6.85 5.31C12.86 13.36 17.5 9.5 23 9.5z" />
          <path fill="#34A853" d="M9.93 22.57c-.43-1.28-.68-2.65-.68-4.07s.25-2.79.68-4.07L3.08 9.12C1.12 12.96 0 17.35 0 22s1.12 9.04 3.08 12.88l6.85-5.31z" />
          <path fill="#FBBC05" d="M23 42.5c5.57 0 10.86-1.19 14.96-3.27l-6.85-5.31c-2.16 1.43-4.92 2.27-8.11 2.27-5.5 0-10.14-3.86-11.79-9.45l-6.85 5.31C7.57 40.06 14.7 45 23 45z" />
          <path fill="#EA4335" d="M46 22c0-1.44-.14-2.84-.39-4.19H23v8.01h12.5c-.54 2.87-2.13 5.29-4.55 6.92l7.17 5.56C43.78 35.25 46 29.99 46 22z" />
        </svg>
      </span>
      <span className="relative z-10">{isLoading ? "Loading..." : "Continue with Google"}</span>
    </button>
  )
}
