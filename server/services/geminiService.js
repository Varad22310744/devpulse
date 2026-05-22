const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateWeeklyReport = async (weeklyStats, username) => {
    try {
        const statsText = weeklyStats.map(day => `
      Date: ${new Date(day.date).toDateString()}
      Commits: ${day.commits}
      PRs Opened: ${day.prsOpened}
      PRs Merged: ${day.prsMerged}
      Active Repos: ${day.reposActive?.join(', ') || 'none'}
    `).join('\n---\n');

        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'user',
                    content: `
            You are a developer productivity coach analyzing GitHub activity.
            
            Developer username: ${username}
            Here is their GitHub activity for the past 7 days:
            
            ${statsText}
            
            Generate a concise weekly productivity report that includes:
            1. Overall summary of the week (2-3 sentences)
            2. Best performing day and why
            3. Streak and consistency observations
            4. One specific actionable tip to improve next week
            
            Keep the tone friendly, motivating and professional.
            Keep total response under 200 words.
          `
                }
            ],
            max_tokens: 500
        });

        return completion.choices[0]?.message?.content || 'Could not generate report.';

    } catch (error) {
        console.error('Groq error:', error.message);
        return 'Could not generate report at this time. Please try again later.';
    }
};

module.exports = { generateWeeklyReport };