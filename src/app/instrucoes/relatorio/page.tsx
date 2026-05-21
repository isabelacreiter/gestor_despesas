import {
  PageHeader,
  Section,
  SubSection,
  P,
  Tip,
  Warning,
  Note,
  Code,
} from "@/components/instrucoes-ui";

export const metadata = {
  title: "Relatório Final | Fluxo Financeiro",
};

export default function RelatorioPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        badge="Entrega · Seção 07"
        title="Relatório Final"
        description="Checklist completo das 3 semanas: evidências obrigatórias, estrutura do documento e critérios de avaliação."
      />

      {/* ── O que é esperado ── */}
      <Section title="O que é esperado na entrega">
        <P>
          O relatório não é apenas um documento — é a{" "}
          <em>história do seu processo</em>. Queremos ver que você entendeu o
          que estava fazendo, por que fez cada escolha e o que aprendeu ao
          longo das 3 semanas.
        </P>
        <ul className="space-y-2 pl-1">
          {[
            ["O que você fez?", "descreva as features implementadas, as ferramentas usadas e as decisões técnicas."],
            ["Como você fez?", "mostre evidências: screenshots, logs, saídas do Jenkins e da Vercel."],
            ["O que você aprendeu?", "reflita sobre os erros, as dificuldades e como as superou."],
          ].map(([q, a]) => (
            <li
              key={q}
              className="rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem] leading-[1.7]"
            >
              <strong className="text-[var(--foreground)]">{q}</strong>{" "}
              <span className="text-[var(--muted)]">{a}</span>
            </li>
          ))}
        </ul>
        <Warning>
          Evite relatórios com screenshots sem contexto. Cada evidência deve ser{" "}
          <em>explicada</em>: o que você estava tentando provar com aquela
          imagem? Qualidade é melhor que quantidade.
        </Warning>
      </Section>

      {/* ── Semana 1 ── */}
      <Section title="Semana 1 — Cypress + Cucumber">
        <P>
          Documente toda a sequência: ativar os cenários <Code>@todo</Code> →
          Jenkins falha → implementar features → Jenkins passa → deploy na Vercel.
        </P>
        <SubSection title="Evidências obrigatórias:">
          <ul className="space-y-2">
            {[
              "Print do Jenkins com pipeline vermelha — stage E2E Tests falhando antes da implementação.",
              "Log completo do stage que bloqueou o deploy (Console Output do Jenkins).",
              "Screenshots do Cypress gerados em cypress/screenshots/ durante a falha.",
              "Print do Jenkins com pipeline verde após implementar as features.",
              "Print do deploy publicado na Vercel acionado pela pipeline verde.",
              "Os dois commits: o que ativou os testes (falha) e o que fez passar.",
              "Análise de causa raiz (RCA): por que o teste falhou e como o Jenkins protegeu a produção.",
            ].map((item, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem] leading-[1.65] text-[var(--muted)]"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-[rgba(31,138,112,0.3)] font-mono text-[9px] font-bold text-[var(--accent-forest)]">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </SubSection>
        <SubSection title="Os 6 cenários obrigatórios que devem estar passando:">
          <ul className="space-y-1.5 pl-2 text-[0.875rem] text-[var(--muted)]">
            {[
              "Cadastro de entrada financeira (Firestore)",
              "Cadastro de saída manual (Firestore)",
              "Exclusão de despesa da lista",
              "Confirmação e limpeza do formulário após salvar",
              "Upload de nota fiscal — criação automática de despesa via OCR",
              "Upload de nota fiscal — mensagem de sucesso e limpeza do campo",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-forest)]" />
                {item}
              </li>
            ))}
          </ul>
        </SubSection>
      </Section>

      {/* ── Semana 2 ── */}
      <Section title="Semana 2 — Playwright + Cucumber">
        <P>
          Documente a migração: remover o stage Cypress do Jenkinsfile, adicionar
          o stage Playwright, reescrever os 6 cenários e gerar o HTML report.
        </P>
        <SubSection title="Evidências obrigatórias:">
          <ul className="space-y-2">
            {[
              "Os 6 cenários Gherkin (arquivos .feature) reescritos para o Playwright.",
              "Print do Jenkins com o stage Playwright falhando (antes de terminar a implementação).",
              "HTML report do Playwright com o trace do cenário que falhou.",
              "Print da pipeline verde com Playwright após implementar.",
              "Comparação objetiva Cypress × Playwright: o que ficou mais claro? Qual foi mais expressivo?",
            ].map((item, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem] leading-[1.65] text-[var(--muted)]"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-[rgba(217,123,44,0.3)] font-mono text-[9px] font-bold text-[var(--accent-amber)]">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </SubSection>
        <Note>
          O Playwright gera automaticamente o HTML report em{" "}
          <Code>playwright-report/</Code>. O Jenkins arquiva esse diretório via{" "}
          <Code>archiveArtifacts</Code> — disponível na aba "Archived Artifacts"
          de cada build.
        </Note>
      </Section>

      {/* ── Semana 3 ── */}
      <Section title="Semana 3 — TestRigor">
        <P>
          O TestRigor não é um gate no Jenkins — é uma atividade comparativa
          independente. Documente os testes em linguagem natural e desenvolva
          senso crítico sobre quando usar cada ferramenta.
        </P>
        <SubSection title="Evidências obrigatórias:">
          <ul className="space-y-2">
            {[
              "Print dos 6 testes escritos em linguagem natural no painel do TestRigor.",
              "Print da execução: painel com resultado de cada teste (verde/vermelho).",
              "Print do log detalhado de pelo menos um teste que falhou, com explicação.",
              "Tabela comparativa preenchida com suas próprias medições (Cypress × Playwright × TestRigor).",
              "Conclusão técnica: em qual cenário real cada ferramenta seria a escolha certa?",
            ].map((item, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem] leading-[1.65] text-[var(--muted)]"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-[rgba(201,92,84,0.3)] font-mono text-[9px] font-bold text-[var(--accent-clay)]">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </SubSection>
      </Section>

      {/* ── Estrutura do relatório ── */}
      <Section title="Estrutura sugerida do relatório">
        <P>
          Esta é uma sugestão — não uma obrigação. O importante é que o
          conteúdo esteja lá e esteja contextualizado.
        </P>
        {[
          {
            n: "1",
            title: "Introdução",
            items: [
              "Contexto do projeto Fluxo Financeiro",
              "Diagrama do fluxo: código local → push → GitHub → webhook → Jenkins → Vercel",
              "Quais features você ficou responsável?",
            ],
          },
          {
            n: "2",
            title: "Configuração do Ambiente",
            items: [
              "Como configurou o Firebase (variáveis de ambiente)?",
              "Como configurou o Jenkins e o webhook?",
              "Como configurou a Vercel e o stage Deploy?",
              "Screenshots de cada configuração.",
            ],
          },
          {
            n: "3",
            title: "Semana 1 — Cypress + Features",
            items: [
              "Features implementadas: income-entry-service, expense-service, route OCR.",
              "Sequência do deploy barrado: @todo ativado → Jenkins FAILURE → correção → SUCCESS.",
              "Evidências da falha intencional (console log + screenshots).",
              "Análise de causa raiz (RCA).",
            ],
          },
          {
            n: "4",
            title: "Semana 2 — Playwright",
            items: [
              "Jenkinsfile modificado: stage Cypress substituído por Playwright.",
              "HTML report com trace do cenário que falhou.",
              "Comparação direta com a abordagem Cypress.",
            ],
          },
          {
            n: "5",
            title: "Semana 3 — TestRigor",
            items: [
              "Testes em linguagem natural: os mesmos 6 cenários.",
              "Print da execução no painel TestRigor.",
              "Tabela comparativa final: Cypress × Playwright × TestRigor.",
              "Conclusão: qual ferramenta para qual cenário de projeto.",
            ],
          },
          {
            n: "6",
            title: "Conclusão e Reflexão",
            items: [
              "O que você não sabia antes deste trabalho e agora sabe?",
              "Qual foi a parte mais difícil?",
              "O que você faria diferente em um projeto real?",
            ],
          },
        ].map((sec) => (
          <div
            key={sec.n}
            className="rounded-xl border border-[var(--border)] bg-white/50 p-4"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] font-mono text-[11px] font-bold text-white">
                {sec.n}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-[var(--foreground)]">
                  {sec.title}
                </p>
                <ul className="mt-2 space-y-1">
                  {sec.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[0.875rem] leading-[1.6] text-[var(--muted)]"
                    >
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--muted)]/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </Section>

      {/* ── Checklist ── */}
      <Section title="Checklist final — antes de entregar">
        <P>
          Percorra esta lista antes de submeter. Salve os arquivos organizados
          por semana.
        </P>
        {[
          {
            group: "Semana 1 — Cypress",
            color: "text-[var(--accent-forest)]",
            border: "border-[rgba(31,138,112,0.2)]",
            items: [
              "Pipeline vermelha no Jenkins (E2E Tests falhando)",
              "Console output com a mensagem de erro",
              "Screenshots do Cypress em cypress/screenshots/",
              "Pipeline verde após implementar",
              "Deploy publicado na Vercel",
              "Análise de causa raiz (RCA)",
            ],
          },
          {
            group: "Semana 2 — Playwright",
            color: "text-[var(--accent-amber)]",
            border: "border-[rgba(217,123,44,0.2)]",
            items: [
              "Jenkinsfile com stage Playwright substituindo Cypress",
              "Stage Playwright falhando no Jenkins",
              "HTML report com trace do teste que falhou",
              "Pipeline verde com Playwright",
              "Comparação objetiva Cypress × Playwright",
            ],
          },
          {
            group: "Semana 3 — TestRigor",
            color: "text-[var(--accent-clay)]",
            border: "border-[rgba(201,92,84,0.2)]",
            items: [
              "6 testes em linguagem natural escritos no painel TestRigor",
              "Print da execução (verde/vermelho)",
              "Log de pelo menos um teste que falhou",
              "Tabela comparativa Cypress × Playwright × TestRigor",
              "Conclusão técnica contextualizada",
            ],
          },
          {
            group: "Configuração geral",
            color: "text-[var(--muted)]",
            border: "border-[var(--border)]",
            items: [
              "Jenkinsfile completo (incluindo stage Deploy com credenciais)",
              "Screenshots do Firebase configurado",
              "URL pública da aplicação na Vercel",
              "Os 3 commits centrais: ativação do @todo, implementação, migração",
            ],
          },
        ].map((group) => (
          <SubSection key={group.group} title={group.group}>
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[0.875rem] text-[var(--muted)]">
                  <span className={`mt-1 flex-shrink-0 text-[10px] ${group.color}`}>☐</span>
                  {item}
                </li>
              ))}
            </ul>
          </SubSection>
        ))}
      </Section>

      {/* ── Formato ── */}
      <Section title="Formato de entrega">
        <ul className="space-y-1.5 pl-2 text-[0.9rem] text-[var(--muted)]">
          {[
            "PDF — formato universal, aceito em qualquer dispositivo.",
            "Google Docs / Notion — compartilhado com permissão de leitura.",
            "Repositório GitHub — pasta /docs com o relatório em Markdown.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-forest)]" />
              {item}
            </li>
          ))}
        </ul>
        <Tip>
          Independente do formato, organize as imagens com legenda. Cada
          screenshot deve ter uma frase explicando o que ela mostra e por que
          está ali.
        </Tip>
      </Section>

      {/* ── Final ── */}
      <div className="rounded-2xl border border-[rgba(31,138,112,0.2)] bg-[rgba(240,252,248,0.7)] p-6">
        <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--accent-forest)] uppercase">
          Boa sorte
        </p>
        <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
          Você tem tudo o que precisa.
        </p>
        <p className="mt-2 text-[0.9rem] leading-[1.75] text-[var(--muted)]">
          O projeto está estruturado, as ferramentas estão configuradas e
          estas instruções cobrem cada etapa. O que falta é colocar a mão na
          massa, cometer alguns erros, aprender com eles e documentar a
          jornada. Isso é exatamente o que o mundo real de desenvolvimento de
          software parece.
        </p>
      </div>
    </div>
  );
}
