import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When(
  "seleciono o arquivo {string} do tipo {string}",
  (filename: string, mimeType: string) => {
    cy.contains("h2", "Saída por leitura de PDF ou imagem").should("be.visible");
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from("dummy content"),
        fileName: filename,
        mimeType: mimeType,
      },
      { force: true },
    );
  },
);

When("seleciono um arquivo PDF valido para analise", () => {
  cy.get('input[type="file"]').selectFile(
    {
      contents: Cypress.Buffer.from("PDF dummy content"),
      fileName: "nota-fiscal.pdf",
      mimeType: "application/pdf",
    },
    { force: true },
  );
});

When("seleciono um arquivo invalido nao PDF", () => {
  cy.get('input[type="file"]').selectFile(
    {
      contents: Cypress.Buffer.from("dummy text"),
      fileName: "arquivo.txt",
      mimeType: "text/plain",
    },
    { force: true },
  );
});

Then("vejo a mensagem de erro {string}", (message: string) => {
  cy.contains(message).should("be.visible");
});

When("seleciono outro arquivo PDF para analise", () => {
  cy.get('input[type="file"]').selectFile(
    {
      contents: Cypress.Buffer.from("Another PDF"),
      fileName: "nota-2.pdf",
      mimeType: "application/pdf",
    },
    { force: true },
  );
});

Then("o dashboard deve exibir ambas as despesas de OCR", () => {
  cy.contains("Estabelecimento Exemplo").should("exist");
});
