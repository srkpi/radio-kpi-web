type Props = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: Props) {
  return (
    <div className="flex flex-col gap-2 border-r border-border p-8 last:border-r-0 hover:bg-muted/30 transition-colors">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-4xl font-black tracking-tighter leading-none">
        {value.toLocaleString('uk-UA')}
      </p>
    </div>
  );
}
