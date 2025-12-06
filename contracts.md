# Shield Foundation - Backend Integration Contracts

## API Contracts & Implementation Plan

### 1. MOCK DATA TO BACKEND MIGRATION

#### Data Currently Mocked in `mock.js`:
- **Contact form submissions** - Need persistent storage
- **Volunteer applications** - Need persistent storage  
- **Newsletter subscriptions** - Need persistent storage
- **Admin authentication** - Need secure JWT-based auth
- **News/updates management** - Need CRUD operations
- **Impact statistics** - Need admin-updatable metrics

#### Static Data (Keep as constants):
- Program information (courses, services)
- Partners list
- Success stories
- Impact highlights structure

---

### 2. DATABASE SCHEMA

#### Collections Needed:

**contacts**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  inquiryType: String,
  createdAt: Date,
  status: String // "new", "responded", "closed"
}
```

**volunteers**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  skills: String,
  availability: String,
  interests: [String],
  experience: String,
  createdAt: Date,
  status: String // "pending", "approved", "rejected"
}
```

**newsletters**
```javascript
{
  _id: ObjectId,
  email: String,
  subscribedAt: Date,
  isActive: Boolean
}
```

**news**
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  status: String, // "draft", "published"
  author: String,
  createdAt: Date,
  updatedAt: Date
}
```

**admin_users**
```javascript
{
  _id: ObjectId,
  username: String,
  password: String, // hashed
  name: String,
  role: String,
  createdAt: Date,
  lastLogin: Date
}
```

**impact_stats** (admin-updatable)
```javascript
{
  _id: ObjectId,
  youthTrained: Number,
  youthPlaced: Number,
  seniorsSupported: Number,
  womenEmpowered: Number,
  updatedAt: Date,
  updatedBy: String
}
```

---

### 3. API ENDPOINTS TO IMPLEMENT

#### Public Endpoints:
- `POST /api/contact` - Submit contact form
- `POST /api/volunteer` - Submit volunteer application  
- `POST /api/newsletter/subscribe` - Newsletter subscription
- `GET /api/news` - Get published news (public)
- `GET /api/impact-stats` - Get current impact statistics

#### Admin Endpoints (Protected):
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/contacts` - List all contacts
- `PUT /api/admin/contacts/:id` - Update contact status
- `GET /api/admin/volunteers` - List all volunteers
- `PUT /api/admin/volunteers/:id` - Update volunteer status
- `GET /api/admin/newsletters` - List newsletter subscribers
- `POST /api/admin/news` - Create news article
- `PUT /api/admin/news/:id` - Update news article
- `DELETE /api/admin/news/:id` - Delete news article
- `GET /api/admin/news` - Get all news (including drafts)
- `GET /api/admin/impact-stats` - Get impact stats for admin
- `PUT /api/admin/impact-stats` - Update impact statistics

---

### 4. AUTHENTICATION STRATEGY

- **JWT-based authentication** for admin users
- **Password hashing** using bcrypt
- **Protected routes** middleware for admin endpoints
- **Session management** with httpOnly cookies

---

### 5. FRONTEND INTEGRATION PLAN

#### Files to Update:
1. **Remove mock.js imports** from all components
2. **Replace mockAPI calls** with actual API calls using axios
3. **Update admin authentication** to use JWT tokens
4. **Add error handling** for network requests
5. **Update localStorage usage** for admin sessions

#### Components Requiring Updates:
- `Homepage.jsx` - Contact form, newsletter signup
- `Contact.jsx` - Contact & volunteer forms
- `AdminLogin.jsx` - Real authentication
- `AdminPanel.jsx` - Real CRUD operations
- `Footer.jsx` - Newsletter signup

---

### 6. ERROR HANDLING & VALIDATION

#### Backend Validation:
- Email format validation
- Required field validation
- Phone number format validation
- Content length limits

#### Frontend Integration:
- Network error handling
- Loading states for all forms
- Success/error toast notifications
- Form validation feedback

---

### 7. SECURITY CONSIDERATIONS

- **CORS configuration** for frontend domain
- **Rate limiting** on contact/newsletter endpoints
- **Input sanitization** to prevent XSS
- **Password strength** requirements for admin
- **JWT token expiration** and refresh logic

---

### 8. DEPLOYMENT PREPARATION

- **Environment variables** for database connection
- **Error logging** for production debugging  
- **Health check endpoint** for monitoring
- **Database indexes** for performance

---

This contract ensures seamless backend integration while maintaining all current frontend functionality and user experience.