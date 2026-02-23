const express = require('express');
const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');
const { protect, adminOnly, isMasterAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer config for event poster upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `event-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/events — list events with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, upcoming } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('club', 'name category logo')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/events/:id — single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club', 'name category logo admin')
      .populate('interestedUsers', 'name');

    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/events — create event (admin only, must have a club)
router.post('/', protect, adminOnly, upload.single('poster'), async (req, res) => {
  try {
    const club = await Club.findOne({ admin: req.user._id });
    if (!club) {
      return res.status(400).json({ message: 'You must create a club before adding events' });
    }

    const { title, description, date, time, venue, category } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      category,
      poster: req.file ? `/uploads/${req.file.filename}` : '',
      club: club._id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/events/:id — edit event (owner admin or master admin)
router.put('/:id', protect, adminOnly, upload.single('poster'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('club');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Allow master admin to edit any event
    if (!isMasterAdmin(req.user) && event.club.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    const { title, description, date, time, venue, category } = req.body;
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.venue = venue || event.venue;
    event.category = category || event.category;
    if (req.file) event.poster = `/uploads/${req.file.filename}`;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/events/:id — delete event (owner admin or master admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('club');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Allow master admin to delete any event
    if (!isMasterAdmin(req.user) && event.club.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Remove from all users' interests
    await User.updateMany(
      { interests: req.params.id },
      { $pull: { interests: req.params.id } }
    );

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/events/:id/interest — toggle interest (student)
router.post('/:id/interest', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user._id;
    const isInterested = event.interestedUsers.includes(userId);

    if (isInterested) {
      // Remove interest
      event.interestedUsers.pull(userId);
      await User.findByIdAndUpdate(userId, { $pull: { interests: event._id } });
    } else {
      // Add interest
      event.interestedUsers.push(userId);
      await User.findByIdAndUpdate(userId, { $addToSet: { interests: event._id } });
    }

    await event.save();
    res.json({
      interested: !isInterested,
      count: event.interestedUsers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
