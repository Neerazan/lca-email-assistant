"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    // Matches MessageBubble assistant wrapper exactly — no avatar, no label
    <div className="px-4 sm:px-6 py-2 animate-fade-in">
      <div className="max-w-3xl mx-auto">

        {/* Tool-calling pill — shown only when a tool is running and no content yet */}
        {tool && !content && (
          <div className="flex items-center gap-2 mb-3 text-sm text-indigo-400 bg-indigo-500/10 w-fit px-3 py-1.5 rounded-full border border-indigo-500/20">
            <svg
              className="animate-spin h-3.5 w-3.5 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Calling {tool}...
          </div>
        )}

        {/* Dot-pulse shown when nothing has arrived yet */}
        {!content && !tool && (
          <div className="dot-pulse flex gap-1.5 mt-1">
            <span /><span /><span />
          </div>
        )}

        {/* Content — identical markdown rendering to MessageBubble */}
        {content && (
          <div className="text-sm text-slate-200 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children, ...props }) => (
                  <div className="mb-2.5 last:mb-0" {...props}>{children}</div>
                ),
                a: ({ children, ...props }) => (
                  <a className="text-indigo-300 hover:text-indigo-100 underline break-all" {...props}>{children}</a>
                ),
                strong: ({ children, ...props }) => (
                  <strong className="font-semibold text-white" {...props}>{children}</strong>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="my-2 space-y-0.5" {...props}>{children}</ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="my-2 space-y-0.5 list-decimal ml-5" {...props}>{children}</ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="ml-5 list-disc marker:text-slate-500" {...props}>{children}</li>
                ),
                h1: ({ children, ...props }) => (
                  <h1 className="text-lg font-semibold text-white mt-4 mb-2" {...props}>{children}</h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className="text-base font-semibold text-white mt-3 mb-1.5" {...props}>{children}</h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className="text-sm font-semibold text-white mt-2.5 mb-1" {...props}>{children}</h3>
                ),
                hr: () => <hr className="my-3 border-white/10" />,
                code: (props: any) => {
                  const { inline, children, ...rest } = props;
                  return inline ? (
                    <code className="rounded bg-white/10 px-1 py-0.5 text-slate-100 text-[12px]" {...rest}>
                      {children}
                    </code>
                  ) : (
                    <pre className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-[#0f172a] p-3 text-sm">
                      <code className="whitespace-pre-wrap wrap-break-words" {...rest}>{children}</code>
                    </pre>
                  );
                },
                blockquote: ({ children, ...props }) => (
                  <blockquote className="pl-4 border-l-2 border-slate-700 text-slate-300 italic my-3" {...props}>{children}</blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>

            {/* Blinking cursor at the end while streaming */}
            {!isComplete && <span className="typing-cursor" />}
          </div>
        )}

      </div>
    </div>
  );
}
