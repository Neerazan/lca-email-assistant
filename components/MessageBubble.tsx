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

  return (
    <div className={`chat-message-row ${isUser ? "user" : "assistant"} animate-fade-in`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="shrink-0 mt-1">
            {isUser ? (
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-slate-400 mb-1.5 block">
              {isUser ? "You" : "Assistant"}
            </span>
            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap wrap-break-words">
              {message.content}
            </div>

            {/* Email Draft Card */}
            {message.email_draft && (
              <div className="mt-4 rounded-xl bg-white/4 border border-white/10 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-indigo-500/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="text-sm font-semibold text-indigo-300">Draft Email</span>
                </div>

                <div className="p-4 space-y-2 text-sm">
                  <div className="flex gap-3">
                    <span className="text-slate-500 w-14 shrink-0">To</span>
                    <span className="text-slate-200">{message.email_draft.to}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-slate-500 w-14 shrink-0">Subject</span>
                    <span className="text-slate-200">{message.email_draft.subject}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {message.email_draft.body}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 p-4 pt-0">
                  <button
                    id="approve-send-button"
                    onClick={() => onApproveDraft?.(message.email_draft!)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors active:scale-[0.98]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Approve &amp; Send
                  </button>
                  <button
                    id="cancel-draft-button"
                    onClick={onCancelDraft}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-sm font-medium transition-colors active:scale-[0.98]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
