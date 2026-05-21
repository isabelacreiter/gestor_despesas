import type { Expense } from "@/services/expense-types";
import { formatCurrency, formatExpenseDate } from "@/services/formatters";

interface RecentExpensesListProps {
  expenses: Expense[];
  loading: boolean;
  deletingExpenseId: string | null;
  onDeleteExpense: (id: string) => Promise<void>;
}

export function RecentExpensesList({
  deletingExpenseId,
  expenses,
  loading,
  onDeleteExpense,
}: RecentExpensesListProps) {
  return (
    <section className="data-panel animate-enter-2">
      {/* Header */}
      <div className="data-panel-header flex items-center justify-between gap-4">
        <div>
          <p className="section-eyebrow">Registro</p>
          <h2 className="mt-1.5 text-[1.1rem] font-semibold text-[var(--foreground)]">
            Últimas despesas
          </h2>
        </div>
        {expenses.length > 0 && (
          <span className="rounded-full border border-[var(--border)] bg-white/60 px-2.5 py-0.5 font-mono text-[10px] tabular-nums text-[var(--muted)]">
            {expenses.length}
          </span>
        )}
      </div>

      {/* Loading skeletons */}
      {loading ? (
        <div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`sk-${i}`}
              className="flex animate-pulse items-center gap-4 border-b border-[var(--border)] px-6 py-4 last:border-0"
            >
              <div className="h-3 w-14 rounded-full bg-[rgba(31,42,34,0.08)]" />
              <div className="h-3 w-16 rounded-full bg-[rgba(31,42,34,0.06)]" />
              <div className="h-3 flex-1 rounded-full bg-[rgba(31,42,34,0.06)]" />
              <div className="h-3 w-16 rounded-full bg-[rgba(31,42,34,0.08)]" />
            </div>
          ))}
        </div>
      ) : null}

      {/* Empty state */}
      {!loading && expenses.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-dashed border-[rgba(31,42,34,0.18)]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 4v10M4 9h10" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <p className="mt-3 font-mono text-[10.5px] tracking-[0.16em] text-[var(--muted)] uppercase">
            Sem registros
          </p>
          <p className="mt-1 max-w-[22rem] text-[12px] leading-[1.65] text-[var(--muted)]/70">
            As saídas cadastradas via formulário ou upload de nota aparecerão aqui.
          </p>
        </div>
      ) : null}

      {/* Ledger rows */}
      {!loading && expenses.length > 0 ? (
        <div>
          {expenses.map((expense, idx) => (
            <article
              key={expense.id}
              className={`flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[rgba(31,42,34,0.025)] ${
                idx < expenses.length - 1
                  ? "border-b border-[var(--border)]"
                  : ""
              }`}
            >
              {/* Date */}
              <time className="w-[4.5rem] flex-shrink-0 font-mono text-[11px] tabular-nums text-[var(--muted)]/80">
                {formatExpenseDate(expense.date)}
              </time>

              {/* Category */}
              <span className="hidden flex-shrink-0 rounded-md border border-[rgba(31,138,112,0.16)] bg-[rgba(240,252,248,0.7)] px-2 py-0.5 font-mono text-[9.5px] tracking-[0.1em] text-[var(--accent-forest)] uppercase sm:inline">
                {expense.category}
              </span>

              {/* Title */}
              <h3 className="min-w-0 flex-1 truncate text-[0.825rem] font-medium text-[var(--foreground)]">
                {expense.title}
              </h3>

              {/* Amount */}
              <span className="flex-shrink-0 font-mono text-[0.825rem] font-semibold tabular-nums text-[var(--foreground)]">
                {formatCurrency(expense.amount)}
              </span>

              {/* Delete */}
              <button
                className="flex-shrink-0 rounded-md border border-[rgba(201,92,84,0.18)] bg-[rgba(255,244,243,0.7)] px-2 py-1 font-mono text-[9.5px] tracking-[0.06em] text-[var(--accent-clay)] transition hover:bg-[rgba(255,244,243,1)] hover:shadow-[0_2px_8px_rgba(201,92,84,0.15)] disabled:cursor-not-allowed disabled:opacity-40 uppercase"
                disabled={deletingExpenseId === expense.id}
                onClick={() => void onDeleteExpense(expense.id)}
                type="button"
                aria-label={`Excluir ${expense.title}`}
              >
                {deletingExpenseId === expense.id ? "···" : "✕"}
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
