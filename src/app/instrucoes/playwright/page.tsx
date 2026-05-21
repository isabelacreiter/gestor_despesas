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
  title: "Semana 2 — Playwright | Fluxo Financeiro",
};

export default function PlaywrightPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        badge="Testes · Semana 2 de 3"
        title="Playwright"
        description="Semana 2: migre do Cypress para o Playwright, reescreva os 6 cenários obrigatórios em TypeScript puro, troque o stage do Jenkins e gere relatórios HTML com Trace Viewer."
      />

      {/* ── Visão geral ── */}
      <Section title="O que acontece na Semana 2">
        <P>
          A Semana 1 provou que CI/CD funciona como gatekeeper. Agora, o
          objetivo é experimentar uma ferramenta diferente para os mesmos
          testes — e entender o que muda na prática.
        </P>
        <P>
          Na Semana 2, os testes são escritos em{" "}
          <strong>TypeScript puro com Playwright</strong> — sem Gherkin, sem
          Cucumber, sem arquivos <Code>.feature</Code>. Você escreve arquivos{" "}
          <Code>.spec.ts</Code> diretamente.
        </P>
        <ul className="space-y-2 pl-1">
          {[
            ["Mesmos 6 cenários obrigatórios", "só muda a sintaxe — o que cada teste verifica é idêntico ao Cypress."],
            ["TypeScript puro com async/await", "sem filas de comandos internas. Você controla explicitamente a ordem de espera."],
            ["Troca o stage no Jenkins", "o pipeline remove o stage Cypress e adiciona o Playwright."],
            ["HTML Report + Trace Viewer", "relatório visual embutido e gravação passo a passo de cada execução."],
          ].map(([term, def]) => (
            <li key={term} className="rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem] leading-[1.7]">
              <strong className="text-[var(--foreground)]">{term}:</strong>{" "}
              <span className="text-[var(--muted)]">{def}</span>
            </li>
          ))}
        </ul>
        <Note>
          Sem Cucumber nesta semana. O Cypress (Semana 1) já usou Gherkin com
          Cucumber. O Playwright aqui é propositalmente diferente — você vai
          comparar as duas abordagens no relatório.
        </Note>
      </Section>

      {/* ── Instalação ── */}
      <Section title="Instalando o Playwright">
        <CodeBlock lang="bash">{`# Instalar e configurar
npm init playwright@latest

# Quando perguntado:
# → Where do you put your end-to-end tests?  playwright/
# → Add a GitHub Actions workflow?  No (Jenkins faz isso)
# → Install Playwright browsers?   Yes`}</CodeBlock>
        <P>
          Configure o arquivo <Code>playwright.config.ts</Code>:
        </P>
        <CodeBlock lang="typescript">{`import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    trace: "on-first-retry",
  },
  reporter: [["html", { outputFolder: "playwright-report" }]],
});`}</CodeBlock>
        <Tip>
          <Code>trace: "on-first-retry"</Code> grava cada passo quando um
          teste falha e é re-tentado. Você pode abrir o arquivo zip depois e
          navegar frame a frame — é a ferramenta mais poderosa para debugar.
        </Tip>
      </Section>

      {/* ── Isolamento de estado ── */}
      <Section title="Isolamento de estado — beforeEach">
        <P>
          Alguns testes dependem de dados pré-existentes (ex: para excluir uma
          despesa, ela precisa estar lá). Sem isolamento, o teste passa na sua
          máquina mas falha no Jenkins, porque o Firestore do CI pode estar
          vazio.
        </P>
        <P>
          A solução é usar <Code>test.beforeEach</Code> para criar os dados
          necessários antes de cada teste que depende de estado:
        </P>
        <CodeBlock lang="typescript">{`import { test, expect } from "@playwright/test";

// Agrupe testes que dependem de estado com test.describe
test.describe("exclusão de despesa", () => {

  test.beforeEach(async ({ page }) => {
    // Garante que existe ao menos uma despesa antes de cada teste do grupo
    await page.goto("/");
    await page.getByRole("button", { name: "Saída Manual" }).click();
    await page.getByLabel("Título da despesa").fill("Despesa para exclusão");
    await page.getByLabel("Valor (R$)").fill("50");
    await page.getByRole("button", { name: "Salvar despesa" }).click();

    // Espera a despesa aparecer na lista antes de continuar
    await expect(page.getByText("Despesa para exclusão")).toBeVisible();
  });

  test("exclui uma despesa da lista", async ({ page }) => {
    // Garantia: "Despesa para exclusão" existe na lista
    await page.getByRole("button", { name: "✕" }).first().click();
    await expect(page.getByText("Despesa para exclusão")).not.toBeVisible();
  });

});`}</CodeBlock>
        <Think>
          Os dados criados no <Code>beforeEach</Code> ficam no Firestore e
          acumulam entre execuções. Em um projeto real, você usaria um banco
          de testes separado ou limparia a coleção no <Code>afterEach</Code>.
          Como você faria isso com o Firestore Admin SDK?
        </Think>
      </Section>

      {/* ── Os 6 testes obrigatórios ── */}
      <Section title="Os 6 testes obrigatórios em Playwright">
        <P>
          Crie o arquivo <Code>playwright/fluxo-financeiro.spec.ts</Code>.
          Os trechos abaixo são esqueletos com dicas — o que está em
          comentário é o que você precisa descobrir e preencher.
        </P>

        <SubSection title="1. Cadastro de entrada financeira">
          <CodeBlock lang="typescript">{`test("salva uma entrada e atualiza o card Entradas", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Entradas" }).click();

  await page.getByLabel("Descrição da entrada").fill("Salário de abril");
  await page.getByLabel("Valor (R$)").fill("5000");
  // Como selecionar a origem "Salário" no select?
  // Dica: page.selectOption() ou page.getByRole("combobox")

  await page.getByRole("button", { name: "Salvar entrada" }).click();

  await expect(page.getByText("Entrada cadastrada com sucesso")).toBeVisible();
  // O que mais deve ser verificado no card "Entradas"?
});`}</CodeBlock>
        </SubSection>

        <SubSection title="2. Cadastro de saída manual">
          <CodeBlock lang="typescript">{`test("salva despesa manual e aparece na lista", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Saída Manual" }).click();

  await page.getByLabel("Título da despesa").fill("Mercado semanal");
  await page.getByLabel("Valor (R$)").fill("150");
  // Como selecionar a categoria "Alimentação"?

  await page.getByRole("button", { name: "Salvar despesa" }).click();

  await expect(page.getByText("Mercado semanal")).toBeVisible();
  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();
});`}</CodeBlock>
        </SubSection>

        <SubSection title="3. Exclusão de despesa (usa beforeEach acima)">
          <CodeBlock lang="typescript">{`// Dentro do test.describe("exclusão de despesa") com o beforeEach já definido:
test("exclui uma despesa da lista", async ({ page }) => {
  // "Despesa para exclusão" já existe graças ao beforeEach

  // Encontra o botão ✕ ao lado da despesa e clica
  // Dica: page.locator("article").filter({ hasText: "Despesa para exclusão" })
  //       .getByRole("button", { name: "✕" }).click()

  // Verifica que sumiu da lista
  await expect(page.getByText("Despesa para exclusão")).not.toBeVisible();
  // O card "Despesas" diminuiu?
});`}</CodeBlock>
        </SubSection>

        <SubSection title="4. Confirmação e limpeza do formulário">
          <CodeBlock lang="typescript">{`test("formulário limpa após salvar", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Saída Manual" }).click();

  await page.getByLabel("Título da despesa").fill("Teste de limpeza");
  await page.getByLabel("Valor (R$)").fill("99");
  await page.getByRole("button", { name: "Salvar despesa" }).click();

  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();

  // Verificar que os campos foram limpos
  await expect(page.getByLabel("Título da despesa")).toHaveValue("");
  await expect(page.getByLabel("Valor (R$)")).toHaveValue("");
});`}</CodeBlock>
        </SubSection>

        <SubSection title="5. Upload de nota fiscal (OCR)">
          <CodeBlock lang="typescript">{`test("cria despesa automaticamente via nota fiscal", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Nota Fiscal" }).click();

  // Playwright usa setInputFiles para upload de arquivo
  await page.setInputFiles('input[type="file"]', "cypress/fixtures/nota_exemplo.pdf");

  await page.getByRole("button", { name: "Analisar nota" }).click();

  // OCR pode demorar — use timeout maior
  await expect(
    page.getByText("Despesa criada automaticamente a partir da nota fiscal.")
  ).toBeVisible({ timeout: 15000 });
});`}</CodeBlock>
        </SubSection>

        <SubSection title="6. Dashboard — cards de resumo">
          <CodeBlock lang="typescript">{`test("cards de resumo existem no dashboard", async ({ page }) => {
  await page.goto("/");

  // Os 3 cards devem existir
  await expect(page.getByText("Entradas").first()).toBeVisible();
  await expect(page.getByText("Despesas").first()).toBeVisible();
  await expect(page.getByText("Lançamentos").first()).toBeVisible();

  // As barras de progresso devem existir
  await expect(page.getByText("Entradas previstas")).toBeVisible();
  await expect(page.getByText("Gastos acumulados")).toBeVisible();
});`}</CodeBlock>
        </SubSection>
      </Section>

      {/* ── Trocando o stage no Jenkins ── */}
      <Section title="Trocando o stage no Jenkins">
        <P>
          Substitua o stage de Cypress pelo de Playwright no{" "}
          <Code>Jenkinsfile</Code>. O comportamento do gatekeeper é idêntico:
          FAILURE bloqueia o deploy.
        </P>
        <CodeBlock lang="groovy">{`// Remova este stage:
stage("E2E Tests (Cypress + Cucumber)") {
  steps {
    sh "npm run test:e2e:ci"
  }
}

// Adicione este:
stage("E2E Tests (Playwright)") {
  steps {
    sh "npx playwright install --with-deps chromium"
    sh "npm run test:e2e:playwright"
  }
  post {
    always {
      archiveArtifacts artifacts: "playwright-report/**/*", allowEmptyArchive: true
    }
  }
}`}</CodeBlock>
        <P>
          No <Code>package.json</Code>, adicione o script:
        </P>
        <CodeBlock lang="json">{`{
  "scripts": {
    "test:e2e:playwright": "npx playwright test"
  }
}`}</CodeBlock>
        <Warning>
          Se o <Code>playwright.config.ts</Code> tiver múltiplos{" "}
          <Code>projects</Code> (Chrome, Firefox, Safari), o tempo de execução
          triplica. Para o Jenkins, restrinja a <Code>chromium</Code> enquanto
          desenvolve.
        </Warning>
      </Section>

      {/* ── HTML Report ── */}
      <Section title="Gerando e lendo o relatório HTML">
        <CodeBlock lang="bash">{`# Rodar todos os testes e gerar relatório
npx playwright test

# Abrir o relatório no navegador
npx playwright show-report

# Se um teste falhou e gerou trace:
npx playwright show-trace playwright-test-results/nome-do-teste/trace.zip`}</CodeBlock>
        <Tip>
          O Trace Viewer permite navegar passo a passo pela execução, ver o
          estado da página em cada momento e identificar exatamente onde o
          teste divergiu. É a evidência mais valiosa para o relatório.
        </Tip>
      </Section>

      {/* ── Cypress vs Playwright ── */}
      <Section title="O que muda em relação ao Cypress">
        <div className="overflow-hidden rounded-xl border border-[var(--border)]">
          <table className="w-full text-[0.875rem]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[rgba(31,42,34,0.04)]">
                <th className="px-4 py-3 text-left font-semibold">Aspecto</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--accent-forest)]">Cypress (Semana 1)</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--accent-amber)]">Playwright (Semana 2)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {[
                ["Formato dos testes", "Gherkin (.feature) + step definitions", "TypeScript puro (.spec.ts)"],
                ["Sintaxe", "cy.get().click()", "await page.click()"],
                ["Async", "Fila interna, sem await", "async/await explícito"],
                ["Browsers", "Chromium/Electron", "Chrome, Firefox, Safari"],
                ["Relatório", "Plugins externos", "HTML report embutido"],
                ["Debug", "UI interativa própria", "Trace Viewer (replay)"],
                ["Upload de arquivo", "cy.fixture() + attachFile()", "page.setInputFiles()"],
              ].map(([asp, cy, pw]) => (
                <tr key={asp} className="bg-white/40">
                  <td className="px-4 py-3 font-medium">{asp}</td>
                  <td className="px-4 py-3 text-[0.8rem] text-[var(--accent-forest)]">{cy}</td>
                  <td className="px-4 py-3 text-[0.8rem] text-[var(--accent-amber)]">{pw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Evidências ── */}
      <Section title="Evidências obrigatórias da Semana 2">
        <ul className="space-y-2">
          {[
            "Os 6 testes Playwright escritos (arquivo playwright/fluxo-financeiro.spec.ts).",
            "Print do Jenkins com o stage Playwright falhando (antes de terminar).",
            "HTML report do Playwright com o trace do teste que falhou.",
            "Print da pipeline verde com Playwright após implementar.",
            "Comparação objetiva Cypress × Playwright: o que ficou mais claro? Qual foi mais expressivo?",
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
        href="/instrucoes/testrigor"
        label="Semana 3 — TestRigor"
        description="Escreva os mesmos testes em linguagem natural e compare as três ferramentas."
      />
    </div>
  );
}
