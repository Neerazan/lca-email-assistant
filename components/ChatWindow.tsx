"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble, { Message, EmailDraft } from "./MessageBubble";
import StreamingMessage from "./StreamingMessage";

interface ChatWindowProps {
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
  onApproveDraft: (draft: EmailDraft, messageId: string) => void;
  onCancelDraft: (messageId: string) => void;
}

export default function ChatWindow({
  messages,
  streamingContent,
  isStreaming,
  onSendMessage,
  onApproveDraft,
  onCancelDraft,
}: ChatWindowProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  // Adjust textarea height automatically
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a]/80 relative sm:rounded-tl-2xl border-t sm:border-l border-white/10 overflow-hidden">
      {/* Decorative Orbs inside chat area */}
      <div className="orb orb-3 -bottom-40 -right-40" />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 z-10 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in max-w-md mx-auto">
             <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 ring-1 ring-indigo-500/20">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Welcome to AI Email Assistant
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              I can help you manage your Gmail inbox. Try asking me to summarize your unread emails, search for specific messages, or draft a reply.
            </p>
            
            <div className="space-y-2 w-full text-left">
              {[
                "Any new emails today?",
                "Summarize my unread emails",
                "Draft an email to John saying I'll be late"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  className="w-full text-sm p-3 rounded-xl glass hover:bg-white/10 text-slate-300 transition-colors flex items-center gap-3 group"
                  onClick={() => onSendMessage(suggestion)}
                >
                  <span className="text-indigo-400 group-hover:text-indigo-300">→</span>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                onApproveDraft={(draft) => onApproveDraft(draft, message.id)}
                onCancelDraft={() => onCancelDraft(message.id)}
              />
            ))}
            
            {isStreaming && (
              <StreamingMessage content={streamingContent} isComplete={false} />
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 pb-6 sm:pb-8 bg-linear-to-t from-[#0a0e1a] to-transparent z-20">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="glass-strong rounded-2xl p-2 pl-4 flex items-end gap-2 shadow-2xl shadow-indigo-500/5 ring-1 ring-white/10 focus-within:ring-indigo-500/50 transition-all duration-300"
          >
            <textarea
              value={inputMessage}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your emails..."
              className="flex-1 max-h-[120px] bg-transparent text-white placeholder-slate-500 border-none focus:ring-0 resize-none py-3 text-sm focus:outline-none"
              style={{ height: '44px' }}
              disabled={isStreaming}
            />
            
            <button
              type="submit"
              disabled={!inputMessage.trim() || isStreaming}
              className={`
                shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                ${inputMessage.trim() && !isStreaming
                  ? "bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg focus:ring-2 focus:ring-indigo-500/50" 
                  : "bg-white/5 text-slate-500 cursor-not-allowed"}
              `}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={inputMessage.trim() && !isStreaming ? "translate-x-px -translate-y-px" : ""}
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
          <div className="text-center mt-2">
             <span className="text-[10px] text-slate-500">Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
