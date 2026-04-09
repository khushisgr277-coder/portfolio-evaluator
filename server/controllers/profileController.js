const githubService = require('../services/githubService');
const { calculateScore } = require('../services/scoringService');
const Report = require('../models/Report');
const mongoose = require('mongoose');

exports.getProfileReport = async (req, res) => {
  try {
    const { username } = req.params;
    const key = username.toLowerCase();

    // --- Cache check (only if DB is connected) ---
    if (mongoose.connection.readyState === 1) {
      try {
        const cached = await Report.findOne({ username: key });
        if (cached) return res.json(cached);
      } catch (_) {}
    }

    // --- Fetch from GitHub in parallel ---
    const [profile, repos, events, commitCount] = await Promise.all([
      githubService.getProfile(username),
      githubService.getRepos(username),
      githubService.getEvents(username),
      githubService.getCommitCount(username)
    ]);

    // --- Score ---
    const { scores, stats } = calculateScore(profile, repos, events, commitCount);

    const profileData = {
      name:         profile.name,
      avatar_url:   profile.avatar_url,
      bio:          profile.bio,
      location:     profile.location,
      blog:         profile.blog,
      html_url:     profile.html_url,
      followers:    profile.followers,
      public_repos: profile.public_repos
    };

    const doc = new Report({ username: key, profile: profileData, stats, scores });

    // --- Save to DB if connected (fire-and-forget) ---
    if (mongoose.connection.readyState === 1) {
      doc.save().catch(() => {});
    }

    return res.json(doc);

  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ message: `GitHub user "${req.params.username}" not found.` });
    }
    if (err.status === 403 || err.status === 429) {
      return res.status(429).json({ message: 'GitHub API rate limit hit. Add a GITHUB_TOKEN in server/.env and restart.' });
    }
    console.error('[profileController]', err.message);
    return res.status(500).json({ message: 'Server error. Try again in a moment.' });
  }
};
