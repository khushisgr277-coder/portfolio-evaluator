# Feature Breakdown

## 1. Smart URL Parsing
Instead of forcing users to meticulously type a username, the search bar accepts full URLs. Behind the scenes, the frontend strips out `https://github.com/` and handles trailing slashes or subpaths to cleanly isolate the exact username.

## 2. Dynamic Radar Visualization
We utilize a radar chart to give an immediate, visual impression of a developer's type. For example:
- A spike in **Activity** and **Community** indicates an active open-source maintainer.
- A spike in **Diversity** suggests a polyglot developer who experiments across multiple languages and frameworks.

## 3. Language Breakdown Badges
The backend parses the developer's primary languages across their top repositories and calculates a percentage usage. The UI then generates dynamic, color-coded badges to display this ratio.

## 4. Intelligent Caching
Evaluating a high-profile developer (like `sindresorhus` with thousands of repos/commits) can trigger dozens of GitHub API requests in seconds. Our MongoDB caching layer intercepts these requests. Once a report is built, it's served instantly from the database for the next 24 hours.

## 5. Shareable Links
Reports exist on their own dedicated route (`/report/username`). This allows recruiters to drop a direct link into Slack, email, or an applicant tracking system (ATS) without requiring colleagues to repeat the search.

## 6. Granular Scoring Model
Scores aren't just arbitrary numbers. The `scoringService.js` breaks down points based on tangible metrics:
- Does the profile have a bio and a linked website? (+Hiring Ready)
- Are there recent commit streaks? (+Activity)
- How many distinct repository topics are labeled? (+Code Quality)
- Does the dev write original code or mostly fork others? (+Diversity)
