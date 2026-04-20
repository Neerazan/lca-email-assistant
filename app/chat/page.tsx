"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatSidebar, { ChatSession } from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import { useAuth } from "@/contexts/AuthContext";
import { useAgentStream } from "@/hooks/useAgentStream";
import { clientFetchAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ChatPage() {
  const { user, appToken, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 640;
  });
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  // Initialize from URL search param if available
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("session");
    }
    return null;
  });

  // Sync URL when activeSessionId changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (activeSessionId) {
        window.history.replaceState(null, "", `/chat?session=${activeSessionId}`);
      } else {
        window.history.replaceState(null, "", `/chat`);
      }
    }
  }, [activeSessionId]);

  const threadId = activeSessionId || "";

  const {
    messages,
    interrupt,
    isStreaming,
    activeTool,
    sendMessage,
    resume,
    stop,
    clearMessages,
  } = useAgentStream(threadId, appToken);

  // Derive streaming state for ChatWindow
  const streamingContent = useMemo(() => {
    if (!isStreaming) return "";
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant") return lastMsg.content;
    return "";
  }, [isStreaming, messages]);

  // Auth protection — redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 640) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Load sessions on mount or when authenticated
  useEffect(() => {
    if (!isAuthenticated || !appToken) return;

    const loadSessions = async () => {
      try {
        const response = await clientFetchAPI("/chat/sessions", appToken);

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setSessions(data);
            // Do not auto-create or auto-select a session.
            // A new session will be created when the user sends a message.
          } else {
            throw new Error("Backend returned invalid sessions data format");
          }
        } else {
          throw new Error("Failed to load sessions");
        }
      } catch (error) {
        console.warn("Sessions fetch failed", error);
      }
    };

    loadSessions();
  }, [isAuthenticated, appToken, activeSessionId]);

  const handleSelectSession = useCallback(
    (id: string) => {
      setActiveSessionId(id);
      clearMessages();
      if (window.innerWidth < 640) {
        setSidebarOpen(false);
      }
    },
    [clearMessages]
  );

  const handleNewChat = useCallback(() => {
    setActiveSessionId(null);
    clearMessages();
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  }, [clearMessages]);

  const handleSendMessage = useCallback(async (
    message: string,
    attachments?: {
      attachment_id: string;
      filename?: string;
      mime_type?: string;
    }[]
  ) => {
    let targetThreadId = threadId;

    // If there's no active session, create one first
    if (!targetThreadId) {
      try {
        const response = await clientFetchAPI("/chat/sessions", appToken, {
          method: "POST",
        });
        if (response.ok) {
          const newSession = await response.json();
          setSessions((prev) => [newSession, ...prev]);
          setActiveSessionId(newSession.id);
          targetThreadId = newSession.id;
        } else {
          console.error("Failed to create new session");
          return;
        }
      } catch (error) {
        console.error("Error creating session:", error);
        return;
      }
    }

    await sendMessage(message, targetThreadId, attachments);
  }, [threadId, appToken, sendMessage]);

  const handleDeleteSession = useCallback((id: string) => {
    setSessionToDelete(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!sessionToDelete) return;
    const id = sessionToDelete;

    try {
      const response = await clientFetchAPI(`/chat/sessions/${id}`, appToken, {
        method: "DELETE",
      });
      if (response.ok) {
        setSessions((prev) => {
          const remainingSessions = prev.filter((s) => s.id !== id);
          if (activeSessionId === id) {
            if (remainingSessions.length > 0) {
              setActiveSessionId(remainingSessions[0].id);
            } else {
              setActiveSessionId(null);
              clearMessages();
              handleNewChat();
            }
          }
          return remainingSessions;
        });
      } else {
        console.error("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setSessionToDelete(null);
    }
  }, [appToken, activeSessionId, clearMessages, handleNewChat, sessionToDelete]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0e1a] overflow-hidden text-slate-200">
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpen={sidebarOpen}
      />
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="sm:hidden fixed inset-0 z-20 bg-black/40 backdrop-blur-[1px]"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 relative">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            streamingContent={streamingContent}
            streamingTool={activeTool}
            isStreaming={isStreaming}
            interrupt={interrupt}
            onSendMessage={handleSendMessage}
            onResume={resume}
            onStop={stop}
            threadId={threadId}
            appToken={appToken}
          />
        </main>
      </div>


      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e2330] p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-white/10">
            <h3 className="text-xl font-medium text-white mb-4">Delete chat?</h3>
            <p className="text-[15px] text-slate-300 mb-8 leading-relaxed">
              This will delete prompts, responses, and any content you created in this session.
            </p>
            <div className="flex items-center justify-end gap-3 font-medium">
              <button
                onClick={() => setSessionToDelete(null)}
                className="px-5 py-2.5 rounded-full text-sm text-slate-200 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-full text-sm bg-[#2b3142] text-red-400 hover:bg-[#343b4f] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
