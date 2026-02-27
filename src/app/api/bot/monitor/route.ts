import { NextResponse } from 'next/server';
import { fetchMonitor } from '@/lib/betterUptime';

export const runtime = 'edge';
export const revalidate = 30;

export async function GET() {
  try {
    const monitor = await fetchMonitor();
    return NextResponse.json(monitor);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
