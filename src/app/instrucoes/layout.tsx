import type { ReactNode } from "react";
import { InstrucoesNav } from "@/components/instrucoes-nav";

export default function InstrucoesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Fixed dark sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 overflow-y-auto bg-[var(--header-bg)] px-4 py-7 lg:flex lg:flex-col">
        {/* Sidebar brand */}
        <div className="mb-7 flex items-center gap-2.5 px-2">
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
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-white/75 uppercase">
              Fluxo Financeiro
            </p>
            <p className="font-mono text-[8.5px] tracking-[0.14em] text-white/30 uppercase">
              Guia do aluno
            </p>
          </div>
        </div>

        <InstrucoesNav />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[var(--header-bg)] px-4 lg:hidden">
        <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-white/70 uppercase">
          Fluxo Financeiro · Guia
        </span>
        <a
          href="/"
          className="font-mono text-[9.5px] tracking-[0.14em] text-white/40 uppercase transition hover:text-white/70"
        >
          ← App
        </a>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <div className="mx-auto max-w-3xl px-5 pb-20 pt-20 sm:px-8 lg:pt-12">
          {children}
        </div>
      </main>
    </div>
  );
}
