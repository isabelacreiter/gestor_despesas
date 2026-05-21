Feature: Formulario de cadastro de entradas

  Background:
    Given que acesso a pagina inicial

  Scenario: Renderiza o titulo do formulario de entradas
    Then vejo o heading "Cadastro de entradas"

  Scenario: Exibe aviso de scaffold da feature de entradas
    Then vejo o texto "TODO implement: esta feature deve ser concluída"

  Scenario: Exibe o select de origem da entrada
    Then vejo o label "Origem"

  Scenario: Bloqueia o envio quando a descricao esta vazia
    When submeto o formulario de entradas sem preencher nenhum campo
    Then vejo o erro de validacao "Informe a descrição da entrada."

  Scenario: Bloqueia o envio com valor zero na entrada
    When preencho o campo descricao da entrada com "Salario"
    And preencho o campo valor da entrada com "0"
    And clico no botao "Salvar entrada"
    Then vejo o erro de validacao "Digite um valor maior que zero."
