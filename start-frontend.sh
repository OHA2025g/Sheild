#!/bin/bash

# Shield Foundation Frontend Startup Script
# This script starts the React frontend application

echo "🚀 Starting Shield Foundation Frontend..."
echo "========================================"

# Navigate to frontend directory
cd "$(dirname "$0")/frontend" || exit 1

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in frontend directory"
    echo "Please ensure frontend/.env exists with backend URL configuration"
    exit 1
fi

echo "✅ Configuration file found"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo "This may take a few minutes on first run..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo "✅ Dependencies ready"

# Check if backend is running
echo "🔌 Checking backend connection..."
BACKEND_URL=$(grep REACT_APP_BACKEND_URL .env | cut -d '=' -f2)
if command -v curl &> /dev/null; then
    if curl -s "$BACKEND_URL/api/" > /dev/null 2>&1; then
        echo "✅ Backend is running at $BACKEND_URL"
    else
        echo "⚠️  Warning: Backend doesn't appear to be running"
        echo "   Please start the backend first: ./start-backend.sh"
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

echo ""
echo "========================================"
echo "🟢 Starting React Development Server..."
echo "========================================"
echo ""
echo "📍 Frontend will be available at: http://localhost:3000"
echo "🔐 Admin panel: http://localhost:3000/admin"
echo "   Login: admin / admin123"
echo ""
echo "Press CTRL+C to stop the server"
echo ""

# Start the development server
npm start

