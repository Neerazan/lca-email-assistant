"use client"

import { useGoogleLogin } from "@react-oauth/google"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
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
      <Image
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        width={20}
        height={20}
      />
      {isLoading ? "Loading..." : "Continue with Google"}
    </button>
  )
}
