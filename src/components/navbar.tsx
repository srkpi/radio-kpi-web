import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between px-10 py-5 border-b border-border bg-background transition-colors">
      <span className="font-display text-xs font-black tracking-[0.22em]">РАДІО КПІ</span>
      <div className="flex items-center gap-3">
        <span className="text-[10px] tracking-widest text-muted-foreground">Статистика</span>
        <ThemeToggle />
      </div>
    </nav>
  );
}
