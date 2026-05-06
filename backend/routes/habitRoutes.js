const express = require('express');
const { check } = require('express-validator');
const { addHabit, getHabits } = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/add',
  protect,
  [
    check('studyHours', 'Study hours is required').isNumeric(),
    check('sleepHours', 'Sleep hours is required').isNumeric(),
    check('distractionTime', 'Distraction time is required').isNumeric(),
    check('mood', 'Mood is required').not().isEmpty(),
  ],
  addHabit
);

router.get('/get', protect, getHabits);

module.exports = router;
