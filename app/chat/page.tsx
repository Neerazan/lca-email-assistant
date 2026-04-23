"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatSidebar, { ChatSession } from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import ChatWindowSkeleton from "@/components/ChatWindowSkeleton";
import ConfirmationModal from "@/components/ConfirmationModal";
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
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);

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
    messagesLoading,
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

  const loadSessions = useCallback(async () => {
    if (!isAuthenticated || !appToken) return;
    try {
      setSessionsLoading(true);
      const response = await clientFetchAPI("/chat/sessions", appToken);
      const data = await response.json();
      if (Array.isArray(data)) {
        setSessions(data);
      } else {
        throw new Error("Backend returned invalid sessions data format");
      }
    } catch (error) {
      console.warn("Sessions fetch failed", error);
    } finally {
      setSessionsLoading(false);
    }
  }, [isAuthenticated, appToken]);

  // Load sessions on mount / auth changes / active session switch
  useEffect(() => {
    loadSessions();
  }, [loadSessions, activeSessionId]);

  // Resizing logic
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth >= 160 && newWidth <= 480) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      // Prevent text selection while resizing
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isResizing, resize, stopResizing]);

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

    // Refresh immediately and once more shortly after to catch lazy title updates.
    await loadSessions();
    window.setTimeout(() => {
      void loadSessions();
    }, 1500);
  }, [threadId, appToken, sendMessage, loadSessions]);

  const handleDeleteSession = useCallback((id: string) => {
    setSessionToDelete(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!sessionToDelete) return;
    const id = sessionToDelete;
    setIsDeleting(true);

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
      setIsDeleting(false);
      setSessionToDelete(null);
    }
  }, [appToken, activeSessionId, clearMessages, handleNewChat, sessionToDelete]);

  if (isLoading || !user) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0a0e1a]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-dvh bg-[#0a0e1a] overflow-hidden text-slate-200">
      <ChatSidebar
        sessions={sessions}
        isLoading={sessionsLoading}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpen={sidebarOpen}
        width={sidebarWidth}
        onResizeStart={startResizing}
        isResizing={isResizing}
        onClose={() => setSidebarOpen(false)}
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
          {messagesLoading && messages.length === 0 ? (
            <ChatWindowSkeleton />
          ) : (
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
          )}
        </main>
      </div>


      <ConfirmationModal
        isOpen={!!sessionToDelete}
        title="Delete chat?"
        description="This will permanently remove this conversation and all its messages. This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setSessionToDelete(null)}
        variant="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
}
