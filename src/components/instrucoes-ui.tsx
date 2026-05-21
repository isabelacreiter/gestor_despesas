import type { ReactNode } from "react";

export function PageHeader({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-[rgba(31,42,34,0.08)] pb-8">
      <span className="inline-block rounded-full border border-[var(--border)] bg-white/60 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
        {badge}
      </span>
      <h1 className="mt-3 text-3xl font-bold leading-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--foreground)]">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SubSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.9375rem] leading-[1.75] text-[rgba(31,42,34,0.82)]">
      {children}
    </p>
  );
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-[rgba(31,138,112,0.2)] bg-[rgba(240,252,248,0.7)] px-4 py-3.5">
      <span className="mt-0.5 flex-shrink-0 text-base">💡</span>
      <div className="text-[0.875rem] leading-[1.7] text-[rgba(31,42,34,0.8)]">
        {children}
      </div>
    </div>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-[rgba(217,123,44,0.24)] bg-[rgba(255,247,238,0.8)] px-4 py-3.5">
      <span className="mt-0.5 flex-shrink-0 text-base">⚠️</span>
      <div className="text-[0.875rem] leading-[1.7] text-[rgba(31,42,34,0.8)]">
        {children}
      </div>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-[rgba(31,42,34,0.1)] bg-white/60 px-4 py-3.5">
      <span className="mt-0.5 flex-shrink-0 text-base">📌</span>
      <div className="text-[0.875rem] leading-[1.7] text-[rgba(31,42,34,0.8)]">
        {children}
      </div>
    </div>
  );
}

export function Think({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-[rgba(201,92,84,0.18)] bg-[rgba(255,244,243,0.7)] px-4 py-3.5">
      <span className="mt-0.5 flex-shrink-0 text-base">🤔</span>
      <div className="text-[0.875rem] leading-[1.7] text-[rgba(31,42,34,0.8)]">
        <span className="font-semibold text-[var(--accent-clay)]">
          Pense antes de continuar:{" "}
        </span>
        {children}
      </div>
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-[rgba(31,42,34,0.08)] px-1.5 py-0.5 font-mono text-[0.8125rem] text-[var(--foreground)]">
      {children}
    </code>
  );
}

export function CodeBlock({
  children,
  lang,
}: {
  children: string;
  lang?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#1a2420]">
      {lang && (
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.15em] text-white/30 uppercase">
            {lang}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.8125rem] leading-[1.75] text-[rgba(255,255,255,0.82)]">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="space-y-3">{children}</ol>;
}

export function Step({
  n,
  children,
}: {
  n: number;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] font-mono text-[11px] font-bold text-white">
        {n}
      </span>
      <div className="flex-1 pt-0.5 text-[0.9375rem] leading-[1.7] text-[rgba(31,42,34,0.82)]">
        {children}
      </div>
    </li>
  );
}

export function Story({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[rgba(31,42,34,0.1)] bg-white/70 p-6 shadow-[0_2px_12px_rgba(31,42,34,0.06)]">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">📖</span>
        <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-[var(--muted)] uppercase">
          Cenário real
        </span>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function NextPage({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white/60 px-6 py-5 transition hover:border-[var(--accent-forest)] hover:bg-[rgba(240,252,248,0.6)]"
    >
      <div>
        <p className="font-mono text-[9.5px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Próxima seção
        </p>
        <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-[var(--muted)]">{description}</p>
      </div>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="flex-shrink-0 text-[var(--muted)] transition group-hover:text-[var(--accent-forest)]"
      >
        <path
          d="M4 10h12M10 4l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
