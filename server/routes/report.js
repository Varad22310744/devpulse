const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes — must be logged in
router.use(authMiddleware);

// Route 1 — Get AI weekly summary
// Fetches last 7 days stats → sends to Gemini → returns summary
router.get('/weekly', reportController.getWeeklyReport);

// Route 2 — Send email digest manually
// Triggers Nodemailer to send weekly report to user email
router.post('/email', reportController.sendEmailDigest);

module.exports = router;