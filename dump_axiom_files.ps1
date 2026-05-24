# Axiom — File Dump for Diagnosis
# Run this from anywhere. It reads from D:\axiom\ and outputs to your Desktop.

$base = "D:\axiom"
$out  = "$env:USERPROFILE\Desktop\axiom_dump"
New-Item -ItemType Directory -Force -Path $out | Out-Null

$files = @(
    "backend\app\workers\celery_app.py",
    "backend\app\workers\tasks.py",
    "backend\app\core\config.py",
    "backend\app\routes\auth_routes.py",
    "backend\app\routes\job_routes.py",
    "backend\app\routes\ws_routes.py",
    "frontend\src\app\auth\reset-password\page.tsx",
    "frontend\src\lib\api.ts",
    "backend\Procfile",
    "backend\app\core\database.py"
)

foreach ($f in $files) {
    $src = Join-Path $base $f
    if (Test-Path $src) {
        # Flatten path to safe filename
        $safe = $f -replace "\\", "__" -replace "/", "__"
        $dst  = Join-Path $out $safe
        Copy-Item $src $dst
        Write-Host "OK  $f"
    } else {
        Write-Host "MISSING  $f"
    }
}

Write-Host "`nDone. Files saved to: $out"
Write-Host "Now zip and upload the folder to Claude."
