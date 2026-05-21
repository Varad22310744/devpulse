const axios = require('axios');

// Base GitHub API URL
const GITHUB_API = 'https://api.github.com';

// Helper — common headers for every GitHub API call
const getHeaders = (accessToken) => ({
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github+json'
});

// Function 1 — Get all repos of user
const getUserRepos = async (accessToken) => {
    try {
        const response = await axios.get(`${GITHUB_API}/user/repos`, {
            headers: getHeaders(accessToken),
            params: {
                per_page: 100,        // fetch max 100 repos
                sort: 'updated',      // most recently updated first
                affiliation: 'owner'  // only repos they own
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching repos:', error.message);
        return [];
    }
};

// Function 2 — Get commits for a specific repo today
const getCommitsForRepo = async (accessToken, username, repoName, date) => {
    try {
        const since = new Date();
        since.setDate(since.getDate() - 7); // last 7 days instead of today only

        const response = await axios.get(
            `${GITHUB_API}/repos/${username}/${repoName}/commits`,
            {
                headers: getHeaders(accessToken),
                params: {
                    author: username,
                    since: since.toISOString(),
                    per_page: 100
                }
            }
        );
        return response.data.length;  // return count of commits
    } catch (error) {
        return 0;  // repo may be empty or no commits today
    }
};

// Function 3 — Get languages used in a repo
const getRepoLanguages = async (accessToken, username, repoName) => {
    try {
        const response = await axios.get(
            `${GITHUB_API}/repos/${username}/${repoName}/languages`,
            { headers: getHeaders(accessToken) }
        );
        return response.data;  // { JavaScript: 12400, CSS: 3200 }
    } catch (error) {
        return {};
    }
};

// Function 4 — Get pull requests for a specific repo
const getPullRequests = async (accessToken, username, repoName) => {
    try {
        const response = await axios.get(
            `${GITHUB_API}/repos/${username}/${repoName}/pulls`,
            {
                headers: getHeaders(accessToken),
                params: {
                    state: 'all',      // open + closed + merged
                    per_page: 100
                }
            }
        );

        const today = new Date().toDateString();

        // Count only today's PRs
        const prsOpened = response.data.filter(pr =>
            new Date(pr.created_at).toDateString() === today
        ).length;

        const prsMerged = response.data.filter(pr =>
            pr.merged_at &&
            new Date(pr.merged_at).toDateString() === today
        ).length;

        return { prsOpened, prsMerged };
    } catch (error) {
        return { prsOpened: 0, prsMerged: 0 };
    }
};

// Function 5 — Master function
// Calls all above functions, combines everything into one object
const fetchAllStats = async (accessToken, username) => {
    try {
        const today = new Date();
        const repos = await getUserRepos(accessToken);

        let totalCommits = 0;
        let totalPrsOpened = 0;
        let totalPrsMerged = 0;
        let activeRepos = [];
        let allLanguages = {};

        // Loop through each repo and collect stats
        for (const repo of repos) {
            const commits = await getCommitsForRepo(
                accessToken, username, repo.name, today
            );

            const { prsOpened, prsMerged } = await getPullRequests(
                accessToken, username, repo.name
            );

            const languages = await getRepoLanguages(
                accessToken, username, repo.name
            );

            // If repo had activity today — add to active list
            if (commits > 0) {
                activeRepos.push(repo.name);
                totalCommits += commits;
            }

            totalPrsOpened += prsOpened;
            totalPrsMerged += prsMerged;

            // Merge languages across all repos
            for (const [lang, bytes] of Object.entries(languages)) {
                allLanguages[lang] = (allLanguages[lang] || 0) + bytes;
            }
        }

        // Convert language bytes to percentages
        const totalBytes = Object.values(allLanguages)
            .reduce((sum, val) => sum + val, 0);

        const languagePercentages = {};
        for (const [lang, bytes] of Object.entries(allLanguages)) {
            languagePercentages[lang] = Math.round((bytes / totalBytes) * 100);
        }

        return {
            date: today,
            commits: totalCommits,
            prsOpened: totalPrsOpened,
            prsMerged: totalPrsMerged,
            reposActive: activeRepos,
            languages: languagePercentages
        };

    } catch (error) {
        console.error('Error in fetchAllStats:', error.message);
        return null;
    }
};

module.exports = {
    fetchAllStats,
    getUserRepos,
    getCommitsForRepo,
    getRepoLanguages
};