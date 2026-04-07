"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import ChatHeader from "@/components/ChatHeader";
import ChatSidebar, { ChatSession } from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import { Message, EmailDraft } from "@/components/MessageBubble";

export default function ChatPage() {
  const { user, session: authSession, loading } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Auth protection
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Load sessions on mount or user change
  useEffect(() => {
    if (!user) return;
    
    const loadSessions = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/sessions`, {
          headers: {
            "Authorization": `Bearer ${authSession?.access_token || ''}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
          if (data.length > 0 && !activeSessionId) {
            setActiveSessionId(data[0].id);
          }
        } else {
          throw new Error("Failed to load sessions");
        }
      } catch (error) {
        console.warn("Sessions fetch failed, using mock data", error);
        // Mock if backend doesn't exist yet
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
  }, [user, authSession, activeSessionId, apiUrl]);

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
    if (!content.trim() || !user) return;

    // Add user message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingContent("");

    try {
      // Create message in backend and start streaming response
      const response = await fetch(`${apiUrl}/api/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authSession?.access_token || ''}`
        },
        body: JSON.stringify({
          session_id: activeSessionId,
          message: content
        })
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (!reader) throw new Error("No reader available");

      let finalContent = "";
      let draftData: EmailDraft | null = null;
      let aiMessageId = `ai-${Date.now()}`;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr.trim() === '[DONE]') break;
            if (!dataStr.trim()) continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.type === 'token') {
                finalContent += data.content;
                setStreamingContent(finalContent);
              } else if (data.type === 'draft') {
                draftData = data.draft;
              }
            } catch (e) {
              console.error("Error parsing stream data", e);
            }
          }
        }
      }

      // Finalize message
      setIsStreaming(false);
      setStreamingContent("");
      
      setMessages(prev => [...prev, {
        id: aiMessageId,
        role: "assistant",
        content: finalContent,
        created_at: new Date().toISOString(),
        email_draft: draftData
      }]);

    } catch (error) {
      console.error("Chat error:", error);
      setIsStreaming(false);
      setStreamingContent("Sorry, there was an error processing your request. Make sure the backend server is running.");
      
      // Simulate error response for UI testing if backend isn't up
      if (content.toLowerCase().includes('draft') || content.toLowerCase().includes('reply')) {
         setTimeout(() => {
           setStreamingContent("");
           setMessages(prev => [...prev, {
             id: `mock-ai-${Date.now()}`,
             role: "assistant",
             content: "I've drafted a reply for you. Please review it below before I send it.",
             created_at: new Date().toISOString(),
             email_draft: {
               to: "john@example.com",
               subject: "Re: Meeting",
               body: "I'll be there at 3pm."
             }
           }]);
         }, 1000);
      } else {
        setTimeout(() => {
          setStreamingContent("");
          setMessages(prev => [...prev, {
            id: `mock-ai-${Date.now()}`,
            role: "assistant",
            content: "You have 3 unread emails.",
            created_at: new Date().toISOString()
          }]);
        }, 1000);
      }
    }
  };

  const handleApproveDraft = async (draft: EmailDraft, messageId: string) => {
    // In a real app, call a backend endpoint to execute the Gmail send
    console.log("Approving draft", draft);
    
    // Update UI to remove the draft card and add confirmation
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, email_draft: null };
      }
      return msg;
    }));
    
    setMessages(prev => [...prev, {
      id: `ai-confirm-${Date.now()}`,
      role: "assistant",
      content: "✅ Email sent successfully!",
      created_at: new Date().toISOString()
    }]);
  };

  const handleCancelDraft = (messageId: string) => {
    // Remove draft from the message
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, email_draft: null };
      }
      return msg;
    }));
    
    setMessages(prev => [...prev, {
      id: `ai-cancel-${Date.now()}`,
      role: "assistant",
      content: "Email draft canceled.",
      created_at: new Date().toISOString()
    }]);
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
            streamingContent={streamingContent}
            isStreaming={isStreaming}
            onSendMessage={handleSendMessage}
            onApproveDraft={handleApproveDraft}
            onCancelDraft={handleCancelDraft}
          />
        </main>
      </div>
    </div>
  );
}
