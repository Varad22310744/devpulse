const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
// Route 1 — Trigger GitHub login
// Frontend calls this when user clicks "Login with GitHub"
router.get('/github', passport.authenticate('github', {
    scope: ['user:email', 'repo', 'read:user']
}));

// Route 2 — GitHub redirects here after user approves
// Passport handles everything — saves user, creates session
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Create JWT token
        const token = jwt.sign(
            { id: req.user._id, username: req.user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        // Send token to frontend via URL
        res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    }
);

// Route 3 — Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.redirect(process.env.CLIENT_URL);
    });
});

// Route 4 — Get current logged in user
// Frontend calls this on every page load to check if user is logged in
router.get('/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not logged in' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json(decoded);
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;