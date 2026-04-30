# CampusConnect - System Diagrams

All diagrams in Mermaid format. You can:
- 📋 Copy-paste into [Mermaid Live Editor](https://mermaid.live)
- 📥 Export as PNG/SVG
- 📝 Use in documentation

---

## 1️⃣ System Architecture Diagram

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        Web["Web Browser<br/>HTML/CSS/JavaScript"]
        Mobile["📱 Mobile Browser<br/>Responsive PWA"]
    end
    
    subgraph Frontend["Frontend Pages"]
        Home["index.html<br/>(Home)"]
        Login["login.html<br/>(Authentication)"]
        Dashboard["dashboard.html<br/>(User Dashboard)"]
        ClubsPage["clubs.html<br/>(Browse Clubs)"]
        ClubProfile["club-profile.html<br/>(Club Details)"]
        EventsPage["events.html<br/>(Browse Events)"]
        AdminDash["admin-dashboard.html<br/>(Club Admin)"]
        MasterAdmin["master-admin.html<br/>(System Admin)"]
    end
    
    subgraph Server["🔧 Backend Server - Node.js/Express"]
        API["API Gateway<br/>/api/*"]
        AuthRoute["Auth Routes<br/>/api/auth"]
        ClubsRoute["Clubs Routes<br/>/api/clubs"]
        EventsRoute["Events Routes<br/>/api/events"]
    end
    
    subgraph Middleware["Middleware Layer"]
        CORS["CORS<br/>Cross-Origin Support"]
        BodyParser["Body Parser<br/>JSON/URL-encoded"]
        Auth["JWT Auth<br/>Token Verification"]
        Authorization["Role-Based Access<br/>Student/Admin/MasterAdmin"]
        FileUpload["Multer<br/>File Uploads"]
    end
    
    subgraph Models["📊 Data Models"]
        User["User Model<br/>• name, email, password<br/>• role: student/clubAdmin/masterAdmin<br/>• interests, createdAt"]
        Club["Club Model<br/>• name, description, category<br/>• logo, admin, createdAt"]
        Event["Event Model<br/>• title, date, time, venue<br/>• category, poster<br/>• club, interestedUsers"]
    end
    
    subgraph Database["🗄️ MongoDB Database"]
        UserDB["Users Collection"]
        ClubDB["Clubs Collection"]
        EventDB["Events Collection"]
    end
    
    subgraph Storage["📁 File Storage"]
        Uploads["uploads/ Directory<br/>Club Logos<br/>Event Posters"]
    end
    
    subgraph Security["🔐 Security"]
        JWT["JWT Tokens<br/>7-day Expiry"]
        BCrypt["Password Hashing<br/>bcryptjs"]
    end
    
    Web -->|HTTP Request| Home
    Mobile -->|HTTP Request| Home
    Home -->|Navigation| Login
    Home -->|Navigation| Dashboard
    Home -->|Navigation| ClubsPage
    Home -->|Navigation| EventsPage
    Home -->|Navigation| AdminDash
    
    Login -->|API Call| AuthRoute
    Dashboard -->|API Call| EventsRoute
    ClubsPage -->|API Call| ClubsRoute
    ClubProfile -->|API Call| ClubsRoute
    EventsPage -->|API Call| EventsRoute
    AdminDash -->|API Call| ClubsRoute
    AdminDash -->|API Call| EventsRoute
    MasterAdmin -->|API Call| API
    
    AuthRoute -->|Uses| Auth
    AuthRoute -->|Uses| BCrypt
    ClubsRoute -->|Uses| Auth
    ClubsRoute -->|Uses| Authorization
    ClubsRoute -->|Uses| FileUpload
    EventsRoute -->|Uses| Auth
    EventsRoute -->|Uses| Authorization
    EventsRoute -->|Uses| FileUpload
    
    API -->|Uses| CORS
    API -->|Uses| BodyParser
    
    AuthRoute -->|CRUD| User
    ClubsRoute -->|CRUD| Club
    ClubsRoute -->|CRUD| User
    EventsRoute -->|CRUD| Event
    EventsRoute -->|CRUD| User
    EventsRoute -->|CRUD| Club
    
    User -->|Persist| UserDB
    Club -->|Persist| ClubDB
    Event -->|Persist| EventDB
    
    ClubsRoute -->|Store| Uploads
    EventsRoute -->|Store| Uploads
    
    AuthRoute -->|Generate/Verify| JWT
    
    style Client fill:#e1f5ff
    style Frontend fill:#f3e5f5
    style Server fill:#e8f5e9
    style Middleware fill:#fff3e0
    style Models fill:#fce4ec
    style Database fill:#f1f8e9
    style Storage fill:#ede7f6
    style Security fill:#ffebee
```

---

## 2️⃣ Complete User Workflow Diagram

```mermaid
graph TD
    Start([User Visits CampusConnect]) --> CheckAuth{User<br/>Authenticated?}
    
    CheckAuth -->|No| LoginPage["📄 Login Page"]
    CheckAuth -->|Yes| HomePage["🏠 Home Page"]
    
    LoginPage --> LoginChoice{User<br/>Type?}
    
    LoginChoice -->|New User| Register["📝 Register<br/>Enter: name, email, password<br/>Role: Student/Club Admin"]
    LoginChoice -->|Existing User| Login["🔐 Login<br/>Enter: email, password"]
    
    Register -->|Success| SaveUser["💾 User Created<br/>Hash password<br/>Generate JWT Token"]
    Login -->|Success| GetUser["✅ Authenticate User<br/>Verify password<br/>Generate JWT Token"]
    
    SaveUser --> HomePage
    GetUser --> HomePage
    
    HomePage --> RoleCheck{User<br/>Role?}
    
    %% STUDENT WORKFLOW
    RoleCheck -->|Student| StudentDash["👨‍🎓 Student Dashboard"]
    
    StudentDash --> StudentOptions{Student<br/>Actions?}
    
    StudentOptions -->|Browse Clubs| ViewClubs["📚 View All Clubs<br/>GET /api/clubs<br/>• Search by name<br/>• Filter by category<br/>• View club details"]
    
    StudentOptions -->|Browse Events| ViewEvents["🎉 View All Events<br/>GET /api/events<br/>• Filter by category<br/>• View upcoming events<br/>• See club info"]
    
    StudentOptions -->|View Profile| ProfilePage["👤 My Profile<br/>GET /api/auth/me<br/>• View interests<br/>• View joined events"]
    
    ViewClubs --> ClubDetail["🔍 View Club Details<br/>GET /api/clubs/:id<br/>• Club info, logo, admin<br/>• See club's events<br/>• Browse upcoming events"]
    
    ViewEvents --> EventDetail["📋 View Event Details<br/>GET /api/events/:id<br/>• Title, description, date, time<br/>• Venue, poster, interested count<br/>• Club info"]
    
    EventDetail --> RegisterEvent{Mark Interest?}
    RegisterEvent -->|Yes| AddInterest["➕ Add to Interests<br/>PUT /api/events/:id<br/>Add user to interestedUsers<br/>Update User.interests"]
    AddInterest --> EventDetail
    RegisterEvent -->|No| EventDetail
    
    %% CLUB ADMIN WORKFLOW
    RoleCheck -->|Club Admin| AdminDash["🛡️ Club Admin Dashboard"]
    
    AdminDash --> CheckClub{Has<br/>Club?}
    
    CheckClub -->|No| CreateClub["➕ Create Club<br/>POST /api/clubs<br/>• Club name, description<br/>• Category, logo upload<br/>Set admin: current user"]
    
    CreateClub --> AdminDash
    
    CheckClub -->|Yes| AdminOptions{Admin<br/>Actions?}
    
    AdminOptions -->|Update Club| EditClub["✏️ Edit Club<br/>PUT /api/clubs/:id<br/>• Update details, logo<br/>• Only by club owner/master"]
    
    AdminOptions -->|Create Event| CreateEvent["➕ Create Event<br/>POST /api/events<br/>• Title, description, date<br/>• Time, venue, category<br/>• Poster upload"]
    
    AdminOptions -->|Manage Events| ManageEvents["📊 View/Edit Events<br/>GET /api/events<br/>PUT /api/events/:id<br/>DELETE /api/events/:id"]
    
    EditClub --> AdminDash
    CreateEvent --> ManageEvents
    ManageEvents --> AdminDash
    
    %% MASTER ADMIN WORKFLOW
    RoleCheck -->|Master Admin| MasterDash["👑 Master Admin Dashboard"]
    
    MasterDash --> MasterOptions{Master Admin<br/>Actions?}
    
    MasterOptions -->|Manage All Clubs| AllClubs["📚 View All Clubs<br/>GET /api/clubs<br/>Edit/Delete any club"]
    
    MasterOptions -->|Manage All Events| AllEvents["🎉 View All Events<br/>GET /api/events<br/>Edit/Delete any event"]
    
    MasterOptions -->|Manage Users| AllUsers["👥 Manage Users<br/>View all users<br/>Change user roles"]
    
    AllClubs --> MasterDash
    AllEvents --> MasterDash
    AllUsers --> MasterDash
    
    %% FILE HANDLING
    CreateClub -.->|Upload Logo| Multer["📤 Multer<br/>Process upload<br/>Save to /uploads/"]
    CreateEvent -.->|Upload Poster| Multer
    EditClub -.->|Upload Logo| Multer
    
    %% ERROR HANDLING
    Login -->|Invalid| LoginError["❌ Invalid Credentials<br/>Show error message<br/>Return to login"]
    LoginError --> LoginPage
    
    CreateClub -->|Duplicate Club| ClubError["❌ Admin already<br/>has a club"]
    ClubError --> AdminDash
    
    CreateEvent -->|No Club| EventError["❌ Must create club<br/>before adding events"]
    EventError --> AdminDash
    
    StudentDash --> Logout["🚪 Logout<br/>Clear JWT token<br/>Clear user data"]
    AdminDash --> Logout
    MasterDash --> Logout
    Logout --> Start
    
    style Start fill:#fff59d
    style HomePage fill:#c8e6c9
    style StudentDash fill:#bbdefb
    style AdminDash fill:#ffe0b2
    style MasterDash fill:#f8bbd0
    style Logout fill:#ffccbc
```

---

## 3️⃣ API Routes & Data Model Diagram

```mermaid
graph LR
    subgraph Auth["🔐 Authentication Flow"]
        Register["POST /api/auth/register<br/>(name, email, password, role)"]
        Login["POST /api/auth/login<br/>(email, password)"]
        Me["GET /api/auth/me<br/>(Protected Route)"]
        
        Register -->|Returns| Token1["JWT Token<br/>+ User Data"]
        Login -->|Returns| Token2["JWT Token<br/>+ User Data"]
        Me -->|Returns| UserData["Authenticated<br/>User Profile"]
    end
    
    subgraph Clubs["📚 Club Management"]
        GetAllClubs["GET /api/clubs<br/>(search, category)"]
        GetClubById["GET /api/clubs/:id"]
        CreateClub["POST /api/clubs<br/>(Protected, Admin)"]
        UpdateClub["PUT /api/clubs/:id<br/>(Protected, Admin/Master)"]
        DeleteClub["DELETE /api/clubs/:id<br/>(Protected, Master)"]
        
        GetAllClubs -->|Returns| ClubList["Array of Clubs"]
        GetClubById -->|Returns| ClubDetail["Club Details<br/>+ Events Array"]
        CreateClub -->|Creates| NewClub["New Club<br/>+ Logo Upload"]
        UpdateClub -->|Updates| ExistingClub["Club Details"]
        DeleteClub -->|Removes| DeletedClub["Club Record"]
    end
    
    subgraph Events["🎉 Event Management"]
        GetAllEvents["GET /api/events<br/>(category, upcoming)"]
        GetEventById["GET /api/events/:id"]
        CreateEvent["POST /api/events<br/>(Protected, Admin)"]
        UpdateEvent["PUT /api/events/:id<br/>(Protected, Admin/Master)"]
        DeleteEvent["DELETE /api/events/:id<br/>(Protected, Master)"]
        MarkInterest["PUT /api/events/:id/interest<br/>(Protected, Student)"]
        
        GetAllEvents -->|Returns| EventList["Array of Events"]
        GetEventById -->|Returns| EventDetail["Event Details<br/>+ Interested Users"]
        CreateEvent -->|Creates| NewEvent["New Event<br/>+ Poster Upload"]
        UpdateEvent -->|Updates| ExistingEvent["Event Details"]
        DeleteEvent -->|Removes| DeletedEvent["Event Record"]
        MarkInterest -->|Updates| InterestList["User Added to<br/>interestedUsers Array"]
    end
    
    subgraph DataModel["📊 Data Relationships"]
        UserModel["👤 User<br/>• _id<br/>• name, email, password<br/>• role<br/>• interests[]<br/>• createdAt"]
        
        ClubModel["📚 Club<br/>• _id<br/>• name, description<br/>• category<br/>• logo<br/>• admin → User<br/>• createdAt"]
        
        EventModel["🎉 Event<br/>• _id<br/>• title, description<br/>• date, time, venue<br/>• category<br/>• poster<br/>• club → Club<br/>• interestedUsers[]<br/>• createdAt"]
        
        UserModel -.->|References| EventModel
        ClubModel -->|FK: admin| UserModel
        EventModel -->|FK: club| ClubModel
        EventModel -.->|References| UserModel
    end
    
    subgraph Security["🔒 Authorization Levels"]
        Public["Public Access<br/>• GET /api/clubs<br/>• GET /api/events<br/>• GET /api/clubs/:id<br/>• GET /api/events/:id"]
        
        Student["Student Access<br/>+ PUT /api/events/:id/interest<br/>+ GET /api/auth/me"]
        
        Admin["Club Admin Access<br/>+ POST /api/clubs<br/>+ PUT own club<br/>+ POST /api/events<br/>+ PUT/DELETE own events"]
        
        Master["Master Admin Access<br/>+ Full CRUD on all clubs<br/>+ Full CRUD on all events<br/>+ Full CRUD on all users"]
        
        Public -.->|Requires JWT| Student
        Student -.->|Requires Role| Admin
        Admin -.->|Requires Role| Master
    end
    
    style Auth fill:#ffebee
    style Clubs fill:#e3f2fd
    style Events fill:#f3e5f5
    style DataModel fill:#e8f5e9
    style Security fill:#fff3e0
```

---

## 📥 How to Download

### Option 1: Use Mermaid Live Editor
1. Go to [mermaid.live](https://mermaid.live)
2. Copy-paste any diagram code above
3. Click **Export** → **Download as PNG/SVG**

### Option 2: Use VS Code Mermaid Extension
1. Install "Markdown Preview Mermaid Support"
2. Create `.mmd` files with the code
3. Preview and export

### Option 3: Save as Files
The Mermaid code is already saved in `DIAGRAMS.md` in your project root!
