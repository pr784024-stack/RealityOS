const Friend = require('../models/Friend');
const User = require('../models/User');
const Habit = require('../models/Habit');

// @desc    Send a friend request
// @route   POST /api/social/add-friend
// @access  Private
const addFriend = async (req, res) => {
  const { friendEmail } = req.body;

  try {
    const friend = await User.findOne({ email: friendEmail });

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (friend._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot add yourself' });
    }

    const existingRequest = await Friend.findOne({
      userId: req.user._id,
      friendId: friend._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent or exists' });
    }

    const newRequest = await Friend.create({
      userId: req.user._id,
      friendId: friend._id,
      status: 'pending',
    });

    res.status(201).json({ message: 'Friend request sent', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Accept a friend request
// @route   POST /api/social/accept
// @access  Private
const acceptFriend = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await Friend.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Ensure the logged-in user is the one receiving the request (friendId in the Friend doc)
    if (request.friendId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to accept this request' });
    }

    request.status = 'accepted';
    await request.save();

    // Create the reciprocal relationship
    await Friend.create({
      userId: req.user._id,
      friendId: request.userId,
      status: 'accepted',
    });

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    List friends and pending requests
// @route   GET /api/social/list
// @access  Private
const listFriends = async (req, res) => {
  try {
    const friends = await Friend.find({ userId: req.user._id, status: 'accepted' }).populate('friendId', 'name email');
    const pendingRequests = await Friend.find({ friendId: req.user._id, status: 'pending' }).populate('userId', 'name email');

    res.json({ friends, pendingRequests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get leaderboard of friends
// @route   GET /api/social/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    // 1. Get all accepted friends
    const friends = await Friend.find({ userId: req.user._id, status: 'accepted' });
    const friendIds = friends.map((f) => f.friendId);
    
    // Include self
    const userIdsToCompare = [...friendIds, req.user._id];

    // 2. Aggregate study hours for these users
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const habits = await Habit.aggregate([
      {
        $match: {
          userId: { $in: userIdsToCompare },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalStudyHours: { $sum: '$studyHours' },
        },
      },
    ]);

    // 3. Populate user info and sort
    const populatedLeaderboard = await Promise.all(
      habits.map(async (h) => {
        const user = await User.findById(h._id).select('name');
        return {
          userId: h._id,
          name: user ? user.name : 'Unknown',
          totalStudyHours: h.totalStudyHours,
        };
      })
    );

    populatedLeaderboard.sort((a, b) => b.totalStudyHours - a.totalStudyHours);

    // Add rank
    const rankedLeaderboard = populatedLeaderboard.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addFriend, acceptFriend, listFriends, getLeaderboard };
