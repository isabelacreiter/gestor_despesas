Trabalho Prático: Implementação de Features e 
Comparativo de Ferramentas de Teste 
Cypress  ▶  Playwright + Cucumber  ▶  testRigor 
Base didática: Next.js 16 + Firebase + Vercel 
1. Visão Geral 
Neste trabalho, cada equipe recebe um projeto base chamado Fluxo Financeiro. O repositório 
não entrega as features avaliadas de forma pronta: ele apresenta a interface, os arquivos, os 
hooks, os testes-guia e os pontos de extensão marcados com TODO implement para que a 
equipe implemente, teste e publique a solução. 
A lógica central da disciplina é simples: uma feature só está concluída quando está provada por 
testes automatizados com evidências documentadas. Não basta o código funcionar na máquina 
local — é preciso demonstrar, por meio dos relatórios gerados pelas ferramentas de teste, que o 
comportamento esperado foi validado. 
O trabalho é organizado em três semanas com ferramentas de teste progressivamente diferentes 
— Cypress, Playwright + Cucumber e testRigor — e essa progressão é intencional: ela simula a 
evolução real de um time de engenharia que começa com testes funcionais de UI, adota BDD 
quando a complexidade dos requisitos aumenta e avalia ferramentas low-code para comparar 
custo-benefício. Ao final, a equipe deve ser capaz de justificar tecnicamente quando usar cada 
abordagem. 
2. Features Obrigatórias a Implementar 
As três features abaixo estão preparadas como scaffold no repositório base. Nenhuma delas está 
completa — é tarefa da equipe implementar, testar e publicar via Vercel. 
● Feature 01: Cadastro de entradas financeiras. 
● Feature 02: Cadastro de saídas manuais. 
● Feature 03: Extração de dados de nota fiscal enviada em PDF ou imagem (OCR) e salvamento 
como despesa. 
3. Objetivos de Aprendizagem 
● Transformar um projeto base em produto funcional a partir de scaffolds e TODOs bem 
posicionados. 
● Aplicar TestOps: usar testes automatizados como critério de conclusão e qualidade de cada 
feature. 
● Evoluir de testes funcionais de UI (Cypress) para BDD (Playwright + Cucumber) e testes em 
linguagem natural (testRigor). 
● Interpretar relatórios HTML do Cypress e do Playwright como evidência técnica de 
qualidade. 
● Utilizar a interface de resultados do testRigor para validar comportamentos em linguagem 
natural. 
● Produzir fragmentos de código que demonstrem a implementação de cada feature e os 
testes associados. 
● Desenvolver senso crítico sobre quando usar engenharia estruturada versus ferramentas de 
IA/low-code. 
4. Cenário do Trabalho 
Você recebeu um template com dashboard responsivo, formulários-base, integração preparada 
para Firebase, 23 cenários Cypress prontos e stubs @todo para os cenários que a equipe deve 
concluir. 
Link do repositório base: https://github.com/emanoelsp/gestor_despesas 
Cada equipe deverá fazer fork ou gerar um repositório a partir do template, preservar o histórico 
de commits e demonstrar claramente o momento em que os testes falham (antes da 
implementação) e o momento em que, após a implementação, todos os testes passam. 
5. Semana 1 — Implementação das Features com Cypress 
Objetivo 
Implementar as três features do scaffold e demonstrar, por meio do relatório HTML do Cypress, 
que os testes falham antes da implementação e passam após a conclusão. O Cypress já está 
configurado com 23 cenários passando e stubs @todo para os cenários que a equipe deve ativar 
e completar. 
Passo a passo 
● Fase 0 — Preparação: clone o repositório, configure o Firebase e explore o dashboard. 
● Fase 1 — Git e GitHub: crie o fork e a branch de trabalho. 
● Fase 2 — Vercel: importe o projeto, cadastre as variáveis do Firebase e da rota OCR. 
● Fase 3 — Ative os cenários @todo ANTES de implementar a feature. O Cypress deve reportar 
falhas no HTML report. 
● Fase 4 — Implemente as features, faça os testes passarem e gere o relatório HTML final com 
todos os testes verdes. 
Cenários Cypress prontos (passando desde o início) 
● dashboard.feature — 5 cenários 
● manual-expense-form.feature — 5 cenários 
● income-entry-form.feature — 5 cenários 
● receipt-upload-panel.feature — 5 cenários 
● receipt-extraction-api.feature — 3 cenários (rota de API) 
Stubs @todo para a equipe completar 
● todo-create-expense.feature — persistência no Firestore (saídas) 
● todo-create-income-entry.feature — persistência no Firestore (entradas) 
● todo-ocr-extraction.feature — OCR + salvamento da despesa 
Como gerar o relatório HTML do Cypress 
Execute o comando abaixo após os testes para gerar o relatório que deve compor o relatório 
PDF: 
npx cypress run --reporter mochawesome 
# O relatório HTML é gerado em: mochawesome-report/mochawesome.html 
O relatório exibe: nome de cada cenário, status (pass/fail), duração, capturas de tela em caso de 
falha e um resumo geral dos resultados. 
Evidências obrigatórias da Semana 1 para o relatório PDF 
● Fragmentos de código das três features implementadas (com comentários indicando os 
pontos de extensão preenchidos). 
● Print ou export do HTML report do Cypress com os cenários @todo ainda falhando (antes da 
implementação). 
● Print ou export do HTML report do Cypress com todos os testes passando (após a 
implementação). 
● Análise de causa raiz (RCA): por que os testes falhavam antes e o que foi necessário 
implementar para fazê-los passar. 
6. Semana 2 — BDD com Playwright + Cucumber 
Objetivo 
Substituir o Cypress pelo par Playwright + Cucumber e adotar a abordagem BDD para a feature 
de OCR, escrevendo o comportamento esperado em Gherkin ANTES de programar o Route 
Handler /api/receipt-extraction. A feature de OCR possui regras de negócio claras e verificáveis 
(nome do estabelecimento, valor, categoria sugerida). O BDD serve como ponte entre o requisito 
do documento e a automação: a equipe escreve o "o quê" antes do "como", garantindo que 
todos entendam a regra de negócio antes de integrar o fluxo de leitura de nota fiscal. O 
aprendizado muda de "como testar" para "o que estamos construindo". 
Exemplo de cenário Gherkin para a feature OCR 
Feature: Extração de nota fiscal por OCR 
Scenario: Upload de PDF válido extrai dados e salva despesa 
Given que o usuário está no painel de upload de nota fiscal 
When ele envia um PDF válido com nome do estabelecimento e valor 
Then o sistema deve extrair o nome do estabelecimento 
And o sistema deve extrair o valor da compra 
And o resultado deve ser salvo como despesa no Firestore 
And o dashboard deve exibir a nova despesa na lista de lançamentos recentes 
Dinâmica da atividade 
● 1. Escreva os cenários Gherkin ANTES de implementar a rota de OCR. 
● 2. As Step Definitions do Cucumber chamarão as ações do Playwright. 
● 3. Execute os testes — o Playwright deve reportar falhas no HTML report porque a rota ainda 
retorna 501. 
● 4. Implemente a rota de OCR, faça os cenários passarem e gere o relatório HTML final. 
Como gerar o relatório HTML do Playwright 
Configure o reporter no arquivo playwright.config.ts: 
// playwright.config.ts 
export default defineConfig({ 
reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]], 
}); 
Execute os testes e abra o relatório: 
npx playwright test 
npx playwright show-report  # abre o HTML report no navegador 
O relatório exibe: cada cenário com status pass/fail, trace interativo (Playwright Trace Viewer), 
capturas de tela, vídeos e logs de console. Inclua prints do trace viewer no relatório PDF. 
O que muda em relação ao Cypress 
Aspecto 
Cypress 
Paradigma 
Orientado a componente/UI 
Playwright + Cucumber 
Orientado a comportamento 
(BDD) 
Especificação 
Navegadores 
Paralelismo 
Relatório 
Legibilidade do requisito 
Ideal para 
Steps em TypeScript direto 
Electron/Chrome 
Limitado no plano free 
Screenshot/vídeo 
Baixa (código) 
Smoke tests rápidos de UI 
Evidências obrigatórias da Semana 2 para o relatório PDF 
legível 
por 
Gherkin 
não-técnicos 
Chromium, Firefox, WebKit 
Nativo e configurável 
HTML report + Trace Viewer 
Alta (Gherkin em linguagem 
natural) 
Features com regras de 
negócio complexas 
● Fragmentos dos cenários Gherkin escritos antes da implementação da rota de OCR. 
● Fragmentos das Step Definitions em TypeScript que conectam o Gherkin às ações do 
Playwright. 
● Print ou export do HTML report do Playwright com os cenários falhando (rota não 
implementada). 
● Print ou export do HTML report do Playwright com todos os testes passando. 
● Print do Playwright Trace Viewer mostrando o passo a passo de ao menos um cenário. 
● Comparação objetiva: o que ficou mais claro com BDD? Qual ferramenta foi mais expressiva 
para descrever os requisitos? 
7. Semana 3 — Laboratório de Tendências Low-Code (testRigor) 
Objetivo 
Experimentar o paradigma de testes em linguagem natural com testRigor e desenvolver senso 
crítico sobre quando usar engenharia estruturada versus ferramentas de IA/low-code. As 
evidências desta semana vêm diretamente da interface do testRigor — não é necessário gerar 
arquivos locais; os prints do painel da plataforma são as evidências esperadas. 
Como o testRigor funciona 
O testRigor abstrai completamente o código de automação. A equipe escreve testes em 
linguagem natural diretamente na plataforma: 
Open "https://seu-projeto.vercel.app" 
Click "Salvar despesa" 
Check that page contains "Informe o título da despesa." 
Type "Mercado semanal" in "Título da despesa" 
Type "150" in "Valor total" 
Click "Salvar despesa" 
Check that page contains "Despesa cadastrada com sucesso." 
Dinâmica da atividade 
● 1. Com as features implementadas nas Semanas 1 e 2, acesse a plataforma testRigor e 
aponte para a URL da sua Vercel. 
● 2. Escreva os mesmos cenários já cobertos pelo Playwright, agora em linguagem natural. 
● 3. Execute os testes e registre os resultados diretamente no painel do testRigor (pass/fail, 
logs, capturas). 
● 4. Meça e compare: tempo para criar o teste, facilidade de manutenção, legibilidade para 
não-técnicos, cobertura obtida. 
● 5. Redija a conclusão técnica: para qual cenário real cada ferramenta seria a escolha certa? 
O que muda em relação ao Playwright 
Aspecto 
Código necessário 
Playwright + Cucumber 
TypeScript + Gherkin 
testRigor 
Linguagem natural (zero 
código) 
Manutenção 
Integração CI/CD 
Debugging 
Custo 
Velocidade de criação 
Ideal para 
Manual, por desenvolvedor 
Nativa (GitHub Actions, etc.) 
Trace Viewer detalhado 
Open-source 
Automática pela IA do 
testRigor 
Via 
API/webhook 
limitada) 
(mais 
Painel visual simplificado 
Plataforma SaaS (freemium) 
Média (requer entender BDD) Alta (linguagem natural) 
Times técnicos com BDD 
Validação rápida por QAs ou 
PMs 
Evidências obrigatórias da Semana 3 para o relatório PDF 
● Print dos testes escritos em linguagem natural no painel do testRigor. 
● Print da execução dos testes no testRigor mostrando o resultado (pass/fail) de cada caso. 
● Print do log ou da tela de detalhes de ao menos um teste executado (mostrando os passos 
realizados pela plataforma). 
● Tabela comparativa preenchida: Cypress × Playwright × testRigor. 
● Conclusão técnica: em qual cenário real de projeto cada ferramenta seria a escolha certa? 
8. Estrutura Obrigatória do Relatório PDF Final 
O relatório deve cobrir as três semanas em sequência e incluir tanto os fragmentos de código 
das implementações quanto os resultados dos relatórios gerados por cada ferramenta. 
● 1. Introdução: contexto do projeto, descrição das três features e visão geral das ferramentas 
utilizadas. 
● 2. Semana 1 — Cypress: fragmentos de código das features implementadas + resultados do 
HTML report do Cypress (falha e sucesso) + RCA. 
● 3. Semana 2 — Playwright + Cucumber: fragmentos dos cenários Gherkin e Step Definitions 
+ resultados do HTML report do Playwright + print do Trace Viewer + comparação com 
Cypress. 
● 4. Semana 3 — testRigor: prints da interface do testRigor (testes escritos e resultados de 
execução) + tabela comparativa final (Cypress × Playwright × testRigor) + conclusão técnica. 
● 5. Conclusão geral: lições aprendidas sobre TestOps e qualidade de software, o que o grupo 
faria diferente. 
IMPORTANTE: mascare todos os secrets, tokens e IDs nos prints do relatório. 
9. Restrições e Regras 
● É proibido expor tokens, secrets ou IDs sensíveis em arquivos versionados ou nos prints do 
relatório. 
● As três features avaliadas devem permanecer como trabalho da equipe; o template é 
somente scaffold. 
● Os resultados dos testes devem ser obtidos a partir das ferramentas oficiais: HTML report do 
Cypress, HTML report do Playwright e interface do testRigor. 
● Não é permitido incluir no relatório prints de testes fabricados ou resultados que não 
correspondam à execução real dos testes. 
10. Rubrica de Avaliação 
Critério 
Feature 01 — 
Entradas 
financeiras 
Feature 02 — 
Saídas manuais 
Excelente 
Concluída, 
testada 
integrada 
e 
ao 
dashboard com 
evidência 
no 
relatório HTML 
do Cypress. 
Concluída, 
testada 
e 
Adequado 
Parcial ou com 
lacunas 
de 
validação/testes. 
Insuficiente 
Não concluída. 
Não concluída. 
Peso 
10% 
10% 
Parcial ou sem 
robustez 
de 
persistida 
corretamente 
com evidência 
no 
relatório 
HTML 
Cypress. 
do 
validação. 
Feature 03 — 
OCR de nota 
fiscal 
Upload, extração 
e salvamento 
funcionando 
com boa 
evidência 
técnica nos 
relatórios 
Cypress e 
Playwright. 
Fluxo parcial: 
upload existe, 
mas extração ou 
persistência tem 
lacunas. 
Não concluída. 15% 
Semana 1 — 
Cypress + RCA 
Fragmentos de 
código claros, 
HTML report 
com falha e 
sucesso, RCA 
consistente 
explicando o 
que foi 
implementado. 
Há código e 
relatório, mas a 
análise ficou 
superficial. 
Sem fragmentos 
de código ou 
sem relatório 
HTML real do 
Cypress. 
20% 
Semana 2 — 
Playwright + 
BDD 
Cenários 
Gherkin escritos 
antes da 
implementação, 
HTML report 
com falha e 
sucesso, Trace 
Viewer 
documentado, 
comparação 
clara com 
Cypress. 
Playwright 
funcionando, 
mas sem BDD ou 
comparação 
fraca. 
Playwright não 
utilizado ou sem 
relatório HTML 
real. 
20% 
Semana 3 — 
testRigor + 
Comparativo 
Testes em 
linguagem 
natural 
executados e 
documentados 
via prints da 
interface do 
testRigor, tabela 
comparativa 
completa, 
conclusão 
técnica sólida. 
Testes 
executados, mas 
comparação 
superficial ou 
prints 
incompletos. 
testRigor não 
utilizado ou 
comparativo 
ausente. 
15% 
Qualidade do 
relatório PDF 
Documento 
claro, objetivo, 
tecnicamente 
auditável com 
fragmentos de 
Documento 
suficiente, mas 
com lacunas de 
clareza ou 
evidências. 
Relatório 
incompleto ou 
fraco 
tecnicamente. 
10% 
código e todas 
as evidências de 
teste.