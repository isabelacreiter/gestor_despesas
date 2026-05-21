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
  title: "Deploy com Vercel | Fluxo Financeiro",
};

export default function DeployPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        badge="Automação · Seção 02"
        title="Deploy com Vercel"
        description="Aprenda a publicar sua aplicação na internet com a Vercel e conectá-la ao pipeline do Jenkins para deploys automáticos."
      />

      {/* ── O que é a Vercel ── */}
      <Section title="O que é a Vercel?">
        <P>
          A Vercel é uma plataforma de hospedagem especializada em aplicações
          Next.js. Com ela, você publica seu projeto na internet em minutos, sem
          precisar configurar servidor, banco ou infraestrutura.
        </P>
        <P>
          Cada vez que o código é enviado para a branch principal do seu
          repositório, a Vercel pode fazer o deploy automaticamente — ou você
          pode controlar isso pelo Jenkins.
        </P>
        <ul className="space-y-2 pl-1">
          {[
            [
              "URL de produção",
              "o endereço permanente da sua aplicação (ex: fluxo-financeiro.vercel.app).",
            ],
            [
              "Preview deployments",
              "quando você abre um Pull Request, a Vercel cria uma URL temporária para testar aquela versão.",
            ],
            [
              "Environment variables",
              "variáveis de ambiente (como as do Firebase) são configuradas no painel da Vercel, sem aparecer no código.",
            ],
          ].map(([term, def]) => (
            <li
              key={term}
              className="rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3 text-[0.875rem] leading-[1.7]"
            >
              <strong className="text-[var(--foreground)]">{term}:</strong>{" "}
              <span className="text-[var(--muted)]">{def}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Criando conta e importando ── */}
      <Section title="Criando conta e importando o projeto">
        <Steps>
          <Step n={1}>
            Acesse <Code>vercel.com</Code> e crie uma conta usando o GitHub
            (isso facilita a integração).
          </Step>
          <Step n={2}>
            Na tela principal, clique em <strong>"Add New → Project"</strong>.
          </Step>
          <Step n={3}>
            Autorize a Vercel a acessar seus repositórios do GitHub e selecione
            o repositório do projeto.
          </Step>
          <Step n={4}>
            A Vercel detecta automaticamente que é um projeto Next.js. Revise
            as configurações — geralmente não precisa mudar nada.
          </Step>
          <Step n={5}>
            <strong>Antes de clicar em Deploy</strong>: configure as variáveis
            de ambiente. Veja a seção abaixo.
          </Step>
        </Steps>
      </Section>

      {/* ── Variáveis de ambiente ── */}
      <Section title="Configurando as variáveis de ambiente (Firebase)">
        <P>
          O projeto usa Firebase para salvar os dados. As credenciais do Firebase
          não devem estar no código-fonte (imagine commitar sua senha no
          GitHub!). Elas ficam em{" "}
          <strong>variáveis de ambiente</strong>.
        </P>
        <P>
          Localmente, você usa um arquivo <Code>.env.local</Code>. Na Vercel,
          você configura essas mesmas variáveis pelo painel.
        </P>
        <SubSection title="Onde configurar na Vercel:">
          <Steps>
            <Step n={1}>
              No painel do projeto, vá em{" "}
              <strong>Settings → Environment Variables</strong>.
            </Step>
            <Step n={2}>
              Para cada variável do seu arquivo <Code>.env.local</Code>,
              clique em <strong>"Add New"</strong> e insira o nome e o valor.
            </Step>
            <Step n={3}>
              As variáveis que o projeto usa começam com{" "}
              <Code>NEXT_PUBLIC_FIREBASE_</Code>. Todas elas precisam estar
              configuradas aqui.
            </Step>
            <Step n={4}>
              Escolha em quais ambientes aplicar:{" "}
              <strong>Production, Preview e Development</strong>.
            </Step>
          </Steps>
        </SubSection>
        <Warning>
          Nunca commite o arquivo <Code>.env.local</Code> no GitHub. Verifique
          se ele está no <Code>.gitignore</Code>. Credenciais expostas em
          repositórios públicos podem ser usadas por terceiros.
        </Warning>
        <Tip>
          Se a aplicação abrir na Vercel mas mostrar o aviso de "Firebase não
          configurado", é sinal que alguma variável está faltando ou com nome
          errado. Revise cada uma delas.
        </Tip>
      </Section>

      {/* ── Conectando com Jenkins ── */}
      <Section title="Conectando Jenkins com a Vercel">
        <P>
          Existem duas formas de fazer o Jenkins enviar o código para a Vercel:
          usando o <strong>Vercel CLI</strong> ou usando um{" "}
          <strong>deploy hook</strong> (URL especial que dispara um deploy).
        </P>

        <SubSection title="Opção A — Vercel CLI (recomendada para este projeto)">
          <P>
            O Vercel CLI é uma ferramenta de linha de comando. Com ela, você
            pode fazer deploy a partir de qualquer terminal — inclusive o
            terminal do Jenkins.
          </P>
          <P>
            A ideia é: no estágio de Deploy do seu Jenkinsfile, você chama o
            comando da CLI para publicar a versão atual.
          </P>
          <CodeBlock lang="groovy">{`stage('Deploy') {
  steps {
    // Instale o Vercel CLI globalmente antes
    // e configure o token como variável de ambiente no Jenkins
    sh 'npx vercel --prod --token $VERCEL_TOKEN'
    //                              ↑ variável de ambiente segura
    //                                (não escreva o token direto aqui!)
  }
}`}</CodeBlock>
          <Think>
            Como você faz o Jenkins usar um token secreto sem colocá-lo
            diretamente no Jenkinsfile? Pesquise sobre "Jenkins Credentials" e
            "withCredentials". Isso é uma prática de segurança essencial.
          </Think>
        </SubSection>

        <SubSection title="Opção B — Deploy Hook">
          <P>
            Um deploy hook é uma URL especial que, quando acessada, dispara um
            deploy na Vercel. É mais simples, mas menos controlável.
          </P>
          <Steps>
            <Step n={1}>
              Na Vercel, vá em{" "}
              <strong>Settings → Git → Deploy Hooks → Create Hook</strong>.
            </Step>
            <Step n={2}>
              Copie a URL gerada.
            </Step>
            <Step n={3}>
              No Jenkinsfile, faça uma requisição para essa URL no estágio de
              Deploy:
            </Step>
          </Steps>
          <CodeBlock lang="groovy">{`stage('Deploy') {
  steps {
    // Envia uma requisição POST para o hook
    sh 'curl -X POST https://api.vercel.com/v1/integrations/deploy/...'
    // Substitua pela URL real do seu deploy hook
  }
}`}</CodeBlock>
        </SubSection>

        <Note>
          Para o relatório, documente qual abordagem você escolheu e por quê.
          Explique como o Jenkins e a Vercel se comunicam no seu pipeline.
        </Note>
      </Section>

      {/* ── Monitorando ── */}
      <Section title="Monitorando o deploy">
        <P>
          Depois de acionar o deploy, você pode acompanhar o progresso no
          painel da Vercel em tempo real. Cada deploy fica registrado com:
        </P>
        <ul className="space-y-1.5 pl-2 text-[0.9rem] text-[var(--muted)]">
          {[
            "A URL do deploy (para acessar aquela versão específica)",
            "O status: Building, Ready ou Error",
            "Os logs de build (para investigar erros)",
            "O commit que originou o deploy",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-forest)]" />
              {item}
            </li>
          ))}
        </ul>
        <Tip>
          Salve screenshots das telas de deploy bem-sucedido e de deploy com
          erro no painel da Vercel. Você vai precisar deles no relatório final.
        </Tip>
      </Section>

      <NextPage
        href="/instrucoes/todo"
        label="Features para implementar"
        description="O que precisa ser codificado, onde está cada TODO e o histórico de um deploy barrado."
      />
    </div>
  );
}
