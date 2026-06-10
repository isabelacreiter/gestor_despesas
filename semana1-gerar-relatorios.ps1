Set-Location $PSScriptRoot
$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "=== SEMANA 1 - CYPRESS ===" -ForegroundColor Cyan
Write-Host "Gerando relatorio ANTES (stubs) e DEPOIS (implementado)" -ForegroundColor Cyan
Write-Host ""

# ---- FASE 1: relatorio ANTES (stubs ativados) ----
Write-Host ">>> FASE 1: Cypress com stubs - cenarios @todo devem FALHAR..." -ForegroundColor Yellow

if (Test-Path "mochawesome-report") { Remove-Item -Recurse -Force "mochawesome-report" }

npm run test:e2e
$fase1Exit = $LASTEXITCODE
Write-Host ">>> Fase 1 encerrada (exit code: $fase1Exit)"

if (Test-Path "mochawesome-report") {
    Rename-Item "mochawesome-report" "mochawesome-report-antes"
    Write-Host ">>> Relatorio ANTES salvo em: mochawesome-report-antes/" -ForegroundColor Yellow
} else {
    Write-Host ">>> AVISO: relatorio nao gerado na Fase 1." -ForegroundColor Red
}

# ---- RESTAURAR implementacoes reais via git ----
Write-Host ""
Write-Host ">>> Restaurando implementacoes via git restore..." -ForegroundColor Cyan

git restore src/services/expense-service.ts
git restore src/services/income-entry-service.ts
git restore src/app/api/receipt-extraction/route.ts

Write-Host ">>> Implementacoes restauradas." -ForegroundColor Green

# ---- FASE 2: relatorio DEPOIS (implementacao real) ----
Write-Host ""
Write-Host ">>> FASE 2: Cypress com implementacao real - todos devem PASSAR..." -ForegroundColor Green

if (Test-Path "mochawesome-report") { Remove-Item -Recurse -Force "mochawesome-report" }

npm run test:e2e
$fase2Exit = $LASTEXITCODE
Write-Host ">>> Fase 2 encerrada (exit code: $fase2Exit)"

if (Test-Path "mochawesome-report") {
    Rename-Item "mochawesome-report" "mochawesome-report-depois"
    Write-Host ">>> Relatorio DEPOIS salvo em: mochawesome-report-depois/" -ForegroundColor Green
} else {
    Write-Host ">>> AVISO: relatorio nao gerado na Fase 2." -ForegroundColor Red
}

Write-Host ""
Write-Host "=== CONCLUIDO ===" -ForegroundColor Cyan
Write-Host "Abra no navegador:" -ForegroundColor White
Write-Host "  mochawesome-report-antes/mochawesome.html" -ForegroundColor Yellow
Write-Host "  mochawesome-report-depois/mochawesome.html" -ForegroundColor Green
