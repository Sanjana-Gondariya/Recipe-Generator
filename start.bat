@echo off
REM Quick Start Script for Recipe Generator (Windows)

echo 🚀 Starting Recipe Generator...
echo.

REM Check if .env exists
if not exist "backend\.env" (
    echo ⚠️  .env file not found!
    echo 📝 Creating from env.example...
    copy backend\env.example backend\.env
    echo.
    echo ⚠️  IMPORTANT: Edit backend\.env with your database credentials!
    echo    Required: DB_USER, DB_PASSWORD, OPENAI_API_KEY
    echo.
    pause
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm run install:all
    echo.
)

REM Setup database
echo 🗄️  Initializing database...
cd backend
call node migrations\init-db.js
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🌐 Starting servers...
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:5001
echo.
echo Press Ctrl+C to stop
echo.

call npm run dev
