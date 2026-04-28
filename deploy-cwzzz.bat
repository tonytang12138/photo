@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   cwzzz.online Domain Deployment
echo ========================================
echo.
echo Checking environment...
echo.

:: Check Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Git not found. Please install Git first.
    echo Download: https://git-scm.com/downloads
    pause
    exit /b 1
)
echo [OK] Git is installed

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js first.
    echo Download: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js is installed

echo.
echo ========================================
echo   Step 1: Initialize Git Repository
echo ========================================
echo.

if not exist .git (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - Deploy to cwzzz.online"
    echo [OK] Git repository initialized
) else (
    echo [OK] Git repository already exists
    git add .
    git commit -m "Update for cwzzz.online deployment"
)

echo.
echo ========================================
echo   Step 2: Push to GitHub
echo ========================================
echo.
echo Enter your GitHub repository URL
echo Format: https://github.com/username/repo.git
echo.
set /p git_repo=GitHub Repository URL: 

if "%git_repo%"=="" (
    echo ERROR: Repository URL cannot be empty
    pause
    exit /b 1
)

git remote remove origin 2>nul
git remote add origin %git_repo%
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo WARNING: Push failed. Please check network connection and repository permissions.
    pause
)

echo.
echo ========================================
echo   Step 3: Install Vercel CLI
echo ========================================
echo.
echo Installing Vercel CLI...
npm install -g vercel
echo [OK] Vercel CLI installed

echo.
echo ========================================
echo   Step 4: Deploy to Vercel
echo ========================================
echo.
echo Deploying frontend to Vercel...
echo.
echo Note: First time requires Vercel login
echo.
vercel --prod

echo.
echo ========================================
echo   Step 5: Bind Custom Domain
echo ========================================
echo.
echo Domain Binding Instructions:
echo.
echo Method A: Use Vercel Console (Recommended)
echo   1. Visit https://vercel.com/dashboard
echo   2. Select your project
echo   3. Settings - Domains - Add
echo   4. Enter cwzzz.online
echo.
echo Method B: Use CLI
echo   Run: vercel domains add cwzzz.online
echo.
set /p bind_domain=Bind domain now? (Y/N): 

if /i "%bind_domain%"=="Y" (
    vercel domains add cwzzz.online
    if %errorlevel% equ 0 (
        echo [OK] Domain bound successfully
    ) else (
        echo WARNING: Domain binding failed. Please bind manually in Vercel console.
    )
)

echo.
echo ========================================
echo   Step 6: Configure DNS
echo ========================================
echo.
echo DNS Configuration Instructions:
echo.
echo Option 1: Use Vercel Nameserver (Recommended)
echo   Change your domain's Nameserver to:
echo   - ns1.vercel-dns.com
echo   - ns2.vercel-dns.com
echo.
echo Option 2: Use A Records
echo   Add these DNS records:
echo   Type: A    Name: @    Value: 76.76.21.21
echo   Type: A    Name: @    Value: 76.76.21.22
echo   Type: CNAME Name: www Value: cname.vercel-dns.com
echo.
echo Please configure DNS at your domain registrar.
echo Wait for DNS propagation (usually a few minutes to hours).
echo.
pause

echo.
echo ========================================
echo   Step 7: Deploy Backend to Railway
echo ========================================
echo.
set /p deploy_backend=Deploy backend now? (Y/N): 

if /i "%deploy_backend%"=="Y" (
    echo.
    echo Installing Railway CLI...
    npm install -g @railway/cli
    
    echo.
    echo Logging in to Railway...
    railway login
    
    echo.
    echo Deploying backend...
    cd backend
    railway init
    railway up
    
    echo.
    echo Configuring environment variables...
    set /p jwt_secret=Enter JWT_SECRET (at least 32 characters): 
    railway variables set JWT_SECRET=%jwt_secret%
    railway variables set NODE_ENV=production
    
    cd ..
    
    echo.
    echo [OK] Backend deployment completed!
    echo.
    echo Backend API URL: https://your-backend.up.railway.app
    echo Please remember this URL for frontend configuration.
)

echo.
echo ========================================
echo   Step 8: Configure API URL
echo ========================================
echo.
echo Creating API configuration file...
echo.
echo Enter backend API URL (press Enter for default)
echo Format: https://your-backend.up.railway.app
echo.
set /p api_url=Backend API URL: 

if "%api_url%"=="" (
    set api_url=https://your-backend.up.railway.app
)

echo.
echo [OK] Configuration file created
echo File location: api-config.js
echo.
echo You need to add this line to head section of all HTML files:
echo   ^<script src="api-config.js"^>^</script^>
echo.

echo.
echo ========================================
echo   Step 9: Configure CORS
echo ========================================
echo.
echo IMPORTANT: Configure CORS in backend
echo.
echo Please edit backend/server.js
echo Add to cors configuration:
echo   'https://cwzzz.online',
echo   'https://www.cwzzz.online',
echo.
echo Then redeploy backend:
echo   cd backend
echo   railway up
echo.

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Congratulations! Your website will be online soon.
echo.
echo Access URLs:
echo    - https://cwzzz.online
echo    - https://www.cwzzz.online
echo.
echo Next Steps:
echo    1. Wait for DNS propagation (check https://dnschecker.org)
echo    2. Bind domain in Vercel console
echo    3. Configure backend CORS
echo    4. Test website functionality
echo.
echo Documentation: cwzzz-deploy-guide.md
echo.
pause
