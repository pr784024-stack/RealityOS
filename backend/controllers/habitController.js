const Habit = require('../models/Habit');
const { validationResult } = require('express-validator');

// @desc    Add a new habit entry
// @route   POST /api/habits/add
// @access  Private
const addHabit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { studyHours, sleepHours, distractionTime, mood } = req.body;

  try {
    const habit = await Habit.create({
      userId: req.user._id,
      studyHours,
      sleepHours,
      distractionTime,
      mood,
      date: new Date(),
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all habits for logged-in user
// @route   GET /api/habits/get
// @access  Private
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addHabit, getHabits };
