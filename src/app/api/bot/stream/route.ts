import { NextResponse } from 'next/server';
import { fetchMonitor } from '@/lib/betterUptime';

export const runtime = 'edge';
export const revalidate = 30;

export async function GET() {
  try {
    const monitor = await fetchMonitor();
    if (monitor.data.attributes.status !== 'up') {
      return NextResponse.json({ error: 'Radio offline' }, { status: 502 });
    }

    const serviceUrl = monitor.data.attributes.url.replace(/\/+$/, '');
    const streamUrl = `${serviceUrl}/stream`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: streamUrl,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
