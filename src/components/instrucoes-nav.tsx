"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    group: "Automação",
    items: [
      {
        href: "/instrucoes/jenkins",
        label: "Jenkins",
        sub: "CI/CD na prática",
        icon: "🔧",
      },
      {
        href: "/instrucoes/deploy",
        label: "Deploy",
        sub: "Vercel + pipeline",
        icon: "🚀",
      },
    ],
  },
  {
    group: "Features",
    items: [
      {
        href: "/instrucoes/todo",
        label: "To-Do List",
        sub: "O que implementar",
        icon: "✅",
      },
    ],
  },
  {
    group: "Testes",
    items: [
      {
        href: "/instrucoes/cypress",
        label: "Cypress",
        sub: "BDD com Cucumber",
        icon: "🌲",
      },
      {
        href: "/instrucoes/playwright",
        label: "Playwright",
        sub: "Migração e novos testes",
        icon: "🎭",
      },
      {
        href: "/instrucoes/testrigor",
        label: "TestRigor",
        sub: "Testes com IA",
        icon: "🤖",
      },
    ],
  },
  {
    group: "Entrega",
    items: [
      {
        href: "/instrucoes/relatorio",
        label: "Relatório",
        sub: "O que entregar",
        icon: "📄",
      },
    ],
  },
];

export function InstrucoesNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6">
      {/* Back to app */}
      <Link
        href="/"
        className="flex items-center gap-2 font-mono text-[10px] font-medium tracking-[0.16em] text-white/50 uppercase transition hover:text-white/80"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 2L4 7l5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Voltar ao app
      </Link>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.group}>
          <p className="mb-2 px-2 font-mono text-[9px] font-bold tracking-[0.24em] text-white/25 uppercase">
            {section.group}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                      isActive
                        ? "bg-[var(--accent-forest)]/20 text-white"
                        : "text-white/55 hover:bg-white/[0.07] hover:text-white/85"
                    }`}
                  >
                    <span className="text-[1rem]">{item.icon}</span>
                    <div className="min-w-0">
                      <p
                        className={`text-[0.8125rem] font-medium leading-tight ${
                          isActive ? "text-white" : ""
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="mt-0.5 truncate text-[10.5px] text-white/35">
                        {item.sub}
                      </p>
                    </div>
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-forest)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
