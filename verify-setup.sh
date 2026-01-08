#!/bin/bash

# Shield Foundation Setup Verification Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Shield Foundation - Setup Verification Script          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

ERRORS=0
WARNINGS=0

# Check backend .env
echo "🔍 Checking backend configuration..."
if [ -f "backend/.env" ]; then
    echo "   ✅ backend/.env exists"
    if grep -q "MONGO_URL" backend/.env; then
        echo "   ✅ MONGO_URL configured"
    else
        echo "   ❌ MONGO_URL not found"
        ((ERRORS++))
    fi
else
    echo "   ❌ backend/.env missing"
    ((ERRORS++))
fi

# Check frontend .env
echo ""
echo "🔍 Checking frontend configuration..."
if [ -f "frontend/.env" ]; then
    echo "   ✅ frontend/.env exists"
    if grep -q "REACT_APP_BACKEND_URL" frontend/.env; then
        echo "   ✅ REACT_APP_BACKEND_URL configured"
    else
        echo "   ❌ REACT_APP_BACKEND_URL not found"
        ((ERRORS++))
    fi
else
    echo "   ❌ frontend/.env missing"
    ((ERRORS++))
fi

# Check Python dependencies
echo ""
echo "🔍 Checking Python environment..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    echo "   ✅ Python 3 installed: $PYTHON_VERSION"
    
    # Check key packages
    if python3 -c "import motor" 2>/dev/null; then
        echo "   ✅ motor (MongoDB driver) installed"
    else
        echo "   ⚠️  motor not installed - run: pip3 install -r backend/requirements.txt"
        ((WARNINGS++))
    fi
    
    if python3 -c "import fastapi" 2>/dev/null; then
        echo "   ✅ fastapi installed"
    else
        echo "   ⚠️  fastapi not installed - run: pip3 install -r backend/requirements.txt"
        ((WARNINGS++))
    fi
else
    echo "   ❌ Python 3 not found"
    ((ERRORS++))
fi

# Check Node.js
echo ""
echo "🔍 Checking Node.js environment..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js installed: $NODE_VERSION"
else
    echo "   ❌ Node.js not found"
    ((ERRORS++))
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   ✅ npm installed: $NPM_VERSION"
    
    if [ -d "frontend/node_modules" ]; then
        echo "   ✅ Frontend dependencies installed"
    else
        echo "   ⚠️  Frontend dependencies not installed - run: cd frontend && npm install"
        ((WARNINGS++))
    fi
else
    echo "   ❌ npm not found"
    ((ERRORS++))
fi

# Test MongoDB connection
echo ""
echo "🔍 Testing MongoDB connection..."
cd backend
python3 << 'PYEOF' 2>/dev/null
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
import os
import sys

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
        if not mongo_url:
            print("   ❌ MONGO_URL not set")
            return False
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        db_name = os.getenv('DB_NAME', 'shield_foundation')
        db = client[db_name]
        count = len(await db.list_collection_names())
        print(f"   ✅ MongoDB connected: {count} collections found")
        client.close()
        return True
    except Exception as e:
        print(f"   ❌ MongoDB connection failed: {e}")
        return False

sys.exit(0 if asyncio.run(test()) else 1)
PYEOF

if [ $? -ne 0 ]; then
    ((ERRORS++))
fi
cd ..

# Check startup scripts
echo ""
echo "🔍 Checking startup scripts..."
if [ -x "start-backend.sh" ]; then
    echo "   ✅ start-backend.sh is executable"
else
    echo "   ⚠️  start-backend.sh not executable - run: chmod +x start-backend.sh"
    ((WARNINGS++))
fi

if [ -x "start-frontend.sh" ]; then
    echo "   ✅ start-frontend.sh is executable"
else
    echo "   ⚠️  start-frontend.sh not executable - run: chmod +x start-frontend.sh"
    ((WARNINGS++))
fi

# Check documentation
echo ""
echo "🔍 Checking documentation..."
[ -f "MONGODB_SETUP.md" ] && echo "   ✅ MONGODB_SETUP.md exists"
[ -f "QUICK_START.md" ] && echo "   ✅ QUICK_START.md exists"

# Summary
echo ""
echo "════════════════════════════════════════════════════════════"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ ALL CHECKS PASSED - Your setup is ready!"
    echo ""
    echo "To start your application:"
    echo "  1. ./start-backend.sh"
    echo "  2. ./start-frontend.sh (in another terminal)"
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  SETUP COMPLETE WITH WARNINGS ($WARNINGS warnings)"
    echo ""
    echo "Address the warnings above for optimal setup."
else
    echo "❌ SETUP INCOMPLETE ($ERRORS errors, $WARNINGS warnings)"
    echo ""
    echo "Please fix the errors above before proceeding."
fi
echo "════════════════════════════════════════════════════════════"
