# 🚀 Shield Foundation Website - Deployment Guide

## Quick Start (Single Command Deployment)

```bash
# Clone the repository and run the deployment script
git clone <your-repo-url>
cd shield-foundation-website
chmod +x deploy.sh
./deploy.sh
```

The single command `./deploy.sh` will automatically:
- Install all system dependencies (Node.js, Python, MongoDB)
- Install backend and frontend dependencies
- Build the frontend for production  
- Configure and start all services
- Seed the database with initial data
- Set up nginx reverse proxy
- Display service information and management commands

## 📋 Prerequisites

- **Operating System**: Ubuntu 18.04+ / CentOS 7+ / Debian 9+
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 10GB free space
- **Network**: Internet connection for downloading dependencies
- **User**: Root access or sudo privileges

## 🐳 Docker Deployment (Alternative)

### Using Docker Compose (Recommended)

```bash
# 1. Clone repository
git clone <your-repo-url>
cd shield-foundation-website

# 2. Start all services with one command
docker-compose up -d

# 3. Check service status
docker-compose ps

# 4. View logs
docker-compose logs -f
```

### Using Individual Docker Commands

```bash
# 1. Build images
docker build -t shield-foundation .

# 2. Start MongoDB
docker run -d --name shield-mongodb -p 27017:27017 mongo:6.0

# 3. Start the application
docker run -d --name shield-app -p 80:80 -p 8001:8001 --link shield-mongodb shield-foundation
```

## 🛠️ Manual Installation

### Step 1: Install System Dependencies

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y curl wget gnupg2 software-properties-common supervisor nginx
```

**CentOS/RHEL:**
```bash
sudo yum update -y
sudo yum install -y curl wget gnupg2 supervisor nginx
```

### Step 2: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Install Python

```bash
sudo apt-get install -y python3 python3-pip

# Verify installation
python3 --version
pip3 --version
```

### Step 4: Install MongoDB

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 5: Install Dependencies

```bash
# Backend dependencies
cd backend/
pip3 install -r requirements.txt
cd ../

# Frontend dependencies (install Yarn first)
npm install -g yarn
cd frontend/
yarn install
cd ../
```

### Step 6: Build Frontend

```bash
cd frontend/
yarn build
cd ../
```

### Step 7: Configure Environment Variables

**Backend (.env):**
```bash
cat > backend/.env << EOL
MONGO_URL=mongodb://localhost:27017/shield_foundation
JWT_SECRET=$(openssl rand -hex 32)
CORS_ORIGINS=*
EOL
```

**Frontend (.env):**
```bash
cat > frontend/.env << EOL
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
EOL
```

### Step 8: Setup Services

**Create supervisor configuration:**
```bash
sudo tee /etc/supervisor/conf.d/shield-foundation.conf << EOL
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
EOL
```

**Start services:**
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start shield-backend shield-frontend
```

### Step 9: Seed Database

```bash
python3 seed_database.py
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/shield_foundation` | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Random generated | Yes |
| `CORS_ORIGINS` | Allowed CORS origins | `*` | Yes |
| `REACT_APP_BACKEND_URL` | Backend API URL | `http://localhost:8001` | Yes |

### Database Configuration

The application uses MongoDB with the following collections:
- `admin_users` - Admin user accounts
- `impact_stats` - Impact statistics data
- `success_stories` - Success story content
- `leadership_team` - Team member information  
- `gallery_items` - Gallery media items
- `news` - Blog posts and news
- `detailed_page_sections` - CMS page content
- `site_settings` - Site configuration and branding
- `contacts` - Contact form submissions
- `newsletters` - Newsletter subscriptions
- `volunteers` - Volunteer registrations

## 🎯 Service Management

### Check Service Status
```bash
sudo supervisorctl status
```

### Restart Services
```bash
# Restart all services
sudo supervisorctl restart all

# Restart individual services
sudo supervisorctl restart shield-backend
sudo supervisorctl restart shield-frontend
```

### View Logs
```bash
# Backend logs
tail -f /var/log/shield-backend.out.log
tail -f /var/log/shield-backend.err.log

# Frontend logs  
tail -f /var/log/shield-frontend.out.log
tail -f /var/log/shield-frontend.err.log
```

### Stop Services
```bash
sudo supervisorctl stop shield-backend shield-frontend
```

## 🌐 Nginx Configuration

### Basic Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### HTTPS Configuration (Recommended)

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Same proxy configuration as above
}
```

## 🔐 Security Considerations

### 1. Change Default Admin Credentials
- Default username: `admin`
- Default password: `admin123`
- **IMPORTANT**: Change these immediately after deployment

### 2. Environment Security
- Generate a strong JWT secret: `openssl rand -hex 32`
- Use environment variables for sensitive data
- Never commit `.env` files to version control

### 3. Database Security
- Set up MongoDB authentication in production
- Use MongoDB Atlas for managed hosting
- Regular database backups

### 4. Network Security
- Use HTTPS in production
- Configure proper firewall rules
- Use reverse proxy (nginx) for additional security

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check backend health
curl http://localhost:8001/api/health

# Check frontend
curl http://localhost:3000

# Check database
mongo --eval "db.adminCommand('ping')"
```

### Backup Database
```bash
# Create backup
mongodump --db shield_foundation --out /backup/$(date +%Y%m%d)

# Restore backup
mongorestore --db shield_foundation /backup/20240101/shield_foundation/
```

### Log Rotation
```bash
# Setup log rotation
sudo tee /etc/logrotate.d/shield-foundation << EOL
/var/log/shield-*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 0644 root root
    postrotate
        supervisorctl restart shield-backend shield-frontend
    endscript
}
EOL
```

## 🚨 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Kill processes using ports
sudo fuser -k 3000/tcp
sudo fuser -k 8001/tcp
```

**2. Permission Denied**
```bash
# Fix file permissions
chmod +x deploy.sh
sudo chown -R $USER:$USER /path/to/project
```

**3. MongoDB Connection Issues**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

**4. Frontend Build Issues**
```bash
# Clear cache and reinstall
cd frontend/
rm -rf node_modules package-lock.json
yarn install
yarn build
```

### Debug Mode

Enable debug mode by setting environment variables:
```bash
export DEBUG=true
export LOG_LEVEL=debug
```

## 📱 Access Information

After successful deployment:

- **Website**: http://localhost:3000 or http://yourdomain.com
- **Admin Panel**: http://localhost:3000/admin
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

### Default Admin Access
- **Username**: `admin`  
- **Password**: `admin123`

**⚠️ SECURITY WARNING**: Change default credentials immediately after first login!

## 🎉 Success Verification

1. ✅ Website loads at http://localhost:3000
2. ✅ Admin panel accessible at /admin  
3. ✅ API responds at http://localhost:8001/api/health
4. ✅ Database contains seeded data
5. ✅ All services show "RUNNING" status
6. ✅ Social media links configurable in admin
7. ✅ All CRUD operations work in admin panel
8. ✅ No mock data - everything from database

## 📞 Support

For deployment issues or questions:
1. Check logs: `tail -f /var/log/shield-*.log`
2. Verify service status: `supervisorctl status`
3. Check database connection: `mongo --eval "db.adminCommand('ping')"`
4. Review this documentation
5. Check project issues on repository

---

**🚀 The Shield Foundation website is now ready for production!**