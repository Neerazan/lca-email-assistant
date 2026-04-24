"use client"

import LoginButton from "@/components/LoginButton";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
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
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/2 backdrop-blur-xl px-6 sm:px-10 py-10 sm:py-12 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col items-center space-y-8">

            <div className="w-full rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90 text-center shadow-lg shadow-amber-500/5">
              This application is currently pending verification from Google, which temporarily restricts new logins. If you would like to test the app, please{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=nirajandhakal634@gmail.com&su=Access%20Request%20for%20AI%20Email%20Assistant&body=Hi%20Nirajan,%0A%0AI%20would%20like%20to%20test%20the%20AI%20Email%20Assistant%20app.%20Please%20grant%20me%20access.%0A%0AThanks!"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
              >
                contact the developer
              </a>.
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shadow-lg shadow-indigo-500/10 mb-1 overflow-hidden border border-white/10">
              <Image
                src="/icon.png"
                alt="AI Email Assistant Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
                priority
              />
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
                <div key={item} className="rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-xs sm:text-[13px] text-slate-300">
                  {item}
                </div>
              ))}
            </div>

            <div className="pt-4 w-full max-w-sm">
              <LoginButton />
{/* 
              <p className="mt-4 text-xs text-slate-500">
                For demonstration only. Requires Gmail read/send permissions.
              </p> */}
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
