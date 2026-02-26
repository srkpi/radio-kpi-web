import { fetchMonitor } from "@/lib/betterUptime";

export const runtime = "edge";

export async function GET() {
  try {
    const monitor = await fetchMonitor();
    const serviceUrl = monitor.data.attributes.url.replace(/\/+$/, "");
    const streamUrl = `${serviceUrl}/stream`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: streamUrl,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
