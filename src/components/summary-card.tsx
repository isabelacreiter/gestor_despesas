type SummaryCardTone = "amber" | "clay" | "forest";

interface ToneConfig {
  bg: string;
  bar: string;
  eyebrow: string;
  symbol: string;
}

const toneStyles: Record<SummaryCardTone, ToneConfig> = {
  forest: {
    bg: "bg-gradient-to-br from-[rgba(240,252,248,0.95)] to-[rgba(220,248,238,0.7)]",
    bar: "bg-[var(--accent-forest)]",
    eyebrow: "text-[var(--accent-forest)]",
    symbol: "↑",
  },
  amber: {
    bg: "bg-gradient-to-br from-[rgba(255,247,237,0.95)] to-[rgba(255,235,200,0.7)]",
    bar: "bg-[var(--accent-amber)]",
    eyebrow: "text-[var(--accent-amber)]",
    symbol: "↓",
  },
  clay: {
    bg: "bg-gradient-to-br from-[rgba(255,244,243,0.95)] to-[rgba(255,228,226,0.7)]",
    bar: "bg-[var(--accent-clay)]",
    eyebrow: "text-[var(--accent-clay)]",
    symbol: "Σ",
  },
};

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  tone: SummaryCardTone;
}

export function SummaryCard({
  description,
  tone,
  title,
  value,
}: SummaryCardProps) {
  const s = toneStyles[tone];
  return (
    <article className={`relative overflow-hidden ${s.bg} px-6 py-5`}>
      {/* Decorative background symbol */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -right-1 -top-2 select-none font-mono text-[5.5rem] font-black leading-none opacity-[0.055] ${s.eyebrow}`}
      >
        {s.symbol}
      </span>

      <div className="relative">
        <div className={`h-[3px] w-10 rounded-full ${s.bar}`} />
        <p
          className={`mt-3 font-mono text-[9px] font-bold tracking-[0.26em] uppercase ${s.eyebrow}`}
        >
          {title}
        </p>
        <p className="mt-1.5 font-mono text-[1.65rem] font-bold tabular-nums leading-none text-[var(--foreground)]">
          {value}
        </p>
        <p className="mt-3 text-[11px] leading-[1.65] text-[var(--muted)]">
          {description}
        </p>
      </div>
    </article>
  );
}
