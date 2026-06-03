import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { When, Then } = createBdd();

When("faço upload de um PDF válido", async ({ page }) => {
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: "nota-fiscal.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("PDF dummy content for Playwright BDD test"),
  });
});

When("faço upload de um arquivo de texto inválido", async ({ page }) => {
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: "arquivo.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not a receipt"),
  });
});

When("clico em analisar nota fiscal", async ({ page }) => {
  await page.click("button:has-text('Analisar nota fiscal')");
});

Then("vejo confirmação de despesa criada via OCR", async ({ page }) => {
  await page.waitForSelector(
    "text=Despesa criada automaticamente a partir da nota fiscal.",
    { timeout: 15_000 },
  );
});

Then("vejo mensagem de erro de tipo não suportado", async ({ page }) => {
  await page.waitForSelector("text=Envie um arquivo em PDF, JPG, PNG ou WEBP");
});

Then("o campo de arquivo está vazio após envio", async ({ page }) => {
  const value = await page.inputValue('input[type="file"]');
  expect(value).toBe("");
});
