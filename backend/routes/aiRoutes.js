const express = require('express');
const { getPrediction, getHistory } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/predict', protect, getPrediction);
router.get('/history', protect, getHistory);

module.exports = router;
