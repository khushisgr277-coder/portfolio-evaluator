# Developer Portfolio Evaluator

A web tool that analyzes any GitHub profile and generates a detailed developer scorecard — covering activity, code quality, project diversity, community impact, and hiring readiness.

Built this because I got tired of manually checking GitHub profiles during code reviews and wanted a quick way to benchmark developers fairly.

---

## Features

- Search any GitHub username or paste any GitHub link
- Generates a scored report across 5 weighted categories
- Animated radar chart and circular score ring visualizations
- Language breakdown with color-coded badges
- 24-hour report caching (avoids burning API rate limits)
- Shareable report links (`/report/:username`)
- Smart URL parser — accepts usernames, profile URLs, or repo links

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Chart.js + react-chartjs-2
- Vanilla CSS with glassmorphism design

**Backend**
- Node.js + Express
- Octokit (GitHub REST API v3)
- MongoDB + Mongoose (with TTL-based cache)
- dotenv

## Project Structure

```
portfolio-evaluator/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/           # Home.jsx, Report.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Error handler
│   ├── models/Report.js     # Mongoose schema with TTL
│   ├── routes/              # API routes
│   ├── services/            # GitHub API + Scoring logic
│   └── index.js             # Entry point
│
├── docs/                    # Project documentation
├── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)
- A GitHub personal access token (_optional_ but recommended to avoid rate limits)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/portfolio-evaluator.git
cd portfolio-evaluator
```

**Setup the backend:**
```bash
cd server
npm install
cp .env.example .env
# Fill in your values in .env
node index.js
```

**Setup the frontend (new terminal):**
```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

See `.env.example` in the `server/` directory for the required variables.

## Scoring Breakdown

| Category       | Weight | What it measures                              |
|----------------|--------|-----------------------------------------------|
| Activity       | 25 pts | Commits (90 days), recent push streak         |
| Code Quality   | 20 pts | Repo topics, licenses, descriptions           |
| Diversity      | 20 pts | Unique languages, original vs forked repos    |
| Community      | 20 pts | Stars, forks (log scale), follower count      |
| Hiring Ready   | 15 pts | Bio, website, contact info                    |

## Screenshots

> _(Add your screenshots to `docs/screenshots/` and reference them here)_

## License

MIT — see [LICENSE](./LICENSE) for details.

## Contributing

Pull requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
