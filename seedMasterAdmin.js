// Seed Master Admin User
// Run this script once: node seedMasterAdmin.js

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusconnect';

const masterAdmin = {
  name: 'Shubhanshu',
  email: 'shubhanshujaypee@gmail.com',
  password: 'Somu@2712',
  role: 'masterAdmin'
};

async function seedMasterAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if master admin already exists
    const existing = await User.findOne({ email: masterAdmin.email });
    
    if (existing) {
      if (existing.role !== 'masterAdmin') {
        // Update to master admin role if user exists but isn't master admin
        existing.role = 'masterAdmin';
        await existing.save();
        console.log('✅ Updated existing user to Master Admin role');
      } else {
        console.log('ℹ️  Master Admin already exists');
      }
    } else {
      // Create new master admin
      await User.create(masterAdmin);
      console.log('✅ Master Admin created successfully!');
    }

    console.log('\n📧 Email:', masterAdmin.email);
    console.log('👤 Name:', masterAdmin.name);
    console.log('🔐 Password: [as configured]');
    console.log('🛡️  Role: masterAdmin\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seedMasterAdmin();
