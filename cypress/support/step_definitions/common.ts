import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given("que acesso a pagina inicial", () => {
  cy.visit("/");
  cy.contains("Fluxo Financeiro", { timeout: 15000 }).should("be.visible");
  // Aguarda os botões de aba estarem prontos para interação
  cy.get("aside button", { timeout: 10000 }).should("have.length.at.least", 1);
});

Then("vejo o texto {string}", (text: string) => {
  cy.contains(text).should("be.visible");
});

Then("vejo o heading {string}", (text: string) => {
  cy.contains("h2", text).should("be.visible");
});

Then("vejo o card com titulo {string}", (title: string) => {
  cy.contains(title).should("be.visible");
});

Then("vejo o label {string}", (label: string) => {
  cy.contains("label", label).should("be.visible");
});

Then("vejo o botao {string}", (text: string) => {
  cy.contains("button", text).should("be.visible");
});

Then("vejo o erro de validacao {string}", (message: string) => {
  cy.contains(message).should("be.visible");
});

Then("vejo o alerta {string}", (message: string) => {
  cy.contains('[role="alert"]', message).should("be.visible");
});

When("clico no botao {string}", (text: string) => {
  cy.contains("button", text).click();
});

When("clico na aba {string}", (tabName: string) => {
  cy.contains("button", tabName, { timeout: 10000 })
    .should("be.visible")
    .click();
});

Then("vejo a mensagem {string}", (message: string) => {
  cy.contains(message).should("be.visible");
});

Then("vejo {string} na lista de despesas recentes", (itemName: string) => {
  cy.contains(itemName).should("be.visible");
});

Then("{string} nao deve estar visivel na lista", (itemName: string) => {
  cy.contains(itemName).should("not.exist");
});

When("recarrego a pagina", () => {
  cy.reload();
});

Then("o dashboard deve carregar corretamente", () => {
  cy.contains("Fluxo Financeiro").should("be.visible");
});

Then("o campo {string} deve estar vazio", (fieldName: string) => {
  if (fieldName.includes("descricao")) {
    cy.get("#income-title").should("have.value", "");
  } else if (fieldName.includes("titulo")) {
    cy.get("#title").should("have.value", "");
  } else if (fieldName.includes("valor")) {
    cy.get("#amount").should("have.value", "");
  } else if (fieldName.includes("arquivo")) {
    cy.get('input[type="file"]').should("have.value", "");
  }
});

Then("o dashboard deve exibir {string} transacoes", (count: string) => {
  cy.contains("h2", "Últimas despesas")
    .closest("section")
    .find("article")
    .should("have.length.at.least", parseInt(count));
});

When("clico no botao de excluir da despesa {string}", (itemName: string) => {
  cy.contains(itemName)
    .closest("article")
    .find('button[aria-label*="Excluir"], button[title*="Excluir"]')
    .click({ force: true });
});
