# Trabalho Prático — TestOps com Jenkins

**Disciplina:** Qualidade de Software e TestOps  
**Duração:** 3 semanas  
**Entregável:** Relatório PDF com evidências das 3 semanas + link do repositório com histórico de commits

---

## Contexto

Você recebeu o repositório base de um sistema financeiro chamado **Fluxo Financeiro**. A aplicação já tem interface funcional, mas três features foram deixadas intencionalmente incompletas — marcadas com `TODO implement` no código.

Seu trabalho é implementar as features, controlar a qualidade por meio de testes automatizados e garantir que o deploy na Vercel só aconteça quando a pipeline do Jenkins estiver verde.

A lógica é simples: **se os testes falham, o deploy não acontece.** Você vai vivenciar isso na prática — e documentar cada etapa.

---

## O que você vai implementar

| Feature | Arquivo | O que está faltando | Obrigatoriedade |
| --- | --- | --- | --- |
| 01 — Entradas financeiras | `src/services/income-entry-service.ts` | `createIncomeEntry()` e `subscribeToIncomeEntries()` | **Obrigatório** |
| 02 — Saídas manuais | `src/services/expense-service.ts` | `createExpense()` e `deleteExpense()` | **Obrigatório** |
| 03 — Nota fiscal (OCR) | `src/app/api/receipt-extraction/route.ts` | Integração com API de OCR (Claude, Google Vision ou Tesseract.js) | Opcional |

> **Feature 03 é opcional.** O scaffold do OCR já está quase completo — a rota lê o arquivo, converte para base64 e tem exemplos comentados para 3 provedores diferentes. Se implementar, os cenários de OCR no Cypress/Playwright devem passar. Se não implementar, os 6 cenários obrigatórios (Features 01 e 02) são suficientes para a pipeline verde.

O guia completo de implementação está em `/instrucoes/todo` na aplicação.

---

## Configurando o Deploy Vercel

O `Jenkinsfile` já tem o stage `Deploy Vercel` implementado com `withCredentials`. Você precisa apenas cadastrar 3 credenciais no Jenkins:

1. Acesse **Jenkins → Manage Jenkins → Credentials → (global) → Add Credentials**
2. Tipo: **Secret text**
3. Crie as três com os IDs exatos:

| ID da credencial | Onde encontrar o valor |
| --- | --- |
| `VERCEL_TOKEN` | Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel → Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Vercel → Settings → General → Project ID |

> **Nunca coloque o token diretamente no Jenkinsfile.** O arquivo fica no repositório — use sempre `withCredentials`.

---

## Os 6 cenários obrigatórios de teste

Estes cenários devem ser implementados e documentados nas **três ferramentas** (Cypress, Playwright e TestRigor):

| # | Cenário | Feature |
| --- | --- | --- |
| 1 | Cadastro de entrada financeira — salvar e ver card Entradas atualizado | 01 |
| 2 | Cadastro de saída manual — salvar e ver item na lista de lançamentos | 02 |
| 3 | Exclusão de despesa — clicar no ✕ e verificar que o item sumiu | 02 |
| 4 | Confirmação e limpeza — mensagem de sucesso + campos em branco após salvar | 02 |
| 5 | Upload de nota fiscal — despesa criada automaticamente via OCR | 03 (opcional) |
| 6 | Mensagem de sucesso do OCR — "Despesa criada automaticamente a partir da nota fiscal." | 03 (opcional) |

> Se a Feature 03 não for implementada, os cenários 5 e 6 ficam de fora. Os cenários 1–4 são suficientes para a pipeline verde.

---

## Semana 1 — Cypress + Cucumber (BDD)

**Objetivo:** implementar as Features 01 e 02 e demonstrar que o Jenkins bloqueia o deploy enquanto os testes falham.

**Sequência obrigatória:**

1. Configure o Jenkins, o Firebase e o webhook do GitHub.
2. **Ative os cenários `@todo`** nos arquivos Cypress — escreva step definitions básicas antes de implementar as features.
3. Faça push. O Jenkins deve falhar no stage `E2E Tests (Cypress + Cucumber)`. **Capture esta evidência.**
4. Implemente as Features 01 e 02 (veja `/instrucoes/todo`).
5. Faça os testes passarem localmente: `npm run test:e2e:ci`.
6. Faça push. Pipeline verde + deploy na Vercel. **Capture esta evidência.**

**Arquivos `@todo` para ativar:**
```text
cypress/e2e/todo-create-income-entry.feature
cypress/e2e/todo-create-expense.feature
cypress/e2e/todo-ocr-extraction.feature  ← só se implementar Feature 03
```

**Formato dos testes — Gherkin + Cucumber:**
```gherkin
Scenario: Salva uma saida manual com dados validos e exibe na lista
  Given que acesso a pagina inicial
  When seleciono a aba "Saída Manual"
  And preencho o titulo com "Mercado semanal"
  And preencho o valor com "150.00"
  And clico em "Salvar despesa"
  Then "Mercado semanal" aparece na lista de lancamentos
```

**Evidências obrigatórias:**
- [ ] Pipeline vermelha no Jenkins (E2E Tests falhando)
- [ ] Console Output completo do stage que falhou
- [ ] Screenshots do Cypress em `cypress/screenshots/`
- [ ] Pipeline verde após implementar
- [ ] Deploy publicado na Vercel
- [ ] Os dois commits: o que ativou os testes e o que fez passar
- [ ] Análise de causa raiz (RCA): por que falhou e como o Jenkins protegeu a produção

---

## Semana 2 — Playwright (TypeScript puro)

**Objetivo:** migrar do Cypress para o Playwright, reescrever os cenários em TypeScript com `async/await` e trocar o stage no Jenkinsfile.

> **Sem Cucumber na Semana 2.** O Cypress (Semana 1) usou Gherkin + Cucumber. O Playwright aqui é TypeScript puro em arquivos `.spec.ts`. Você vai comparar as duas abordagens no relatório.

**Formato dos testes — TypeScript puro:**
```typescript
test("salva despesa manual e aparece na lista", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Saída Manual" }).click();
  await page.getByLabel("Título da despesa").fill("Mercado semanal");
  await page.getByLabel("Valor (R$)").fill("150");
  await page.getByRole("button", { name: "Salvar despesa" }).click();
  await expect(page.getByText("Mercado semanal")).toBeVisible();
});
```

**Isolamento de estado com `beforeEach`:**

Testes que dependem de dados pré-existentes (ex: exclusão) devem usar `test.beforeEach` para criar o estado necessário antes de rodar:

```typescript
test.describe("exclusão de despesa", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Saída Manual" }).click();
    await page.getByLabel("Título da despesa").fill("Despesa para exclusão");
    await page.getByLabel("Valor (R$)").fill("50");
    await page.getByRole("button", { name: "Salvar despesa" }).click();
    await expect(page.getByText("Despesa para exclusão")).toBeVisible();
  });

  test("exclui uma despesa da lista", async ({ page }) => {
    await page.getByRole("button", { name: "✕" }).first().click();
    await expect(page.getByText("Despesa para exclusão")).not.toBeVisible();
  });
});
```

**Troca no Jenkinsfile:**
```groovy
// Remova:
stage("E2E Tests (Cypress + Cucumber)") { ... }

// Adicione:
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
}
```

**Evidências obrigatórias:**
- [ ] Os cenários reescritos em TypeScript (arquivo `playwright/fluxo-financeiro.spec.ts`)
- [ ] Print do Jenkins com stage Playwright falhando
- [ ] HTML report do Playwright com trace do teste que falhou
- [ ] Print da pipeline verde com Playwright
- [ ] Comparação objetiva Cypress × Playwright (facilidade, expressividade, debugging)

---

## Semana 3 — TestRigor (linguagem natural)

**Objetivo:** escrever os mesmos cenários em linguagem natural e desenvolver senso crítico sobre quando usar cada ferramenta.

> O TestRigor **não é integrado ao Jenkins** nesta semana. É uma atividade comparativa independente — ele roda na nuvem e precisa de uma URL pública (Vercel).

**Formato dos testes — linguagem natural:**
```text
open "https://seu-app.vercel.app"
click on "Saída Manual"
enter "Mercado semanal" into "Título da despesa"
enter "150" into "Valor (R$)"
click on "Salvar despesa"
check that page contains "Despesa cadastrada com sucesso."
```

**Evidências obrigatórias:**
- [ ] Print dos 6 testes escritos no painel TestRigor
- [ ] Print da execução com resultado de cada teste (verde/vermelho)
- [ ] Log detalhado de pelo menos um teste que falhou
- [ ] Tabela comparativa preenchida: Cypress × Playwright × TestRigor
- [ ] Conclusão técnica: em qual cenário real cada ferramenta seria a escolha certa?

---

## Comparação entre ferramentas (preencher no relatório)

| Critério | Cypress | Playwright | TestRigor |
| --- | --- | --- | --- |
| Formato dos testes | Gherkin (.feature) | TypeScript (.spec.ts) | Linguagem natural |
| Tempo para criar os 6 cenários | — | — | — |
| Facilidade para iniciantes | — | — | — |
| Integração com Jenkins | Nativa | Nativa | Via API (limitada) |
| Relatório de evidências | Plugins externos | HTML + Trace Viewer | Painel visual |
| Manutenção quando UI muda | Frágil (seletores) | Frágil (seletores) | Resistente (IA) |
| Custo | Open-source | Open-source | Freemium (SaaS) |
| Controle técnico | Alto | Alto | Baixo |

---

## Estrutura do relatório PDF

```
1. Introdução
   - Contexto do Fluxo Financeiro
   - Diagrama: código → push → GitHub → webhook → Jenkins → Vercel

2. Semana 1 — Cypress + Features
   - Implementação das Features 01 e 02 (03 se implementado)
   - Deploy barrado: evidências (print + console log)
   - Pipeline verde: evidências
   - Análise de causa raiz (RCA)

3. Semana 2 — Playwright
   - Jenkinsfile modificado (stage Playwright)
   - HTML report com trace do teste que falhou
   - Comparação com Cypress

4. Semana 3 — TestRigor
   - Testes em linguagem natural
   - Tabela comparativa preenchida
   - Conclusão técnica

5. Conclusão geral
   - Lições aprendidas
   - O que faria diferente em um projeto real
```

---

## Critérios de avaliação

| Critério | Peso |
| --- | --- |
| Features 01 e 02 implementadas corretamente | 25% |
| Pipeline Jenkins funcionando (gate de deploy) | 20% |
| 6 cenários documentados em Cypress | 15% |
| 6 cenários documentados em Playwright | 15% |
| 6 cenários documentados em TestRigor | 10% |
| Qualidade do relatório e análise crítica | 15% |

---

## Recursos

- Instruções completas: `/instrucoes` na aplicação deployada
- Jenkins e CI/CD: `/instrucoes/jenkins`
- Deploy Vercel: `/instrucoes/deploy`
- Features a implementar: `/instrucoes/todo`
- Cypress — Semana 1: `/instrucoes/cypress`
- Playwright — Semana 2: `/instrucoes/playwright`
- TestRigor — Semana 3: `/instrucoes/testrigor`
- Checklist do relatório: `/instrucoes/relatorio`
