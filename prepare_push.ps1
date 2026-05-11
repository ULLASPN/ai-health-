# NEUROSCAN AI 3D - Git Setup & Packaging Script

Write-Host "--- Packaging NEUROSCAN AI 3D ---" -ForegroundColor Cyan

# Define paths
$projectPath = "C:\Users\ullas\.gemini\antigravity\scratch\neuroscan-ai-3d"
$zipPath = "C:\Users\ullas\.gemini\antigravity\scratch\neuroscan-ai-3d.zip"

# Create Zip
if (Test-Path $zipPath) { Remove-Item $zipPath }
Compress-Archive -Path "$projectPath\*" -DestinationPath $zipPath -Force
Write-Host "[SUCCESS] Project zipped at: $zipPath" -ForegroundColor Green

# Git Initialization
Set-Location $projectPath
if (-not (Test-Path ".git")) {
    git init
    git add .
    git commit -m "Initial commit: NEUROSCAN AI 3D Immersive Platform"
    Write-Host "[SUCCESS] Git repository initialized." -ForegroundColor Green
}

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. git remote add origin <YOUR_REPO_URL>"
Write-Host "2. git branch -M main"
Write-Host "3. git push -u origin main"
