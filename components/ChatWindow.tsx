"use client";

import type { InterruptValue, Message } from "@/hooks/useAgentStream";
import { uploadAttachment, type UploadedAttachment } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import EmailDraftCard from "./EmailDraftCard";
import MessageBubble from "./MessageBubble";
import StreamingMessage from "./StreamingMessage";

interface ChatWindowProps {
  messages: Message[];
  streamingContent: string;
  streamingTool: string | null;
  isStreaming: boolean;
  interrupt: InterruptValue | null;
  onSendMessage: (
    content: string,
    attachments?: {
      attachment_id: string;
      filename?: string;
      mime_type?: string;
    }[]
  ) => void;
  onResume: (decisions: Record<string, unknown>[]) => void;
  onStop: () => void;
  threadId: string;
  appToken: string | null;
}

export default function ChatWindow({
  messages,
  streamingContent,
  streamingTool,
  isStreaming,
  interrupt,
  onSendMessage,
  onResume,
  onStop,
  threadId,
  appToken,
}: ChatWindowProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, streamingContent, interrupt]);

  const handleSubmit = () => {
    if (isStreaming) {
      onStop();
      return;
    }
    if (!inputMessage.trim() || !!interrupt) return;
    onSendMessage(
      inputMessage,
      attachments.map((item) => ({
        attachment_id: item.id,
        filename: item.filename,
        mime_type: item.mime_type,
      }))
    );
    setInputMessage("");
    setAttachments([]);
    setUploadError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleSelectFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !appToken) return;
    setUploadError(null);
    setIsUploading(true);

    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) =>
          uploadAttachment(appToken, file, threadId || undefined)
        )
      );
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload attachment."
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const inputDisabled = isStreaming || !!interrupt;
  const canSend = (inputMessage.trim() && !inputDisabled && !isUploading) || isStreaming;

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--chat-bg)" }}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {messages.length === 0 && !interrupt ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in px-4">
            <div className="max-w-lg">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">How can I help you today?</h2>
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
                    type="button"
                    className="text-left text-sm p-3.5 rounded-xl border border-white/10 bg-white/3 hover:bg-white/6 text-slate-300 transition-colors cursor-pointer"
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
          <div className="pt-6 pb-2">
            {messages
              .filter((msg, idx) => {
                if (isStreaming && idx === messages.length - 1 && msg.role === "assistant") return false;
                return true;
              })
              .map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

            {isStreaming && !interrupt && (
              <StreamingMessage content={streamingContent} tool={streamingTool} isComplete={false} />
            )}

            {interrupt && (
              <EmailDraftCard interrupt={interrupt} onRespond={onResume} />
            )}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* ── Enhanced Input Area ── */}
      <div className="shrink-0 px-4 pb-5 pt-3">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-2xl border transition-all duration-200 shadow-lg"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: inputMessage ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)",
              boxShadow: inputMessage
                ? "0 0 0 3px rgba(99,102,241,0.08), 0 4px 24px rgba(0,0,0,0.3)"
                : "0 4px 24px rgba(0,0,0,0.2)",
            }}
          >
            <textarea
              ref={textareaRef}
              id="chat-input"
              value={inputMessage}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={
                interrupt
                  ? "Waiting for your approval above..."
                  : isStreaming
                    ? "AI is responding..."
                    : "Message AI Email Assistant..."
              }
              rows={1}
              className="w-full resize-none bg-transparent text-sm text-white placeholder-slate-500 px-4 pt-3.5 pb-3 focus:outline-none max-h-40"
              disabled={inputDisabled}
            />
            {attachments.length > 0 && (
              <div className="px-3 pb-1 flex flex-wrap gap-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-200"
                  >
                    <span className="max-w-[180px] truncate">{attachment.filename}</span>
                    <button
                      type="button"
                      className="cursor-pointer text-slate-400 hover:text-white"
                      onClick={() => removeAttachment(attachment.id)}
                      disabled={inputDisabled}
                      title="Remove attachment"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {uploadError && (
              <div className="px-3 pb-1 text-[11px] text-rose-400">{uploadError}</div>
            )}

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-3 py-2.5 border-t border-white/10">
              {/* Left: hint text + attach */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={inputDisabled || isUploading}
                  className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading..." : "Attach"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleSelectFiles}
                />
                <span className="text-[10px] text-slate-600 select-none hidden sm:block">
                  {interrupt ? "Approve or reject above" : isStreaming ? "Click to stop responding" : "Shift+Enter for new line"}
                </span>
              </div>

              {/* Right: send button */}
              <button
                id="send-button"
                type="button"
                onClick={handleSubmit}
                disabled={!canSend}
                className={`
                  cursor-pointer ml-auto flex items-center justify-center rounded-xl transition-all duration-200
                  ${canSend
                    ? "w-8 h-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-500/30 scale-100 hover:scale-105"
                    : "w-8 h-8 bg-white/5 text-slate-600 cursor-not-allowed"
                  }
                  ${isStreaming ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30" : ""}
                `}
              >
                {isStreaming ? (
                  /* Stop / loading ring */
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  /* Up arrow */
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5" />
                    <path d="m5 12 7-7 7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-[10px] text-slate-700 mt-2 select-none">
            AI can make mistakes. Double-check important info.
          </p>
        </div>
      </div>
    </div>
  );
}