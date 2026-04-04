import { MonitorAttributes } from '@/lib/betterUptime';

type Props = {
  status: MonitorAttributes['status'];
};

const STATUS_CONFIG = {
  up: { label: 'Працює', color: 'bg-green-500', text: 'text-green-500' },
  down: { label: 'Не працює', color: 'bg-red-500', text: 'text-red-500' },
  paused: { label: 'На паузі', color: 'bg-yellow-500', text: 'text-yellow-500' },
  pending: { label: 'Очікування', color: 'bg-yellow-500', text: 'text-yellow-500' },
  maintenance: { label: 'Обслуговування', color: 'bg-yellow-500', text: 'text-yellow-500' },
  validating: { label: 'Перевірка', color: 'bg-yellow-500', text: 'text-yellow-500' },
};

export function StatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.paused;

  return (
    <a
      href="https://radio-kpi.betteruptime.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 border border-border px-3 py-1.5 hover:border-foreground/30 transition-colors"
    >
      <span className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
      <span className={`text-xs font-semibold tracking-widest uppercase ${config.text}`}>
        {config.label}
      </span>
    </a>
  );
}
