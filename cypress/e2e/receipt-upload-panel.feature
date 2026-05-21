Feature: Painel de upload de nota fiscal

  Background:
    Given que acesso a pagina inicial

  Scenario: Renderiza o titulo do painel de upload
    Then vejo o heading "Saída por leitura de PDF ou imagem"

  Scenario: Exibe os tipos de arquivo aceitos
    Then vejo o texto "PDF, JPG, PNG ou WEBP"

  Scenario: Exibe o botao de analisar nota fiscal
    Then vejo o botao "Analisar nota fiscal"

  Scenario: Exibe o nome do arquivo apos selecionar um PDF valido
    When seleciono o arquivo "nota-mercado.pdf" do tipo "application/pdf"
    Then vejo o texto "Arquivo pronto para análise:"
    And vejo o texto "nota-mercado.pdf"

  Scenario: Exibe erro ao tentar analisar sem selecionar arquivo
    When clico no botao "Analisar nota fiscal"
    Then vejo o alerta "Selecione uma nota fiscal em PDF ou imagem para continuar."
