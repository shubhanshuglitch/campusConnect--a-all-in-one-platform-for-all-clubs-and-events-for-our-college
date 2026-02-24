const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/events', require('./routes/events'));

// Serve frontend pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/clubs', (req, res) => res.sendFile(path.join(__dirname, 'public', 'clubs.html')));
app.get('/club/:id', (req, res) => res.sendFile(path.join(__dirname, 'public', 'club-profile.html')));
app.get('/events', (req, res) => res.sendFile(path.join(__dirname, 'public', 'events.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html')));
app.get('/master-admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'master-admin.html')));

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusconnect';

// Auto-seed master admin on startup
async function seedMasterAdmin() {
  try {
    const User = require('./models/User');
    const masterEmail = 'shubhanshujaypee@gmail.com';
    
    const existing = await User.findOne({ email: masterEmail });
    if (!existing) {
      await User.create({
        name: 'Shubhanshu',
        email: masterEmail,
        password: 'Somu@2712',
        role: 'masterAdmin'
      });
      console.log('✅ Master Admin seeded');
    } else if (existing.role !== 'masterAdmin') {
      existing.role = 'masterAdmin';
      await existing.save();
      console.log('✅ Master Admin role updated');
    }
  } catch (err) {
    console.log('ℹ️  Master Admin seed skipped:', err.message);
  }
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Seed master admin if not exists
    await seedMasterAdmin();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 CampusConnect server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
