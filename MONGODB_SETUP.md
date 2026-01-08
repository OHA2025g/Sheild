# MongoDB Setup Guide - Shield Foundation

## ✅ Connection Established Successfully!

Your Shield Foundation project has been successfully connected to MongoDB.

### 📋 Configuration Details

**MongoDB Connection String:**
```
mongodb://Shield_Foundation:e26bfa34de2cf8a2b10b@31.97.207.166:27017/?tls=false
```

**Database Name:** `shield_foundation`

**Server:** `31.97.207.166:27017`

---

## 📁 Configuration Files Created

### Backend Configuration (`backend/.env`)
```env
# MongoDB Configuration
MONGO_URL=mongodb://Shield_Foundation:e26bfa34de2cf8a2b10b@31.97.207.166:27017/?tls=false
DB_NAME=shield_foundation

# JWT Secret Key (change this to a secure random string in production)
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

### Frontend Configuration (`frontend/.env`)
```env
# Backend API Configuration
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## 📊 Database Status

✅ **Connection Status:** Active and Working

**Existing Collections Found:**
- `admin_users` (3 documents) - System administrators
- `contacts` (1 document) - Contact form submissions
- `volunteers` (0 documents) - Volunteer applications
- `newsletters` (3 documents) - Newsletter subscribers
- `news` (2 documents) - News articles
- `blogs` (7 documents) - Blog posts
- `donations` (1 document) - Donation records
- `impact_stats` (1 document) - Impact statistics
- `site_content` (2 documents) - CMS content
- `site_settings` (1 document) - Site configuration
- `leadership_team` (24 documents) - Team members
- `success_stories` (10 documents) - Success stories
- `testimonials` (4 documents) - User testimonials
- `gallery_items` (0 documents) - Gallery photos
- `detailed_page_sections` (4 documents) - Page sections
- `pages` (10 documents) - Page data
- And more...

---

## 🚀 How to Start Your Application

### 1. Start the Backend Server

```bash
cd backend
python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at: `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### 2. Start the Frontend Application

```bash
cd frontend
npm start
# or
yarn start
```

The frontend will be available at: `http://localhost:3000`

---

## 🔐 Default Admin Credentials

The database initialization creates a default admin user:

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change these credentials after first login!

---

## 🧪 Testing the Connection

You can test the MongoDB connection anytime by running:

```bash
cd backend
python3 << 'EOF'
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

async def test():
    load_dotenv()
    client = AsyncIOMotorClient(os.getenv('MONGO_URL'))
    await client.admin.command('ping')
    print("✅ MongoDB connection successful!")
    client.close()

asyncio.run(test())
EOF
```

---

## 📦 Required Dependencies

Make sure you have installed all required packages:

### Backend
```bash
cd backend
pip install -r requirements.txt
```

Key packages:
- `motor==3.3.1` - Async MongoDB driver
- `pymongo==4.5.0` - MongoDB driver
- `fastapi==0.110.1` - Web framework
- `python-dotenv>=1.0.1` - Environment variables
- `pyjwt>=2.10.1` - JWT authentication
- `bcrypt>=4.0.0` - Password hashing

### Frontend
```bash
cd frontend
npm install
# or
yarn install
```

---

## 🔧 Database Operations

### Initialize Database
The database is automatically initialized when the backend starts. It will:
- Create default admin user
- Create initial impact statistics
- Set up database indexes for performance

### Manual Initialization
```bash
cd backend
python3 -c "import asyncio; from database import init_database; asyncio.run(init_database())"
```

---

## 🌐 API Endpoints

Once the backend is running, you can access:

- **Health Check:** `GET /api/`
- **Admin Login:** `POST /api/admin/login`
- **Get News:** `GET /api/news`
- **Get Blogs:** `GET /api/blogs`
- **Contact Form:** `POST /api/contact`
- **Volunteer Application:** `POST /api/volunteer`
- **Newsletter Subscription:** `POST /api/newsletter/subscribe`
- **Donation Submission:** `POST /api/donation`
- **Impact Stats:** `GET /api/impact-stats`

Full API documentation available at: `http://localhost:8000/docs`

---

## 🛡️ Security Notes

1. **JWT Secret:** The default JWT secret key is for development only. For production, generate a secure random key:
   ```bash
   python3 -c "import secrets; print(secrets.token_hex(32))"
   ```
   Then update `JWT_SECRET_KEY` in `backend/.env`

2. **MongoDB Authentication:** Your connection uses username/password authentication. Keep these credentials secure.

3. **TLS/SSL:** Currently TLS is disabled (`tls=false`). For production, consider enabling TLS/SSL.

4. **Admin Password:** Change the default admin password immediately after deployment.

---

## 🐛 Troubleshooting

### Connection Errors

If you encounter connection issues:

1. **Check MongoDB server is running:**
   ```bash
   ping 31.97.207.166
   ```

2. **Verify credentials:** Make sure the username and password are correct

3. **Check network access:** Ensure your IP is whitelisted on the MongoDB server

4. **Firewall:** Verify port 27017 is accessible

### Environment Variables Not Loading

If environment variables aren't loading:

1. Verify `.env` file exists in the correct directory
2. Check file permissions: `ls -la backend/.env`
3. Ensure `python-dotenv` is installed
4. Try loading explicitly in your code

---

## 📝 Additional Resources

- MongoDB Documentation: https://docs.mongodb.com/
- FastAPI Documentation: https://fastapi.tiangolo.com/
- Motor Documentation: https://motor.readthedocs.io/

---

## ✅ Setup Verification Checklist

- [x] MongoDB connection string configured
- [x] Backend `.env` file created
- [x] Frontend `.env` file created
- [x] MongoDB connection tested and working
- [x] Database initialization tested
- [x] Existing collections verified
- [x] Default admin user confirmed

**Status:** 🎉 **Ready to use!**

---

*Setup completed on: January 8, 2026*
*Database: shield_foundation @ 31.97.207.166:27017*

