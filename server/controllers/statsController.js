const Stats = require('../models/Stats');
const User = require('../models/User');
const { fetchAllStats } = require('../services/githubService');

// Helper — calculate streak from stats array
const calculateStreak = (statsArray) => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Go backwards from today
    for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);

        const dayStats = statsArray.find(s => {
            const statDate = new Date(s.date);
            statDate.setHours(0, 0, 0, 0);
            return statDate.getTime() === checkDate.getTime();
        });

        if (dayStats && dayStats.commits > 0) {
            streak++;
        } else {
            break;  // streak broken — stop counting
        }
    }
    return streak;
};

// Controller 1 — Get full dashboard data
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch last 30 days stats from MongoDB
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const stats = await Stats.find({
            userId,
            date: { $gte: thirtyDaysAgo }
        }).sort({ date: 1 });

        // Calculate totals
        const totalCommits = stats.reduce((sum, day) => sum + day.commits, 0);
        const totalPRs = stats.reduce((sum, day) => sum + day.prsOpened, 0);
        const activeDays = stats.filter(day => day.commits > 0).length;
        const streak = calculateStreak(stats);

        // Best day
        const bestDay = stats.reduce((best, day) =>
            day.commits > (best?.commits || 0) ? day : best, null
        );

        res.json({
            totalCommits,
            totalPRs,
            activeDays,
            streak,
            bestDay: bestDay ? {
                date: bestDay.date,
                commits: bestDay.commits
            } : null,
            recentStats: stats
        });

    } catch (error) {
        console.error('getDashboard error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller 2 — Get commit history for line chart
const getCommitHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const stats = await Stats.find({
            userId,
            date: { $gte: thirtyDaysAgo }
        }).sort({ date: 1 });

        // Format for Chart.js line chart
        const commitHistory = stats.map(day => ({
            date: new Date(day.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }),
            commits: day.commits
        }));

        res.json(commitHistory);

    } catch (error) {
        console.error('getCommitHistory error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller 3 — Get language breakdown for pie chart
const getLanguages = async (req, res) => {
    try {
        const userId = req.user.id;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const stats = await Stats.find({
            userId,
            date: { $gte: thirtyDaysAgo }
        });

        // Merge languages across all days
        const merged = {};
        for (const day of stats) {
            for (const [lang, percent] of day.languages) {
                merged[lang] = (merged[lang] || 0) + percent;
            }
        }

        // Recalculate percentages
        const total = Object.values(merged).reduce((sum, v) => sum + v, 0);
        const languages = {};
        for (const [lang, value] of Object.entries(merged)) {
            languages[lang] = Math.round((value / total) * 100);
        }

        res.json(languages);

    } catch (error) {
        console.error('getLanguages error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller 4 — Fetch fresh GitHub data and save to MongoDB
const fetchAndSave = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Fetch from GitHub API
        const stats = await fetchAllStats(user.accessToken, user.username);

        if (!stats) {
            return res.status(500).json({ message: 'Failed to fetch GitHub data' });
        }

        // Calculate total commits all time
        const previousStats = await Stats.find({ userId: user.id });
        const previousTotal = previousStats.reduce(
            (sum, day) => sum + day.commits, 0
        );

        // Save or update today's stats
        await Stats.findOneAndUpdate(
            {
                userId: user.id,
                date: {
                    $gte: new Date().setHours(0, 0, 0, 0),
                    $lte: new Date().setHours(23, 59, 59, 999)
                }
            },
            {
                ...stats,
                userId: user.id,
                totalCommitsAllTime: previousTotal + stats.commits
            },
            { upsert: true, returnDocument: 'after' }  // create if not exists
        );

        res.json({ message: 'Stats fetched and saved successfully' });

    } catch (error) {
        console.error('fetchAndSave error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getDashboard,
    getCommitHistory,
    getLanguages,
    fetchAndSave
};