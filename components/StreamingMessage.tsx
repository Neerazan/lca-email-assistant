"use client";

interface StreamingMessageProps {
  content: string;
  tool?: string | null;
  isComplete: boolean;
}

export default function StreamingMessage({
  content,
  tool,
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
            
            {tool && !content && (
              <div className="flex items-center gap-2 mb-2 text-sm text-indigo-400 bg-indigo-500/10 w-fit px-3 py-1.5 rounded-full border border-indigo-500/20">
                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calling {tool}...
              </div>
            )}

            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap wrap-break-words">
              {content}
              {!isComplete && <span className="typing-cursor" />}
            </div>

            {!isComplete && !content && !tool && (
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
