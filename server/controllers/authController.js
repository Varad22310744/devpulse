const User = require('../models/User');

// Get current logged in user
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-accessToken');
        // select('-accessToken') — never send token to frontend
        // security — token should stay in backend only

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt
        });

    } catch (error) {
        console.error('getMe error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getMe };