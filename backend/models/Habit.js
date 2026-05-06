const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studyHours: {
    type: Number,
    required: true,
    default: 0,
  },
  sleepHours: {
    type: Number,
    required: true,
    default: 0,
  },
  distractionTime: {
    type: Number,
    required: true,
    default: 0,
  },
  mood: {
    type: String,
    enum: ['Great', 'Good', 'Okay', 'Bad', 'Terrible'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Habit', habitSchema);
