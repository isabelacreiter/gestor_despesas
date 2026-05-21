# TODO implement: Desafio 1 — Persistência de saídas manuais no Firestore
#
# Pré-requisito: concluir createExpense() em src/services/expense-service.ts
# e configurar as variáveis NEXT_PUBLIC_FIREBASE_* no ambiente de testes.
#
# O que testar:
#   - Despesa salva aparece na lista "Lançamentos recentes" sem recarregar a página
#   - Saldo estimado diminui após salvar a despesa
#   - Formulário é limpo após o envio bem-sucedido
#   - Mensagem de confirmação "Despesa cadastrada com sucesso." é exibida
#   - Despesa excluída desaparece da lista em tempo real
#   - Valor negativo ou zero continua bloqueado mesmo com Firestore ativo

Feature: Criação de saída manual no Firestore

  Background:
    # TODO implement: iniciar o app com variáveis Firebase válidas no ambiente de teste
    Given que acesso a pagina inicial

  @todo
  Scenario: Salva uma saida manual com dados validos e exibe na lista
    # TODO implement: preencher título com "Mercado semanal"
    # TODO implement: preencher valor com "150.00"
    # TODO implement: selecionar categoria "Alimentacao"
    # TODO implement: clicar em "Salvar despesa"
    # TODO implement: verificar que "Mercado semanal" aparece na lista de lançamentos recentes
    # TODO implement: verificar que o card "Despesas" foi atualizado com o novo total
    Given pendente de implementacao
    Then pendente de implementacao

  @todo
  Scenario: Exibe confirmacao e limpa o formulario apos salvar
    # TODO implement: preencher e submeter o formulário
    # TODO implement: verificar mensagem "Despesa cadastrada com sucesso."
    # TODO implement: verificar que os campos título e valor estão em branco
    Given pendente de implementacao
    Then pendente de implementacao

  @todo
  Scenario: Permite excluir uma saida existente da lista
    # TODO implement: verificar que o botão de exclusão está visível na lista
    # TODO implement: clicar no botão de excluir da despesa
    # TODO implement: verificar que a despesa foi removida da lista sem recarregar
    Given pendente de implementacao
    Then pendente de implementacao
