# CampusConnect

A centralized platform for managing college clubs and events. Connect students with clubs, discover events, and build vibrant campus communities.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Node.js](https://img.shields.io/badge/Node.js-v16%2B-green)
![Express.js](https://img.shields.io/badge/Express.js-4.22.1-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**CampusConnect** solves the fragmentation problem of college clubs and events across multiple platforms. It provides:

- **Centralized Hub**: All clubs and events in one place
- **Role-Based Access**: Students, Club Admins, and Master Admin roles
- **Event Interest Tracking**: Students can mark interest in events
- **File Management**: Upload club logos and event posters
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Secure Authentication**: JWT tokens with bcryptjs password hashing

### Problem Statement
Students struggle to find clubs and events across multiple platforms, social media pages, and Discord servers. Club admins lack a centralized management system. CampusConnect provides a unified solution.

---

## ✨ Features

### For Students
- ✅ Browse and search clubs by name or category
- ✅ View club details and member information
- ✅ Discover upcoming events
- ✅ Mark interest in events
- ✅ View events you're interested in
- ✅ Responsive mobile-friendly interface

### For Club Admins
- ✅ Create and manage one club
- ✅ Upload club logo
- ✅ Create and manage events for their club
- ✅ Upload event posters
- ✅ View interested students for events
- ✅ Edit and delete events

### For Master Admin
- ✅ Full system access
- ✅ Manage all clubs
- ✅ Delete clubs and events
- ✅ Manage users
- ✅ View all system data

### Technical Features
- 🔐 Secure JWT authentication
- 🔒 bcryptjs password hashing (12 rounds)
- 📱 Progressive Web App (PWA) support
- 🎨 Responsive CSS with Flexbox
- 📁 File upload with Multer
- 🗄️ MongoDB with Mongoose ODM
- 🛡️ CORS protection
- ⚡ Non-blocking I/O with Node.js

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 16+ | Runtime environment |
| Express.js | 4.22.1 | Web framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | 9.2.1 | ODM (Object Data Modeling) |
| JWT | 9.0.3 | Authentication |
| bcryptjs | 3.0.3 | Password hashing |
| Multer | 1.4.4 | File upload handling |
| CORS | 2.8.6 | Cross-origin requests |
| dotenv | 17.3.1 | Environment variables |

### Frontend
| Technology | Purpose |
|-----------|---------|
| HTML5 | Semantic markup |
| CSS3 | Responsive styling |
| JavaScript (ES6+) | Client-side logic |
| Fetch API | API communication |

---

## 📦 Installation

### Prerequisites
- **Node.js** (v16 or higher): [Download](https://nodejs.org/)
- **MongoDB** (Local or Atlas): [Setup Guide](https://www.mongodb.com/docs/manual/installation/)
- **npm** (comes with Node.js)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/campusConnect.git
cd campusConnect
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
Create `.env` file in project root:
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/campusconnect

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Master Admin (auto-created on startup)
MASTER_ADMIN_EMAIL=admin@campus.edu
MASTER_ADMIN_PASSWORD=SecurePassword123!
MASTER_ADMIN_NAME=Master Administrator
```

### Step 4: Seed Master Admin
The master admin is automatically created on first server startup. No additional seeding required.

### Step 5: Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:3000`

---

## ⚙️ Configuration

### Environment Variables

**Required:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing

**Optional:**
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

### Example .env
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusconnect
JWT_SECRET=super_secret_key_at_least_32_characters_long
MASTER_ADMIN_EMAIL=admin@campus.edu
MASTER_ADMIN_PASSWORD=AdminPassword@123
```

### MongoDB Connection
**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/campusconnect
```

**MongoDB Atlas Cloud:**
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
```

---

## 🚀 Usage

### Starting the Application

**Terminal 1 - MongoDB (if using local)**
```bash
mongod
```

**Terminal 2 - Node Server**
```bash
npm start
```

Server runs on `http://localhost:3000`

### Accessing the Application

| Page | URL | Access |
|------|-----|--------|
| Home | `http://localhost:3000/` | Public |
| Register | `http://localhost:3000/login.html` | Public |
| Login | `http://localhost:3000/login.html` | Public |
| Dashboard | `http://localhost:3000/dashboard.html` | Students |
| Browse Clubs | `http://localhost:3000/clubs.html` | Public |
| Club Profile | `http://localhost:3000/club-profile.html` | Public |
| Browse Events | `http://localhost:3000/events.html` | Public |
| Admin Dashboard | `http://localhost:3000/admin-dashboard.html` | Club Admins |
| Master Admin | `http://localhost:3000/master-admin.html` | Master Admin |

### Test Accounts

**Student Account:**
```
Email: student@campus.edu
Password: Student@123
Role: student
```

**Club Admin Account:**
```
Email: admin@campus.edu
Password: Admin@123
Role: clubAdmin
```

**Master Admin Account:**
```
Created automatically on startup
Check .env for credentials
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@campus.edu",
  "password": "SecurePass@123",
  "role": "student"  // Optional: student, clubAdmin, masterAdmin
}

Response: 201 Created
{
  "_id": "userId",
  "name": "John Doe",
  "email": "john@campus.edu",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 2. Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@campus.edu",
  "password": "SecurePass@123"
}

Response: 200 OK
{
  "_id": "userId",
  "name": "John Doe",
  "email": "john@campus.edu",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 3. Get Current User Profile
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "_id": "userId",
  "name": "John Doe",
  "email": "john@campus.edu",
  "role": "student",
  "interests": [
    {
      "_id": "eventId",
      "title": "Hackathon",
      "date": "2024-05-15",
      ...
    }
  ]
}
```

### Club Endpoints

#### 1. Get All Clubs
```http
GET /clubs?search=coding&category=Coding
Authorization: Optional (Bearer <token>)

Query Parameters:
- search: Search by club name (case-insensitive)
- category: Filter by category

Response: 200 OK
[
  {
    "_id": "clubId",
    "name": "Coding Club",
    "description": "Learn programming",
    "category": "Coding",
    "logo": "/uploads/club-1234567890.jpg",
    "admin": {
      "_id": "adminId",
      "name": "Admin Name",
      "email": "admin@campus.edu"
    },
    "createdAt": "2024-04-30"
  },
  ...
]
```

#### 2. Get Club Details
```http
GET /clubs/:id
Authorization: Optional

Response: 200 OK
{
  "club": {
    "_id": "clubId",
    "name": "Coding Club",
    ...
  },
  "events": [
    {
      "_id": "eventId",
      "title": "Monthly Meetup",
      ...
    }
  ]
}
```

#### 3. Create Club
```http
POST /clubs
Authorization: Bearer <token>  (Required)
Content-Type: multipart/form-data

Form Data:
- name: "New Club"
- description: "Club description"
- category: "Coding"  // One of: Coding, Music, Sports, Arts, Science, Literature, Social Service, Photography, Dance, Other
- logo: <file>  (Optional)

Response: 201 Created
{
  "_id": "newClubId",
  "name": "New Club",
  ...
}

Errors:
- 401: Not authenticated
- 403: Requires clubAdmin or masterAdmin role
- 400: Admin already has a club
```

#### 4. Update Club
```http
PUT /clubs/:id
Authorization: Bearer <token>  (Required)
Content-Type: multipart/form-data

Form Data:
- name: "Updated Club Name"
- description: "Updated description"
- category: "Music"
- logo: <file>  (Optional)

Response: 200 OK
```

#### 5. Delete Club
```http
DELETE /clubs/:id
Authorization: Bearer <token>  (Required - masterAdmin only)

Response: 200 OK
{ "message": "Club deleted successfully" }
```

### Event Endpoints

#### 1. Get All Events
```http
GET /events?category=Coding&upcoming=true
Authorization: Optional

Query Parameters:
- category: Filter by category
- upcoming: true/false (only future events)

Response: 200 OK
[
  {
    "_id": "eventId",
    "title": "Hackathon 2024",
    "description": "24-hour coding competition",
    "date": "2024-05-20",
    "time": "09:00",
    "venue": "Main Hall",
    "category": "Coding",
    "poster": "/uploads/event-1234567890.jpg",
    "club": { ... },
    "interestedUsers": 15,
    "createdAt": "2024-04-30"
  }
]
```

#### 2. Get Event Details
```http
GET /events/:id
Authorization: Optional

Response: 200 OK
{
  "_id": "eventId",
  "title": "Hackathon 2024",
  ...,
  "interestedUsers": [
    { "_id": "userId1", "name": "Student 1" },
    { "_id": "userId2", "name": "Student 2" }
  ]
}
```

#### 3. Create Event
```http
POST /events
Authorization: Bearer <token>  (Required)
Content-Type: multipart/form-data

Form Data:
- title: "New Event"
- description: "Event description"
- date: "2024-05-20"  (YYYY-MM-DD format)
- time: "14:00"  (HH:MM format)
- venue: "Room 101"
- category: "Coding"
- poster: <file>  (Optional)

Response: 201 Created
```

#### 4. Update Event
```http
PUT /events/:id
Authorization: Bearer <token>  (Required)
Content-Type: multipart/form-data

Response: 200 OK
```

#### 5. Delete Event
```http
DELETE /events/:id
Authorization: Bearer <token>  (Required - masterAdmin only)

Response: 200 OK
```

---

## 📁 Project Structure

```
campusConnect/
│
├── server.js                    # Main Express server file
├── package.json                 # Dependencies & scripts
├── .env                         # Environment variables (create locally)
├── .gitignore                   # Git exclusions
│
├── middleware/
│   └── auth.js                  # JWT verification & authorization
│
├── models/
│   ├── User.js                  # User schema
│   ├── Club.js                  # Club schema
│   └── Event.js                 # Event schema
│
├── routes/
│   ├── auth.js                  # Authentication endpoints
│   ├── clubs.js                 # Club management endpoints
│   └── events.js                # Event management endpoints
│
├── public/
│   ├── index.html               # Home page
│   ├── login.html               # Login/Register page
│   ├── dashboard.html           # Student dashboard
│   ├── clubs.html               # Browse clubs
│   ├── club-profile.html        # Club details page
│   ├── events.html              # Browse events
│   ├── admin-dashboard.html     # Club admin panel
│   ├── master-admin.html        # Master admin panel
│   ├── css/
│   │   └── style.css            # Responsive styling
│   └── js/
│       └── app.js               # Client-side logic
│
└── uploads/                     # Uploaded logos & posters
```

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['student', 'clubAdmin', 'masterAdmin'],
  interests: [ObjectId] → Event IDs,
  createdAt: Date
}
```

### Club Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: Enum ['Coding', 'Music', 'Sports', ...],
  logo: String (file path),
  admin: ObjectId → User ID,
  createdAt: Date
}
```

### Event Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  date: Date,
  time: String (HH:MM),
  venue: String,
  category: Enum ['Coding', 'Music', 'Sports', ...],
  poster: String (file path),
  club: ObjectId → Club ID,
  interestedUsers: [ObjectId] → User IDs,
  createdAt: Date
}
```

---

## 🔐 Authentication

### JWT Token Flow

```
1. User Registers/Logs In
   ↓
2. Server generates JWT token:
   - Header: { alg: "HS256", typ: "JWT" }
   - Payload: { id: userId }
   - Signature: HMACSHA256(Header + Payload, JWT_SECRET)
   ↓
3. Token sent to client
   ↓
4. Client stores in localStorage
   ↓
5. Subsequent requests:
   Authorization: Bearer <token>
   ↓
6. Server verifies token signature
   ↓
7. User accessed via req.user
```

### Token Details
- **Expiry**: 7 days
- **Format**: Bearer scheme
- **Storage**: Client localStorage
- **Verification**: Server-side signature validation

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **student** | Browse clubs/events, mark interest |
| **clubAdmin** | Manage 1 club, create events |
| **masterAdmin** | Full system access |

---

## 📤 File Upload

### Multer Configuration
- **Location**: `/uploads` directory
- **Max Size**: 5 MB
- **Naming**: Auto-generated (timestamp-based)
- **Types Allowed**: images/* (jpg, png, gif)

### Supported Uploads
1. **Club Logo**: `/api/clubs` POST
2. **Event Poster**: `/api/events` POST

### File Access
```
Uploaded files accessible at:
http://localhost:3000/uploads/<filename>
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env` is correct
- Test connection: `mongodb://localhost:27017/campusconnect`

### Issue: "JWT_SECRET not found"
**Solution:**
- Add `JWT_SECRET=your_secret_key` to `.env`

### Issue: "Port 3000 already in use"
**Solution:**
- Change port: `PORT=3001` in `.env`
- Or kill process: `lsof -ti:3000 | xargs kill -9`

### Issue: "CORS errors"
**Solution:**
- Check `CORS` is enabled in `server.js`
- Frontend and backend should communicate properly

### Issue: "File upload fails"
**Solution:**
- Create `/uploads` directory: `mkdir uploads`
- Check directory permissions: `chmod 755 uploads`

### Issue: "Token expired"
**Solution:**
- Tokens valid for 7 days
- User needs to login again after expiry

---

## 📝 Contributing

### Fork & Clone
```bash
git clone https://github.com/yourusername/campusConnect.git
cd campusConnect
```

### Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### Make Changes
- Write clean, well-commented code
- Follow existing code style
- Add tests for new features

### Commit & Push
```bash
git add .
git commit -m "Add: description of your feature"
git push origin feature/your-feature-name
```

### Create Pull Request
- Describe changes clearly
- Link to any related issues

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Support

### Issues
Found a bug? [Open an issue](https://github.com/yourusername/campusConnect/issues)

### Questions
Have questions? [Start a discussion](https://github.com/yourusername/campusConnect/discussions)

### Contact
- 📧 Email: campusconnect@campus.edu
- 💬 Slack: #campusconnect channel

---

## 🎓 Academic Note

CampusConnect is a full-stack web application project demonstrating:
- ✅ REST API design principles
- ✅ MongoDB database modeling
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Responsive web design
- ✅ File upload handling
- ✅ Error handling & validation
- ✅ Security best practices

---

## 📊 Quick Links

- [API Documentation](#api-documentation)
- [Installation Guide](#installation)
- [Viva Preparation](./VIVA_CODE_EXPLANATION.md)
- [Architecture Analysis](./ARCHITECTURE_ANALYSIS.md)
- [Project Report](./FINAL_PROJECT_REPORT.md)

---

**Last Updated**: April 30, 2026  
**Version**: 1.0.0  
**Status**: Production Ready

Made with ❤️ by Campus Community
