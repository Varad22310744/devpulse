const cron = require('node-cron');
const User = require('../models/User');
const Stats = require('../models/Stats');
const { fetchAllStats } = require('../services/githubService');

const startDailyFetch = () => {

    // Runs every day at 11:59 PM
    // Format: second minute hour day month weekday
    cron.schedule('59 23 * * *', async () => {
        console.log('Daily fetch started:', new Date().toDateString());

        try {
            // Get all users from database
            const users = await User.find({});

            if (users.length === 0) {
                console.log('No users found. Skipping.');
                return;
            }

            // Fetch stats for each user one by one
            for (const user of users) {
                try {
                    console.log(`Fetching stats for: ${user.username}`);

                    // Call GitHub API for this user
                    const stats = await fetchAllStats(
                        user.accessToken,
                        user.username
                    );

                    if (!stats) {
                        console.log(`Failed to fetch for ${user.username}. Skipping.`);
                        continue;  // skip this user, go to next
                    }

                    // Calculate total commits all time
                    const previousStats = await Stats.find({ userId: user._id });
                    const previousTotal = previousStats.reduce(
                        (sum, day) => sum + day.commits, 0
                    );

                    // Save today's stats — upsert prevents duplicates
                    await Stats.findOneAndUpdate(
                        {
                            userId: user._id,
                            date: {
                                $gte: new Date().setHours(0, 0, 0, 0),
                                $lte: new Date().setHours(23, 59, 59, 999)
                            }
                        },
                        {
                            ...stats,
                            userId: user._id,
                            totalCommitsAllTime: previousTotal + stats.commits
                        },
                        { upsert: true, returnDocument: 'after' }
                    );

                    console.log(`Stats saved for: ${user.username}`);

                } catch (userError) {
                    // One user failing should not stop others
                    console.error(
                        `Error for ${user.username}:`,
                        userError.message
                    );
                    continue;
                }
            }

            console.log('Daily fetch completed:', new Date().toDateString());

        } catch (error) {
            console.error('Cron job failed:', error.message);
        }
    });

    console.log('Daily fetch cron job scheduled — runs at 11:59 PM');
};

module.exports = { startDailyFetch };