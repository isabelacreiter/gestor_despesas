Feature: Criação de saída manual no Firestore

  Background:
    Given que acesso a pagina inicial

  Scenario: Salva uma despesa e atualiza a lista
    When clico na aba "Saída Manual"
    And preencho o campo titulo da despesa com "Mercado semanal"
    And preencho o campo valor com "150.50"
    And clico no botao "Salvar despesa"
    Then vejo a mensagem "Despesa cadastrada com sucesso."
    And vejo "Mercado semanal" na lista de despesas recentes

  Scenario: Despesa persiste apos recarregar a pagina
    When clico na aba "Saída Manual"
    And preencho o campo titulo da despesa com "Combustivel"
    And preencho o campo valor com "80"
    And clico no botao "Salvar despesa"
    And recarrego a pagina
    Then vejo "Combustivel" na lista de despesas recentes

  Scenario: Formulario limpa apos salvar despesa
    When clico na aba "Saída Manual"
    And preencho o campo titulo da despesa com "Alimentacao"
    And preencho o campo valor com "45"
    And clico no botao "Salvar despesa"
    Then o campo titulo da despesa deve estar vazio
    And o campo valor deve estar vazio

  Scenario: Excluir despesa remove da lista
    When clico na aba "Saída Manual"
    And preencho o campo titulo da despesa com "Compra teste"
    And preencho o campo valor com "99.99"
    And clico no botao "Salvar despesa"
    And clico no botao de excluir da despesa "Compra teste"
    Then "Compra teste" nao deve estar visivel na lista

  Scenario: Multiplas despesas se acumulam na lista
    When clico na aba "Saída Manual"
    And preencho o campo titulo da despesa com "Despesa 1"
    And preencho o campo valor com "50"
    And clico no botao "Salvar despesa"
    And preencho o campo titulo da despesa com "Despesa 2"
    And preencho o campo valor com "75"
    And clico no botao "Salvar despesa"
    Then o dashboard deve exibir "2" transacoes