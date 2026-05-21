import { formatCurrency } from "@/services/formatters";

interface OverviewChartProps {
  income: number;
  expenses: number;
  loading: boolean;
}

export function OverviewChart({
  expenses,
  income,
  loading,
}: OverviewChartProps) {
  const higherValue = Math.max(expenses, income, 1);
  const balance = income - expenses;

  const bars = [
    {
      key: "income",
      label: "Entradas previstas",
      helper: "Entrada usada como referência no painel inicial.",
      value: income,
      fill: "bg-[var(--accent-forest)]",
      glow: "shadow-[0_2px_12px_rgba(31,138,112,0.35)]",
      dot: "bg-[var(--accent-forest)]",
    },
    {
      key: "expenses",
      label: "Gastos acumulados",
      helper: "Despesas salvas no Firestore via saída manual ou upload.",
      value: expenses,
      fill: "bg-[var(--accent-amber)]",
      glow: "shadow-[0_2px_12px_rgba(217,123,44,0.35)]",
      dot: "bg-[var(--accent-amber)]",
    },
  ];

  return (
    <section className="data-panel animate-enter-1">
      {/* Header */}
      <div className="data-panel-header flex items-start justify-between gap-4">
        <div>
          <p className="section-eyebrow">Visão geral</p>
          <h2 className="mt-1.5 text-[1.1rem] font-semibold text-[var(--foreground)]">
            Gastos vs. Entradas
          </h2>
        </div>
        <div className="flex-shrink-0 rounded-xl border border-[var(--border)] bg-white/60 px-4 py-2.5 text-right">
          <p className="font-mono text-[8.5px] tracking-[0.2em] text-[var(--muted)] uppercase">
            Saldo projetado
          </p>
          <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-[var(--foreground)]">
            {loading ? (
              <span className="opacity-40">—</span>
            ) : (
              formatCurrency(balance)
            )}
          </p>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-5 px-6 py-5">
        {bars.map((bar) => {
          const pct = Math.max(
            Math.round((bar.value / higherValue) * 100),
            bar.value === 0 ? 3 : 10,
          );

          return (
            <div key={bar.key}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 flex-shrink-0 rounded-full ${bar.dot}`} />
                  <span className="text-[0.8rem] text-[var(--muted)]">
                    {bar.label}
                  </span>
                </div>
                <span className="font-mono text-[0.8rem] font-medium tabular-nums text-[var(--foreground)]">
                  {loading ? (
                    <span className="opacity-40">···</span>
                  ) : (
                    formatCurrency(bar.value)
                  )}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-[rgba(31,42,34,0.07)]">
                <div
                  className={`animate-bar-rise h-full rounded-full ${bar.fill} ${bar.glow}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <p className="mt-1.5 text-[10.5px] leading-[1.55] text-[var(--muted)]/70">
                {bar.helper}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
