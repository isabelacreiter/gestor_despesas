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
  title: "Jenkins e CI/CD | Fluxo Financeiro",
};

export default function JenkinsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        badge="Automação · Seção 01"
        title="Jenkins e CI/CD"
        description="Configure o Jenkins, conecte ao seu repositório GitHub via webhook e entenda como o pipeline controla o deploy das 3 semanas do trabalho."
      />

      {/* ── O que é CI/CD ── */}
      <Section title="O que é CI/CD?">
        <P>
          Imagine uma fábrica de carros. Antigamente, um carro era montado do
          início ao fim por uma única pessoa. Se algo dava errado no final,
          ninguém sabia onde o problema tinha começado.
        </P>
        <P>
          A linha de montagem mudou isso: cada etapa é feita em ordem, e cada
          peça é verificada antes de passar para a próxima.{" "}
          <strong>CI/CD funciona exatamente assim para software.</strong>
        </P>
        <ul className="space-y-2 pl-1">
          {[
            [
              "CI — Integração Contínua",
              "toda vez que você envia código ao repositório, o sistema testa automaticamente se tudo continua funcionando.",
            ],
            [
              "CD — Entrega/Deploy Contínuo",
              "depois que os testes passam, o sistema publica a versão atualizada na Vercel automaticamente — sem você precisar fazer nada.",
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
        <Tip>
          A lógica central deste trabalho:{" "}
          <strong>se os testes falham, o deploy não acontece.</strong> O Jenkins
          é o gatekeeper. Você vai vivenciar isso na prática nas 3 semanas.
        </Tip>
      </Section>

      {/* ── O que é o Jenkins ── */}
      <Section title="O que é o Jenkins?">
        <P>
          Jenkins é um servidor de automação open source. Ele fica{" "}
          <em>"de plantão"</em> observando seu repositório no GitHub. Quando
          você faz um <Code>git push</Code>, o Jenkins recebe um sinal chamado{" "}
          <strong>webhook</strong> e executa a sequência de etapas que você
          definiu no <Code>Jenkinsfile</Code>.
        </P>
        <P>
          Esse arquivo já existe na raiz do projeto. As etapas são:
        </P>
        <ul className="space-y-1.5 pl-2 text-[0.9rem] text-[var(--muted)]">
          {[
            ["Checkout", "baixa o código do GitHub para o servidor Jenkins"],
            ["Install", "roda npm ci para instalar dependências"],
            ["Unit Tests", "roda os testes unitários com Jest"],
            ["Build", "faz o build de produção com next build"],
            ["E2E Tests", "roda o Cypress (Semana 1) ou Playwright (Semana 2)"],
            ["Deploy Vercel", "só executa se tudo acima passou — TODO implement"],
          ].map(([step, desc]) => (
            <li key={step} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-forest)]" />
              <span>
                <strong className="text-[var(--foreground)]">{step}:</strong>{" "}
                {desc}
              </span>
            </li>
          ))}
        </ul>
        <Warning>
          O stage <Code>Deploy Vercel</Code> tem <Code>TODO implement</Code> —
          você precisa configurar as credenciais da Vercel no Jenkins para que
          o deploy automático funcione. Veja a seção Deploy nestas instruções.
        </Warning>
      </Section>

      {/* ── O Jenkinsfile real ── */}
      <Section title="O Jenkinsfile do projeto">
        <P>
          Este é o <Code>Jenkinsfile</Code> que já está na raiz do repositório.
          Estude cada stage antes de conectar ao Jenkins.
        </P>
        <CodeBlock lang="groovy">{`pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timestamps()
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("Install") {
      steps {
        sh "npm ci"
      }
    }

    stage("Unit Tests") {
      steps {
        sh "npm run test -- --runInBand"
      }
    }

    stage("Build") {
      steps {
        sh "npm run build"
      }
    }

    // Semana 1: Cypress + Cucumber
    stage("E2E Tests (Cypress + Cucumber)") {
      steps {
        sh "npm run test:e2e:ci"
      }
      post {
        always {
          archiveArtifacts artifacts: "cypress/screenshots/**/*.png,cypress/videos/**/*.mp4",
                           allowEmptyArchive: true
        }
      }
    }

    stage("Deploy Vercel") {
      when {
        branch "main"
      }
      steps {
        // Pré-requisito: cadastre as três credenciais em
        // Jenkins → Manage Jenkins → Credentials → (global) → Add Credentials
        //   Tipo: Secret text | IDs: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
        // Os valores vêm do painel da Vercel (Settings → Tokens / General).
        withCredentials([
          string(credentialsId: "VERCEL_TOKEN",      variable: "VERCEL_TOKEN"),
          string(credentialsId: "VERCEL_ORG_ID",     variable: "VERCEL_ORG_ID"),
          string(credentialsId: "VERCEL_PROJECT_ID", variable: "VERCEL_PROJECT_ID"),
        ]) {
          sh "npm install --global vercel@latest"
          sh "vercel pull --yes --environment=production --token=$VERCEL_TOKEN"
          sh "vercel build --prod --token=$VERCEL_TOKEN"
          sh "vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN"
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline concluída. Deploy publicado na Vercel."
    }
    failure {
      echo "Pipeline falhou. Deploy bloqueado. Colete os logs para o relatório."
    }
  }
}`}</CodeBlock>
        <Think>
          Por que o stage <Code>Deploy Vercel</Code> tem a condição{" "}
          <Code>when {"{ branch 'main' }"}</Code>? O que acontece se você fizer
          push em uma branch diferente? Isso é intencional — em projetos reais,
          deploys de produção só saem da branch principal.
        </Think>
      </Section>

      {/* ── Semana 2: trocando o stage ── */}
      <Section title="Semana 2: trocando o stage de E2E">
        <P>
          Na Semana 2 você migra de Cypress para Playwright. O Jenkinsfile
          precisa refletir essa troca. Substitua o stage de Cypress por:
        </P>
        <CodeBlock lang="groovy">{`// Semana 2: substitui o stage Cypress pelo Playwright
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
        <Note>
          O stage continua bloqueando o deploy — só muda a ferramenta. O
          comportamento do Jenkins é idêntico: FAILURE se qualquer teste falhar,
          SUCCESS se todos passarem.
        </Note>
      </Section>

      {/* ── Criando o pipeline ── */}
      <Section title="Criando o pipeline no Jenkins">
        <Steps>
          <Step n={1}>
            Acesse o painel do Jenkins (endereço fornecido pelo professor).
          </Step>
          <Step n={2}>
            Clique em <strong>"New Item"</strong> no menu lateral.
          </Step>
          <Step n={3}>
            Dê um nome ao seu projeto, ex:{" "}
            <Code>fluxo-financeiro-grupo-3</Code>.
          </Step>
          <Step n={4}>
            Selecione <strong>"Pipeline"</strong> e clique em{" "}
            <strong>"OK"</strong>.
          </Step>
          <Step n={5}>
            Em <strong>"Pipeline"</strong>, escolha{" "}
            <strong>"Pipeline script from SCM"</strong>.
          </Step>
          <Step n={6}>
            Em <strong>"SCM"</strong>, selecione <strong>"Git"</strong> e cole
            a URL do seu fork no GitHub.
          </Step>
          <Step n={7}>
            Em <strong>"Script Path"</strong>, mantenha{" "}
            <Code>Jenkinsfile</Code> — o arquivo já está na raiz do repositório.
          </Step>
          <Step n={8}>
            Ative <strong>"GitHub hook trigger for GITScm polling"</strong> na
            seção Build Triggers.
          </Step>
          <Step n={9}>
            Clique em <strong>"Save"</strong>.
          </Step>
        </Steps>
      </Section>

      {/* ── Webhook ── */}
      <Section title="Conectando ao GitHub via Webhook">
        <P>
          O webhook é o elo entre o GitHub e o Jenkins. Sem ele, o Jenkins não
          sabe que você fez push — você teria que disparar manualmente.
        </P>
        <SubSection title="Configuração:">
          <Steps>
            <Step n={1}>
              No seu repositório GitHub, acesse{" "}
              <strong>Settings → Webhooks → Add webhook</strong>.
            </Step>
            <Step n={2}>
              Em <strong>"Payload URL"</strong>, coloque:{" "}
              <Code>http://{"<seu-jenkins>"}/github-webhook/</Code>
            </Step>
            <Step n={3}>
              Em <strong>"Content type"</strong>, selecione{" "}
              <Code>application/json</Code>.
            </Step>
            <Step n={4}>
              Em <strong>"Which events"</strong>, marque apenas{" "}
              <strong>"Just the push event"</strong>.
            </Step>
            <Step n={5}>
              Clique em <strong>"Add webhook"</strong>. Faça um push de teste
              e verifique em <strong>"Recent Deliveries"</strong> se o código
              de resposta foi <strong>200</strong>.
            </Step>
          </Steps>
        </SubSection>
      </Section>

      {/* ── Lendo a saída ── */}
      <Section title="Lendo a saída do Jenkins">
        <P>
          Clique em qualquer número na coluna <strong>"Build History"</strong>{" "}
          e depois em <strong>"Console Output"</strong> para ver o log completo
          em tempo real.
        </P>
        <SubSection title="O que significa cada resultado:">
          <ul className="space-y-2">
            {[
              {
                icon: "✅",
                label: "SUCCESS",
                desc: "todas as etapas passaram. Deploy liberado.",
                color: "text-[var(--accent-forest)]",
              },
              {
                icon: "❌",
                label: "FAILURE",
                desc: "algum stage falhou. Deploy bloqueado. Leia o console — a mensagem de erro está lá.",
                color: "text-[var(--accent-clay)]",
              },
              {
                icon: "⚠️",
                label: "UNSTABLE",
                desc: "o pipeline terminou mas com testes com falha. Atenção necessária.",
                color: "text-[var(--accent-amber)]",
              },
            ].map((r) => (
              <li
                key={r.label}
                className="flex gap-3 rounded-xl border border-[var(--border)] bg-white/50 px-4 py-3"
              >
                <span>{r.icon}</span>
                <div>
                  <span className={`font-mono text-[0.8rem] font-bold ${r.color}`}>
                    {r.label}
                  </span>
                  <span className="ml-2 text-[0.875rem] text-[var(--muted)]">
                    {r.desc}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </SubSection>
        <Warning>
          Quando um build falha, <strong>não ignore o erro</strong>. Leia o
          console com calma — a mensagem exata de erro está lá. Guarde um
          screenshot para o relatório: a falha intencional da Semana 1 é uma
          das evidências obrigatórias.
        </Warning>
        <Tip>
          Os artefatos do Cypress (screenshots e vídeos) ficam disponíveis
          na aba <strong>"Archived Artifacts"</strong> de cada build. O Jenkins
          os captura automaticamente pelo <Code>archiveArtifacts</Code> do
          Jenkinsfile — você não precisa baixar manualmente.
        </Tip>
      </Section>

      <NextPage
        href="/instrucoes/deploy"
        label="Deploy com Vercel"
        description="Configure as credenciais na Vercel e complete o stage Deploy Vercel no Jenkinsfile."
      />
    </div>
  );
}
