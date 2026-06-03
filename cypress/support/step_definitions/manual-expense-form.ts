import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("submeto o formulario de saida manual sem preencher nenhum campo", () => {
  cy.contains("button", "Salvar despesa", { timeout: 10000 }).should("be.visible").click();
});

When("preencho o campo titulo da despesa com {string}", (value: string) => {
  cy.get("#title", { timeout: 10000 }).should("be.visible").clear().type(value);
});

When("preencho o campo valor com {string}", (value: string) => {
  cy.get("#amount", { timeout: 10000 }).should("be.visible").clear().type(value);
});

Then("o campo titulo da despesa deve estar vazio", () => {
  cy.get("#title").should("have.value", "");
});

Then("o campo valor deve estar vazio", () => {
  cy.get("#amount").should("have.value", "");
});
