# 🚀 Quick Start Guide - Shield Foundation

## ✅ MongoDB Connected Successfully!

Your project is now fully configured and ready to run.

---

## 🎯 Starting the Application

### Method 1: Using Startup Scripts (Recommended)

**Start Backend:**
```bash
./start-backend.sh
```

**Start Frontend:** (in a new terminal)
```bash
./start-frontend.sh
```

### Method 2: Manual Start

**Backend:**
```bash
cd backend
python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend:**
```bash
cd frontend
npm start
```

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main website |
| **Admin Panel** | http://localhost:3000/admin | Admin dashboard |
| **Backend API** | http://localhost:8000 | API endpoints |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |

---

## 🔐 Default Login Credentials

```
Username: admin
Password: admin123
```

⚠️ **Important:** Change these credentials after first login!

---

## 📊 Database Information

**Connection:** MongoDB @ `31.97.207.166:27017`  
**Database:** `shield_foundation`  
**Status:** ✅ Connected and Operational

**Collections Available:**
- admin_users (3)
- contacts (1)
- volunteers (0)
- newsletters (3)
- news (2)
- blogs (7)
- donations (1)
- testimonials (4)
- leadership_team (24)
- success_stories (10)
- And more...

---

## 🛠️ Configuration Files

### Backend Configuration
**File:** `backend/.env`
```env
MONGO_URL=mongodb://Shield_Foundation:e26bfa34de2cf8a2b10b@31.97.207.166:27017/?tls=false
DB_NAME=shield_foundation
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
```

### Frontend Configuration
**File:** `frontend/.env`
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## 🧪 Testing MongoDB Connection

Run this command to test the connection:

```bash
cd backend
python3 -c "
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

async def test():
    load_dotenv()
    client = AsyncIOMotorClient(os.getenv('MONGO_URL'))
    await client.admin.command('ping')
    print('✅ MongoDB connection successful!')
    client.close()

asyncio.run(test())
"
```

---

## 📝 Common Tasks

### View Database Collections
```bash
cd backend
python3 << 'EOF'
import asyncio
from database import db

async def show_collections():
    collections = await db.list_collection_names()
    for col in collections:
        count = await db[col].count_documents({})
        print(f"{col}: {count} documents")

asyncio.run(show_collections())
EOF
```

### Initialize Database
```bash
cd backend
python3 -c "import asyncio; from database import init_database; asyncio.run(init_database())"
```

### Check Backend Logs
The backend runs with `--reload` flag, so changes are automatically detected.
Watch the terminal for logs and any errors.

---

## 🔧 Troubleshooting

### Backend won't start
1. Check if MongoDB is accessible: `ping 31.97.207.166`
2. Verify `.env` file exists in `backend/` directory
3. Install dependencies: `cd backend && pip install -r requirements.txt`
4. Check Python version: `python3 --version` (should be 3.8+)

### Frontend won't start
1. Check if backend is running first
2. Verify `.env` file exists in `frontend/` directory
3. Install dependencies: `cd frontend && npm install`
4. Clear cache: `cd frontend && rm -rf node_modules && npm install`

### Can't connect to MongoDB
1. Verify credentials in `backend/.env`
2. Check network connectivity to server
3. Ensure port 27017 is not blocked by firewall

### Authentication issues
1. Verify default admin user exists in database
2. Check JWT_SECRET_KEY is set in backend/.env
3. Clear browser localStorage and try again

---

## 📚 API Endpoints Reference

### Public Endpoints (No Auth Required)
- `GET /api/` - Health check
- `GET /api/news` - Get published news
- `GET /api/blogs` - Get published blogs
- `GET /api/impact-stats` - Get impact statistics
- `POST /api/contact` - Submit contact form
- `POST /api/volunteer` - Submit volunteer application
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/donation` - Submit donation

### Admin Endpoints (Auth Required)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/contacts` - Get contact submissions
- `GET /api/admin/volunteers` - Get volunteer applications
- `GET /api/admin/donations` - Get donations
- `GET /api/admin/news` - Get all news (including drafts)
- `POST /api/admin/news` - Create news article
- `PUT /api/admin/news/{id}` - Update news article
- `DELETE /api/admin/news/{id}` - Delete news article
- And many more...

**Full documentation:** http://localhost:8000/docs

---

## 🎨 Admin Panel Features

Once logged in to the admin panel, you can:

✅ Manage site content and pages  
✅ Create and edit news articles  
✅ Manage blog posts  
✅ View contact form submissions  
✅ Manage volunteer applications  
✅ Track donations  
✅ Update impact statistics  
✅ Manage testimonials  
✅ Update leadership team  
✅ Configure site settings  
✅ Manage user accounts  

---

## 📂 Project Structure

```
Shield Foundation/
├── backend/
│   ├── .env                 ← MongoDB configuration
│   ├── server.py            ← FastAPI application
│   ├── database.py          ← MongoDB connection
│   ├── models.py            ← Data models
│   ├── auth.py              ← Authentication logic
│   └── requirements.txt     ← Python dependencies
├── frontend/
│   ├── .env                 ← Backend URL configuration
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js           ← API client
│   │   └── components/      ← React components
│   └── package.json         ← Node dependencies
├── start-backend.sh         ← Backend startup script
├── start-frontend.sh        ← Frontend startup script
├── MONGODB_SETUP.md         ← Detailed setup guide
└── QUICK_START.md           ← This file
```

---

## 🆘 Need Help?

1. **Check logs:** Look at terminal output for error messages
2. **API Documentation:** Visit http://localhost:8000/docs
3. **MongoDB Setup:** See `MONGODB_SETUP.md` for detailed info
4. **Test connection:** Run the MongoDB connection test above

---

## ✅ Setup Checklist

- [x] MongoDB connection configured
- [x] Backend `.env` file created
- [x] Frontend `.env` file created
- [x] Database connection tested
- [x] Startup scripts created
- [x] All dependencies documented

**Status:** 🎉 **Ready to Use!**

---

*Last Updated: January 8, 2026*  
*MongoDB: shield_foundation @ 31.97.207.166:27017*

