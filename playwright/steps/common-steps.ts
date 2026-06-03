import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

Given("que acesso a pagina inicial via Playwright", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("text=Fluxo Financeiro", { timeout: 15_000 });
  await page.request.delete("/api/test/clear-data").catch(() => {});
});

When("navego para o painel de nota fiscal", async ({ page }) => {
  await page.click("button:has-text('Nota Fiscal')");
  await page.waitForSelector("h2:has-text('Saída por leitura de PDF ou imagem')");
});

Then("a despesa do OCR aparece na lista de lançamentos recentes", async ({ page }) => {
  await page.waitForSelector("text=Estabelecimento Exemplo", { timeout: 15_000 });
});
