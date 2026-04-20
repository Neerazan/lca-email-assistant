"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function ChatHeader({
  onToggleSidebar,
  sidebarOpen: _sidebarOpen,
}: ChatHeaderProps) {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-4 py-2.5 border-b border-white/6 z-20"
      style={{ background: "var(--chat-header-bg)", backdropFilter: "blur(12px)" }}
    >
      {/* Left: Sidebar toggle + Title */}
      <div className="flex items-center gap-2">
        <button
          id="sidebar-toggle"
          type="button"
          onClick={onToggleSidebar}
          className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          aria-label="Toggle sidebar"
        >
          <span className="-translate-x-[1px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </span>
        </button>
        <span className="text-sm font-medium text-slate-300">
          AI Email Assistant
        </span>
      </div>

      {/* Right: User Dropdown */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        {user && (
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="cursor-pointer flex items-center gap-2 group pl-2 sm:pl-5 pr-2 sm:pr-4 py-1.5 rounded-full hover:bg-white/5 transition-colors border border-white/10 max-w-[180px] sm:max-w-none"
          >
            <span className="hidden sm:block text-sm text-slate-300 font-medium truncate">
              {user.name || user.email?.split('@')[0] || 'User'}
            </span>
            {user.picture ? (
              <img
                src={user.picture}
                alt="Avatar"
                className="w-6 h-6 rounded-full border border-white/20 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white border border-white/20">
                {(user.email?.[0] || "U").toUpperCase()}
              </div>
            )}
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
              className="text-slate-400 group-hover:text-white transition-colors"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        )}

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#0d0d15] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
            <div className="px-3 py-2 border-b border-white/5 mb-1 sm:hidden">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">User</p>
              <p className="text-xs text-slate-300 truncate">{user?.email}</p>
            </div>

            <Link
              href="/settings"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Settings
            </Link>

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                signOut();
              }}
              className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5 mt-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
