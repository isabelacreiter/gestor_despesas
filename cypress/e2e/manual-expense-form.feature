Feature: Formulario de saida manual

  Background:
    Given que acesso a pagina inicial

  Scenario: Renderiza o titulo do formulario
    Then vejo o heading "Saída manual"

  Scenario: Exibe aviso de scaffold da feature
    Then vejo o texto "TODO implement: esta feature deve ser concluída"

  Scenario: Exibe o label de categoria no formulario
    Then vejo o label "Categoria"

  Scenario: Bloqueia o envio quando o titulo esta vazio
    When submeto o formulario de saida manual sem preencher nenhum campo
    Then vejo o erro de validacao "Informe o título da despesa."

  Scenario: Bloqueia o envio com valor zero
    When preencho o campo titulo da despesa com "Mercado"
    And preencho o campo valor com "0"
    And clico no botao "Salvar despesa"
    Then vejo o erro de validacao "Digite um valor maior que zero."
