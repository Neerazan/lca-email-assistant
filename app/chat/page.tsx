"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatSidebar, { ChatSession } from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import { useAuth } from "@/contexts/AuthContext";
import { clientFetchAPI } from "@/lib/api";
import { useAgentStream } from "@/hooks/useAgentStream";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export default function ChatPage() {
  const { user, appToken, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Use the active session ID as the thread_id for the agent
  // Memoize so Date.now() doesn't change on every re-render
  const threadId = useMemo(
    () => activeSessionId || `thread-${Date.now()}`,
    [activeSessionId]
  );

  const {
    messages,
    interrupt,
    isStreaming,
    activeTool,
    sendMessage,
    resume,
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
            if (data.length > 0 && !activeSessionId) {
              setActiveSessionId(data[0].id);
            }
          } else {
            throw new Error("Backend returned invalid sessions data format");
          }
        } else {
          throw new Error("Failed to load sessions");
        }
      } catch (error) {
        console.warn("Sessions fetch failed, using mock data", error);
        // Mock if backend doesn't exist yet
        const mockSession = {
          id: `session-${crypto.randomUUID()}`,
          title: 'New Conversation',
          created_at: new Date().toISOString()
        };
        setSessions([mockSession]);
        setActiveSessionId(mockSession.id);
      }
    };

    loadSessions();
  }, [isAuthenticated, appToken, activeSessionId, apiUrl]);

  // Close sidebar on mobile when session is selected
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    clearMessages();
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    const newId = `session-${crypto.randomUUID()}`;
    const newSession = {
      id: newId,
      title: "New Conversation",
      created_at: new Date().toISOString(),
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    clearMessages();
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

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
        isOpen={sidebarOpen}
      />

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
            onSendMessage={sendMessage}
            onResume={resume}
          />
        </main>
      </div>
    </div>
  );
}
