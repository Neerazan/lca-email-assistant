/**
 * POST /api/chat
 *
 * Proxy route that forwards chat messages to the FastAPI backend
 * and streams the response back to the client using SSE.
 *
 * TODO: Update streaming logic once backend chat endpoint is fully implemented.
 */

export const maxDuration = 300;

export async function POST(req: Request) {
  const { messages, session_id } = await req.json();
  const lastMessage = messages[messages.length - 1];

  const authHeader = req.headers.get('Authorization');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${apiUrl}/chat/stream`, {
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
      return new Response(
        JSON.stringify({ error: `Backend responded with status: ${response.status}` }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the backend response directly to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    console.error("Stream proxy error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to connect to backend" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
