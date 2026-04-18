import { useState, useRef, useCallback, useEffect } from "react";
import { clientFetchAPI } from "@/lib/api";

export interface InterruptValue {
  actionRequests: {
    action: string;
    args: Record<string, unknown>;
    description?: string;
  }[];
  reviewConfigs: {
    actionName: string;
    allowedDecisions: ("approve" | "reject" | "edit")[];
  }[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export function useAgentStream(threadId: string, appToken: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [interrupt, setInterrupt] = useState<InterruptValue | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const assistantBufferRef = useRef("");

  const consumeStream = useCallback(async (response: Response) => {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    setIsStreaming(true);
    setActiveTool(null);

    // Start an empty assistant message
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", id: assistantId, created_at: new Date().toISOString() },
    ]);
    assistantBufferRef.current = "";

    let streamBuffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split("\n");
        // Keep the last incomplete line in the buffer
        streamBuffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const dataStr = line.slice(6).trim();
          if (!dataStr || dataStr === "[DONE]") continue;

          try {
            const payload = JSON.parse(dataStr);

            if (payload.type === "token") {
              assistantBufferRef.current += payload.token;
              const content = assistantBufferRef.current;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id === assistantId) {
                  return [
                    ...prev.slice(0, -1),
                    { ...last, content },
                  ];
                }
                return prev;
              });
            } else if (payload.type === "tool_call") {
              setActiveTool(payload.tool);
            } else if (payload.type === "interrupt") {
              setInterrupt(payload.value);
            } else if (payload.type === "done") {
              setActiveTool(null);
            }
          } catch {
            console.error("Error parsing SSE data:", dataStr);
          }
        }
      }
    } finally {
      setIsStreaming(false);
      setActiveTool(null);
    }
  }, []);

  // Fetch messages from the backend when threadId changes
  useEffect(() => {
    if (!threadId || !appToken) return;
    
    // Don't fetch if it's a completely new locally-generated thread
    if (threadId.startsWith("thread-")) return;

    const fetchMessages = async () => {
      try {
        const response = await clientFetchAPI(`/chat/sessions/${threadId}/messages`, appToken);
        if (response.ok) {
          const data = await response.json();
          // Ensure messages have a unique id for React rendering
          setMessages(data.map((msg: any) => ({
            ...msg,
            id: msg.id || crypto.randomUUID(),
          })));
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    fetchMessages();
  }, [threadId, appToken]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!threadId) {
        console.error("Cannot send message: No active session (threadId is empty)");
        return;
      }
      
      // Add user message immediately
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: message,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        },
      ]);
      setInterrupt(null);

      const res = await clientFetchAPI("/chat/stream", appToken, {
        method: "POST",
        body: JSON.stringify({ message, thread_id: threadId }),
      });

      await consumeStream(res);
    },
    [threadId, appToken, consumeStream]
  );

  const resume = useCallback(
    async (decisions: Record<string, unknown>[]) => {
      setInterrupt(null);

      const res = await clientFetchAPI("/chat/resume", appToken, {
        method: "POST",
        body: JSON.stringify({
          thread_id: threadId,
          decisions,
        }),
      });

      await consumeStream(res);
    },
    [threadId, appToken, consumeStream]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setInterrupt(null);
  }, []);

  return { messages, interrupt, isStreaming, activeTool, sendMessage, resume, clearMessages };
}
