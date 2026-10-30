Set-Location $PSScriptRoot\backend
if (-not (Test-Path .\venv\Scripts\Activate.ps1)) {
  Write-Host "Virtual environment missing. Creating..."
  py -3 -m venv venv
  .\venv\Scripts\Activate.ps1
  pip install -r requirements.txt
} else {
  .\venv\Scripts\Activate.ps1
}
uvicorn main:app --reload --port 8000
