import { NextResponse } from "next/server";
import { fetchMonitor } from "@/lib/betterUptime";

export const runtime = "edge";

export async function GET() {
  try {
    const monitor = await fetchMonitor();
    const serviceUrl = monitor.data.attributes.url.replace(/\/+$/, "");
    const response = await fetch(`${serviceUrl}/statistics`);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Service responded with ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
