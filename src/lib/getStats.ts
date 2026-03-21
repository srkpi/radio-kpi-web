import { fetchMonitor } from '@/lib/betterUptime';
import { processStats } from '@/lib/processStats';
import { ComputedStats, RawStats } from '@/lib/types';

export async function getStats(): Promise<ComputedStats> {
  const monitor = await fetchMonitor();
  const serviceUrl = monitor.data.attributes.url.replace(/\/+$/, '');

  const response = await fetch(`${serviceUrl}/statistics`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Service responded with ${response.status} ${response.statusText}`);
  }

  const raw: RawStats = await response.json();
  return processStats(raw);
}
