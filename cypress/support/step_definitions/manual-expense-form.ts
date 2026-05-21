import { When } from "@badeball/cypress-cucumber-preprocessor";

When("submeto o formulario de saida manual sem preencher nenhum campo", () => {
  cy.contains("button", "Salvar despesa").click();
});

When("preencho o campo titulo da despesa com {string}", (value: string) => {
  cy.get("#title").clear().type(value);
});

When("preencho o campo valor com {string}", (value: string) => {
  cy.get("#amount").clear().type(value);
});
