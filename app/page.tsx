"use client"

import LoginButton from "@/components/LoginButton";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/chat");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-200 flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Animated Orbs Background */}
      <div className="orb orb-1 top-[-12%] left-[-12%] opacity-15" />
      <div className="orb orb-2 bottom-[5%] right-[-10%] opacity-10" />

      <main className="relative z-10 w-full max-w-4xl text-center animate-fade-in">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl px-6 sm:px-10 py-10 sm:py-12 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col items-center space-y-8">

            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                AI Email <span className="text-indigo-400">Assistant</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Read, summarize, structure, and draft replies for your Gmail with a LangGraph-powered AI workflow built for safe human-in-the-loop execution.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-2xl text-left">
              {[
                "Search and summarize inbox threads",
                "Draft polished replies with context",
                "Human-in-the-loop approval before send",
              ].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs sm:text-[13px] text-slate-300">
                  {item}
                </div>
              ))}
            </div>

            <div className="pt-4 w-full max-w-sm">
              <LoginButton />

              <p className="mt-4 text-xs text-slate-500">
                For demonstration only. Requires Gmail read/send permissions.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with legal links */}
      <footer className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-4 text-xs text-slate-600">
        <Link href="/terms" className="hover:text-slate-400 transition-colors">
          Terms of Service
        </Link>
        <span>·</span>
        <Link href="/privacy" className="hover:text-slate-400 transition-colors">
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
