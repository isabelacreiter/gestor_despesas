// Generated from: playwright\features\ocr-extraction.feature
import { test } from "playwright-bdd";

test.describe('Extração OCR de nota fiscal — Playwright BDD', () => {

  test.beforeEach('Background', async ({ Given, page }, testInfo) => { if (testInfo.error) return;
    await Given('que acesso a pagina inicial via Playwright', null, { page }); 
  });
  
  test('Upload de PDF válido extrai despesa e salva no Firestore', async ({ When, Then, And, page }) => { 
    await When('navego para o painel de nota fiscal', null, { page }); 
    await And('faço upload de um PDF válido', null, { page }); 
    await And('clico em analisar nota fiscal', null, { page }); 
    await Then('vejo confirmação de despesa criada via OCR', null, { page }); 
    await And('a despesa do OCR aparece na lista de lançamentos recentes', null, { page }); 
  });

  test('Arquivo de tipo inválido exibe mensagem de erro', async ({ When, Then, And, page }) => { 
    await When('navego para o painel de nota fiscal', null, { page }); 
    await And('faço upload de um arquivo de texto inválido', null, { page }); 
    await Then('vejo mensagem de erro de tipo não suportado', null, { page }); 
  });

  test('Campo de arquivo limpa após envio bem-sucedido', async ({ When, Then, And, page }) => { 
    await When('navego para o painel de nota fiscal', null, { page }); 
    await And('faço upload de um PDF válido', null, { page }); 
    await And('clico em analisar nota fiscal', null, { page }); 
    await Then('o campo de arquivo está vazio após envio', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('playwright\\features\\ocr-extraction.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given que acesso a pagina inicial via Playwright","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When navego para o painel de nota fiscal","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And faço upload de um PDF válido","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And clico em analisar nota fiscal","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then vejo confirmação de despesa criada via OCR","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And a despesa do OCR aparece na lista de lançamentos recentes","stepMatchArguments":[]}]},
  {"pwTestLine":18,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given que acesso a pagina inicial via Playwright","isBg":true,"stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When navego para o painel de nota fiscal","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"And faço upload de um arquivo de texto inválido","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then vejo mensagem de erro de tipo não suportado","stepMatchArguments":[]}]},
  {"pwTestLine":24,"pickleLine":18,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given que acesso a pagina inicial via Playwright","isBg":true,"stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When navego para o painel de nota fiscal","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"And faço upload de um PDF válido","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"And clico em analisar nota fiscal","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then o campo de arquivo está vazio após envio","stepMatchArguments":[]}]},
]; // bdd-data-end