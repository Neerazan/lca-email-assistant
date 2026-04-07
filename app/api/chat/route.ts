import { createDataStreamResponse } from 'ai';

export const maxDuration = 300;

export async function POST(req: Request) {
  const { messages, session_id } = await req.json();
  const lastMessage = messages[messages.length - 1];

  const authHeader = req.headers.get('Authorization');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return createDataStreamResponse({
    execute: async (dataStream) => {
      try {
        const response = await fetch(`${apiUrl}/api/chat/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
          body: JSON.stringify({
            session_id,
            message: lastMessage.content,
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend responded with status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No readable stream from backend.");

        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (dataStr === "[DONE]") break;
              if (!dataStr) continue;

              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.type === "token") {
                  dataStream.writeText(parsed.content);
                } else if (parsed.type === "draft") {
                  dataStream.writeAnnotation({
                    type: "email_draft",
                    draft: parsed.draft,
                  });
                }
              } catch (e) {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      } catch (err) {
        console.error("Stream proxy error:", err);
        dataStream.writeText("\n[Error connecting to the backend server]");
      }
    },
  });
}
