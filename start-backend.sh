#!/bin/bash

# Shield Foundation Backend Startup Script
# This script starts the FastAPI backend server with MongoDB connection

echo "🚀 Starting Shield Foundation Backend..."
echo "========================================"

# Navigate to backend directory
cd "$(dirname "$0")/backend" || exit 1

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in backend directory"
    echo "Please ensure backend/.env exists with MongoDB configuration"
    exit 1
fi

echo "✅ Configuration file found"

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "🔄 Activating virtual environment..."
    source venv/bin/activate
fi

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if ! python3 -c "import motor, fastapi, uvicorn" 2>/dev/null; then
    echo "⚠️  Some dependencies missing. Installing..."
    pip3 install -r requirements.txt
fi

echo "✅ Dependencies ready"

# Test MongoDB connection
echo "🔌 Testing MongoDB connection..."
python3 << 'PYEOF'
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
import os

env_file = Path('.env')
if env_file.exists():
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            os.environ[key.strip()] = value.strip()

async def test():
    try:
        mongo_url = os.getenv('MONGO_URL')
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print("✅ MongoDB connection successful")
        client.close()
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False

import sys
sys.exit(0 if asyncio.run(test()) else 1)
PYEOF

if [ $? -ne 0 ]; then
    echo "❌ Cannot start backend - MongoDB connection failed"
    exit 1
fi

echo ""
echo "========================================"
echo "🟢 Starting FastAPI Server..."
echo "========================================"
echo ""
echo "📍 API will be available at: http://localhost:8000"
echo "📚 API Docs available at: http://localhost:8000/docs"
echo ""
echo "Press CTRL+C to stop the server"
echo ""

# Start the server
python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload

