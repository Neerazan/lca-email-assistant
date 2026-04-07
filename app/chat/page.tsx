"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { useAuth } from "@/components/AuthProvider";
import ChatHeader from "@/components/ChatHeader";
import ChatSidebar, { ChatSession } from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import { EmailDraft } from "@/components/MessageBubble";
import { createClient } from "@/lib/supabaseClient";

export default function ChatPage() {
  const { user, session: authSession, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isStreaming,
    setMessages,
    append,
  } = useChat({
    api: "/api/chat",
    headers: authSession?.access_token
      ? { Authorization: `Bearer ${authSession.access_token}` }
      : undefined,
    body: {
      session_id: activeSessionId,
    },
    id: activeSessionId || "default",
  });

  // Auth protection
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Load sessions on mount or user change
  useEffect(() => {
    if (!user) return;
    
    // In a real app we'd fetch these from Supabase
    // For now we'll just mock one session if none exist
    const loadSessions = async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setSessions(data);
        if (data.length > 0 && !activeSessionId) {
          setActiveSessionId(data[0].id);
        }
      } else {
        // Mock if table doesn't exist yet
        const mockSession = { 
          id: 'mock-1', 
          title: 'New Conversation', 
          created_at: new Date().toISOString() 
        };
        setSessions([mockSession]);
        setActiveSessionId(mockSession.id);
      }
    };
    
    loadSessions();
  }, [user, supabase]);

  // Close sidebar on mobile when session is selected
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    // In a real app we'd load messages for this session here
    setMessages([]);
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    const newId = `new-${Date.now()}`;
    const newSession = {
      id: newId,
      title: "New Conversation",
      created_at: new Date().toISOString(),
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setMessages([]);
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !authSession || isStreaming) return;
    await append({ role: "user", content });
  };

  const handleApproveDraft = async (draft: EmailDraft, messageId: string) => {
    console.log("Approving draft", draft);
    
    // In a real app, call a backend endpoint to execute the Gmail send

    // Mark the draft as completed so it no longer shows
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              annotations: msg.annotations?.filter(
                (a: any) => a.type !== "email_draft"
              ),
            }
          : msg
      )
    );
    
    // Confirmation
    append({
      role: "assistant",
      content: "✅ Email sent successfully!",
    });
  };

  const handleCancelDraft = (messageId: string) => {
    // Remove draft from the message
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              annotations: msg.annotations?.filter(
                (a: any) => a.type !== "email_draft"
              ),
            }
          : msg
      )
    );
    
    append({
      role: "assistant",
      content: "Email draft canceled.",
    });
  };

  if (loading || !user) {
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
            isStreaming={isStreaming}
            onSendMessage={handleSendMessage}
            onApproveDraft={handleApproveDraft}
            onCancelDraft={handleCancelDraft}
            inputMessage={input}
            onInputChange={handleInputChange}
            onSubmitMessage={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          />
        </main>
      </div>
    </div>
  );
}
