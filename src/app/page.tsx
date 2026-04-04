import { Navbar } from '@/components/navbar';
import { RadioPlayer } from '@/components/radio-player';
import { StatusBadge } from '@/components/status-badge';
import { fetchMonitor } from '@/lib/betterUptime';
import Link from 'next/link';

export const revalidate = 0;

export default async function HomePage() {
  const monitor = await fetchMonitor();
  const status = monitor.data.attributes.status;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-10">
        <section className="min-h-[calc(100vh-65px)] flex flex-col justify-between py-20">
          <div className="flex flex-col gap-10">
            <StatusBadge status={status} />
            <h1 className="font-display text-[clamp(4rem,12vw,10rem)] font-black tracking-tighter leading-[0.9]">
              Радіо
              <br />
              КПІ
            </h1>
            <p className="text-sm text-foreground/60 max-w-sm leading-relaxed">
              Студентське радіо Київського політехнічного інституту. Замовляй музику через бота в
              Telegram.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-8">
            <RadioPlayer />
            <Link
              href="/stats"
              className="text-xs font-semibold tracking-widest uppercase text-foreground/60 hover:text-foreground transition-colors"
            >
              Статистика →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
