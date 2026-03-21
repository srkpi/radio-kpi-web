type Props = {
  label: string
  value: number
}

export function StatCard({ label, value }: Props) {
  return (
    <div className="flex flex-col gap-2 border-r border-border p-8 last:border-r-0 hover:bg-foreground/5 transition-colors">
      <p className="text-xs font-semibold tracking-widest uppercase text-foreground/60">
        {label}
      </p>
      <p className="font-display text-4xl font-black tracking-tighter leading-none">
        {value.toLocaleString('uk-UA')}
      </p>
    </div>
  )
}