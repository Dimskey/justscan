@echo off
echo 🚀 Starting JustSploit with Docker...

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found!
    echo 📝 Please copy .env.example to .env and configure your settings:
    echo    copy .env.example .env
    echo    notepad .env
    pause
    exit /b 1
)

REM Check if REPLICATE_API_TOKEN is set
findstr /C:"REPLICATE_API_TOKEN=" .env | findstr /V /C:"REPLICATE_API_TOKEN=$" | findstr /V /C:"REPLICATE_API_TOKEN= " >nul
if errorlevel 1 (
    echo ⚠️  REPLICATE_API_TOKEN is not set in .env file
    echo 🔑 Please get your token from: https://replicate.com/account/api-tokens
    echo 📝 And add it to your .env file
)

REM Build and start services
echo 🔨 Building Docker images...
docker-compose build

echo 🚀 Starting services...
docker-compose up -d

echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ✅ JustSploit Backend is now running!
echo.
echo 🔧 Backend API: http://localhost:8000
echo 📊 API Docs: http://localhost:8000/docs
echo.
echo 💡 To start frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 📝 To view logs: docker-compose logs -f
echo 🛑 To stop: docker-compose down
echo.
pause