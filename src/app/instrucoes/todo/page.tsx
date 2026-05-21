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
  title: "Features a implementar | Fluxo Financeiro",
};

export default function TodoPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        badge="Features · Mapa do scaffold"
        title="O que implementar"
        description="O projeto já tem estrutura, UI e testes prontos. Sua tarefa é preencher os TODO implement — as duas features obrigatórias de persistência e, opcionalmente, o OCR de nota fiscal."
      />

      {/* ── Visão geral ── */}
      <Section title="Como o scaffold funciona">
        <P>
          O código que você recebeu é um <strong>scaffold</strong> — estrutura
          inicial pronta para você completar. A interface já existe, os hooks
          já estão conectados, os tipos já estão definidos, e os testes já
          cobrem os contratos esperados.
        </P>
        <P>
          Procure no código por comentários marcados com{" "}
          <Code>TODO implement</Code>. Esses são os únicos pontos onde você
          precisa escrever código novo.
        </P>
        <CodeBlock lang="bash">{`# Arquivos com TODO implement
src/services/income-entry-service.ts     ← Feature 01: entradas (obrigatório)
src/services/expense-service.ts          ← Feature 02: saídas manuais (obrigatório)
src/app/api/receipt-extraction/route.ts  ← Feature 03: OCR nota fiscal (opcional)
Jenkinsfile                              ← stage Deploy Vercel`}</CodeBlock>
        <Warning>
          Não altere a assinatura das funções nem as props dos componentes.
          Os testes existentes cobrem as interfaces públicas — se você mudar
          os contratos, os testes vão quebrar por razão errada.
        </Warning>
      </Section>

      {/* ── Feature 01 ── */}
      <Section title="Feature 01 — Cadastro de Entradas (obrigatório)">
        <P>
          O formulário de entradas já renderiza e valida. O que falta é a
          persistência: quando o usuário clica em "Salvar entrada", os dados
          precisam ir para o Firestore e o dashboard precisa atualizar em
          tempo real.
        </P>

        <SubSection title="Arquivos a modificar:">
          <ul className="space-y-2">
            {[
              ["src/services/income-entry-service.ts", "implementar createIncomeEntry() e subscribeToIncomeEntries()"],
              ["src/services/use-income-entries.ts", "substituir o fallback de demo pela soma real do Firestore"],
            ].map(([file, desc]) => (
              <li key={file} className="rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem]">
                <code className="font-mono text-[0.8rem] text-[var(--foreground)]">{file}</code>
                <p className="mt-1 text-[var(--muted)]">{desc}</p>
              </li>
            ))}
          </ul>
        </SubSection>

        <SubSection title="O que precisa funcionar:">
          <ul className="space-y-1.5 pl-2 text-[0.9rem] text-[var(--muted)]">
            {[
              "Submeter o formulário persiste a entrada na coleção do Firestore.",
              "O card 'Entradas' atualiza em tempo real (sem reload).",
              "O saldo no header reflete a diferença entradas − despesas.",
              "Recarregar a página mantém os dados.",
              "Os cenários @todo do todo-create-income-entry.feature passam.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-forest)]" />
                {item}
              </li>
            ))}
          </ul>
        </SubSection>

        <Think>
          Como o Firestore sincroniza em tempo real? Pesquise a diferença
          entre <Code>onSnapshot()</Code> (listener em tempo real) e{" "}
          <Code>getDocs()</Code> (leitura única). Qual faz mais sentido para
          um dashboard que precisa atualizar enquanto o usuário usa?
        </Think>
        <Tip>
          O Firebase já está configurado em <Code>src/services/firebase.ts</Code>.
          Importe o <Code>db</Code> de lá — não crie uma segunda instância.
        </Tip>
      </Section>

      {/* ── Feature 02 ── */}
      <Section title="Feature 02 — Saída Manual (obrigatório)">
        <P>
          Muito parecida com a Feature 01, mas para despesas. O formulário
          valida, o hook existe — falta a persistência e a exclusão.
        </P>

        <SubSection title="Arquivo a modificar:">
          <div className="rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem]">
            <code className="font-mono text-[0.8rem] text-[var(--foreground)]">src/services/expense-service.ts</code>
            <p className="mt-1 text-[var(--muted)]">implementar createExpense() e deleteExpense()</p>
          </div>
        </SubSection>

        <SubSection title="O que precisa funcionar:">
          <ul className="space-y-1.5 pl-2 text-[0.9rem] text-[var(--muted)]">
            {[
              "Salvar despesa persiste no Firestore e aparece na lista sem reload.",
              "Deletar despesa remove do Firestore e da lista em tempo real.",
              "O card 'Despesas' atualiza o total automaticamente.",
              "O card 'Lançamentos' atualiza o contador.",
              "Os cenários @todo do todo-create-expense.feature passam.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-amber)]" />
                {item}
              </li>
            ))}
          </ul>
        </SubSection>
        <Think>
          Para deletar, você precisa do ID do documento no Firestore. Olhe
          a interface <Code>Expense</Code> — ela já tem um campo <Code>id</Code>.
          Pesquise <Code>deleteDoc</Code> e <Code>doc(db, "collection", id)</Code>.
        </Think>
      </Section>

      {/* ── Feature 03 — OPCIONAL ── */}
      <Section title="Feature 03 — Nota Fiscal via OCR (opcional)">
        <div className="mb-4 rounded-xl border border-[rgba(217,123,44,0.3)] bg-[rgba(254,249,238,0.8)] px-4 py-3 text-[0.875rem]">
          <p className="font-semibold text-[var(--accent-amber)]">Feature opcional</p>
          <p className="mt-1 text-[var(--muted)]">
            Esta feature não é requisito para a pipeline verde nem para os 6
            cenários obrigatórios de Cypress/Playwright. Implemente se quiser
            nota extra ou se seu grupo quiser o desafio técnico completo.
            Os cenários de OCR no Cypress (<Code>todo-ocr-extraction.feature</Code>)
            só precisam passar se você implementar esta feature.
          </p>
        </div>

        <P>
          O usuário envia um PDF ou imagem de nota fiscal, o sistema lê o
          conteúdo com OCR/IA e cria uma despesa automaticamente com o nome
          do estabelecimento e o valor da compra.
        </P>

        <SubSection title="Fluxo completo:">
          <Steps>
            <Step n={1}>
              Usuário seleciona arquivo no painel "Nota Fiscal" e clica em
              "Analisar nota".
            </Step>
            <Step n={2}>
              O serviço cliente (<Code>src/services/receipt-upload.ts</Code>)
              envia o arquivo via <Code>FormData</Code> para{" "}
              <Code>POST /api/receipt-extraction</Code>.
            </Step>
            <Step n={3}>
              A rota lê o arquivo, converte para base64 e chama o provedor
              de OCR/IA de sua escolha.
            </Step>
            <Step n={4}>
              A rota retorna:{" "}
              <Code>{`{ establishmentName, amount, suggestedCategory }`}</Code>
            </Step>
            <Step n={5}>
              O serviço cliente transforma o JSON em um{" "}
              <Code>ExpenseInput</Code> e chama <Code>createExpense()</Code>{" "}
              (Feature 02) para salvar no Firestore.
            </Step>
          </Steps>
        </SubSection>

        <SubSection title="O que já está pronto:">
          <P>
            O scaffold já faz quase tudo — você só precisa integrar o
            provedor de OCR. Veja o que cada arquivo já tem:
          </P>
          <ul className="space-y-2">
            {[
              ["src/services/receipt-upload.ts", "A função extractExpenseFromReceipt() já faz o fetch para a rota, trata erros e mapeia o resultado com mapReceiptExtractionToExpense(). Está completa."],
              ["src/app/api/receipt-extraction/route.ts", "Já lê o arquivo, já converte para base64. Só falta a chamada ao provedor de OCR/IA no bloco TODO implement."],
            ].map(([file, desc]) => (
              <li key={file} className="rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem]">
                <code className="font-mono text-[0.8rem] text-[var(--foreground)]">{file}</code>
                <p className="mt-1 text-[var(--muted)]">{desc}</p>
              </li>
            ))}
          </ul>
        </SubSection>

        <SubSection title="O único TODO restante — integrar o OCR (route.ts):">
          <P>
            Abra <Code>src/app/api/receipt-extraction/route.ts</Code>. O
            arquivo já converte o arquivo para base64. Você precisa substituir
            o bloco <Code>TODO implement</Code> pela chamada ao provedor:
          </P>
          <CodeBlock lang="typescript">{`// O que já está pronto na rota — não precisa alterar:
const bytes = await receipt.arrayBuffer();
const base64 = Buffer.from(bytes).toString("base64");
const mediaType = receipt.type; // "image/jpeg", "application/pdf", etc.

// ── Sua tarefa: escolha um provedor e substitua o TODO abaixo ──

// Opção A — Claude API (recomendado, professor pode fornecer a key):
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": process.env.ANTHROPIC_API_KEY!,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-opus-4-7",
    max_tokens: 256,
    messages: [{
      role: "user",
      content: [
        {
          type: "image",
          source: { type: "base64", media_type: mediaType, data: base64 },
        },
        {
          type: "text",
          text: 'Extraia desta nota fiscal. Responda SOMENTE com JSON: ' +
                '{"establishmentName":"...","amount":0.00,"suggestedCategory":"..."}. ' +
                'suggestedCategory deve ser uma de: Alimentação, Transporte, ' +
                'Saúde, Educação, Lazer, Moradia, Outros.',
        },
      ],
    }],
  }),
});
const data = await response.json();
const extracted = JSON.parse(data.content[0].text);

return Response.json({
  establishmentName: extracted.establishmentName,
  amount: Number(extracted.amount),
  suggestedCategory: extracted.suggestedCategory,
});`}</CodeBlock>

          <ul className="mt-3 space-y-2 pl-1">
            {[
              {
                name: "Claude API",
                env: "ANTHROPIC_API_KEY",
                note: "Server-side, sem NEXT_PUBLIC_. Lida bem com PDFs e imagens.",
              },
              {
                name: "Google Cloud Vision",
                env: "GOOGLE_CLOUD_KEY_JSON",
                note: "Use TEXT_DETECTION e processe o rawText com regex para extrair valor.",
              },
              {
                name: "Tesseract.js (sem key)",
                env: "Nenhuma variável necessária",
                note: "npm install tesseract.js — open source, sem custo.",
              },
            ].map((opt) => (
              <li key={opt.name} className="rounded-xl border border-[var(--border)] bg-white/50 px-4 py-2.5 text-[0.875rem]">
                <span className="font-semibold text-[var(--foreground)]">{opt.name}</span>
                {" — "}
                <span className="text-[var(--muted)]">{opt.note}</span>
                <span className="ml-2 font-mono text-[0.775rem] text-[var(--accent-clay)]">
                  [{opt.env}]
                </span>
              </li>
            ))}
          </ul>
        </SubSection>

        <Note>
          A função <Code>mapReceiptExtractionToExpense()</Code> em{" "}
          <Code>receipt-upload.ts</Code> já valida a categoria — se o modelo
          retornar algo fora da lista de categorias válidas, ela cai para{" "}
          <Code>"Outros"</Code> automaticamente.
        </Note>
      </Section>

      {/* ── Jenkinsfile ── */}
      <Section title="Completando o stage Deploy Vercel no Jenkinsfile">
        <P>
          O <Code>Jenkinsfile</Code> já tem o stage <Code>Deploy Vercel</Code>{" "}
          implementado com <Code>withCredentials</Code>. Você só precisa
          cadastrar as 3 credenciais no Jenkins e preencher com os valores da
          sua conta Vercel.
        </P>
        <SubSection title="Cadastrando as credenciais no Jenkins:">
          <Steps>
            <Step n={1}>
              Acesse <strong>Manage Jenkins → Credentials → (global) → Add Credentials</strong>.
            </Step>
            <Step n={2}>
              Selecione o tipo <strong>Secret text</strong>.
            </Step>
            <Step n={3}>
              Crie três credenciais com os IDs exatos:{" "}
              <Code>VERCEL_TOKEN</Code>, <Code>VERCEL_ORG_ID</Code>,{" "}
              <Code>VERCEL_PROJECT_ID</Code>.
            </Step>
            <Step n={4}>
              Os valores vêm do painel da Vercel:{" "}
              <strong>Settings → Tokens</strong> (para o token) e{" "}
              <strong>Settings → General</strong> (para org e project ID).
            </Step>
          </Steps>
        </SubSection>
        <Warning>
          Nunca coloque o token da Vercel diretamente no <Code>Jenkinsfile</Code>.
          O arquivo fica no repositório público — use sempre{" "}
          <Code>withCredentials</Code> para que o Jenkins injete as variáveis
          sem expô-las no log.
        </Warning>
      </Section>

      {/* ── Historia do deploy barrado ── */}
      <Section title="O deploy que foi barrado — reproduza este cenário">
        <Story>
          <P>
            Era meia-noite. Pedro tinha implementado a Feature 02 e estava
            animado. Fez commit e <Code>git push</Code> sem rodar os testes
            localmente. <em>"Parece certo"</em>, pensou.
          </P>
          <P>
            O Jenkins recebeu o webhook e iniciou o pipeline. Install, unit
            tests, build — tudo passou. Na etapa{" "}
            <strong>"E2E Tests"</strong>, os cenários <Code>@todo</Code> que
            Pedro tinha ativado rodaram — e falharam.
          </P>
          <CodeBlock lang="bash">{`[Cypress] FAIL cypress/e2e/todo-create-expense.feature

  ✕ Salva uma saida manual com dados validos e exibe na lista

    AssertionError: Timed out retrying after 4000ms:
      Expected to find content: 'Mercado semanal'
      but never did.

      cy.contains('Mercado semanal')

      This element was not found because createExpense()
      returns undefined instead of persisting to Firestore.`}</CodeBlock>
          <P>
            O stage "Deploy Vercel" <strong>não foi executado</strong>. A
            produção ficou com a versão anterior. O Jenkins marcou o build
            como <strong>FAILURE</strong>.
          </P>
          <P>
            Pedro leu o erro. A função <Code>createExpense()</Code> ainda
            estava com <Code>TODO implement</Code> — não persistia nada.
            Ele implementou, rodou <Code>npm run test:e2e:ci</Code> localmente
            até passar, e deu push novamente. Jenkins verde. Deploy na Vercel.
          </P>
        </Story>

        <SubSection title="Como reproduzir (sequência obrigatória da Semana 1):">
          <Steps>
            <Step n={1}>
              Ative os cenários <Code>@todo</Code> escrevendo step definitions
              básicas (que rodem, mas ainda não passem).
            </Step>
            <Step n={2}>
              Faça push <strong>antes</strong> de implementar as features.
            </Step>
            <Step n={3}>
              Capture: Jenkins vermelho + log do stage E2E + screenshots do
              Cypress em <Code>cypress/screenshots/</Code>.
            </Step>
            <Step n={4}>
              Implemente as Features 01 e 02. Rode os testes localmente até
              passar: <Code>npm run test:e2e:ci</Code>.
            </Step>
            <Step n={5}>
              Faça push. Capture: Jenkins verde + deploy na Vercel.
            </Step>
          </Steps>
        </SubSection>
      </Section>

      <NextPage
        href="/instrucoes/cypress"
        label="Cypress — Semana 1"
        description="Os 6 cenários obrigatórios, como ativar os @todo e a sequência de falha → correção."
      />
    </div>
  );
}
