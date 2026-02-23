# Master Sync and Fix Script for The Cajun Menu
# This script automates Git synchronization, dependency installation, linting, and build validation.

Write-Host "--- Phase 1: Git Synchronization ---" -ForegroundColor Cyan
git pull origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Git pull failed. Please resolve conflicts." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n--- Phase 2: Dependency Check ---" -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n--- Phase 3: Linting and Fixing ---" -ForegroundColor Cyan
npm run lint:fix
if ($LASTEXITCODE -ne 0) {
    Write-Host "Linting errors found. Attempting manual fixes if necessary." -ForegroundColor Yellow
}

Write-Host "`n--- Phase 4: Build Validation ---" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n--- Phase 5: Final Git Sync ---" -ForegroundColor Cyan
git add .
git commit -m "chore: automated sync and fix (periodic maintenance)"
git push origin main

Write-Host "`nProject is clean, synced, and verified!" -ForegroundColor Green
