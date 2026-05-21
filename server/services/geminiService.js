const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateWeeklyReport = async (weeklyStats, username) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Format stats into readable text for Gemini
        const statsText = weeklyStats.map(day => `
      Date: ${new Date(day.date).toDateString()}
      Commits: ${day.commits}
      PRs Opened: ${day.prsOpened}
      PRs Merged: ${day.prsMerged}
      Active Repos: ${day.reposActive.join(', ') || 'none'}
      Languages: ${JSON.stringify(Object.fromEntries(day.languages))}
    `).join('\n---\n');

        // Prompt sent to Gemini
        const prompt = `
      You are a developer productivity coach analyzing GitHub activity.
      
      Developer username: ${username}
      Here is their GitHub activity for the past 7 days:
      
      ${statsText}
      
      Generate a concise weekly productivity report that includes:
      1. Overall summary of the week (2-3 sentences)
      2. Best performing day and why
      3. Most used programming language
      4. Streak and consistency observations
      5. One specific actionable tip to improve next week
      
      Keep the tone friendly, motivating and professional.
      Keep total response under 200 words.
    `;

        let lastError;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            } catch (err) {
                lastError = err;
                if (err.message?.includes('503') && attempt < 3) {
                    console.log(`Gemini attempt ${attempt} failed. Retrying in 10s...`);
                    await new Promise(r => setTimeout(r, 10000)); // wait 10 seconds
                } else {
                    break;
                }
            }
        }
        throw lastError;

    } catch (error) {
        console.error('Gemini error:', error.message);
        return 'Could not generate report at this time. Please try again later.';
    }
};

module.exports = { generateWeeklyReport };