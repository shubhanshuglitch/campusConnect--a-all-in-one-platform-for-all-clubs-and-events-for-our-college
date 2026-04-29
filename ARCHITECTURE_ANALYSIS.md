# 🏗️ CampusConnect - Complete Architecture Analysis

## 📋 Executive Summary

**CampusConnect** is a comprehensive platform designed to unify college club management and event discovery. It provides three distinct user roles with different capabilities, enabling students to discover clubs and events, club administrators to manage their clubs and create events, and master administrators to oversee the entire system.

**Stack**: Node.js + Express.js + MongoDB  
**Frontend**: Vanilla JavaScript + Responsive CSS (PWA-enabled)  
**Key Features**: Authentication, Role-Based Access Control, File Uploads, Event Interest Tracking

---

## 🏛️ System Architecture Overview

### 1. **Client Layer**
- **Web Browser**: Full desktop experience
- **Mobile Browser**: Responsive PWA with touch gestures, offline support
- **Supported Devices**: Desktop (>1024px), Tablet (768px-1024px), Mobile (360px-768px)

### 2. **Frontend Layer** (8 Pages)
| Page | Purpose | Audience |
|------|---------|----------|
| `index.html` | Home/Landing page | All users |
| `login.html` | Authentication interface | Unauthenticated users |
| `dashboard.html` | Personal user dashboard | Authenticated students |
| `clubs.html` | Browse all clubs | All authenticated users |
| `club-profile.html` | Detailed club view | All authenticated users |
| `events.html` | Browse events | All authenticated users |
| `admin-dashboard.html` | Club management panel | Club admins |
| `master-admin.html` | System administration | Master admin only |

### 3. **Backend Layer** (Node.js/Express)
```
Server Architecture:
├── Express App
│   ├── Middleware Layer
│   │   ├── CORS (Cross-origin requests)
│   │   ├── Body Parser (JSON/URL-encoded)
│   │   ├── JWT Authentication
│   │   ├── Role-Based Authorization
│   │   └── Multer (File uploads)
│   ├── API Routes
│   │   ├── /api/auth (Authentication)
│   │   ├── /api/clubs (Club management)
│   │   └── /api/events (Event management)
│   ├── Error Handler
│   └── Static File Server (/uploads)
└── MongoDB Connection
```

### 4. **Data Layer**

#### Database Models

**User Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcryptjs),
  role: "student" | "clubAdmin" | "masterAdmin",
  interests: [EventId], // Events user is interested in
  createdAt: Date
}
```

**Club Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: "Coding" | "Music" | "Sports" | "Arts" | "Science" | 
             "Literature" | "Social Service" | "Photography" | "Dance" | "Other",
  logo: String (URL to /uploads/club-*.ext),
  admin: UserId (Reference to User),
  createdAt: Date
}
```

**Event Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  date: Date,
  time: String,
  venue: String,
  category: String (same as Club categories),
  poster: String (URL to /uploads/event-*.ext),
  club: ClubId (Reference to Club),
  interestedUsers: [UserId], // Users interested in event
  createdAt: Date
}
```

#### Data Relationships
```
User (1) ──── (Many) Club    [One user can admin multiple clubs - restricted to 1 in code]
User (Many) ──── (Many) Event [Users mark interest in events]
Club (1) ──── (Many) Event     [One club has many events]
```

### 5. **Security Layer**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Authentication | JWT (JSON Web Tokens) | User session management (7-day expiry) |
| Password Security | bcryptjs | Password hashing with salt (rounds: 12) |
| Authorization | Role-Based Middleware | Enforce role restrictions on routes |
| CORS | Express CORS | Control cross-origin requests |
| File Upload | Multer | Validate & store file uploads (5MB limit) |

---

## 🔄 Complete User Workflows

### **Workflow 1: Student Journey**

```
1. VISIT PLATFORM
   └─> Redirected to /login if not authenticated

2. AUTHENTICATION
   └─> Register: name, email, password (role = "student")
   └─> Login: email, password
   └─> Receive: JWT Token + User Profile

3. DASHBOARD
   └─> View personal profile
   └─> Access user's event interests

4. BROWSE CLUBS
   ├─> GET /api/clubs
   │   └─> Filter by name (search)
   │   └─> Filter by category
   ├─> Click club card
   └─> GET /api/clubs/:id
       └─> View club details, logo, admin, events

5. BROWSE EVENTS
   ├─> GET /api/events
   │   └─> Filter by category
   │   └─> Show upcoming events
   ├─> Click event card
   └─> GET /api/events/:id
       ├─> View event details
       ├─> See poster
       └─> View interested users count

6. MARK EVENT INTEREST
   ├─> Click "I'm Interested" button
   └─> PUT /api/events/:id
       ├─> Add user to interestedUsers[]
       └─> Add event to user.interests[]

7. LOGOUT
   └─> Clear JWT token & session
```

### **Workflow 2: Club Admin Journey**

```
1. REGISTER AS CLUB ADMIN
   ├─> Register with role = "clubAdmin"
   └─> Receive JWT Token

2. CREATE CLUB (First Time)
   ├─> Access admin-dashboard.html
   ├─> Check if user already has club
   └─> POST /api/clubs
       ├─> Form: name, description, category, logo (upload)
       ├─> Set admin = current user
       └─> One club per admin (constraint enforced)

3. UPDATE CLUB
   ├─> Edit club details
   └─> PUT /api/clubs/:id
       ├─> Update: name, description, category, logo
       └─> Only club owner or master admin can edit

4. CREATE EVENTS
   ├─> Check if club exists (prerequisite)
   └─> POST /api/events
       ├─> Form: title, description, date, time, venue, category, poster
       ├─> Auto-set: club = admin's club
       └─> Multiple events per club allowed

5. MANAGE EVENTS
   ├─> View all events for own club
   ├─> Update event details
   │   └─> PUT /api/events/:id
   └─> Delete event
       └─> DELETE /api/events/:id

6. VIEW INTERESTED USERS
   ├─> GET /api/events/:id
   └─> See interestedUsers array

7. LOGOUT
```

### **Workflow 3: Master Admin Journey**

```
1. SYSTEM STARTUP
   ├─> Master admin auto-seeded in database
   └─> Email: shubhanshujaypee@gmail.com
       Password: Somu@2712

2. LOGIN AS MASTER ADMIN
   ├─> Access master-admin.html
   └─> JWT Token generated

3. MANAGE ALL CLUBS
   ├─> GET /api/clubs (no restrictions)
   ├─> PUT /api/clubs/:id (edit any club)
   ├─> DELETE /api/clubs/:id (delete any club)
   └─> Override club admin restrictions

4. MANAGE ALL EVENTS
   ├─> GET /api/events (no restrictions)
   ├─> PUT /api/events/:id (edit any event)
   └─> DELETE /api/events/:id (delete any event)

5. MANAGE ALL USERS
   ├─> View all users
   ├─> Change user roles
   └─> Reset user permissions

6. SYSTEM OVERSIGHT
   └─> Monitor platform activity & health

7. LOGOUT
```

---

## 📡 API Reference

### **Authentication API**

| Method | Endpoint | Access | Payload | Returns |
|--------|----------|--------|---------|---------|
| POST | `/api/auth/register` | Public | `{name, email, password, role}` | `{_id, name, email, role, token}` |
| POST | `/api/auth/login` | Public | `{email, password}` | `{_id, name, email, role, token}` |
| GET | `/api/auth/me` | Protected | - | User profile + interests |

### **Clubs API**

| Method | Endpoint | Access | Query/Payload | Returns |
|--------|----------|--------|---------------|---------|
| GET | `/api/clubs` | Public | `?search=name&category=Coding` | `[{club}, ...]` |
| GET | `/api/clubs/:id` | Public | - | `{club, events[]}` |
| POST | `/api/clubs` | Admin | `{name, description, category, logo}` | `{club}` |
| PUT | `/api/clubs/:id` | Admin/Master | `{name, description, category, logo}` | `{club}` |
| DELETE | `/api/clubs/:id` | Master | - | `{message: "success"}` |

### **Events API**

| Method | Endpoint | Access | Query/Payload | Returns |
|--------|----------|--------|---------------|---------|
| GET | `/api/events` | Public | `?category=Music&upcoming=true` | `[{event}, ...]` |
| GET | `/api/events/:id` | Public | - | `{event, interestedUsers[]}` |
| POST | `/api/events` | Admin | `{title, description, date, time, venue, category, poster}` | `{event}` |
| PUT | `/api/events/:id` | Admin/Master | Event fields | `{event}` |
| DELETE | `/api/events/:id` | Master | - | `{message: "success"}` |

---

## 🔐 Authorization Levels

### **Level 1: Public Access**
- GET /api/clubs
- GET /api/clubs/:id
- GET /api/events
- GET /api/events/:id

### **Level 2: Authenticated Student**
Requires: JWT Token
- All Level 1 endpoints
- GET /api/auth/me
- PUT /api/events/:id (mark interest)

### **Level 3: Club Admin**
Requires: JWT Token + role = "clubAdmin"
- All Level 2 endpoints
- POST /api/clubs (create own club)
- PUT /api/clubs/:id (edit own club)
- POST /api/events (create event for own club)
- PUT /api/events/:id (edit own events)
- DELETE /api/events/:id (delete own events)

### **Level 4: Master Admin**
Requires: JWT Token + role = "masterAdmin"
- **All endpoints** - Full CRUD access to all resources
- Override all club/event ownership restrictions
- Manage all users

---

## 📁 File Structure

```
campusConnect/
├── server.js                 # Express app setup & MongoDB connection
├── package.json              # Dependencies & scripts
├── .env                       # Environment variables (MONGODB_URI, JWT_SECRET, PORT)
│
├── middleware/
│   └── auth.js              # JWT verification, role-based authorization
│
├── models/
│   ├── User.js              # User schema & password hashing
│   ├── Club.js              # Club schema
│   └── Event.js             # Event schema
│
├── routes/
│   ├── auth.js              # /api/auth endpoints
│   ├── clubs.js             # /api/clubs endpoints
│   └── events.js            # /api/events endpoints
│
├── public/
│   ├── index.html           # Home page
│   ├── login.html           # Login/Register page
│   ├── dashboard.html       # Student dashboard
│   ├── clubs.html           # Browse clubs page
│   ├── club-profile.html    # Club details page
│   ├── events.html          # Browse events page
│   ├── admin-dashboard.html # Club admin panel
│   ├── master-admin.html    # Master admin panel
│   ├── css/
│   │   └── style.css        # Responsive styles
│   └── js/
│       └── app.js           # Client-side logic
│
└── uploads/                 # Stored files (logos, posters)
    ├── club-*.ext
    └── event-*.ext
```

---

## 🚀 Deployment Information

**Runtime**: Node.js  
**Framework**: Express.js  
**Database**: MongoDB (cloud or local)  
**Environment Variables Required**:
```
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key
PORT=3000
```

**Package Dependencies**:
- `express` (4.22.1) - Web framework
- `mongoose` (9.2.1) - MongoDB ODM
- `jsonwebtoken` (9.0.3) - JWT generation & verification
- `bcryptjs` (3.0.3) - Password hashing
- `cors` (2.8.6) - Cross-origin resource sharing
- `multer` (1.4.4) - File upload handling
- `dotenv` (17.3.1) - Environment variable loading

---

## 📊 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Client** | HTML5, CSS3, JavaScript (ES6+) | User interface & interactions |
| **Server** | Node.js, Express.js | API server & routing |
| **Database** | MongoDB | Data persistence |
| **Authentication** | JWT, bcryptjs | Security & user sessions |
| **File Handling** | Multer | Upload management |
| **Communication** | REST API, HTTP/HTTPS | Client-server communication |

---

## 🎯 Key Features

✅ **Multi-role access control** (Student, Club Admin, Master Admin)  
✅ **Club management** (Create, read, update, delete)  
✅ **Event lifecycle** (Create events, manage attendance interest)  
✅ **File uploads** (Club logos, event posters)  
✅ **User authentication** (Registration, login with JWT)  
✅ **Event interest tracking** (Users mark interest in events)  
✅ **Search & filtering** (By name, category, date)  
✅ **Mobile-first responsive design** (PWA-enabled)  
✅ **Data validation** (Constraints on club creation, file size limits)

---

## 🔄 Data Flow Example: User Registering & Attending Event

```
1. User fills registration form
   └─> POST /api/auth/register {name, email, password}
   
2. Server receives request
   ├─> Check if email exists
   ├─> Hash password (bcryptjs, 12 rounds)
   ├─> Create User document in MongoDB
   └─> Generate JWT token (7-day expiry)

3. User receives token, navigates to dashboard
   └─> GET /api/auth/me (headers: Authorization: Bearer <token>)

4. User browses events
   └─> GET /api/events?category=Coding
   ├─> Server queries Event collection
   ├─> Populate club references
   └─> Return event array

5. User marks interest in event
   └─> PUT /api/events/:id
   ├─> Verify JWT token
   ├─> Add user._id to event.interestedUsers[]
   ├─> Add event._id to user.interests[]
   └─> Save both documents

6. Event organizer checks interested users
   └─> GET /api/events/:id
   ├─> Return event with populated interestedUsers[]
   └─> Display list on admin-dashboard
```

---

## 🛡️ Security Considerations

**Implemented**:
- ✅ Password hashing (bcryptjs, 12 rounds)
- ✅ JWT authentication (7-day expiry)
- ✅ Role-based access control
- ✅ CORS validation
- ✅ File upload size limits (5MB)
- ✅ Email uniqueness constraint
- ✅ Environment variables for secrets

**Recommendations**:
- Add rate limiting on auth endpoints
- Implement request validation/sanitization
- Use HTTPS in production
- Add logging & monitoring
- Implement refresh token rotation
- Add account lockout after failed logins

---

## 📝 Notes

- Master admin is auto-seeded on first startup
- Each club admin can manage only one club
- Users can mark interest in unlimited events
- File uploads stored in `/uploads/` directory
- Mobile-responsive design optimized for touchscreen
- PWA capabilities for offline support

---

**Document Generated**: April 30, 2026  
**Version**: 1.0  
**Status**: Complete Architecture Analysis
