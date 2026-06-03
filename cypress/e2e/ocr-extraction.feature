Feature: Extração OCR de nota fiscal

  Background:
    Given que acesso a pagina inicial

  Scenario: Upload de arquivo valido extrai dados
    When clico na aba "Nota Fiscal"
    And seleciono um arquivo PDF valido para analise
    And clico no botao "Analisar nota fiscal"
    Then vejo a mensagem "Despesa criada automaticamente a partir da nota fiscal."

  Scenario: Arquivo invalido exibe erro
    When clico na aba "Nota Fiscal"
    And seleciono um arquivo invalido nao PDF
    Then vejo a mensagem de erro "Envie um arquivo em PDF, JPG, PNG ou WEBP"

  Scenario: Despesa do OCR aparece na lista
    When clico na aba "Nota Fiscal"
    And seleciono um arquivo PDF valido para analise
    And clico no botao "Analisar nota fiscal"
    Then vejo "Estabelecimento Exemplo" na lista de despesas recentes

  Scenario: Campo de arquivo limpa apos envio com sucesso
    When clico na aba "Nota Fiscal"
    And seleciono um arquivo PDF valido para analise
    And clico no botao "Analisar nota fiscal"
    Then o campo de arquivo deve estar vazio

  Scenario: OCR funciona com multiplos uploads
    When clico na aba "Nota Fiscal"
    And seleciono um arquivo PDF valido para analise
    And clico no botao "Analisar nota fiscal"
    And seleciono outro arquivo PDF para analise
    And clico no botao "Analisar nota fiscal"
    Then o dashboard deve exibir ambas as despesas de OCR