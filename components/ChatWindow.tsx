"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble, { Message, EmailDraft } from "./MessageBubble";
import StreamingMessage from "./StreamingMessage";

interface ChatWindowProps {
  messages: Message[];
  streamingContent: string;
  streamingTool: string | null;
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
  onApproveDraft: (draft: EmailDraft, messageId: string) => void;
  onCancelDraft: (messageId: string) => void;
}

export default function ChatWindow({
  messages,
  streamingContent,
  streamingTool,
  isStreaming,
  onSendMessage,
  onApproveDraft,
  onCancelDraft,
}: ChatWindowProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isStreaming) return;

    onSendMessage(inputMessage);
    setInputMessage("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--chat-bg)" }}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in px-4">
            <div className="max-w-lg">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                How can I help you today?
              </h2>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                I can read, summarize, and draft replies to your emails.
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { icon: "📬", text: "Any new emails today?" },
                  { icon: "📋", text: "Summarize my unread emails" },
                  { icon: "🔍", text: "Find emails from my manager" },
                  { icon: "✍️", text: "Draft a reply to the latest email" },
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    id={`suggestion-${i}`}
                    className="text-left text-sm p-3.5 rounded-xl border border-white/10 bg-white/3 hover:bg-white/6 text-slate-300 transition-colors group"
                    onClick={() => onSendMessage(suggestion.text)}
                  >
                    <span className="mr-2">{suggestion.icon}</span>
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onApproveDraft={(draft) => onApproveDraft(draft, message.id)}
                onCancelDraft={() => onCancelDraft(message.id)}
              />
            ))}

            {isStreaming && (
              <StreamingMessage content={streamingContent} tool={streamingTool} isComplete={false} />
            )}
            <div ref={messagesEndRef} className="h-8" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="relative rounded-2xl border border-white/10 bg-(--chat-input-bg) focus-within:border-indigo-500/50 transition-colors shadow-lg"
          >
            <textarea
              ref={textareaRef}
              id="chat-input"
              value={inputMessage}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message AI Email Assistant..."
              rows={1}
              className="w-full resize-none bg-transparent text-sm text-white placeholder-slate-500 px-4 pt-3.5 pb-12 focus:outline-none max-h-40"
              disabled={isStreaming}
            />

            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <span className="text-[10px] text-slate-600 mr-1 hidden sm:inline">
                Shift+Enter for new line
              </span>
              <button
                id="send-button"
                type="submit"
                disabled={!inputMessage.trim() || isStreaming}
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                  ${inputMessage.trim() && !isStreaming
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-white/5 text-slate-600 cursor-not-allowed"}
                `}
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
                  <path d="M12 19V5" />
                  <path d="m5 12 7-7 7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
