Write-Host "🔨 Build production..." -ForegroundColor Cyan
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build FAILED" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build OK" -ForegroundColor Green

Write-Host "🔍 Vérification absence de console.log..." -ForegroundColor Cyan
$matches = Get-ChildItem -Path "apps/web/app", "apps/web/components", "apps/web/lib", "apps/web/stores" -Include "*.ts","*.tsx" -Recurse | Select-String -Pattern "console\.log" | Where-Object { $_.Line -notmatch "// allow-console" }

if ($matches) {
    Write-Host "❌ console.log trouvés en production :" -ForegroundColor Red
    $matches | ForEach-Object { Write-Host "   $($_.Path):$($_.LineNumber)" }
    exit 1
}

Write-Host "✅ Aucun console.log" -ForegroundColor Green
Write-Host "🚀 Smoke test OK" -ForegroundColor Green
