"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface MessageBubbleProps {
  message: Message;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className=" cursor-pointer inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 hover:text-slate-300 transition-all duration-150 mt-1.5 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 focus:opacity-100"
      title="Copy response"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="px-4 sm:px-6 py-1 animate-fade-in">
        <div className="max-w-3xl mx-auto flex justify-end">
          <div className="max-w-[72%] sm:max-w-[55%]">
            {/*
              Bubble tail at TOP-RIGHT: top-left=18px, top-right=4px, bottom-right=18px, bottom-left=18px
              This makes the "notch" at the top-right corner — sender bubble style
            */}
            <div
              className="text-slate-100 text-sm leading-relaxed px-4 py-2.5"
              style={{ background: "#3d4263", borderRadius: "18px 4px 18px 18px" }}
            >
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group px-4 sm:px-6 py-2 animate-fade-in">
      <div className="max-w-3xl mx-auto">
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
                  <code className="rounded bg-white/10 px-1 py-0.5 text-slate-100 text-[12px]" {...rest}>{children}</code>
                ) : (
                  <pre className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-[#0f172a] p-3 text-sm">
                    <code className="whitespace-pre-wrap break-words" {...rest}>{children}</code>
                  </pre>
                );
              },
              blockquote: ({ children, ...props }) => (
                <blockquote className="pl-4 border-l-2 border-slate-700 text-slate-300 italic my-3" {...props}>{children}</blockquote>
              ),
            }}
          >
            {message.content || ""}
          </ReactMarkdown>
        </div>
        <CopyButton text={message.content} />
      </div>
    </div>
  );
}