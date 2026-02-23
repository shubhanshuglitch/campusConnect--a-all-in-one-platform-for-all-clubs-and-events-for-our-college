const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Coding', 'Music', 'Sports', 'Arts', 'Science', 'Literature', 'Social Service', 'Photography', 'Dance', 'Other']
  },
  poster: { type: String, default: '' },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  interestedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
