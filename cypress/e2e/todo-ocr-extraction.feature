# TODO implement: Desafio 2 — Extração de nota fiscal por OCR
#
# Pré-requisito: implementar a rota /api/receipt-extraction com um provedor de OCR
# (ex: Claude API com vision), concluir extractExpenseFromReceipt() em receipt-upload.ts
# e createExpense() para persistir o resultado no Firestore.
#
# O que testar:
#   - Upload de PDF retorna establishmentName e amount extraídos
#   - Dados extraídos são mapeados corretamente para a estrutura de Expense
#   - Despesa é salva automaticamente no Firestore após a extração
#   - Mensagem "Despesa criada automaticamente a partir da nota fiscal." aparece
#   - Arquivo inválido (CSV, TXT) continua bloqueado antes de chegar na API
#   - API retorna suggestedCategory dentro das categorias válidas do sistema

Feature: Extração de nota fiscal por OCR

  Background:
    # TODO implement: iniciar o app com Firebase e ANTHROPIC_API_KEY configurados
    Given que acesso a pagina inicial

  @todo
  Scenario: Extrai dados de uma nota fiscal em PDF e salva como despesa
    # TODO implement: selecionar um PDF de nota fiscal real com cy.fixture()
    # TODO implement: clicar em "Analisar nota fiscal"
    # TODO implement: verificar que a despesa aparece na lista de lançamentos recentes
    # TODO implement: verificar que o valor extraído é maior que zero
    Given pendente de implementacao
    Then pendente de implementacao

  @todo
  Scenario: A rota de OCR retorna os campos esperados no contrato
    # TODO implement: fazer POST via fetch para /api/receipt-extraction com nota válida
    # TODO implement: verificar que a resposta tem status 200
    # TODO implement: verificar que a resposta contém establishmentName preenchido
    # TODO implement: verificar que amount é um número maior que zero
    # TODO implement: verificar que suggestedCategory é um dos valores de expenseCategories
    Given pendente de implementacao
    Then pendente de implementacao

  @todo
  Scenario: Exibe mensagem de sucesso apos importar a nota fiscal
    # TODO implement: selecionar arquivo válido e clicar em "Analisar nota fiscal"
    # TODO implement: verificar mensagem "Despesa criada automaticamente a partir da nota fiscal."
    # TODO implement: verificar que o campo de arquivo foi limpo após o sucesso
    Given pendente de implementacao
    Then pendente de implementacao
