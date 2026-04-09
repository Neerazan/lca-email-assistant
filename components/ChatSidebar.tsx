"use client";

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
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
        w-64 flex flex-col
        border-r border-white/6
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full sm:-translate-x-full"}
      `}
      style={{ background: "var(--chat-sidebar-bg)" }}
    >
      {/* New Chat Button */}
      <div className="p-3">
        <button
          id="new-chat-button"
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg
            border border-white/10 bg-white/3 hover:bg-white/6
            text-slate-300 text-sm font-medium
            transition-colors active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          New chat
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {sessions.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-xs text-slate-600">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm
                  transition-colors group truncate
                  ${
                    activeSessionId === session.id
                      ? "bg-white/8 text-white"
                      : "text-slate-400 hover:bg-white/4 hover:text-slate-300"
                  }
                `}
              >
                <span className="truncate block">{session.title || "New conversation"}</span>
                <span className="text-[10px] text-slate-600 block mt-0.5">
                  {formatDate(session.created_at)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
