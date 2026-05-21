# TODO implement - Mapa das Atividades

Este repositorio foi preparado para apoiar um trabalho pratico de Jenkins, TestOps e evolucao de funcionalidades. O objetivo nao e entregar a solucao pronta, e sim deixar os pontos de extensao organizados para a turma.

## Aplicacao

- `src/components/income-entry-form.tsx`
  - concluir a experiencia de cadastro de entradas
  - validar os campos e enviar os dados corretos para o hook
- `src/services/income-entry-service.ts`
  - persistir entradas no Firestore
  - definir a colecao e o contrato dos documentos
- `src/services/use-income-entries.ts`
  - trocar o fallback demonstrativo pela soma real das entradas
  - refletir erros e loading da feature no dashboard
- `src/components/manual-expense-form.tsx`
  - concluir as regras da saida manual
  - garantir feedback e cobertura de testes da feature
- `src/services/expense-service.ts`
  - persistir as saidas manuais e as saidas vindas do OCR
  - manter o formato esperado pelo dashboard
- `src/components/receipt-upload-panel.tsx`
  - concluir a experiencia de upload da nota fiscal
  - exibir os dados extraidos antes da gravacao final
- `src/services/receipt-upload.ts`
  - transformar a resposta da API de OCR em uma despesa valida
  - decidir as regras de categoria, data e fallback
- `src/app/api/receipt-extraction/route.ts`
  - integrar um provedor ou estrategia de OCR
  - extrair `establishmentName` e `amount`
  - devolver um contrato JSON consistente para o cliente

## Qualidade e Testes

- `src/__tests__/income-entry-form.test.tsx`
  - remover o `skip`
  - validar o comportamento final da feature de entradas
- `src/__tests__/manual-expense-form.test.tsx`
  - remover o `skip`
  - validar a saida manual e o bloqueio de valores invalidos
- `src/__tests__/receipt-upload-panel.test.tsx`
  - remover o `skip`
  - verificar o fluxo completo de leitura por arquivo
- `src/__tests__/receipt-upload.test.ts`
  - remover o `skip`
  - fazer o teste falhar no momento planejado do trabalho
  - corrigir a implementacao ate o teste passar

## Infraestrutura

- `Jenkinsfile`
  - cadastrar credentials seguras
  - completar o deploy na Vercel
  - garantir que testes e build bloqueiem a publicacao
- `.env.example`
  - revisar se a estrategia de OCR vai exigir variaveis server-side adicionais

## Sugestao de fluxo didatico

1. Rodar a base localmente e entender os componentes existentes.
2. Configurar o Jenkins para clonar, instalar, testar e buildar o projeto.
3. Escolher qual dos testes `skip` sera ativado primeiro para provocar a falha planejada.
4. Registrar a falha do pipeline no Jenkins.
5. Implementar entradas, saidas manuais e leitura por arquivo ate a pipeline liberar o deploy.
