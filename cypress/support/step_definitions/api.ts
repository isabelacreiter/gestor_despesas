import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given("que acesso a pagina inicial para testes de API", () => {
  cy.visit("/");
});

When(
  "faço um POST direto para {string} sem body",
  (path: string) => {
    cy.request({
      url: path,
      method: "POST",
      failOnStatusCode: false,
    }).as("apiResponse");
  },
);

When(
  "faço upload de um arquivo {string} para {string}",
  (mimeType: string, path: string) => {
    cy.window().then((win) => {
      const formData = new win.FormData();
      const blob = new win.Blob(["dummy content"], { type: mimeType });
      formData.append("receipt", blob, "test-file");

      return win
        .fetch(path, { method: "POST", body: formData })
        .then((res) =>
          res.json().then((body: Record<string, unknown>) => ({
            status: res.status,
            body,
          })),
        );
    }).as("apiResponse");
  },
);

Then("a resposta deve ter status {int}", (status: number) => {
  cy.get<{ status: number }>("@apiResponse")
    .its("status")
    .should("equal", status);
});

Then("a resposta deve conter o campo {string}", (field: string) => {
  cy.get<{ body: Record<string, unknown> }>("@apiResponse")
    .its("body")
    .should("have.property", field);
});
