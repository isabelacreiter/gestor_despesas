"use client";

import Link from "next/link";
import { useState } from "react";
import { IncomeEntryForm } from "@/components/income-entry-form";
import { ManualExpenseForm } from "@/components/manual-expense-form";
import { OverviewChart } from "@/components/overview-chart";
import { RecentExpensesList } from "@/components/recent-expenses-list";
import { ReceiptUploadPanel } from "@/components/receipt-upload-panel";
import { SummaryCard } from "@/components/summary-card";
import { formatCurrency } from "@/services/formatters";
import { useIncomeEntries } from "@/services/use-income-entries";
import { useExpenses } from "@/services/use-expenses";

type FormTab = "income" | "expense" | "receipt";

const formTabs: { id: FormTab; label: string; short: string }[] = [
  { id: "income", label: "Entradas", short: "01" },
  { id: "expense", label: "Saída Manual", short: "02" },
  { id: "receipt", label: "Nota Fiscal", short: "03" },
];

export function ExpenseDashboardApp() {
  const [activeTab, setActiveTab] = useState<FormTab>("income");

  const {
    addIncomeEntry,
    incomeEntries,
    isSubmitting: isSubmittingIncomeEntry,
    loading: loadingIncomeEntries,
    totalIncome,
  } = useIncomeEntries();
  const {
    addExpense,
    deleteExpense,
    deletingExpenseId,
    error,
    expenses,
    isConfigured,
    isSubmitting,
    loading,
  } = useExpenses();

  const totalExpenses = expenses.reduce(
    (currentTotal, expense) => currentTotal + expense.amount,
    0,
  );
  const remainingBalance = totalIncome - totalExpenses;
  const latestExpenses = expenses.slice(0, 5);
  const totalTransactions = expenses.length + incomeEntries.length;
  const progressPercentage = Math.min(
    Math.round((totalExpenses / totalIncome) * 100),
    100,
  );

  const DOTS = 32;
  const filledDots = expenses.length
    ? Math.max(Math.round((progressPercentage / 100) * DOTS), 1)
    : 0;

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Command-bar header ── */}
      <header className="sticky top-0 z-50 bg-[var(--header-bg)] shadow-[0_1px_0_rgba(255,255,255,0.06)]">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex flex-shrink-0 items-center gap-2.5">
            <svg
              className="h-5 w-5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <rect
                width="20"
                height="20"
                rx="5"
                fill="var(--accent-forest)"
                fillOpacity="0.9"
              />
              <polyline
                points="3,13 7,9 11,11.5 17,5"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-mono text-[10px] font-semibold tracking-[0.22em] text-white/75 uppercase">
              Fluxo Financeiro
            </span>
          </div>

          {/* Dot-matrix progress */}
          <div className="hidden flex-1 items-center justify-center gap-3 md:flex">
            <span className="font-mono text-[8.5px] tracking-[0.22em] text-white/30 uppercase">
              Orçamento
            </span>
            <div className="flex items-center gap-[3px]">
              {Array.from({ length: DOTS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-[5px] w-[5px] rounded-full transition-all duration-300 ${
                    i < filledDots
                      ? "bg-[var(--accent-amber)] opacity-90"
                      : "bg-white/[0.1]"
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-[8.5px] tabular-nums tracking-[0.15em] text-white/30">
              {progressPercentage}%
            </span>
          </div>

          {/* Right: instrucoes link + balance */}
          <div className="ml-auto flex flex-shrink-0 items-center gap-4">
            <Link
              href="/instrucoes/jenkins"
              className="hidden rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 font-mono text-[9.5px] font-medium tracking-[0.14em] text-white/55 uppercase transition hover:bg-white/[0.1] hover:text-white/80 sm:inline-flex"
            >
              Instruções
            </Link>
            <div className="text-right">
              <p className="font-mono text-[8px] tracking-[0.22em] text-white/30 uppercase">
                Saldo
              </p>
              <p
                className={`font-mono text-sm font-semibold tabular-nums ${
                  remainingBalance >= 0
                    ? "text-[#6ee7b7]"
                    : "text-[var(--accent-clay)]"
                }`}
              >
                {formatCurrency(remainingBalance)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── System notices ── */}
      {!isConfigured ? (
        <div className="border-b border-[rgba(217,123,44,0.22)] bg-[rgba(255,247,238,0.75)] px-4 py-2 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-[11px] text-[var(--accent-amber)]">
              <span className="font-bold">⚠ Firebase não configurado</span>
              <span className="mx-2 opacity-40">·</span>
              <span className="text-[var(--muted)]">
                Defina as variáveis{" "}
                <code className="rounded bg-[rgba(217,123,44,0.12)] px-1 text-[var(--foreground)]">
                  NEXT_PUBLIC_FIREBASE_*
                </code>{" "}
                para ativar o Firestore.
              </span>
            </p>
          </div>
        </div>
      ) : null}

      {isConfigured && error ? (
        <div className="border-b border-[rgba(201,92,84,0.22)] bg-[rgba(255,244,243,0.75)] px-4 py-2 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p
              role="alert"
              className="font-mono text-[11px] text-[var(--accent-clay)]"
            >
              <span className="font-bold">✕ Erro</span>
              <span className="mx-2 opacity-40">·</span>
              {error}
            </p>
          </div>
        </div>
      ) : null}

      {/* ── Page body ── */}
      <main className="flex-1 px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Metric strip */}
          <div
            className="animate-enter grid grid-cols-1 overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3"
            style={{ gap: "1px" }}
          >
            <SummaryCard
              description="Fica em fallback até a turma concluir o cadastro real de entradas."
              tone="forest"
              title="Entradas"
              value={formatCurrency(totalIncome)}
            />
            <SummaryCard
              description="Soma das saídas cadastradas manualmente ou via leitura de nota."
              tone="amber"
              title="Despesas"
              value={formatCurrency(totalExpenses)}
            />
            <SummaryCard
              description="Total combinado de registros de entradas e saídas no dashboard."
              tone="clay"
              title="Lançamentos"
              value={`${totalTransactions} registro${totalTransactions === 1 ? "" : "s"}`}
            />
          </div>

          {/* Two-column content */}
          <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
            <section className="space-y-5">
              <OverviewChart
                expenses={totalExpenses}
                income={totalIncome}
                loading={loading || loadingIncomeEntries}
              />
              <RecentExpensesList
                deletingExpenseId={deletingExpenseId}
                expenses={latestExpenses}
                loading={loading}
                onDeleteExpense={deleteExpense}
              />
            </section>

            {/* Forms with tab navigation */}
            <aside className="space-y-4">
              {/* Tab strip */}
              <div className="flex rounded-2xl border border-[var(--border)] bg-white/50 p-1 backdrop-blur-sm">
                {formTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2.5 transition-all ${
                      activeTab === tab.id
                        ? tab.id === "income"
                          ? "bg-[var(--accent-forest)] text-white shadow-[0_2px_8px_rgba(31,138,112,0.3)]"
                          : tab.id === "expense"
                            ? "bg-[var(--accent-amber)] text-white shadow-[0_2px_8px_rgba(217,123,44,0.3)]"
                            : "bg-[var(--accent-clay)] text-white shadow-[0_2px_8px_rgba(201,92,84,0.25)]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/60"
                    }`}
                  >
                    <span className="font-mono text-[8px] tracking-[0.18em] opacity-70">
                      {tab.short}
                    </span>
                    <span className="text-[11.5px] font-semibold leading-tight">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active form */}
              {activeTab === "income" && (
                <IncomeEntryForm
                  isSubmitting={isSubmittingIncomeEntry}
                  onSubmitIncomeEntry={addIncomeEntry}
                />
              )}
              {activeTab === "expense" && (
                <ManualExpenseForm
                  isSubmitting={isSubmitting}
                  onSubmitExpense={addExpense}
                />
              )}
              {activeTab === "receipt" && (
                <ReceiptUploadPanel
                  isSubmitting={isSubmitting}
                  onSubmitExpense={addExpense}
                />
              )}
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
