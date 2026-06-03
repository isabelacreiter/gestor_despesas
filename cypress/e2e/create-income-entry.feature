Feature: Criação de entrada financeira no Firestore

  Background:
    Given que acesso a pagina inicial

  Scenario: Salva uma entrada e atualiza o dashboard
    When clico na aba "Entradas"
    And preencho o campo descricao da entrada com "Pagamento do cliente"
    And preencho o campo valor da entrada com "1500"
    And clico no botao "Salvar entrada"
    Then vejo a mensagem "Entrada cadastrada com sucesso."
    And o card "Entradas previstas" deve refletir o valor adicionado

  Scenario: Entrada persiste apos recarregar a pagina
    When clico na aba "Entradas"
    And preencho o campo descricao da entrada com "Salario mensal"
    And preencho o campo valor da entrada com "5000"
    And clico no botao "Salvar entrada"
    And recarrego a pagina
    Then o card "Entradas previstas" deve conter o valor "5.000"

  Scenario: Formulario limpa apos salvar
    When clico na aba "Entradas"
    And preencho o campo descricao da entrada com "Freelance"
    And preencho o campo valor da entrada com "800"
    And clico no botao "Salvar entrada"
    Then o campo descricao da entrada deve estar vazio

  Scenario: Multiplas entradas se acumulam no dashboard
    When clico na aba "Entradas"
    And preencho o campo descricao da entrada com "Entrada 1"
    And preencho o campo valor da entrada com "100"
    And clico no botao "Salvar entrada"
    And preencho o campo descricao da entrada com "Entrada 2"
    And preencho o campo valor da entrada com "200"
    And clico no botao "Salvar entrada"
    Then o card "Entradas previstas" deve conter o valor "300"