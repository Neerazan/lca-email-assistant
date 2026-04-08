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
    <div className="flex gap-3 justify-start animate-fade-in">
      {/* AI Avatar */}
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

      <div className="max-w-[80%] sm:max-w-[70%]">
        <div className="glass rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-slate-200">
          <div className="whitespace-pre-wrap wrap-break-words">
            {content}
            {!isComplete && (
              <span className="typing-cursor" />
            )}
          </div>
        </div>

        {!isComplete && (
          <div className="flex items-center gap-1.5 mt-1.5 ml-1">
            <div className="flex gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span className="text-[10px] text-slate-500">AI is typing...</span>
          </div>
        )}
      </div>
    </div>
  );
}
