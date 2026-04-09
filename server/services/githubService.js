const { Octokit } = require('octokit');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const githubService = {
  getProfile: async (username) => {
    const { data } = await octokit.rest.users.getByUsername({ username });
    return data;
  },

  getRepos: async (username) => {
    const { data } = await octokit.rest.repos.listForUser({
      username,
      per_page: 100,
      sort: 'updated',
      type: 'all'
    });
    return data;
  },

  getEvents: async (username) => {
    try {
      // Fetch up to 3 pages of events (300 events)
      const pages = await Promise.all([1, 2, 3].map(page =>
        octokit.rest.activity.listPublicEventsForUser({ username, per_page: 100, page })
          .then(r => r.data)
          .catch(() => [])
      ));
      return pages.flat();
    } catch {
      return [];
    }
  },

  getCommitCount: async (username) => {
    try {
      // Use search API to count commits in last 90 days
      const since = new Date();
      since.setDate(since.getDate() - 90);
      const sinceStr = since.toISOString().split('T')[0];

      const { data } = await octokit.rest.search.commits({
        q: `author:${username} author-date:>${sinceStr}`,
        per_page: 1
      });
      return data.total_count || 0;
    } catch {
      return 0;
    }
  }
};

module.exports = githubService;
