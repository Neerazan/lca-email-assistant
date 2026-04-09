"use client";

interface StreamingMessageProps {
  content: string;
  isComplete: boolean;
}

export default function StreamingMessage({
  content,
  isComplete,
}: StreamingMessageProps) {
  return (
    <div className="chat-message-row assistant animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex gap-4">
          {/* AI Avatar */}
          <div className="shrink-0 mt-1">
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
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-slate-400 mb-1.5 block">
              Assistant
            </span>
            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap wrap-break-words">
              {content}
              {!isComplete && <span className="typing-cursor" />}
            </div>

            {!isComplete && !content && (
              <div className="dot-pulse flex gap-1.5 mt-1">
                <span /><span /><span />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
