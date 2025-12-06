#!/bin/bash

# Shield Foundation Website - Single Command Deployment Script
# This script sets up and starts the complete Shield Foundation website

set -e  # Exit on any error

echo "🚀 Shield Foundation Website Deployment Starting..."
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_warning "Running as root. This is acceptable for deployment."
fi

# Step 1: Install System Dependencies
print_status "Step 1/8: Installing system dependencies..."
if command -v apt-get &> /dev/null; then
    apt-get update -qq
    apt-get install -y curl wget gnupg2 software-properties-common supervisor nginx
elif command -v yum &> /dev/null; then
    yum update -y
    yum install -y curl wget gnupg2 supervisor nginx
else
    print_warning "Package manager not detected. Please install curl, wget, supervisor, and nginx manually."
fi

# Step 2: Install Node.js
print_status "Step 2/8: Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi
NODE_VERSION=$(node --version)
print_success "Node.js installed: $NODE_VERSION"

# Step 3: Install Python and pip
print_status "Step 3/8: Installing Python..."
if ! command -v python3 &> /dev/null; then
    apt-get install -y python3 python3-pip
fi
PYTHON_VERSION=$(python3 --version)
print_success "Python installed: $PYTHON_VERSION"

# Step 4: Install MongoDB
print_status "Step 4/8: Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    apt-get update -qq
    apt-get install -y mongodb-org
    
    # Start MongoDB
    systemctl start mongod
    systemctl enable mongod
fi
print_success "MongoDB installed and started"

# Step 5: Install Backend Dependencies
print_status "Step 5/8: Installing backend dependencies..."
cd backend/
pip3 install -r requirements.txt
cd ../

print_success "Backend dependencies installed"

# Step 6: Install Frontend Dependencies
print_status "Step 6/8: Installing frontend dependencies..."
cd frontend/
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install -g yarn
    yarn install
fi
cd ../

print_success "Frontend dependencies installed"

# Step 7: Build Frontend for Production
print_status "Step 7/8: Building frontend for production..."
cd frontend/
yarn build
cd ../

print_success "Frontend built for production"

# Step 8: Setup Environment and Start Services
print_status "Step 8/8: Setting up environment and starting services..."

# Create production environment files if they don't exist
if [ ! -f backend/.env ]; then
    print_warning "Backend .env file not found. Creating default configuration..."
    cat > backend/.env << EOL
MONGO_URL=mongodb://localhost:27017/shield_foundation
JWT_SECRET=$(openssl rand -hex 32)
CORS_ORIGINS=*
EOL
fi

if [ ! -f frontend/.env ]; then
    print_warning "Frontend .env file not found. Creating default configuration..."
    cat > frontend/.env << EOL
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
EOL
fi

# Setup supervisor configuration
cat > /etc/supervisor/conf.d/shield-foundation.conf << EOL
[program:shield-backend]
command=python3 -m uvicorn server:app --host 0.0.0.0 --port 8001
directory=$(pwd)/backend
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/shield-backend.err.log
stdout_logfile=/var/log/shield-backend.out.log

[program:shield-frontend]
command=yarn start
directory=$(pwd)/frontend
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/shield-frontend.err.log
stdout_logfile=/var/log/shield-frontend.out.log
environment=PORT=3000

[program:mongodb]
command=mongod --config /etc/mongod.conf
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/mongodb.err.log
stdout_logfile=/var/log/mongodb.out.log
EOL

# Reload supervisor configuration
supervisorctl reread
supervisorctl update

# Start all services
supervisorctl start shield-backend
supervisorctl start shield-frontend
supervisorctl start mongodb

# Wait a moment for services to start
sleep 5

# Seed the database
print_status "Seeding database with initial data..."
cd /app
python3 seed_database.py

print_success "Database seeded successfully"

# Check service status
print_status "Checking service status..."
supervisorctl status

# Setup nginx reverse proxy (optional)
if command -v nginx &> /dev/null; then
    print_status "Setting up nginx reverse proxy..."
    cat > /etc/nginx/sites-available/shield-foundation << EOL
server {
    listen 80;
    server_name _;

    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support for development
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

    ln -sf /etc/nginx/sites-available/shield-foundation /etc/nginx/sites-enabled/
    nginx -t && systemctl restart nginx
    print_success "Nginx reverse proxy configured"
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=================================================="
print_success "Shield Foundation website is now running!"
echo ""
echo "📋 Service Information:"
echo "  • Frontend: http://localhost:3000"
echo "  • Backend API: http://localhost:8001"
echo "  • Admin Panel: http://localhost:3000/admin"
echo "  • Database: MongoDB on localhost:27017"
echo ""
echo "🔧 Management Commands:"
echo "  • Check status: supervisorctl status"
echo "  • Restart all: supervisorctl restart all"
echo "  • View logs: tail -f /var/log/shield-*.log"
echo ""
echo "📁 Default Admin Credentials:"
echo "  • Username: admin"
echo "  • Password: admin123"
echo ""
print_success "Deployment completed successfully! 🚀"