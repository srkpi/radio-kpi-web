import { Navbar } from '@/components/navbar';
import { StatCard } from '@/components/stat-card';
import { TopSongs } from '@/components/top-songs';
import { MonthlyChart, HourlyChart, WeekdayChart } from '@/components/charts';
import { StatusBadge } from '@/components/status-badge';
import { getStats } from '@/lib/getStats';
import { fetchMonitor } from '@/lib/betterUptime';

export const revalidate = 0;

export default async function StatsPage() {
  const [data, monitor] = await Promise.all([getStats(), fetchMonitor()]);
  const status = monitor.data.attributes.status;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-10 pb-20">
        <header className="py-16 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/60 tracking-widest">— Статистика</p>
            <StatusBadge status={status} />
          </div>
          <h1 className="font-display text-7xl font-black tracking-tighter leading-[0.95]">
            Вся&nbsp;історія
            <br />
            в&nbsp;цифрах
          </h1>
          <p className="text-sm text-foreground/60 tracking-widest">
            Дані оновлюються кожну годину
          </p>
        </header>

        <div className="border border-border grid grid-cols-3">
          <StatCard label="Пісень зіграно" value={data.totalOrders} />
          <StatCard label="Хвилин музики" value={data.totalMinutes} />
          <StatCard label="Днів у ефірі" value={data.daysActive} />
        </div>

        <div className="grid grid-cols-2 border-x border-b border-border">
          <div className="p-8 border-r border-border">
            <h2 className="text-xs font-bold tracking-widest text-foreground/60 uppercase mb-6">
              Замовлення по місяцях
            </h2>
            <MonthlyChart data={data} />
          </div>
          <div className="p-8">
            <h2 className="text-xs font-bold tracking-widest text-foreground/60 uppercase mb-6">
              Топ 10 пісень
            </h2>
            <TopSongs songs={data.topSongs} />
          </div>
        </div>

        <div className="grid grid-cols-2 border-x border-b border-border">
          <div className="p-8 border-r border-border">
            <h2 className="text-xs font-bold tracking-widest text-foreground/60 uppercase mb-6">
              Активність по годинах
            </h2>
            <HourlyChart data={data} />
          </div>
          <div className="p-8">
            <h2 className="text-xs font-bold tracking-widest text-foreground/60 uppercase mb-6">
              Активність по днях тижня
            </h2>
            <WeekdayChart data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}
