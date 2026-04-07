"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/chat");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-200 overflow-hidden relative">
      {/* Animated Orbs Background */}
      <div className="orb orb-1 top-[-10%] left-[-10%]" />
      <div className="orb orb-2 bottom-[10%] right-[-5%]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <header className="pt-8 pb-16 flex justify-between items-center animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
            <span className="font-bold tracking-tight text-xl text-white">
              AI Email <span className="text-indigo-400">Assistant</span>
            </span>
          </div>
          <div>
            <button
              onClick={signInWithGoogle}
              className="px-5 py-2.5 text-sm font-medium rounded-lg glass hover:bg-white/10 transition-colors"
            >
              Sign In
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center py-10 lg:py-20 animate-fade-in">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400"></span>
              Human-in-the-loop AI
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Manage your <br />
              <span className="gradient-text pb-2">Gmail inbox</span> <br />
              conversations.
            </h1>

            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Stop drowning in emails. Read, summarize, search, and reply to
              your messages through a natural language chat interface. You always
              stay in control.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={signInWithGoogle}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
                Continue with Google
              </button>
            </div>
            
            <p className="text-xs text-slate-500">
              By signing in, you grant read and send access to your Gmail account.
              <br className="hidden sm:block" />
              Emails are never sent without your explicit approval.
            </p>
          </div>

          {/* Hero Visual */}
          <div className="relative animate-float lg:ml-auto w-full max-w-lg mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl blur-lg opacity-30 animate-pulse-glow" />
            
            <div className="relative glass-strong rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Fake Window Header */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 bg-black/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
              </div>
              
              {/* Fake Chat Content */}
              <div className="p-4 space-y-4">
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                    Summarize my unread emails from John
                  </div>
                </div>
                
                <div className="flex justify-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex-shrink-0" />
                  <div className="glass text-slate-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] space-y-2">
                    <p>You have 2 unread emails from John:</p>
                    <ul className="list-disc pl-4 text-slate-300">
                      <li><strong>Project Update</strong>: The deadline is moved to Friday.</li>
                      <li><strong>Lunch?</strong>: Asking if you're free at 12pm tomorrow.</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                    Reply to the lunch one: "Sure, let's do 12:30 instead"
                  </div>
                </div>
                
                <div className="flex justify-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex-shrink-0" />
                  <div className="glass text-slate-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm w-full">
                    <div className="border border-indigo-500/30 rounded-lg p-3 bg-black/20">
                      <div className="text-xs text-indigo-400 font-medium mb-2">Draft Preview</div>
                      <div className="space-y-1 mb-3">
                        <div className="text-slate-400">To: john@example.com</div>
                        <div className="text-slate-200">Sure, let's do 12:30 instead. See you then!</div>
                      </div>
                      <button className="w-full bg-emerald-600 text-white py-1.5 rounded-md text-xs font-semibold">
                        Approve & Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
