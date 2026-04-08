"use client";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  email_draft?: EmailDraft | null;
}

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
}

interface MessageBubbleProps {
  message: Message;
  onApproveDraft?: (draft: EmailDraft) => void;
  onCancelDraft?: () => void;
}

export default function MessageBubble({
  message,
  onApproveDraft,
  onCancelDraft,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`flex gap-3 animate-fade-in ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
      )}

      <div className={`max-w-[80%] sm:max-w-[70%] ${isUser ? "order-first" : ""}`}>
        {/* Message Bubble */}
        <div
          className={`
            rounded-2xl px-4 py-3 text-sm leading-relaxed
            ${
              isUser
                ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-br-md"
                : "glass text-slate-200 rounded-bl-md"
            }
          `}
        >
          {/* Render message content with basic formatting */}
          <div className="whitespace-pre-wrap wrap-break-words">
            {message.content}
          </div>
        </div>

        {/* Email Draft Card (inline) */}
        {message.email_draft && (
          <div className="mt-3 glass-strong rounded-xl p-4 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="text-sm font-semibold text-indigo-300">
                📧 Draft Email Preview
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-slate-500 w-16 shrink-0">To:</span>
                <span className="text-slate-200">{message.email_draft.to}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-500 w-16 shrink-0">Subject:</span>
                <span className="text-slate-200">
                  {message.email_draft.subject}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10">
                <span className="text-slate-500 text-xs block mb-1">Body:</span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {message.email_draft.body}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                id="approve-send-button"
                onClick={() => onApproveDraft?.(message.email_draft!)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                  bg-emerald-600 hover:bg-emerald-500
                  text-white text-sm font-medium
                  transition-all duration-200
                  shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30
                  active:scale-[0.98]"
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Approve &amp; Send
              </button>
              <button
                id="cancel-draft-button"
                onClick={onCancelDraft}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                  bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30
                  text-slate-300 hover:text-rose-300 text-sm font-medium
                  transition-all duration-200
                  active:scale-[0.98]"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <span
          className={`text-[10px] text-slate-500 mt-1 block ${isUser ? "text-right" : "text-left"}`}
        >
          {formatTime(message.created_at)}
        </span>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  );
}
