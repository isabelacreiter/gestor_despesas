import {
  PageHeader,
  Section,
  SubSection,
  P,
  Tip,
  Warning,
  Note,
  Think,
  Code,
  CodeBlock,
  Steps,
  Step,
  NextPage,
} from "@/components/instrucoes-ui";

export const metadata = {
  title: "Semana 3 — TestRigor | Fluxo Financeiro",
};

export default function TestRigorPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        badge="Testes · Semana 3 de 3"
        title="TestRigor"
        description="Semana 3: escreva os mesmos 6 testes em linguagem natural, sem código. Compare as três ferramentas e desenvolva senso crítico sobre quando usar cada uma."
      />

      {/* ── Contexto da semana ── */}
      <Section title="O que acontece na Semana 3">
        <P>
          Você já vivenciou o CI/CD com Cypress (Semana 1) e com Playwright
          (Semana 2). Agora o objetivo é diferente: não é mais configurar um
          pipeline — é experimentar um paradigma completamente novo e{" "}
          <strong>desenvolver senso crítico</strong> sobre suas limitações.
        </P>
        <Note>
          O TestRigor <strong>não é integrado ao Jenkins como critério de
          bloqueio de deploy</strong> nesta semana. Ele é usado como atividade
          comparativa independente. Misturar paradigmas de engenharia no mesmo
          gate diluiria o foco técnico da pipeline.
        </Note>
        <P>
          O foco desta semana é responder: <em>quando faz sentido usar uma
          ferramenta de testes com IA e sem código?</em>
        </P>
      </Section>

      {/* ── O que é ── */}
      <Section title="O que é o TestRigor?">
        <P>
          O <strong>TestRigor</strong> (testrigor.com) é uma plataforma de
          automação de testes baseada em IA. A proposta é eliminar o código:
          você descreve o que o teste deve fazer em frases em inglês, e o
          TestRigor interpreta, encontra os elementos na página e executa as
          ações em um navegador real hospedado na nuvem.
        </P>
        <ul className="space-y-2 pl-1">
          {[
            ["Zero código", "você escreve 'click on Salvar despesa' — sem seletores CSS, sem TypeScript, sem await."],
            ["IA encontra os elementos", "o sistema entende o contexto da página e acha o elemento pelo significado, não pela estrutura HTML."],
            ["Execução na nuvem", "os testes rodam nos servidores do TestRigor — você não precisa de máquina local nem de Jenkins configurado."],
            ["Resistente a mudanças de UI", "se você renomear uma classe CSS, o teste continua funcionando porque ele procura pelo texto visível, não pelo seletor."],
          ].map(([term, def]) => (
            <li key={term} className="rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem] leading-[1.7]">
              <strong className="text-[var(--foreground)]">{term}:</strong>{" "}
              <span className="text-[var(--muted)]">{def}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Criando conta ── */}
      <Section title="Criando conta e configurando o projeto">
        <Steps>
          <Step n={1}>
            Acesse <Code>testrigor.com</Code> e crie uma conta gratuita.
          </Step>
          <Step n={2}>
            Clique em <strong>"Create Test Suite"</strong>. Dê um nome como{" "}
            <Code>Fluxo Financeiro — Semana 3</Code>.
          </Step>
          <Step n={3}>
            Em <strong>"Application URL"</strong>, coloque a URL da Vercel
            (não localhost — o TestRigor roda na nuvem e precisa acessar
            sua aplicação pela internet).
          </Step>
          <Step n={4}>
            Escolha <strong>Chrome</strong> como navegador padrão.
          </Step>
          <Step n={5}>
            Salve. Você está pronto para criar os primeiros testes.
          </Step>
        </Steps>
        <Warning>
          O TestRigor precisa acessar sua aplicação pela internet. O deploy
          na Vercel (Semana 1 ou 2) precisa estar publicado antes de começar
          aqui.
        </Warning>
      </Section>

      {/* ── Os 6 testes em linguagem natural ── */}
      <Section title="Os 6 testes obrigatórios em linguagem natural">
        <P>
          Os mesmos 6 cenários das Semanas 1 e 2, agora escritos sem código.
          Compare a legibilidade com o TypeScript do Playwright e o Gherkin
          do Cypress.
        </P>

        <SubSection title="1. Cadastro de entrada financeira">
          <CodeBlock lang="text">{`Test name: Salva entrada e atualiza card Entradas

Steps:
  open "https://seu-app.vercel.app"
  click on "Entradas"
  enter "Salário de abril" into "Descrição da entrada"
  enter "5000" into "Valor (R$)"
  select "Salário" from "Origem"
  click on "Salvar entrada"
  check that page contains "Entrada cadastrada com sucesso"
  check that "Entradas" section contains text`}</CodeBlock>
        </SubSection>

        <SubSection title="2. Cadastro de saída manual">
          <CodeBlock lang="text">{`Test name: Salva despesa manual e aparece na lista

Steps:
  open "https://seu-app.vercel.app"
  click on "Saída Manual"
  enter "Mercado semanal" into "Título da despesa"
  enter "150" into "Valor (R$)"
  select "Alimentação" from "Categoria"
  click on "Salvar despesa"
  check that page contains "Mercado semanal"
  check that page contains "Despesa cadastrada com sucesso."`}</CodeBlock>
        </SubSection>

        <SubSection title="3. Exclusão de despesa">
          <CodeBlock lang="text">{`Test name: Exclui despesa da lista

Steps:
  open "https://seu-app.vercel.app"
  // Pressupõe que há despesas cadastradas
  click on "✕" near "Mercado semanal"
  check that page does not contain "Mercado semanal"`}</CodeBlock>
        </SubSection>

        <SubSection title="4. Confirmação e limpeza do formulário">
          <CodeBlock lang="text">{`Test name: Formulario limpa apos salvar

Steps:
  open "https://seu-app.vercel.app"
  click on "Saída Manual"
  enter "Teste de limpeza" into "Título da despesa"
  enter "99" into "Valor (R$)"
  click on "Salvar despesa"
  check that page contains "Despesa cadastrada com sucesso."
  check that "Título da despesa" is empty`}</CodeBlock>
        </SubSection>

        <SubSection title="5. Upload de nota fiscal">
          <CodeBlock lang="text">{`Test name: Cria despesa via nota fiscal

Steps:
  open "https://seu-app.vercel.app"
  click on "Nota Fiscal"
  upload file "nota_exemplo.pdf" into file input
  click on "Analisar nota"
  wait for page to contain "Despesa criada automaticamente" with timeout 15 seconds
  check that page contains text in "Últimas despesas"`}</CodeBlock>
        </SubSection>

        <SubSection title="6. Dashboard — cards de resumo">
          <CodeBlock lang="text">{`Test name: Cards mostram totais do dashboard

Steps:
  open "https://seu-app.vercel.app"
  check that page contains "Entradas"
  check that page contains "Despesas"
  check that page contains "Lançamentos"
  check that page contains "Entradas previstas"
  check that page contains "Gastos acumulados"`}</CodeBlock>
        </SubSection>

        <Tip>
          Se um passo falhar porque o TestRigor não encontra o elemento,
          tente ser mais específico. Em vez de{" "}
          <em>"click on 'Salvar'"</em>, escreva{" "}
          <em>"click on button 'Salvar entrada'"</em>. A IA usa o contexto
          extra para disambiguar.
        </Tip>
      </Section>

      {/* ── Rodando ── */}
      <Section title="Rodando e coletando evidências">
        <Steps>
          <Step n={1}>
            No painel do TestRigor, selecione o test suite.
          </Step>
          <Step n={2}>
            Clique em <strong>"Run All Tests"</strong>.
          </Step>
          <Step n={3}>
            Aguarde — cada teste abre um navegador real na nuvem.
          </Step>
          <Step n={4}>
            Ao terminar, clique em cada teste para ver os screenshots de cada
            passo e o log detalhado.
          </Step>
          <Step n={5}>
            Faça screenshots do painel com os resultados (verde/vermelho) para
            o relatório.
          </Step>
        </Steps>
        <Note>
          O TestRigor gera automaticamente screenshots de cada passo e vídeo
          da sessão. Você não precisa configurar nada — está tudo disponível
          na tela de resultado do teste.
        </Note>
      </Section>

      {/* ── Tabela comparativa ── */}
      <Section title="Tabela comparativa — Cypress × Playwright × TestRigor">
        <P>
          Preencha a tabela abaixo no seu relatório com suas próprias
          experiências. Os valores desta tabela são um ponto de partida —
          você pode discordar e justificar.
        </P>
        <div className="overflow-hidden rounded-xl border border-[var(--border)]">
          <table className="w-full text-[0.8125rem]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[rgba(31,42,34,0.04)]">
                <th className="px-4 py-3 text-left font-semibold">Critério</th>
                <th className="px-4 py-3 text-center font-semibold text-[var(--accent-forest)]">Cypress</th>
                <th className="px-4 py-3 text-center font-semibold text-[var(--accent-amber)]">Playwright</th>
                <th className="px-4 py-3 text-center font-semibold text-[var(--accent-clay)]">TestRigor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {[
                ["Tempo para criar os 6 testes", "—", "—", "—"],
                ["Facilidade para iniciantes", "Média", "Média-alta", "Alta"],
                ["Integração com Jenkins", "Nativa", "Nativa", "Via API (limitada)"],
                ["Relatório de evidências", "Plugins externos", "HTML embutido", "Painel visual"],
                ["Manutenção quando a UI muda", "Frágil (seletores)", "Frágil (seletores)", "Resistente (IA)"],
                ["Custo", "Open-source", "Open-source", "Freemium (SaaS)"],
                ["Multi-browser", "Limitado", "Nativo", "Nativo (nuvem)"],
                ["Controle técnico", "Alto", "Alto", "Baixo"],
                ["Legível por não-técnicos", "Parcial (Gherkin)", "Parcial (Gherkin)", "Sim (linguagem natural)"],
              ].map(([crit, cy, pw, tr]) => (
                <tr key={crit} className="bg-white/40">
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">{crit}</td>
                  <td className="px-4 py-3 text-center text-[var(--muted)]">{cy}</td>
                  <td className="px-4 py-3 text-center text-[var(--muted)]">{pw}</td>
                  <td className="px-4 py-3 text-center text-[var(--muted)]">{tr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Think>
          Em qual cenário real de projeto você escolheria cada ferramenta?
          Pense em: time sem programadores, startup com time técnico pequeno,
          empresa grande com QAs dedicados, projeto de curto prazo.
        </Think>
      </Section>

      {/* ── Evidências ── */}
      <Section title="Evidências obrigatórias da Semana 3">
        <ul className="space-y-2">
          {[
            "Print dos 6 testes escritos em linguagem natural no TestRigor.",
            "Print da execução: painel com resultado de cada teste (verde/vermelho).",
            "Print do log detalhado de pelo menos um teste que falhou, com explicação.",
            "Tabela comparativa preenchida com suas próprias medições (Cypress × Playwright × TestRigor).",
            "Conclusão técnica: em qual cenário real cada ferramenta seria a escolha certa?",
          ].map((item, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem] leading-[1.65] text-[var(--muted)]">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-[rgba(31,42,34,0.2)] font-mono text-[9px] font-bold text-[var(--muted)]">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <NextPage
        href="/instrucoes/relatorio"
        label="Relatório Final"
        description="Estrutura completa das 3 semanas, checklist de evidências e o que se espera na entrega."
      />
    </div>
  );
}
