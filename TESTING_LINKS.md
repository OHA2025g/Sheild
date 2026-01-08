# 🧪 Shield Foundation - Testing Links

**Status:** ✅ **LIVE AND RUNNING**

**Date:** January 8, 2026  
**Backend Port:** 8000  
**Frontend Port:** 3000

---

## 🌐 Main Application Links

### Public Website Pages

| Page | URL | Description |
|------|-----|-------------|
| 🏠 **Homepage** | http://localhost:3000 | Main landing page |
| 📰 **News** | http://localhost:3000/news | Latest news and updates |
| 📝 **Blog** | http://localhost:3000/blog | Blog articles |
| ℹ️ **About** | http://localhost:3000/about | About the foundation |
| 💼 **Programs** | http://localhost:3000/programs | Foundation programs |
| 📊 **Impact** | http://localhost:3000/impact | Impact statistics and stories |
| 🖼️ **Gallery** | http://localhost:3000/gallery | Photo gallery |
| 📞 **Contact** | http://localhost:3000/contact | Contact form |
| 🤝 **Volunteer** | http://localhost:3000/volunteer | Volunteer registration |
| 💝 **Donate** | http://localhost:3000/donation | Donation form |

### Admin Panel

| Feature | URL | Credentials |
|---------|-----|-------------|
| 🔐 **Admin Login** | http://localhost:3000/admin | Username: `admin`<br>Password: `admin123` |

---

## 🔌 Backend API Links

### Interactive Documentation

| Tool | URL | Description |
|------|-----|-------------|
| 📚 **Swagger UI** | http://localhost:8000/docs | Interactive API documentation with try-it-out feature |
| 📖 **ReDoc** | http://localhost:8000/redoc | Clean, readable API documentation |
| 🏥 **Health Check** | http://localhost:8000/api/ | API status endpoint |

### Public API Endpoints

```bash
# Health Check
curl http://localhost:8000/api/

# Get Impact Statistics
curl http://localhost:8000/api/impact-stats

# Get News Articles
curl http://localhost:8000/api/news

# Get Blog Posts
curl http://localhost:8000/api/blogs

# Get Testimonials
curl http://localhost:8000/api/testimonials

# Get Success Stories
curl http://localhost:8000/api/success-stories

# Get Leadership Team
curl http://localhost:8000/api/leadership-team

# Get Site Settings
curl http://localhost:8000/api/site-settings

# Get Gallery Items
curl http://localhost:8000/api/gallery-items
```

### Admin API Endpoints (Require Authentication)

```bash
# Admin Login
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get All Contacts (with token)
curl http://localhost:8000/api/admin/contacts \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get All Volunteers (with token)
curl http://localhost:8000/api/admin/volunteers \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get All Donations (with token)
curl http://localhost:8000/api/admin/donations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📱 Network Access

If you want to test from other devices on your network:

- **Frontend:** http://192.168.29.42:3000
- **Backend:** http://192.168.29.42:8000

---

## 🧪 Testing Scenarios

### 1. Test Contact Form Submission

**Page:** http://localhost:3000/contact

**Test Data:**
```
Name: John Doe
Email: john@example.com
Phone: 9876543210
Subject: Testing Contact Form
Message: This is a test message from the contact form.
```

**Verify:**
- Form submits successfully
- Success message appears
- Check admin panel: http://localhost:3000/admin (Contacts section)

### 2. Test Volunteer Registration

**Page:** http://localhost:3000/volunteer

**Test Data:**
```
Name: Jane Smith
Email: jane@example.com
Phone: 9876543211
Skills: Teaching, Communication
Availability: Weekends
Interests: Youth Training, Community Service
```

**Verify:**
- Registration completes successfully
- Check admin panel: http://localhost:3000/admin (Volunteers section)

### 3. Test Donation Form

**Page:** http://localhost:3000/donation

**Test Data:**
```
Name: Test Donor
Email: donor@example.com
Amount: 1000
Payment Method: Bank Transfer
Message: Test donation
```

**Verify:**
- Donation form submits successfully
- Check admin panel: http://localhost:3000/admin (Donations section)

### 4. Test Newsletter Subscription

**Footer section on any page**

**Test Data:**
```
Email: subscriber@example.com
```

**Verify:**
- Subscription successful message appears
- Check admin panel (Newsletter Subscribers section)

### 5. Test Admin Panel Features

**Login:** http://localhost:3000/admin

**Credentials:**
```
Username: admin
Password: admin123
```

**Test Features:**
- ✅ View dashboard
- ✅ Manage news articles (Create, Edit, Delete)
- ✅ Manage blog posts
- ✅ View contact submissions
- ✅ View volunteer applications
- ✅ View donations
- ✅ Update impact statistics
- ✅ Manage testimonials
- ✅ Manage leadership team
- ✅ Update site settings

---

## 📊 Database Information

**Connection:** MongoDB @ `31.97.207.166:27017`  
**Database:** `shield_foundation`  
**Status:** ✅ Connected

**Collections:**
- admin_users (3 documents)
- contacts
- volunteers
- newsletters (3 subscribers)
- news (2 articles)
- blogs (7 posts)
- donations
- testimonials (4 items)
- leadership_team (24 members)
- success_stories (10 stories)
- gallery_items
- impact_stats
- site_content
- site_settings

---

## 🛠️ Management Commands

### View Logs

```bash
# Backend logs
tail -f backend/backend.log

# Frontend logs
tail -f frontend/frontend.log
```

### Stop Services

```bash
# Stop backend
cd backend
kill $(cat backend.pid)

# Stop frontend
cd frontend
kill $(cat frontend.pid)
```

### Restart Services

```bash
# Restart backend
./start-backend.sh

# Restart frontend
./start-frontend.sh
```

---

## ✅ Test Checklist

### Frontend Tests
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] News page displays articles
- [ ] Blog page displays posts
- [ ] About page shows team and information
- [ ] Gallery displays images
- [ ] Contact form submits successfully
- [ ] Volunteer form submits successfully
- [ ] Donation form submits successfully
- [ ] Newsletter subscription works
- [ ] Admin login works
- [ ] Admin panel loads and functions

### Backend API Tests
- [ ] Health check endpoint responds
- [ ] Impact stats endpoint returns data
- [ ] News API returns articles
- [ ] Blog API returns posts
- [ ] Testimonials API works
- [ ] Success stories API works
- [ ] Leadership team API works
- [ ] Admin login API works
- [ ] Admin endpoints require authentication
- [ ] CORS headers are properly set

### Database Tests
- [ ] MongoDB connection is stable
- [ ] Data persists across restarts
- [ ] CRUD operations work in admin panel
- [ ] Indexes are properly created
- [ ] Database initialization works

### Integration Tests
- [ ] Frontend successfully calls backend API
- [ ] Backend successfully queries MongoDB
- [ ] Admin authentication flow works end-to-end
- [ ] Form submissions save to database
- [ ] Admin panel displays database data

---

## 🚨 Troubleshooting

### Frontend not loading?
```bash
# Check if frontend is running
lsof -i :3000

# Check frontend logs
tail -f frontend/frontend.log

# Restart frontend
cd frontend
kill $(cat frontend.pid)
PORT=3000 npm start
```

### Backend not responding?
```bash
# Check if backend is running
lsof -i :8000

# Check backend logs
tail -f backend/backend.log

# Test MongoDB connection
cd backend
python3 -c "import asyncio; from database import db; print('Connected')"
```

### API returning errors?
- Check backend logs: `tail -f backend/backend.log`
- Verify MongoDB connection
- Check CORS settings
- Verify JWT token for admin endpoints

---

## 📞 Support

For issues or questions:
1. Check logs in `backend/backend.log` and `frontend/frontend.log`
2. Review `MONGODB_SETUP.md` for configuration details
3. See `QUICK_START.md` for common commands

---

**Last Updated:** January 8, 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready

