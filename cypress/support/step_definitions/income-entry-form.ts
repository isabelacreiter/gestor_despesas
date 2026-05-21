import { When } from "@badeball/cypress-cucumber-preprocessor";

When("submeto o formulario de entradas sem preencher nenhum campo", () => {
  cy.contains("button", "Salvar entrada").click();
});

When("preencho o campo descricao da entrada com {string}", (value: string) => {
  cy.get("#income-title").clear().type(value);
});

When("preencho o campo valor da entrada com {string}", (value: string) => {
  cy.get("#income-amount").clear().type(value);
});
