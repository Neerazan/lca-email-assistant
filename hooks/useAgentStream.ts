import { clientFetchAPI } from "@/lib/api";
import { useCallback, useEffect, useRef, useState } from "react";

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

interface StreamTokenPayload {
  type: "token";
  token: string;
}

interface StreamToolPayload {
  type: "tool_call";
  tool: string;
}

interface StreamInterruptPayload {
  type: "interrupt";
  value: InterruptValue;
}

interface StreamDonePayload {
  type: "done";
}

type StreamPayload =
  | StreamTokenPayload
  | StreamToolPayload
  | StreamInterruptPayload
  | StreamDonePayload
  | { type: string; [key: string]: unknown };

interface SessionMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  [key: string]: unknown;
}

export function useAgentStream(threadId: string, appToken: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [interrupt, setInterrupt] = useState<InterruptValue | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const assistantBufferRef = useRef("");
  const skipFetchRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const consumeStream = useCallback(async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stream request failed: ${response.status} ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Unable to read stream response body");
    }

    const decoder = new TextDecoder();
    setIsStreaming(true);
    setActiveTool(null);

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
        streamBuffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const dataStr = line.slice(6).trim();
          if (!dataStr || dataStr === "[DONE]") continue;

          try {
            const payload = JSON.parse(dataStr) as StreamPayload;

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
            } else if (payload.type === "tool_call" && typeof (payload as StreamToolPayload).tool === "string") {
              setActiveTool((payload as StreamToolPayload).tool);
            } else if (payload.type === "interrupt" && typeof (payload as StreamInterruptPayload).value === "object") {
              setInterrupt((payload as StreamInterruptPayload).value);
            } else if (payload.type === "done") {
              setActiveTool(null);
            }
          } catch (error) {
            console.error("Error parsing SSE data:", dataStr, error);
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Stream aborted by user");
      } else {
        console.error("Stream consumption error:", error);
      }
    } finally {
      setIsStreaming(false);
      setActiveTool(null);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!threadId || !appToken) return;
    if (threadId.startsWith("thread-")) return;

    if (skipFetchRef.current === threadId) {
      skipFetchRef.current = null;
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await clientFetchAPI(`/chat/sessions/${threadId}/messages`, appToken);
        const data = (await response.json()) as SessionMessage[];

        if (!Array.isArray(data)) {
          throw new Error("Invalid messages payload");
        }

        setMessages(
          data.map((msg) => ({
            ...msg,
            id: msg.id || crypto.randomUUID(),
          }))
        );
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    fetchMessages();
  }, [threadId, appToken]);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
      setActiveTool(null);
    }
  }, []);

  const sendMessage = useCallback(
    async (message: string, overrideThreadId?: string) => {
      const targetThreadId = overrideThreadId || threadId;
      if (!targetThreadId) {
        console.error("Cannot send message: No active session (threadId is empty)");
        return;
      }

      if (overrideThreadId && overrideThreadId !== threadId) {
        skipFetchRef.current = overrideThreadId;
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

      // Create new AbortController for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await clientFetchAPI("/chat/stream", appToken, {
          method: "POST",
          body: JSON.stringify({ message, thread_id: targetThreadId }),
          signal: controller.signal,
        });

        await consumeStream(res);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("Request aborted by user");
        } else {
          console.error("Failed to send message:", error);
        }
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [threadId, appToken, consumeStream]
  );

  const resume = useCallback(
    async (decisions: Record<string, unknown>[]) => {
      setInterrupt(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await clientFetchAPI("/chat/resume", appToken, {
          method: "POST",
          body: JSON.stringify({
            thread_id: threadId,
            decisions,
          }),
          signal: controller.signal,
        });

        await consumeStream(res);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("Resume aborted by user");
        } else {
          console.error("Failed to resume:", error);
        }
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [threadId, appToken, consumeStream]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setInterrupt(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { messages, interrupt, isStreaming, activeTool, sendMessage, resume, stop, clearMessages };
}
