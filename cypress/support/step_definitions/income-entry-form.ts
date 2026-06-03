import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("submeto o formulario de entradas sem preencher nenhum campo", () => {
  cy.contains("button", "Salvar entrada", { timeout: 10000 }).should("be.visible").click();
});

When("preencho o campo descricao da entrada com {string}", (value: string) => {
  cy.get("#income-title", { timeout: 10000 }).should("be.visible").clear().type(value);
});

When("preencho o campo valor da entrada com {string}", (value: string) => {
  cy.get("#income-amount", { timeout: 10000 }).should("be.visible").clear().type(value);
});

Then("o card {string} deve refletir o valor adicionado", (cardTitle: string) => {
  // Aguarda a atualização do card de entradas
  cy.contains(cardTitle).parent().parent().should("contain", "R$");
});

Then("o card {string} deve conter o valor {string}", (cardTitle: string, value: string) => {
  cy.contains(cardTitle)
    .closest("article")
    .should("contain", value);
});

Then("o campo descricao da entrada deve estar vazio", () => {
  cy.get("#income-title").should("have.value", "");
});
