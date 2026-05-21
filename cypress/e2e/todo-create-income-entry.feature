# TODO implement: Desafio 1 — Persistência de entradas no Firestore
#
# Pré-requisito: concluir createIncomeEntry() em src/services/income-entry-service.ts
# e subscribeToIncomeEntries() para sincronização em tempo real.
#
# O que testar:
#   - Entrada salva reflete no card "Entradas" sem recarregar
#   - Saldo estimado aumenta após salvar uma entrada
#   - Formulário é limpo e mensagem de confirmação aparece
#   - Entradas persistem após recarregar a página (Firestore em tempo real)
#   - Valor zero ou negativo continua bloqueado com Firebase ativo

Feature: Criação de entrada financeira no Firestore

  Background:
    # TODO implement: iniciar o app com variáveis Firebase válidas no ambiente de teste
    Given que acesso a pagina inicial

  @todo
  Scenario: Salva uma entrada e atualiza o card de entradas
    # TODO implement: preencher descrição com "Salário de abril"
    # TODO implement: preencher valor com "5000"
    # TODO implement: selecionar origem "Salario"
    # TODO implement: clicar em "Salvar entrada"
    # TODO implement: verificar que o card "Entradas" exibe o novo total
    # TODO implement: verificar que o saldo estimado aumentou
    Given pendente de implementacao
    Then pendente de implementacao

  @todo
  Scenario: Exibe confirmacao e reseta o formulario apos salvar
    # TODO implement: submeter a entrada com dados válidos
    # TODO implement: verificar mensagem "Entrada cadastrada com sucesso."
    # TODO implement: verificar que os campos descrição e valor estão limpos
    Given pendente de implementacao
    Then pendente de implementacao

  @todo
  Scenario: Entradas persistidas aparecem apos recarregar a pagina
    # TODO implement: salvar uma entrada via formulário
    # TODO implement: chamar cy.reload() para recarregar a página
    # TODO implement: verificar que o card "Entradas" ainda reflete o valor salvo
    Given pendente de implementacao
    Then pendente de implementacao
