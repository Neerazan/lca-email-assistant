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
    <header
      className="flex items-center justify-between px-4 py-2.5 border-b border-white/6 z-20"
      style={{ background: "var(--chat-header-bg)", backdropFilter: "blur(12px)" }}
    >
      {/* Left: Sidebar toggle + Title */}
      <div className="flex items-center gap-2">
        <button
          id="sidebar-toggle"
          onClick={onToggleSidebar}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
          )}
        </button>
        <span className="text-sm font-medium text-slate-300">
          AI Email Assistant
        </span>
      </div>

      {/* Right: User + Sign out */}
      <div className="flex items-center gap-2">
        {user && (
          <>
            <span className="text-xs text-slate-500 hidden sm:inline mr-1">
              {user.email}
            </span>
            {user.picture ? (
              <img
                src={user.picture}
                alt="Avatar"
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                {(user.email?.[0] || "U").toUpperCase()}
              </div>
            )}
          </>
        )}
        <button
          id="sign-out-button"
          onClick={() => signOut()}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-all"
          title="Sign out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
