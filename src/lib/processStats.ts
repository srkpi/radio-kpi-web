import { UA_MONTHS, WEEKDAYS } from './constants';
import { ComputedStats, RawStats } from './types';

export function processStats(raw: RawStats): ComputedStats {
  const { songs, orders } = raw;

  let totalSec = 0;
  const nameCounts = new Map<string, number>();
  const monthMap = new Map<string, { n: number; ts: number }>();
  const hourMap = new Map<number, number>();
  const wdMap = new Map<number, number>();

  for (const o of orders) {
    const sid = o[0];
    if (sid < songs.length) {
      totalSec += songs[sid][1];
      const name = songs[sid][0];
      nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);
    }

    if (o.length > 3) {
      const d = new Date(o[3] * 1000);
      const mkey = `${UA_MONTHS[d.getMonth()]}'${String(d.getFullYear()).slice(2)}`;
      const mts = d.getFullYear() * 100 + d.getMonth();
      const prev = monthMap.get(mkey);
      monthMap.set(mkey, { n: (prev?.n ?? 0) + 1, ts: prev?.ts ?? mts });
      hourMap.set(d.getHours(), (hourMap.get(d.getHours()) ?? 0) + 1);
      wdMap.set(d.getDay(), (wdMap.get(d.getDay()) ?? 0) + 1);
    }
  }

  const timestamps = orders.filter((o) => o.length > 3).map((o) => o[3]);
  const daysActive = Math.round((Math.max(...timestamps) - Math.min(...timestamps)) / 86400);

  return {
    totalOrders: orders.length,
    totalMinutes: Math.round(totalSec / 60),
    daysActive,
    topSongs: [...nameCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count })),
    monthly: [...monthMap.entries()]
      .sort((a, b) => a[1].ts - b[1].ts)
      .map(([month, { n }]) => ({ month, count: n })),
    byHour: Array.from({ length: 24 }, (_, h) => ({
      hour: h % 6 === 0 ? `${h}:00` : '',
      count: hourMap.get(h) ?? 0,
    })),
    byWeekday: [1, 2, 3, 4, 5, 6, 0].map((d) => ({
      day: WEEKDAYS[d === 0 ? 6 : d - 1],
      count: wdMap.get(d) ?? 0,
    })),
  };
}
