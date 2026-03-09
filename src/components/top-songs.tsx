import { ComputedStats } from '@/lib/types';

type Props = {
  songs: ComputedStats['topSongs'];
};

export function TopSongs({ songs }: Props) {
  const max = songs[0]?.count ?? 1;
  return (
    <ol className="flex flex-col">
      {songs.map((song, i) => (
        <li key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-b-0">
          <span className="text-[9px] text-muted-foreground w-4 shrink-0 font-mono">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <span className="text-[11px] font-semibold truncate">{song.name}</span>
            <div className="h-px bg-border">
              <div
                className="h-full bg-foreground transition-all duration-1000"
                style={{ width: `${Math.round((song.count / max) * 100)}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0 font-mono">{song.count}</span>
        </li>
      ))}
    </ol>
  );
}
