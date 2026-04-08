"use client";
import { useAuth } from "@/contexts/AuthContext";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function ChatHeader({
  onToggleSidebar,
  sidebarOpen,
}: ChatHeaderProps) {
  const { user, signOut } = useAuth();


  return (
    <header className="glass-strong flex items-center justify-between px-4 py-3 sm:px-6 border-b border-white/10 z-20">
      {/* Left: Sidebar toggle + Logo */}
      <div className="flex items-center gap-3">
        <button
          id="sidebar-toggle"
          onClick={onToggleSidebar}
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {sidebarOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
          <span className="font-semibold text-base hidden sm:block">
            AI Email Assistant
          </span>
        </div>
      </div>

      {/* Right: User info + Sign out */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-sm font-medium text-slate-200 leading-tight">
                {user.name || user.email?.split("@")[0]}
              </span>
              <span className="text-xs text-slate-400 leading-tight">
                {user.email}
              </span>
            </div>
            {user.image ? (
              <img
                src={user.image}
                alt="Avatar"
                className="w-8 h-8 rounded-full ring-2 ring-indigo-500/50"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold">
                {(user.email?.[0] || "U").toUpperCase()}
              </div>
            )}
          </>
        )}
        <button
          id="sign-out-button"
          onClick={() => signOut()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Sign out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
