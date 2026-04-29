@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   cwzzz.online Deployment Status Check
echo ========================================
echo.
echo Checking deployment status...
echo.

:: Check Git status
echo [1] Git Repository Status:
if exist .git (
    echo     [OK] Git repository exists
    git status --short >nul 2>&1
    if %errorlevel% equ 0 (
        echo     [OK] Git is working
    ) else (
        echo     [WARNING] Git has uncommitted changes
    )
) else (
    echo     [ERROR] Git not initialized
)
echo.

:: Check if vercel.json exists
echo [2] Vercel Configuration:
if exist vercel.json (
    echo     [OK] vercel.json exists
) else (
    echo     [ERROR] vercel.json not found
)
echo.

:: Check if api-config.js exists
echo [3] API Configuration:
if exist api-config.js (
    echo     [OK] api-config.js exists
) else (
    echo     [ERROR] api-config.js not found
)
echo.

:: Check if backend exists
echo [4] Backend Configuration:
if exist backend (
    echo     [OK] Backend directory exists
    if exist backend\server.js (
        echo     [OK] server.js exists
    )
    if exist backend\package.json (
        echo     [OK] package.json exists
    )
    if exist backend\.env (
        echo     [OK] .env file exists
    ) else (
        echo     [INFO] .env file not found (will be created on Railway)
    )
) else (
    echo     [ERROR] Backend directory not found
)
echo.

:: Check Node.js
echo [5] Node.js Installation:
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo     [OK] Node.js is installed
    node --version
) else (
    echo     [ERROR] Node.js not installed
)
echo.

:: Check npm
echo [6] npm Installation:
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo     [OK] npm is installed
    npm --version
) else (
    echo     [ERROR] npm not installed
)
echo.

:: Check if Vercel CLI is installed
echo [7] Vercel CLI:
where vercel >nul 2>nul
if %errorlevel% equ 0 (
    echo     [OK] Vercel CLI is installed
    vercel --version
) else (
    echo     [INFO] Vercel CLI not installed
    echo            Install with: npm install -g vercel
)
echo.

:: Check if Railway CLI is installed
echo [8] Railway CLI:
where railway >nul 2>nul
if %errorlevel% equ 0 (
    echo     [OK] Railway CLI is installed
    railway --version
) else (
    echo     [INFO] Railway CLI not installed
    echo            Install with: npm install -g @railway/cli
)
echo.

echo ========================================
echo   Next Steps
echo ========================================
echo.
echo 1. Check Vercel Dashboard:
echo    https://vercel.com/dashboard
echo.
echo 2. Check DNS Status:
echo    https://dnschecker.org/#A/cwzzz.online
echo.
echo 3. If not deployed yet:
echo    - Run: npm install -g vercel
echo    - Run: vercel login
echo    - Run: vercel --prod
echo.
echo 4. Bind domain in Vercel:
echo    Settings - Domains - Add: cwzzz.online
echo.
echo 5. Configure DNS at your domain registrar:
echo    Nameservers: ns1.vercel-dns.com, ns2.vercel-dns.com
echo.
echo 6. Deploy backend (optional):
echo    cd backend
echo    railway login
echo    railway init
echo    railway up
echo.
echo ========================================
echo   For detailed instructions, see:
echo   - README-??????.md
echo   - ?????????.md
echo ========================================
echo.
pause
