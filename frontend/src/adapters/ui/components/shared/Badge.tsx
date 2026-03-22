type Variant = 'green' | 'red' | 'blue' | 'yellow' | 'slate';

const variants: Record<Variant, string> = {
  green:  'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  red:    'bg-red-500/15    text-red-400    ring-1 ring-red-500/30',
  blue:   'bg-blue-500/15   text-blue-400   ring-1 ring-blue-500/30',
  yellow: 'bg-amber-500/15  text-amber-400  ring-1 ring-amber-500/30',
  slate:  'bg-slate-500/15  text-slate-400  ring-1 ring-slate-500/30',
};

interface BadgeProps {
  label:   string;
  variant: Variant;
}

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5
                  text-xs font-medium ${variants[variant]}`}
    >
      {label}
    </span>
  );
}