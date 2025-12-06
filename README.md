# 🛡️ Shield Foundation Website

> **A comprehensive, database-driven website for the Shield Foundation NGO with advanced CMS capabilities**

[![Production Ready](https://img.shields.io/badge/Production-Ready-green.svg)](https://github.com/shield-foundation)
[![Database Driven](https://img.shields.io/badge/Database-Driven-blue.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)

## 🚀 Quick Start

Deploy the entire website with a single command:

```bash
git clone <repository-url>
cd shield-foundation-website
chmod +x deploy.sh
./deploy.sh
```

**That's it!** The website will be running at `http://localhost:3000` with admin panel at `/admin`.

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)  
- [🏗️ Architecture](#️-architecture)
- [🚀 Deployment](#-deployment)
- [🛠️ Development](#️-development)
- [📊 Admin Panel](#-admin-panel)
- [🔧 Configuration](#-configuration)
- [📱 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)

## 🎯 Overview

The Shield Foundation Website is a modern, full-stack web application built for an NGO focused on youth empowerment and senior citizen care. It features a comprehensive Content Management System (CMS) that allows administrators to manage every aspect of the website through an intuitive admin panel.

### Key Highlights

- **🎯 Mission-Driven**: Designed specifically for Shield Foundation's "Adding Life to Years" mission
- **📊 100% Database-Driven**: No hardcoded content - everything manageable via admin panel  
- **🎨 Professional Design**: Modern UI with blue, yellow, and white color scheme
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **🔒 Secure Admin Panel**: JWT-based authentication with role-based permissions
- **⚡ High Performance**: Optimized for speed and SEO

## ✨ Features

### 🌐 Public Website
- **Homepage**: Hero section with impact statistics and call-to-action
- **About Us**: Timeline-based journey, team profiles, and partner showcase
- **Programs**: Youth skilling and senior citizen care program details
- **Impact**: Success stories, impact metrics, and community highlights
- **Gallery**: Photo gallery with categorization and filtering
- **Blog**: News and updates with category-based organization
- **Contact**: Contact form with newsletter subscription

### 🛡️ Admin Panel
- **📊 Dashboard**: Real-time statistics and quick access to all features
- **📰 Blog Management**: Full CRUD operations for blog posts and news
- **🎯 Advanced Page Management**: Edit every section of every page
- **👥 User Management**: Role-based admin user management
- **🎨 Site Settings & Branding**: Logo, colors, and social media management
- **🌟 Success Stories**: Manage inspiring success stories
- **👥 Team Management**: Leadership team profiles and bios
- **🖼️ Gallery Management**: Upload and organize photo galleries
- **📧 Contact Management**: View and manage contact submissions
- **💌 Newsletter Management**: Manage newsletter subscriptions
- **🗄️ Database Management**: Complete overview and management of all data

### 🔐 Security & Performance
- **JWT Authentication**: Secure admin panel access
- **Role-Based Permissions**: Super Admin, Admin, Editor, and Viewer roles
- **Input Validation**: Comprehensive server-side and client-side validation
- **XSS Protection**: Sanitized inputs and secure data handling
- **Performance Optimized**: Fast loading with efficient database queries

## 🏗️ Architecture

### Tech Stack

**Frontend**
- **React 18.x**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Shadcn/UI**: High-quality, accessible UI components
- **Lucide React**: Beautiful SVG icons
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

**Backend**  
- **FastAPI**: High-performance Python web framework
- **Pydantic**: Data validation and serialization
- **JWT**: Secure authentication and authorization
- **Bcrypt**: Password hashing and security
- **CORS**: Cross-origin resource sharing configuration

**Database**
- **MongoDB**: NoSQL document database
- **Motor**: Async MongoDB driver for Python
- **11 Collections**: Organized data structure for all content types

**DevOps & Deployment**
- **Supervisor**: Process management and monitoring
- **Nginx**: Reverse proxy and static file serving
- **Docker**: Containerization support
- **Single-Command Deployment**: Automated setup script

### Database Schema

```
shield_foundation/
├── admin_users/          # Admin user accounts and roles
├── impact_stats/         # Impact metrics and statistics  
├── success_stories/      # Success story content and media
├── leadership_team/      # Team member profiles and bios
├── gallery_items/        # Gallery photos and metadata
├── news/                 # Blog posts and news articles
├── detailed_page_sections/ # CMS page content sections
├── site_settings/        # Site configuration and branding
├── contacts/             # Contact form submissions
├── newsletters/          # Newsletter subscriptions
└── volunteers/           # Volunteer registrations
```

## 🚀 Deployment

### Production Deployment (Single Command)

```bash
# 1. Clone repository
git clone <repository-url>
cd shield-foundation-website

# 2. Run deployment script
chmod +x deploy.sh
./deploy.sh

# 3. Access website
# Website: http://localhost:3000
# Admin: http://localhost:3000/admin
```

### Docker Deployment

```bash
# Using Docker Compose
docker-compose up -d

# Using individual containers
docker build -t shield-foundation .
docker run -d -p 80:80 -p 8001:8001 shield-foundation
```

### Cloud Deployment

The application supports deployment on:
- **AWS**: EC2, ECS, or Elastic Beanstalk
- **Google Cloud**: Compute Engine, Cloud Run, or App Engine  
- **Azure**: Virtual Machines, Container Instances, or App Service
- **DigitalOcean**: Droplets or App Platform
- **Heroku**: Web dynos with MongoDB Atlas

Detailed cloud deployment guides available in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## 🛠️ Development

### Prerequisites

- **Node.js**: 18.x or later
- **Python**: 3.9 or later  
- **MongoDB**: 6.0 or later
- **Yarn**: Latest version

### Setup Development Environment

```bash
# 1. Clone repository
git clone <repository-url>
cd shield-foundation-website

# 2. Install backend dependencies
cd backend/
pip install -r requirements.txt
cd ../

# 3. Install frontend dependencies
cd frontend/
yarn install
cd ../

# 4. Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 5. Start MongoDB (if not using Docker)
mongod

# 6. Seed database
python3 seed_database.py

# 7. Start development servers
# Terminal 1 - Backend
cd backend/
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2 - Frontend  
cd frontend/
yarn start
```

### Development Scripts

```bash
# Backend
cd backend/
python -m uvicorn server:app --reload    # Start with hot reload
python seed_database.py                  # Seed database with sample data
python -m pytest                         # Run tests

# Frontend
cd frontend/
yarn start                              # Start development server
yarn build                              # Build for production
yarn test                               # Run tests
yarn lint                               # Lint code
```

## 📊 Admin Panel

### Access & Authentication

- **URL**: `http://localhost:3000/admin`
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`
- **⚠️ IMPORTANT**: Change default credentials after first login

### Admin Features

#### 🏠 Dashboard
- Real-time statistics overview
- Quick access to all management features
- Recent activity monitoring
- System health indicators

#### 📰 Blog Management  
- Create, edit, and delete blog posts
- Rich text editor with media support
- Category and tag management
- Publish/draft status control
- SEO optimization fields

#### 🎯 Advanced Page Management
- **About Page**: Edit journey timeline, team profiles, partner information
- **Programs Page**: Manage all program sections and details
- **Impact Page**: Update impact metrics, success stories, highlights
- **Gallery Page**: Photo upload, categorization, and organization
- **Contact Page**: Configure contact information and form settings

#### 👥 User Management
- Create and manage admin users
- Role-based permissions (Super Admin, Admin, Editor, Viewer)
- Password management and security
- User activity monitoring

#### 🎨 Site Settings & Branding
- **Logo Management**: Upload and configure site logo and favicon
- **Color Scheme**: Customize primary, secondary, and accent colors
- **Social Media**: Configure Facebook, Instagram, YouTube, Twitter, LinkedIn links
- **Site Information**: Update title, description, and meta information

#### 🌟 Success Stories Management
- Create inspiring success stories with photos
- Program association and categorization
- Achievement highlighting
- Location and demographic information

#### 🖼️ Gallery Management
- Upload and organize photo galleries
- Category-based organization
- Image optimization and metadata
- Display order and visibility control

#### 🗄️ Database Management
- Complete overview of all 11 MongoDB collections
- Document count and statistics
- Data viewer with search and filter
- Safe document deletion with protection

### Admin User Roles

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full access to all features including user management |
| **Admin** | Full content management, limited user management |
| **Editor** | Content creation and editing, no administrative functions |  
| **Viewer** | Read-only access to admin panel and statistics |

## 🔧 Configuration

### Environment Variables

**Backend (backend/.env)**
```bash
MONGO_URL=mongodb://localhost:27017/shield_foundation
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGINS=*
```

**Frontend (frontend/.env)**
```bash
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
```

### Customization Options

#### Color Scheme
Update colors through admin panel or modify CSS variables:
```css
:root {
  --primary-color: #2563eb;    /* Blue */
  --secondary-color: #eab308;  /* Yellow */
  --accent-color: #ffffff;     /* White */
}
```

#### Logo and Branding
- Upload logo via admin panel Site Settings
- Supported formats: PNG, JPG, SVG
- Recommended size: 200x60px
- Automatic optimization and responsive scaling

#### Social Media Integration
Configure social media links in admin panel:
- Facebook, Instagram, YouTube, Twitter, LinkedIn
- Links automatically appear in website footer
- Only configured platforms are displayed

## 📱 API Documentation

### Public API Endpoints

```bash
# Site Content
GET /api/site-content           # Get general site content
GET /api/site-settings          # Get public site settings

# Impact & Statistics  
GET /api/impact-stats          # Get impact statistics
GET /api/success-stories       # Get published success stories

# Content Pages
GET /api/detailed-page-sections/{page}  # Get page sections (about/programs/impact)
GET /api/gallery-items         # Get gallery items  
GET /api/news                  # Get published blog posts
GET /api/leadership-team       # Get team members

# Contact & Engagement
POST /api/contact              # Submit contact form
POST /api/newsletter           # Subscribe to newsletter
POST /api/volunteer            # Register as volunteer
```

### Admin API Endpoints

```bash  
# Authentication
POST /api/admin/login          # Admin login
POST /api/admin/logout         # Admin logout

# Content Management  
GET|POST|PUT|DELETE /api/admin/news          # Blog management
GET|POST|PUT|DELETE /api/admin/success-stories  # Success story management
GET|POST|PUT|DELETE /api/admin/leadership-team  # Team management
GET|POST|PUT|DELETE /api/admin/gallery-items    # Gallery management
GET|POST|PUT|DELETE /api/admin/detailed-page-sections  # Page section management

# Site Management
GET|PUT /api/admin/site-settings    # Site settings management
GET|POST|PUT|DELETE /api/admin/users  # User management

# Database Management
GET /api/admin/database/stats                    # Database statistics
GET /api/admin/database/collections              # List all collections
GET /api/admin/database/{collection}             # Get collection data
DELETE /api/admin/database/{collection}/{id}     # Delete document
```

### API Authentication

Admin endpoints require JWT authentication:

```javascript
// Login to get token
const response = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'password' })
});
const { access_token } = await response.json();

// Use token in subsequent requests
const apiResponse = await fetch('/api/admin/news', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

## 🧪 Testing

### Backend Testing
```bash
cd backend/
python -m pytest tests/ -v
python -m pytest tests/ --cov=. --cov-report=html
```

### Frontend Testing
```bash
cd frontend/
yarn test                    # Run tests
yarn test --coverage        # Run with coverage
yarn test --watchAll        # Watch mode
```

### End-to-End Testing
```bash  
# Using the comprehensive test script
python3 test_website.py

# Manual testing checklist available in TESTING.md
```

## 🚨 Troubleshooting

### Common Issues

**1. Services Not Starting**
```bash
# Check service status
sudo supervisorctl status

# Restart services
sudo supervisorctl restart all

# Check logs
tail -f /var/log/shield-*.log
```

**2. Database Connection Issues**
```bash  
# Check MongoDB status
sudo systemctl status mongod

# Test connection
mongo --eval "db.adminCommand('ping')"

# Restart MongoDB
sudo systemctl restart mongod
```

**3. Port Conflicts**
```bash
# Kill processes using ports
sudo fuser -k 3000/tcp
sudo fuser -k 8001/tcp

# Check port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep :8001
```

**4. Permission Issues**
```bash
# Fix file permissions
sudo chown -R $USER:$USER /path/to/project
chmod +x deploy.sh
```

### Debug Mode

Enable debug logging:
```bash
export DEBUG=true
export LOG_LEVEL=debug
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our coding standards
4. **Test thoroughly** using our test suite
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** with detailed description

### Coding Standards

**Backend (Python)**
- Follow PEP 8 style guide
- Use type hints for all functions
- Document all functions with docstrings
- Write comprehensive tests

**Frontend (JavaScript/React)**
- Use functional components with hooks
- Follow React best practices
- Use TypeScript where possible
- Maintain component documentation

### Commit Message Format
```
type(scope): description

feat(admin): add user role management
fix(api): resolve authentication bug
docs(readme): update deployment guide
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shield Foundation** for their dedication to community service
- **Tech Mahindra Foundation** for partnership and support
- **Open Source Community** for the amazing tools and libraries
- **Contributors** who helped build and improve this project

## 📞 Support & Contact

- **Website**: [Shield Foundation Official](https://shield-foundation.org)
- **Email**: contact@shield-foundation.org  
- **Issues**: [GitHub Issues](https://github.com/shield-foundation/website/issues)
- **Documentation**: [Full Documentation](https://docs.shield-foundation.org)

---

<div align="center">

**🛡️ Built with ❤️ for Shield Foundation**

*Adding Life to Years*

[![GitHub Stars](https://img.shields.io/github/stars/shield-foundation/website.svg?style=social&label=Star)](https://github.com/shield-foundation/website)
[![GitHub Forks](https://img.shields.io/github/forks/shield-foundation/website.svg?style=social&label=Fork)](https://github.com/shield-foundation/website/fork)

</div>