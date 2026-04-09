# Developer Setup Guide

Are you looking to run or contribute to the Portfolio Evaluator locally? Follow these steps to get everything up and running.

## 1. Prerequisites
Before you start, ensure you have the following installed on your machine:
*   **Node.js**: v18.x or higher (we recommend using `nvm`).
*   **MongoDB**: A local instance running on port 27017, or a free cloud cluster via MongoDB Atlas.
*   **Git**: For version control.

## 2. Environment Variables
You'll need a GitHub Personal Access Token (Classic) to avoid hitting the standard API rate limit (60 requests/hour). 

1. Go to your GitHub Settings -> Developer settings -> Personal access tokens.
2. Generate a new token. You don't need any special scopes for public data, just checking the bottom boxes or generating a classic token with read-only access is fine.

Navigate to the `server/` directory and duplicate the `.env.example` file:
```bash
cd server
cp .env.example .env
```
Open `.env` and paste your GitHub token into the `GITHUB_TOKEN` variable. Update the `MONGODB_URI` if you are using an Atlas cluster string.

## 3. Installation
Open your terminal and clone the repository. Then, install dependencies for both the frontend and backend.

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

## 4. Running the App Locally
You'll need two terminal windows open.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*Note: Make sure your MongoDB service is actually running, otherwise the server will crash on startup.*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173`. Any changes you make to the React code will hot-reload automatically via Vite.

## 5. Troubleshooting
*   **Getting 403 Forbidden Errors**: This usually means your GitHub token is invalid or you've actually managed to hit the 5,000 requests/hour authenticated limit. Double-check your `.env` file.
*   **Database connection fails**: Ensure MongoDB is running (`mongod` command on Mac/Linux or check Windows Services). If using Atlas, ensure your IP address is whitelisted in the network settings.
