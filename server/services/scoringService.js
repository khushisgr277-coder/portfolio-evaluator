/**
 * Scoring Service
 * Max possible: Activity(25) + Quality(20) + Diversity(20) + Community(20) + Hiring(15) = 100
 */

const calculateScore = (profile, repos, events, commitCount = 0) => {

  // ── 1. ACTIVITY  (max 25) ─────────────────────────────────────────────────
  // commitCount = real 90-day commits from search API
  // events is array of public GitHub events (for streak detection)
  let activityScore = 0;

  // Commits in last 90 days → up to 20 pts  (100+ commits = full marks)
  activityScore += Math.min(20, (commitCount / 100) * 20);

  // Streak: pushed within last 7 days → +5
  const pushEvents = events.filter(e => e.type === 'PushEvent');
  const recentPush = pushEvents.some(e =>
    (Date.now() - new Date(e.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000
  );
  if (recentPush) activityScore += 5;

  activityScore = Math.min(25, activityScore);

  // ── 2. CODE QUALITY  (max 20) ─────────────────────────────────────────────
  let qualityScore = 0;
  const nonForks = repos.filter(r => !r.fork);

  // Ratio of repos with topics (max 5)
  const withTopics = repos.filter(r => r.topics?.length > 0).length;
  qualityScore += Math.min(5, (withTopics / Math.max(1, repos.length)) * 10);

  // Ratio of repos with a license (max 5)
  const withLicense = repos.filter(r => r.license).length;
  qualityScore += Math.min(5, (withLicense / Math.max(1, repos.length)) * 10);

  // Has description on majority of non-fork repos (max 5)
  const withDesc = nonForks.filter(r => r.description).length;
  qualityScore += Math.min(5, (withDesc / Math.max(1, nonForks.length)) * 5);

  // Original repos ratio bonus (max 5)
  const originalRatio = nonForks.length / Math.max(1, repos.length);
  qualityScore += Math.min(5, originalRatio * 5);

  qualityScore = Math.min(20, qualityScore);

  // ── 3. DIVERSITY  (max 20) ────────────────────────────────────────────────
  let diversityScore = 0;
  const languageBreakdown = {};
  repos.forEach(r => {
    if (r.language) languageBreakdown[r.language] = (languageBreakdown[r.language] || 0) + 1;
  });

  const uniqueLangs = Object.keys(languageBreakdown).length;
  // 5+ languages = 10 pts
  diversityScore += Math.min(10, uniqueLangs * 2);

  // Original (non-fork) repos contribute breadth
  const originalCount = repos.filter(r => !r.fork).length;
  diversityScore += Math.min(10, (originalCount / Math.max(1, repos.length)) * 10);

  diversityScore = Math.min(20, diversityScore);

  // ── 4. COMMUNITY  (max 20) ────────────────────────────────────────────────
  let communityScore = 0;

  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);

  // Log scale: log10(stars+forks+1) * 5, capped at 15
  communityScore += Math.min(15, Math.log10(totalStars + totalForks + 1) * 5);

  // Follower bonus: up to 5 pts (50+ followers = full)
  communityScore += Math.min(5, (profile.followers / 50) * 5);

  communityScore = Math.min(20, communityScore);

  // ── 5. HIRING READY  (max 15) ─────────────────────────────────────────────
  let hiringScore = 0;
  if (profile.bio)   hiringScore += 5;
  if (profile.blog)  hiringScore += 5;
  if (profile.email || profile.twitter_username) hiringScore += 5;
  hiringScore = Math.min(15, hiringScore);

  // ── TOTAL ─────────────────────────────────────────────────────────────────
  const total = activityScore + qualityScore + diversityScore + communityScore + hiringScore;

  return {
    scores: {
      activity:  +activityScore.toFixed(2),
      quality:   +qualityScore.toFixed(2),
      diversity: +diversityScore.toFixed(2),
      community: +communityScore.toFixed(2),
      hiring:    +hiringScore.toFixed(2),
      total:     +total.toFixed(2)
    },
    stats: {
      languages:   languageBreakdown,
      totalStars,
      totalForks,
      commitCount
    }
  };
};

module.exports = { calculateScore };
