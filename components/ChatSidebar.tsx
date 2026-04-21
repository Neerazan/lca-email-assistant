"use client";

import ChatSidebarSkeleton from "./ChatSidebarSkeleton";

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  isLoading: boolean;
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
}

export default function ChatSidebar({
  sessions,
  isLoading,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
}: ChatSidebarProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <aside
      className={`
        fixed sm:relative top-0 left-0 z-30 h-full
        flex flex-col overflow-hidden
        border-r border-white/6
        transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0 w-64 sm:w-64" : "-translate-x-full w-64 sm:translate-x-0 sm:w-0 sm:border-r-0"}
      `}
      style={{ background: "var(--chat-bg)" }}
    >
      {/* Sidebar Header */}
      <div className="px-3 pt-3 pb-2 border-b border-white/6">
        <div className="px-1 mb-2 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
            Conversations
          </span>
          <span className="text-[10px] text-slate-600 rounded-full border border-white/10 px-2 py-0.5">
            {sessions.length}
          </span>
        </div>

        <button
          id="new-chat-button"
          onClick={onNewChat}
          className="cursor-pointer w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
            border border-white/10 bg-white/3 hover:bg-white/8
            text-slate-200 text-sm font-medium
            transition-all active:scale-[0.98]"
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </span>
          New chat
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading && sessions.length === 0 ? (
          <ChatSidebarSkeleton />
        ) : sessions.length === 0 ? (
          <div className="mx-1 mt-3 rounded-xl border border-white/8 bg-white/3 p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">No conversations yet</p>
            <p className="text-[11px] text-slate-600">Start a new chat to begin.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectSession(session.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectSession(session.id);
                  }
                }}
                className={`
                  w-full text-left rounded-xl text-sm
                  transition-all group relative cursor-pointer
                  ${activeSessionId === session.id
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                  }
                `}
              >
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="min-w-0 flex-1 pr-6">
                    <span className="truncate block">{session.title || "New conversation"}</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">
                      {formatDate(session.created_at)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-rose-500/20 hover:text-rose-400 text-slate-500 transition-all cursor-pointer"
                    title="Delete chat"
                    aria-label="Delete chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
                {activeSessionId === session.id && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-indigo-400 rounded-r-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
