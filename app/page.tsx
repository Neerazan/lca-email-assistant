import LoginButton from "@/components/LoginButton";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Orbs Background */}
      <div className="orb orb-1 top-[-10%] left-[-10%]" />
      <div className="orb orb-2 bottom-[10%] right-[-5%]" />

      <main className="relative z-10 w-full max-w-2xl px-6 text-center animate-fade-in flex flex-col items-center space-y-8">
        
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
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

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          AI Email <span className="text-indigo-400">Assistant</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
          A portfolio demonstration of an AI agent designed to read, summarize, structure, and draft replies to your emails natively using LangGraph.
        </p>

        <div className="pt-8 w-full max-w-sm">
          <LoginButton />
          
          <p className="mt-4 text-xs text-slate-500">
            For demonstration purposes. Requires granting basic read/send access.
          </p>
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
