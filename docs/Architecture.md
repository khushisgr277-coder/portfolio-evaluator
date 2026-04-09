# Architecture Document

## 1. High-Level Architecture
The application follows a standard modern MERN stack architecture (MongoDB, Express, React, Node.js), adapted to use Vite for the frontend tooling. It consists of two main pieces: a client-side Single Page Application (SPA) and a RESTful backend service.

## 2. Component Design

### 2.1. Frontend (React / Vite)
*   **Routing**: React Router manages navigation between `/` (Home/Search) and `/report/:username` (Report view).
*   **State Management**: Context/Hooks handle localized state. Given the app's simplicity, Redux was deemed overkill.
*   **Visualizations**: `react-chartjs-2` wraps Chart.js to render the radar graphs.
*   **Styling**: Vanilla CSS using modularized stylesheets. The design language is heavily inspired by glassmorphism, utilizing CSS backdrops and variables for a consistent theme.

### 2.2. Backend (Node.js / Express)
*   **Controllers**: Handle incoming HTTP requests, validate input, and structure responses.
*   **Services**: The core business logic lives here.
    *   `githubService.js`: Wraps Octokit calls to fetch user data, repos, and calculate commit frequency.
    *   `scoringService.js`: Takes the raw GitHub data and applies our weighted algorithms to output the final scorecard.
*   **Caching Layer (MongoDB)**: We use a Mongoose model (`Report`) equipped with a TTL (Time-To-Live) index set to 24 hours. When a profile is requested, we first check Mongo. If absent or expired, we hit the GitHub API, generate a new report, and store it.

## 3. Data Flow
1.  **User Input**: User enters `https://github.com/torvalds` into the frontend search bar.
2.  **Parsing**: Frontend parses the string to extract `torvalds`.
3.  **API Call**: Frontend makes a `GET /api/profile/torvalds` request to the backend.
4.  **Cache Check**: Backend queries MongoDB for `torvalds`.
    *   *Cache Hit*: Return stored JSON.
    *   *Cache Miss*:
        1. Backend invokes `Octokit` to call GitHub API.
        2. Data is passed to `scoringService.js`.
        3. A completed JSON scorecard is generated.
        4. The scorecard is saved to MongoDB.
5.  **Response**: Backend sends 200 OK with the scorecard JSON to the frontend.
6.  **Render**: React updates state and draws the charts.

## 4. API External Dependencies
*   `api.github.com`: Core data source. Requires a Personal Access Token (`GITHUB_TOKEN`) in the `.env` to avoid restrictive unauthenticated rate limits.
