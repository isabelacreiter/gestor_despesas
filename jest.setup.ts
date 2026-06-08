import "@testing-library/jest-dom";

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    establishmentName: "Estabelecimento Exemplo",
    amount: 99.9,
    suggestedCategory: "Alimentacao",
    purchaseDate: new Date().toISOString().slice(0, 10),
  }),
}) as unknown as typeof fetch;
