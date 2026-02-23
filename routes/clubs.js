const express = require('express');
const Club = require('../models/Club');
const Event = require('../models/Event');
const User = require('../models/User');
const { protect, adminOnly, masterAdminOnly, isMasterAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer config for club logo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `club-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/clubs — list all clubs with optional search & category filter
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const clubs = await Club.find(query).populate('admin', 'name email').sort({ createdAt: -1 });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/clubs/:id — single club with its events
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('admin', 'name email');
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const events = await Event.find({ club: club._id }).sort({ date: 1 });
    res.json({ club, events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/clubs — create club (admin only)
router.post('/', protect, adminOnly, upload.single('logo'), async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // Check if admin already has a club
    const existingClub = await Club.findOne({ admin: req.user._id });
    if (existingClub) {
      return res.status(400).json({ message: 'You already manage a club. Each admin can manage one club.' });
    }

    const club = await Club.create({
      name,
      description,
      category,
      logo: req.file ? `/uploads/${req.file.filename}` : '',
      admin: req.user._id
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/clubs/:id — update club (owner admin or master admin)
router.put('/:id', protect, adminOnly, upload.single('logo'), async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    // Allow master admin to edit any club
    if (!isMasterAdmin(req.user) && club.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this club' });
    }

    const { name, description, category } = req.body;
    club.name = name || club.name;
    club.description = description || club.description;
    club.category = category || club.category;
    if (req.file) club.logo = `/uploads/${req.file.filename}`;

    await club.save();
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/clubs/:id — delete club (master admin only)
router.delete('/:id', protect, masterAdminOnly, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    // Delete all events associated with this club
    const events = await Event.find({ club: club._id });
    const eventIds = events.map(e => e._id);
    
    // Remove events from users' interests
    await User.updateMany(
      { interests: { $in: eventIds } },
      { $pull: { interests: { $in: eventIds } } }
    );
    
    // Delete events
    await Event.deleteMany({ club: club._id });
    
    // Delete the club
    await Club.findByIdAndDelete(req.params.id);

    res.json({ message: 'Club and all its events deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
