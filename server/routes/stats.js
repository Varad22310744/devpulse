const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const statsController = require('../controllers/statsController');

// Protect all routes — must be logged in
router.use(authMiddleware);

// Route 1 — Get full dashboard data
// Returns streak, total commits, active repos, recent stats
router.get('/dashboard', statsController.getDashboard);

// Route 2 — Get commit history for chart
// Returns array of { date, commits } for last 30 days
router.get('/commits', statsController.getCommitHistory);

// Route 3 — Get language breakdown
// Returns { JavaScript: 60, Python: 40 } for pie chart
router.get('/languages', statsController.getLanguages);

// Route 4 — Manually trigger GitHub fetch
// Used for first time user lands on dashboard
router.post('/fetch', statsController.fetchAndSave);

module.exports = router;