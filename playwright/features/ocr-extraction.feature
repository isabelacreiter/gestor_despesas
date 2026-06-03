Feature: Extração OCR de nota fiscal — Playwright BDD

  Background:
    Given que acesso a pagina inicial via Playwright

  Scenario: Upload de PDF válido extrai despesa e salva no Firestore
    When navego para o painel de nota fiscal
    And faço upload de um PDF válido
    And clico em analisar nota fiscal
    Then vejo confirmação de despesa criada via OCR
    And a despesa do OCR aparece na lista de lançamentos recentes

  Scenario: Arquivo de tipo inválido exibe mensagem de erro
    When navego para o painel de nota fiscal
    And faço upload de um arquivo de texto inválido
    Then vejo mensagem de erro de tipo não suportado

  Scenario: Campo de arquivo limpa após envio bem-sucedido
    When navego para o painel de nota fiscal
    And faço upload de um PDF válido
    And clico em analisar nota fiscal
    Then o campo de arquivo está vazio após envio
