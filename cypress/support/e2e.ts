import "./commands";

beforeEach(() => {
  cy.request({
    method: "DELETE",
    url: "/api/test/clear-data",
    failOnStatusCode: false,
  });
});
