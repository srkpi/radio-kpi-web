'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ComputedStats } from '@/lib/types';

type TooltipProps = {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
};

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border px-3 py-2 flex flex-col gap-0.5">
      <span className="text-[9px] tracking-widest text-muted-foreground">{label}</span>
      <span className="font-display text-sm font-black">
        {payload[0].value.toLocaleString('uk-UA')}
      </span>
    </div>
  );
}

type Props = {
  data: ComputedStats;
};

export function MonthlyChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data.monthly} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 9, fontFamily: 'monospace' }}
          tickFormatter={(v, i) => (i % 2 === 0 ? v : '')}
          axisLine={false}
          tickLine={false}
          className="fill-muted-foreground"
        />
        <YAxis
          tick={{ fontSize: 9, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          className="fill-muted-foreground"
        />
        <Tooltip content={<ChartTooltip />} cursor={{ strokeDasharray: '4 4' }} />
        <Area
          type="monotone"
          dataKey="count"
          strokeWidth={2}
          fill="url(#areaGrad)"
          dot={false}
          activeDot={{ r: 4 }}
          className="stroke-foreground fill-foreground"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function HourlyChart({ data }: Props) {
  const maxCount = Math.max(...data.byHour.map((h) => h.count));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data.byHour} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 9, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          className="fill-muted-foreground"
        />
        <YAxis
          tick={{ fontSize: 9, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          className="fill-muted-foreground"
        />
        <Tooltip content={<ChartTooltip />} cursor={false} />
        <Bar dataKey="count" radius={[2, 2, 0, 0]}>
          {data.byHour.map((entry, i) => (
            <Cell
              key={i}
              className="fill-foreground"
              fillOpacity={0.15 + (entry.count / maxCount) * 0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function WeekdayChart({ data }: Props) {
  const maxCount = Math.max(...data.byWeekday.map((d) => d.count));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={data.byWeekday}
        margin={{ top: 16, right: 4, left: -30, bottom: 0 }}
        barCategoryGap="20%"
      >
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          className="fill-muted-foreground"
        />
        <YAxis
          tick={{ fontSize: 9, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          className="fill-muted-foreground"
        />
        <Tooltip content={<ChartTooltip />} cursor={false} />
        <Bar
          dataKey="count"
          radius={[2, 2, 0, 0]}
          label={{
            position: 'top',
            fontSize: 9,
            fontFamily: 'monospace',
            className: 'fill-muted-foreground',
          }}
        >
          {data.byWeekday.map((entry, i) => (
            <Cell
              key={i}
              className="fill-foreground"
              fillOpacity={0.15 + (entry.count / maxCount) * 0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
