const Stats = require('../models/Stats');
const User = require('../models/User');
const { generateWeeklyReport } = require('../services/geminiService');
const { sendWeeklyDigest } = require('../services/emailService');

// Controller 1 — Get AI weekly report
const getWeeklyReport = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch last 7 days stats
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const stats = await Stats.find({
            userId,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: 1 });

        if (stats.length === 0) {
            return res.json({
                report: 'No activity data found for this week. Start coding and check back later!'
            });
        }

        // Send to Gemini AI
        const report = await generateWeeklyReport(stats, req.user.username);

        res.json({ report });

    } catch (error) {
        console.error('getWeeklyReport error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller 2 — Send email digest
const sendEmailDigest = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user.email) {
            return res.status(400).json({
                message: 'No email found. Make your email public on GitHub.'
            });
        }

        // Fetch last 7 days stats
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const stats = await Stats.find({
            userId,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: 1 });

        if (stats.length === 0) {
            return res.status(400).json({
                message: 'No stats found for this week.'
            });
        }

        // Generate AI report first
        const report = await generateWeeklyReport(stats, user.username);

        // Send email with stats + AI report
        const sent = await sendWeeklyDigest(
            user.email,
            user.username,
            report,
            stats
        );

        if (sent) {
            res.json({ message: `Weekly digest sent to ${user.email}` });
        } else {
            res.status(500).json({ message: 'Failed to send email' });
        }

    } catch (error) {
        console.error('sendEmailDigest error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getWeeklyReport, sendEmailDigest };