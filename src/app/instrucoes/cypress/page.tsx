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
  Story,
  NextPage,
} from "@/components/instrucoes-ui";

export const metadata = {
  title: "Semana 1 — Cypress + Cucumber | Fluxo Financeiro",
};

export default function CypressPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        badge="Testes · Semana 1 de 3"
        title="Cypress + Cucumber"
        description="Semana 1 do trabalho: ative os cenários @todo, veja o Jenkins barrar o deploy, implemente as features, faça os testes passarem e libere o deploy."
      />

      {/* ── Visão geral da semana ── */}
      <Section title="O que acontece esta semana">
        <P>
          A Semana 1 tem uma lógica muito clara: o Jenkins só deve liberar o
          deploy quando todos os testes passam. Para vivenciar isso na prática,
          o trabalho tem uma sequência intencional de falha → correção:
        </P>
        <ol className="space-y-3">
          {[
            [
              "Configure Jenkins, Firebase e o webhook do GitHub",
              "o pipeline precisa estar rodando antes de qualquer teste.",
            ],
            [
              "Ative os cenários @todo",
              "os arquivos todo-*.feature têm cenários desativados que precisam ser implementados. Ao ativá-los sem implementar as features, o Jenkins vai falhar.",
            ],
            [
              "Capture as evidências da falha",
              "prints do Jenkins vermelho + logs do console + screenshots do Cypress.",
            ],
            [
              "Implemente as features",
              "escreva o código nos arquivos marcados com TODO implement.",
            ],
            [
              "Faça os testes passarem e dê push",
              "o Jenkins roda novamente, tudo verde, o deploy vai para a Vercel.",
            ],
          ].map(([title, desc], i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] font-mono text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <div className="flex-1 text-[0.9375rem] leading-[1.7]">
                <strong className="text-[var(--foreground)]">{title}:</strong>{" "}
                <span className="text-[var(--muted)]">{desc}</span>
              </div>
            </li>
          ))}
        </ol>
        <Warning>
          A ordem importa. Não implemente as features antes de ativar os
          testes. A falha intencional no Jenkins é parte do trabalho — é ela
          que você vai documentar e analisar.
        </Warning>
      </Section>

      {/* ── BDD e Gherkin ── */}
      <Section title="BDD e Gherkin — o idioma dos testes">
        <P>
          <strong>BDD (Behavior-Driven Development)</strong> é uma abordagem
          onde você descreve o comportamento esperado da aplicação antes de
          implementá-lo. O texto fica legível para qualquer pessoa — não
          precisa saber programar para entender.
        </P>
        <P>
          A linguagem usada chama-se <strong>Gherkin</strong>. Ela usa palavras
          reservadas em português (ou inglês) para estruturar cada cenário:
        </P>
        <CodeBlock lang="gherkin">{`Feature: Descrição da funcionalidade

  Background:
    Given pré-condição que se aplica a todos os cenários desta feature

  Scenario: Nome do cenário
    Given  ← contexto inicial (estado do sistema)
    When   ← ação do usuário
    Then   ← resultado esperado
    And    ← continuação de Given, When ou Then`}</CodeBlock>
        <Tip>
          O <Code>Background</Code> é executado antes de cada{" "}
          <Code>Scenario</Code>. No projeto, quase todo feature file começa com{" "}
          <Code>Given que acesso a pagina inicial</Code>.
        </Tip>
      </Section>

      {/* ── Estrutura do projeto ── */}
      <Section title="Como os arquivos de teste estão organizados">
        <P>
          O projeto já tem dois tipos de arquivo na pasta{" "}
          <Code>cypress/e2e/</Code>:
        </P>
        <SubSection title="Arquivos prontos e passando (não altere):">
          <CodeBlock lang="bash">{`cypress/e2e/dashboard.feature            — 5 cenários: cards, saldo, título
cypress/e2e/income-entry-form.feature    — 5 cenários: validação do formulário
cypress/e2e/manual-expense-form.feature  — 5 cenários: validação do formulário
cypress/e2e/receipt-upload-panel.feature — 5 cenários: upload e fluxo visual
cypress/e2e/receipt-extraction-api.feature — 3 cenários: contrato da API`}</CodeBlock>
        </SubSection>
        <SubSection title="Arquivos @todo que você precisa ativar e implementar:">
          <CodeBlock lang="bash">{`cypress/e2e/todo-create-income-entry.feature  ← Feature 01: entradas
cypress/e2e/todo-create-expense.feature       ← Feature 02: saídas manuais
cypress/e2e/todo-ocr-extraction.feature       ← Feature 03: nota fiscal`}</CodeBlock>
          <P>
            Cada um desses arquivos tem cenários marcados com{" "}
            <Code>@todo</Code> e steps que dizem{" "}
            <Code>Given pendente de implementacao</Code>. Eles rodam, mas vão
            falhar até você escrever as step definitions reais.
          </P>
        </SubSection>
        <Note>
          As step definitions ficam em{" "}
          <Code>cypress/support/step_definitions/</Code>. Os arquivos já
          existentes mostram o padrão de como escrever novos steps.
        </Note>
      </Section>

      {/* ── Os 6 testes obrigatórios ── */}
      <Section title="Os 6 cenários obrigatórios do trabalho">
        <P>
          Estes são os cenários que você precisa implementar e fazer passar.
          Os comentários dentro dos arquivos <Code>@todo</Code> descrevem o
          que cada step deve fazer — sua tarefa é transformar esses comentários
          em código real.
        </P>

        <SubSection title="1. Cadastro de entrada financeira">
          <CodeBlock lang="gherkin">{`Feature: Criação de entrada financeira no Firestore

  @todo
  Scenario: Salva uma entrada e atualiza o card de entradas
    Given que acesso a pagina inicial
    When seleciono a aba "Entradas"
    And preencho a descricao com "Salário de abril"
    And preencho o valor com "5000"
    And seleciono a origem "Salário"
    And clico em "Salvar entrada"
    Then o card "Entradas" exibe o novo total
    And o saldo no header foi atualizado`}</CodeBlock>
          <P>
            Arquivo: <Code>cypress/e2e/todo-create-income-entry.feature</Code>
          </P>
        </SubSection>

        <SubSection title="2. Cadastro de saída manual">
          <CodeBlock lang="gherkin">{`Feature: Criação de saída manual no Firestore

  @todo
  Scenario: Salva uma saida manual com dados validos e exibe na lista
    Given que acesso a pagina inicial
    When seleciono a aba "Saída Manual"
    And preencho o titulo com "Mercado semanal"
    And preencho o valor com "150.00"
    And seleciono a categoria "Alimentação"
    And clico em "Salvar despesa"
    Then "Mercado semanal" aparece na lista de lancamentos
    And o card "Despesas" foi atualizado com o novo total
    And o card "Lançamentos" incrementou em 1`}</CodeBlock>
          <P>
            Arquivo: <Code>cypress/e2e/todo-create-expense.feature</Code>
          </P>
        </SubSection>

        <SubSection title="3. Exclusão de despesa — atualização da lista">
          <CodeBlock lang="gherkin">{`  @todo
  Scenario: Permite excluir uma saida existente da lista
    Given que existe pelo menos uma despesa cadastrada
    When clico no botao de excluir ao lado da despesa
    Then a despesa desaparece da lista sem recarregar
    And o card "Despesas" diminuiu o valor correspondente`}</CodeBlock>
          <P>
            Este cenário fica no mesmo arquivo de saída manual (Feature 02).
          </P>
        </SubSection>

        <SubSection title="4. Confirmação e limpeza do formulário">
          <CodeBlock lang="gherkin">{`  @todo
  Scenario: Exibe confirmacao e limpa o formulario apos salvar
    Given que acesso a pagina inicial
    When preencho e submeto o formulario de saida manual com dados validos
    Then vejo a mensagem "Despesa cadastrada com sucesso."
    And o campo titulo esta em branco
    And o campo valor esta em branco`}</CodeBlock>
        </SubSection>

        <SubSection title="5. Cadastro via nota fiscal (OCR)">
          <CodeBlock lang="gherkin">{`Feature: Extração de nota fiscal por OCR

  @todo
  Scenario: Extrai dados de uma nota fiscal em PDF e salva como despesa
    Given que acesso a pagina inicial
    And seleciono a aba "Nota Fiscal"
    When faco upload do arquivo "nota_exemplo.pdf"
    And clico em "Analisar nota"
    Then a despesa extraida aparece na lista de lancamentos
    And o valor extraido e maior que zero

  @todo
  Scenario: Exibe mensagem de sucesso apos importar a nota fiscal
    Given que acesso a pagina inicial
    And seleciono a aba "Nota Fiscal"
    When processo uma nota fiscal valida
    Then vejo a mensagem "Despesa criada automaticamente a partir da nota fiscal."
    And o campo de arquivo foi limpo`}</CodeBlock>
          <P>
            Arquivo: <Code>cypress/e2e/todo-ocr-extraction.feature</Code>
          </P>
        </SubSection>

        <SubSection title="6. Atualização do dashboard (saldo e barras)">
          <CodeBlock lang="gherkin">{`Feature: Dashboard principal

  Scenario: Cards mostram totais corretos apos operacoes
    Given que existem entradas e despesas cadastradas
    Then o card "Entradas" mostra a soma total
    And o card "Despesas" mostra a soma total
    And o card "Lançamentos" mostra o numero total de registros
    And a barra "Entradas previstas" reflete o total de entradas
    And a barra "Gastos acumulados" reflete o total de despesas`}</CodeBlock>
          <P>
            Este cenário pode ser adicionado ao{" "}
            <Code>cypress/e2e/dashboard.feature</Code> existente.
          </P>
        </SubSection>
      </Section>

      {/* ── Como escrever step definitions ── */}
      <Section title="Escrevendo as step definitions">
        <P>
          Cada linha de um arquivo <Code>.feature</Code> precisa de uma step
          definition correspondente em TypeScript. Abra os arquivos em{" "}
          <Code>cypress/support/step_definitions/</Code> para ver o padrão
          existente.
        </P>
        <P>A estrutura de uma step definition:</P>
        <CodeBlock lang="typescript">{`import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// "Given" — prepara o contexto
Given("que acesso a pagina inicial", () => {
  cy.visit("/");
  // O que mais precisa ser verdade antes do cenário começar?
});

// "When" — executa a ação
When("seleciono a aba {string}", (nomeAba: string) => {
  // Como você encontra e clica na aba correta?
  // Dica: olhe o atributo role="button" ou o texto visível
  cy.contains("button", nomeAba).click();
});

// "Then" — verifica o resultado
Then("o card {string} exibe o novo total", (tituloCard: string) => {
  // Como você verifica que o valor do card foi atualizado?
  // Dica: cy.contains() encontra por texto, não por seletor CSS
});`}</CodeBlock>
        <Think>
          Antes de escrever o código do step, pense: como um usuário real
          faria essa ação? O que ele clicaria, o que ele digitaria? O Cypress
          está simulando exatamente isso. Abra o app no navegador e faça a
          ação manualmente — observe cada elemento que você interage.
        </Think>
        <Tip>
          Use <Code>cy.contains("button", "texto")</Code> em vez de seletores
          CSS quando possível. Se o texto mudar, o seletor quebra — o texto
          raramente muda sem intenção.
        </Tip>
      </Section>

      {/* ── Rodando ── */}
      <Section title="Como rodar os testes">
        <CodeBlock lang="bash">{`# Modo interativo — veja os testes rodar no navegador
npm run cypress:open

# Modo headless — como o Jenkins roda
npm run cypress:run

# Modo CI (inicia o servidor automaticamente)
npm run test:e2e:ci`}</CodeBlock>
        <Warning>
          Para os cenários @todo com Firestore, o app precisa estar com as
          variáveis <Code>NEXT_PUBLIC_FIREBASE_*</Code> configuradas. Sem elas,
          o Firebase não conecta e os testes falham por razão errada.
        </Warning>
      </Section>

      {/* ── Sequência CI/CD ── */}
      <Section title="A sequência do CI/CD que você vai documentar">
        <Story>
          <P>
            <strong>Passo 1 — Ativar sem implementar.</strong> Abra os arquivos{" "}
            <Code>todo-create-expense.feature</Code> e{" "}
            <Code>todo-create-income-entry.feature</Code>. Escreva step
            definitions básicas (podem retornar erro ou verificar algo
            inexistente). Faça commit e push para a branch main.
          </P>
          <P>
            O Jenkins recebe o webhook, inicia o pipeline. As primeiras etapas
            passam (install, unit tests, build). Na etapa{" "}
            <strong>"E2E Tests (Cypress + Cucumber)"</strong>, os cenários{" "}
            <Code>@todo</Code> rodam e falham. O pipeline marca como{" "}
            <strong>FAILURE</strong>. O stage "Deploy Vercel" não é executado.
          </P>
          <P>
            <strong>Capture agora:</strong> screenshot do Jenkins vermelho,
            log do console com o erro, screenshots do Cypress em{" "}
            <Code>cypress/screenshots/</Code>.
          </P>
          <P>
            <strong>Passo 2 — Implementar as features.</strong> Complete os
            serviços (veja a seção "Features" nas instruções). Rode os testes
            localmente com <Code>npm run test:e2e:ci</Code> até todos passarem.
          </P>
          <P>
            <strong>Passo 3 — Push e pipeline verde.</strong> Com os testes
            passando, faça push. O Jenkins roda novamente, todos os estágios
            ficam verdes. O deploy vai para a Vercel automaticamente.
          </P>
          <P>
            <strong>Capture agora:</strong> screenshot do Jenkins verde,
            screenshot do deploy na Vercel, URL pública da aplicação.
          </P>
        </Story>
      </Section>

      {/* ── Evidências obrigatórias ── */}
      <Section title="Evidências obrigatórias da Semana 1">
        <ul className="space-y-2">
          {[
            "Print do Jenkins com pipeline vermelha (teste ativado antes da implementação).",
            "Log completo do stage E2E Tests que bloqueou o deploy (console output do Jenkins).",
            "Screenshots do Cypress em cypress/screenshots/ gerados durante a falha.",
            "Print do Jenkins com pipeline verde após a correção.",
            "Print do deploy publicado na Vercel pelo pipeline.",
            "Os dois commits: o que ativou o teste (falha) e o que fez passar.",
            "Análise de causa raiz (RCA): por que o teste falhou e como o Jenkins protegeu a produção.",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem] leading-[1.65] text-[var(--muted)]"
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-[rgba(31,42,34,0.2)] text-[9px] font-mono font-bold text-[var(--muted)]">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <NextPage
        href="/instrucoes/playwright"
        label="Semana 2 — Playwright + Cucumber"
        description="Migre do Cypress, adote BDD completo e conecte ao Jenkins com HTML reports."
      />
    </div>
  );
}
