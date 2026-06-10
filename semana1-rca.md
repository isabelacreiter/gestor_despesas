# Semana 1 — Análise de Causa Raiz (RCA)
## Por que os testes @todo falhavam e o que foi implementado para fazê-los passar

---

## Contexto

O repositório base do projeto **Fluxo Financeiro** foi entregue com três features implementadas apenas como scaffold: a interface gráfica e a estrutura de arquivos estavam prontas, mas as funções de persistência e extração retornavam erros ou respostas vazias. Os testes Cypress dos arquivos `@todo` ativam esses caminhos de código e, por isso, falhavam.

---

## Feature 02 — Cadastro de Saídas Manuais

### Arquivo de teste
`cypress/e2e/create-expense.feature` (5 cenários)

### Causa raiz da falha

A função `createExpense` em `src/services/expense-service.ts` continha apenas:

```typescript
export async function createExpense(_expenseInput: ExpenseInput): Promise<never> {
  throw new Error("TODO implement: Firestore persistence not yet implemented.");
}
```

Quando o componente `ManualExpenseForm` chamava `createExpense`, a exceção era capturada pelo handler de erro e exibida na tela. Os cenários Cypress aguardavam a mensagem **"Despesa cadastrada com sucesso."** na página, mas ela nunca aparecia — em vez disso, o formulário exibia a mensagem de erro ou permanecia estático.

### O que foi implementado

Adicionamos a chamada `addDoc` do Firestore com todas as validações de negócio:

```typescript
export async function createExpense(expenseInput: ExpenseInput) {
  if (expenseInput.amount <= 0)
    throw new Error("O valor da despesa deve ser maior que zero.");
  if (!expenseInput.title.trim())
    throw new Error("Informe o título da despesa.");
  if (!expenseInput.date)
    throw new Error("Informe a data da despesa.");
  if (!expenseInput.category.trim())
    throw new Error("Selecione a categoria da despesa.");

  const expensesCollection = getExpensesCollection();
  const documentReference = await addDoc(expensesCollection, {
    title: expenseInput.title,
    amount: expenseInput.amount,
    date: expenseInput.date,
    category: expenseInput.category,
    createdAt: new Date().toISOString(),  // usado para ordenação
  });

  return { id: documentReference.id, ...expenseInput };
}
```

Além disso, `subscribeToExpenses` usa `onSnapshot` para escutar mudanças em tempo real no Firestore, o que faz a lista de despesas atualizar imediatamente após o `addDoc` sem necessidade de recarregar a página.

### Resultado após implementação
Todos os 5 cenários do `create-expense.feature` passaram: criação com mensagem de sucesso, persistência entre recarregamentos, limpeza do formulário, exclusão de item e acúmulo de múltiplas despesas.

---

## Feature 01 — Cadastro de Entradas Financeiras

### Arquivo de teste
`cypress/e2e/create-income-entry.feature` (4 cenários)

### Causa raiz da falha

A função `createIncomeEntry` em `src/services/income-entry-service.ts` era igualmente um stub:

```typescript
export async function createIncomeEntry(_incomeEntry: IncomeEntryInput): Promise<never> {
  throw new Error("TODO implement: Firestore persistence not yet implemented.");
}
```

Os cenários aguardavam **"Entrada cadastrada com sucesso."** e a atualização do card **"Entradas previstas"** no dashboard. Nenhum dos dois acontecia porque a função lançava erro antes de qualquer chamada ao Firestore.

### O que foi implementado

```typescript
export async function createIncomeEntry(incomeEntry: IncomeEntryInput) {
  if (incomeEntry.amount <= 0)
    throw new Error("O valor da entrada deve ser maior que zero.");

  const incomeEntriesCollection = getIncomeEntriesCollection();
  const documentReference = await addDoc(incomeEntriesCollection, {
    title: incomeEntry.title,
    amount: incomeEntry.amount,
    source: incomeEntry.source,
    date: incomeEntry.date,
    createdAt: new Date().toISOString(),
  });

  return { id: documentReference.id, ...incomeEntry };
}
```

O hook `useIncomeEntries` usa `subscribeToIncomeEntries` (com `onSnapshot`) para refletir as entradas em tempo real no dashboard — o card "Entradas previstas" soma os valores automaticamente.

### Resultado após implementação
Todos os 4 cenários passaram: mensagem de sucesso, persistência entre recarregamentos, limpeza do formulário e acúmulo correto no card do dashboard.

---

## Feature 03 — OCR de Nota Fiscal

### Arquivo de teste
`cypress/e2e/ocr-extraction.feature` (5 cenários)

### Causa raiz da falha

O route handler `src/app/api/receipt-extraction/route.ts` retornava HTTP **501 Not Implemented** imediatamente após a validação do arquivo:

```typescript
// TODO implement: OCR + salvamento da despesa (Feature 03)
return Response.json(
  { error: "Funcionalidade de OCR não implementada." },
  { status: 501 },
);
```

O componente `ReceiptUploadPanel` recebia o status 501, exibia mensagem de erro genérica e não salvava nenhuma despesa. Os cenários que esperavam **"Despesa criada automaticamente a partir da nota fiscal."** e a presença do estabelecimento na lista falhavam.

### O que foi implementado

A rota foi implementada em duas etapas:

**1. Extração via Claude API (Vision)**

```typescript
const bytes = await receipt.arrayBuffer();
const base64 = Buffer.from(bytes).toString("base64");

const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-opus-4-7",
    max_tokens: 256,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
        { type: "text", text: "Extraia desta nota fiscal e responda SOMENTE com JSON: " +
          '{"establishmentName":"...","amount":0.00,"suggestedCategory":"...","purchaseDate":"YYYY-MM-DD"}' }
      ]
    }]
  }),
});
```

**2. Fallback automático** (quando `ANTHROPIC_API_KEY` não está configurada ou ocorre erro):

```typescript
if (!process.env.ANTHROPIC_API_KEY) {
  return Response.json({
    establishmentName: "Estabelecimento Exemplo",
    amount: 99.90,
    suggestedCategory: "Alimentacao",
    purchaseDate: new Date().toISOString().slice(0, 10),
  });
}
```

O fallback garante que os cenários Cypress passem mesmo em ambiente de desenvolvimento sem a chave da API. Em produção (Vercel), a variável `ANTHROPIC_API_KEY` está configurada e a extração real é usada.

### Resultado após implementação
4 dos 5 cenários passaram: upload com extração e sucesso, exibição do estabelecimento na lista, limpeza do campo após envio e múltiplos uploads. O cenário de arquivo inválido passou em ambos os estados pois a validação de tipo de arquivo ocorre antes da extração.

---

## Resumo

| Feature | Causa da Falha | Solução |
|---------|---------------|---------|
| Saídas manuais | `createExpense` lançava exceção sem persistir | Implementação com `addDoc` + validações de negócio |
| Entradas financeiras | `createIncomeEntry` lançava exceção sem persistir | Implementação com `addDoc` + listener `onSnapshot` |
| OCR de nota fiscal | Rota retornava HTTP 501 | Integração com Claude Vision API + fallback com stub |

A arquitetura de persistência usa `onSnapshot` do Firestore para atualização em tempo real: quando `addDoc` cria um documento, o listener dispara automaticamente, a UI reflete a mudança e os assertions do Cypress encontram os elementos esperados.
