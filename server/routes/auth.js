const express = require('express');
const router = express.Router();
const passport = require('passport');

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
        // Success — redirect to dashboard
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
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
    if (req.isAuthenticated()) {
        res.json({
            id: req.user._id,
            username: req.user.username,
            avatar: req.user.avatar,
            email: req.user.email
        });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

module.exports = router;