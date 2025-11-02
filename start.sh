#!/bin/bash
# Quick Start Script for Recipe Generator

echo "🚀 Starting Recipe Generator..."
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating from env.example..."
    cp backend/env.example backend/.env
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env with your database credentials!"
    echo "   Required: DB_USER, DB_PASSWORD, OPENAI_API_KEY"
    echo ""
    read -p "Press Enter after editing .env file..."
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
    echo ""
fi

# Setup database if needed
echo "🗄️  Initializing database..."
cd backend
node migrations/init-db.js
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Starting servers..."
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
