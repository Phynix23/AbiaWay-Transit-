Write-Host "🧹 Cleaning dist folder..." -ForegroundColor Yellow
if (Test-Path dist) {
  Remove-Item -Recurse -Force dist
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🏗️  Building for production..." -ForegroundColor Yellow
npm run build

Write-Host "✅ Build complete! Files are in the 'dist' folder" -ForegroundColor Green
Write-Host "🚀 To preview the build, run: npm run preview" -ForegroundColor Cyan