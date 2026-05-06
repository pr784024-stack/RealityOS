const express = require('express');
const { addFriend, acceptFriend, listFriends, getLeaderboard } = require('../controllers/socialController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add-friend', protect, addFriend);
router.post('/accept', protect, acceptFriend);
router.get('/list', protect, listFriends);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
