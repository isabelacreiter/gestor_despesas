Set-Location $PSScriptRoot
$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "=== GERADOR DE RELATORIOS - SEMANA 1 (Cypress) + SEMANA 2 (Playwright) ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Estado atual: stubs ativos (createExpense/createIncomeEntry lancam erro, OCR retorna 501)" -ForegroundColor Yellow
Write-Host "Isso e correto para gerar os relatorios ANTES da implementacao." -ForegroundColor Yellow
Write-Host ""

# ============================================================
# FASE 1-A: Cypress ANTES (stubs ativos - cenarios devem FALHAR)
# ============================================================
Write-Host "--- [1/4] CYPRESS ANTES: cenarios @todo devem FALHAR ---" -ForegroundColor Yellow

if (Test-Path "mochawesome-report") { Remove-Item -Recurse -Force "mochawesome-report" }
if (Test-Path "mochawesome-report-antes") { Remove-Item -Recurse -Force "mochawesome-report-antes" }

npm run test:e2e
if (Test-Path "mochawesome-report") {
    Rename-Item "mochawesome-report" "mochawesome-report-antes"
    Write-Host "OK: mochawesome-report-antes/ gerado" -ForegroundColor Yellow
} else {
    Write-Host "AVISO: relatorio Cypress ANTES nao gerado" -ForegroundColor Red
}

# ============================================================
# FASE 1-B: Playwright ANTES (OCR retorna 501 - cenarios devem FALHAR)
# ============================================================
Write-Host ""
Write-Host "--- [2/4] PLAYWRIGHT ANTES: OCR deve FALHAR (501) ---" -ForegroundColor Yellow

if (Test-Path "playwright-report-antes") { Remove-Item -Recurse -Force "playwright-report-antes" }
if (Test-Path "playwright-report") { Remove-Item -Recurse -Force "playwright-report" }

npm run test:playwright
if (Test-Path "playwright-report") {
    Rename-Item "playwright-report" "playwright-report-antes"
    Write-Host "OK: playwright-report-antes/ gerado" -ForegroundColor Yellow
} else {
    Write-Host "AVISO: relatorio Playwright ANTES nao gerado" -ForegroundColor Red
}

# ============================================================
# RESTAURAR implementacoes reais via git
# ============================================================
Write-Host ""
Write-Host "--- Restaurando implementacoes reais (git restore) ---" -ForegroundColor Cyan

git restore src/services/expense-service.ts
git restore src/services/income-entry-service.ts
git restore src/app/api/receipt-extraction/route.ts

Write-Host "OK: implementacoes restauradas" -ForegroundColor Green

# ============================================================
# FASE 2-A: Cypress DEPOIS (implementado - todos devem PASSAR)
# ============================================================
Write-Host ""
Write-Host "--- [3/4] CYPRESS DEPOIS: todos os cenarios devem PASSAR ---" -ForegroundColor Green

if (Test-Path "mochawesome-report") { Remove-Item -Recurse -Force "mochawesome-report" }
if (Test-Path "mochawesome-report-depois") { Remove-Item -Recurse -Force "mochawesome-report-depois" }

npm run test:e2e
if (Test-Path "mochawesome-report") {
    Rename-Item "mochawesome-report" "mochawesome-report-depois"
    Write-Host "OK: mochawesome-report-depois/ gerado" -ForegroundColor Green
} else {
    Write-Host "AVISO: relatorio Cypress DEPOIS nao gerado" -ForegroundColor Red
}

# ============================================================
# FASE 2-B: Playwright DEPOIS (OCR implementado - todos devem PASSAR)
# ============================================================
Write-Host ""
Write-Host "--- [4/4] PLAYWRIGHT DEPOIS: OCR implementado - deve PASSAR ---" -ForegroundColor Green

if (Test-Path "playwright-report") { Remove-Item -Recurse -Force "playwright-report" }
if (Test-Path "playwright-report-depois") { Remove-Item -Recurse -Force "playwright-report-depois" }

npm run test:playwright
if (Test-Path "playwright-report") {
    Rename-Item "playwright-report" "playwright-report-depois"
    Write-Host "OK: playwright-report-depois/ gerado" -ForegroundColor Green
} else {
    Write-Host "AVISO: relatorio Playwright DEPOIS nao gerado" -ForegroundColor Red
}

# ============================================================
# RESUMO FINAL
# ============================================================
Write-Host ""
Write-Host "=== CONCLUIDO ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "SEMANA 1 - Cypress:" -ForegroundColor White
Write-Host "  mochawesome-report-antes/mochawesome.html  (falhas)" -ForegroundColor Yellow
Write-Host "  mochawesome-report-depois/mochawesome.html (passou)" -ForegroundColor Green
Write-Host ""
Write-Host "SEMANA 2 - Playwright + BDD:" -ForegroundColor White
Write-Host "  playwright-report-antes/index.html         (falhas)" -ForegroundColor Yellow
Write-Host "  playwright-report-depois/index.html        (passou)" -ForegroundColor Green
Write-Host ""
Write-Host "Os traces do Playwright ficam em test-results/" -ForegroundColor White
Write-Host "Abra os relatorios no navegador para tirar os prints do PDF." -ForegroundColor White
