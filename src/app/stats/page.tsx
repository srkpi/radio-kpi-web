"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Cell,
} from "recharts";
import styles from "./stats.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawStats {
  songs: [string, number, string][];
  orders: number[][];
}

interface Computed {
  totalOrders: number;
  totalMinutes: number;
  daysActive: number;
  topSongs: { name: string; count: number }[];
  monthly: { month: string; count: number }[];
  byHour: { hour: string; count: number }[];
  byWeekday: { day: string; count: number }[];
}

// ─── Data processing ──────────────────────────────────────────────────────────

const UA_MONTHS = ["СІЧ","ЛЮТ","БЕР","КВІ","ТРА","ЧЕР","ЛИП","СЕР","ВЕР","ЖОВ","ЛИС","ГРУ"];
const WEEKDAYS = ["ПН","ВТ","СР","ЧТ","ПТ","СБ","НД"];

function process(raw: RawStats): Computed {
  const { songs, orders } = raw;

  let totalSec = 0;
  const nameCounts = new Map<string, number>();
  const monthMap = new Map<string, { n: number; ts: number }>();
  const hourMap = new Map<number, number>();
  const wdMap = new Map<number, number>();

  for (const o of orders) {
    const sid = o[0];
    if (sid < songs.length) totalSec += songs[sid][1];
    const name = sid < songs.length ? songs[sid][0] : null;
    if (name) nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);

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

  const ts = orders.filter(o => o.length > 3).map(o => o[3]);
  const daysActive = Math.round((Math.max(...ts) - Math.min(...ts)) / 86400);

  return {
    totalOrders: orders.length,
    totalMinutes: Math.round(totalSec / 60),
    daysActive,
    topSongs: [...nameCounts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10).map(([name,count])=>({name,count})),
    monthly: [...monthMap.entries()].sort((a,b)=>a[1].ts-b[1].ts).map(([month,{n}])=>({month,count:n})),
    byHour: Array.from({length:24},(_,h)=>({ hour: h%6===0?`${h}:00`:"", count: hourMap.get(h)??0 })),
    byWeekday: [1,2,3,4,5,6,0].map(d=>({ day: WEEKDAYS[d===0?6:d-1], count: wdMap.get(d)??0 })),
  };
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function useCountUp(target: number, delay = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const run = (now: number) => {
        const p = Math.min((now - start) / 1400, 1);
        setV(Math.round((1 - Math.pow(1 - p, 4)) * target));
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return v;
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: {active?:boolean; payload?:{value:number}[]; label?:string}) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{label}</span>
      <span className={styles.tooltipValue}>{payload[0].value.toLocaleString("uk-UA")}</span>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, unit, delay }: { label: string; value: number; unit?: string; delay?: number }) {
  const n = useCountUp(value, delay ?? 0);
  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>
        {n.toLocaleString("uk-UA")}
        {unit && <span className={styles.statUnit}>{unit}</span>}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const [data, setData] = useState<Computed | null>(null);
  const [err, setErr] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    fetch("/api/bot/statistics")
      .then(r => r.json())
      .then((raw: RawStats) => setData(process(raw)))
      .catch(() => setErr(true));
  }, []);

  const fg = dark ? "#f0f0f0" : "#111";
  const fgMuted = dark ? "#555" : "#bbb";
  const barFill = dark ? "#f0f0f0" : "#111";
  const gridColor = dark ? "#1e1e1e" : "#e5e5e5";

  return (
    <div className={styles.root} data-theme={dark ? "dark" : "light"}>
      <div className={styles.grain} aria-hidden />

      {/* Nav */}
      <nav className={styles.nav}>
        <span className={styles.brand}>РАДІО КПІ</span>
        <div className={styles.navRight}>
          <span className={styles.navLabel}>Тема</span>
          <button className={styles.themeToggle} onClick={() => setDark(d => !d)}>
            <span className={styles.toggleTrack} data-on={dark}>
              <span className={styles.toggleThumb} />
            </span>
          </button>
        </div>
      </nav>

      <main className={styles.main}>

        {/* Hero */}
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Вся&nbsp;історія<br/>в&nbsp;цифрах</h1>
          <p className={styles.heroSub}>Дані оновлюються кожну годину</p>
        </section>

        {err && <p className={styles.errMsg}>Не вдалося завантажити статистику</p>}

        {!data && !err && (
          <div className={styles.loader}>
            {[0,1,2].map(i => <span key={i} style={{animationDelay:`${i*0.15}s`}} />)}
          </div>
        )}

        {data && (
          <div className={styles.dashboard}>

            {/* KPI row */}
            <div className={styles.kpiRow}>
              <StatCard label="Пісень зіграно" value={data.totalOrders} delay={0} />
              <StatCard label="Хвилин музики" value={data.totalMinutes} delay={100} />
              <StatCard label="Днів у ефірі" value={data.daysActive} delay={200} />
            </div>

            {/* Monthly + Top songs */}
            <div className={styles.row2}>
              <div className={styles.chartBox}>
                <h2 className={styles.chartTitle}>Замовлення по місяцях</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data.monthly} margin={{top:4,right:4,left:-30,bottom:0}}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={barFill} stopOpacity={0.25}/>
                        <stop offset="100%" stopColor={barFill} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{fill:fgMuted,fontSize:9,fontFamily:"monospace"}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:fgMuted,fontSize:9,fontFamily:"monospace"}} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{stroke:fgMuted,strokeWidth:1,strokeDasharray:"4 4"}} />
                    <Area type="monotone" dataKey="count" stroke={barFill} strokeWidth={2} fill="url(#areaGrad)" dot={false} activeDot={{r:4,fill:barFill}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartBox}>
                <h2 className={styles.chartTitle}>Топ 10 пісень</h2>
                <div className={styles.songList}>
                  {data.topSongs.map((s, i) => (
                    <div key={i} className={styles.songRow}>
                      <span className={styles.songIdx}>{String(i+1).padStart(2,"0")}</span>
                      <div className={styles.songInfo}>
                        <span className={styles.songName}>{s.name}</span>
                        <div className={styles.songBar}>
                          <div
                            className={styles.songBarFill}
                            style={{width:`${Math.round(s.count/data.topSongs[0].count*100)}%`}}
                          />
                        </div>
                      </div>
                      <span className={styles.songCount}>{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hour heatmap + Weekday radar */}
            <div className={styles.row3}>
              <div className={styles.chartBox}>
                <h2 className={styles.chartTitle}>Активність по годинах</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={data.byHour} margin={{top:4,right:4,left:-30,bottom:0}}>
                    <XAxis dataKey="hour" tick={{fill:fgMuted,fontSize:9,fontFamily:"monospace"}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:fgMuted,fontSize:9,fontFamily:"monospace"}} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{fill:gridColor}} />
                    <Bar dataKey="count" radius={[2,2,0,0]}>
                      {data.byHour.map((entry, i) => (
                        <Cell key={i} fill={barFill} fillOpacity={0.2 + (entry.count / Math.max(...data.byHour.map(h=>h.count))) * 0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartBox}>
                <h2 className={styles.chartTitle}>Активність по днях тижня</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={data.byWeekday} margin={{top:8,right:24,left:24,bottom:8}}>
                    <PolarGrid stroke={gridColor} />
                    <PolarAngleAxis dataKey="day" tick={{fill:fgMuted,fontSize:10,fontFamily:"monospace"}} />
                    <Radar dataKey="count" stroke={barFill} fill={barFill} fillOpacity={0.15} strokeWidth={1.5} dot={{r:3,fill:barFill}} />
                    <Tooltip content={<ChartTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}