# Functional and Non-Functional Requirements

## 1. Functional Requirements
*   **Profile Lookup**: The system must allow users to input a GitHub username or paste a profile/repository URL. It should automatically extract the relevant username.
*   **Data Aggregation**: The system must fetch user details, repositories (up to 100 recent), languages, and commit history from GitHub.
*   **Scoring Engine**: The system must calculate a score (0 to 100) based on predefined weighted categories:
    *   Activity (Commits & streaks)
    *   Code Quality (Descriptions, topics, licenses)
    *   Diversity (Languages used, original repos vs. forks)
    *   Community (Stars, forks, followers)
    *   Hiring Readiness (Completeness of bio, website, etc.)
*   **Caching**: To prevent API rate limiting, the backend must cache generated reports for 24 hours. Subsequent requests for the same username within this window should return the cached report.
*   **Visualization**: The frontend must render a Radar chart mapping the five category scores, along with an overall aggregate score ring.

## 2. Non-Functional Requirements
*   **Performance**: The frontend report should render within 3 seconds of a successful API response.
*   **Reliability**: The backend must gracefully handle GitHub API rate limits (HTTP 403) and user not found (HTTP 404) scenarios, passing clean error messages to the frontend.
*   **Maintainability**: The codebase must be split into clearly defined modules (routes, controllers, services) to allow easy updates to the scoring logic later on.
*   **Usability**: The design must be clean, minimal, and fully responsive across mobile and desktop devices.
*   **Security**: API tokens must be strictly maintained in server-side environment variables and never exposed to the client.

## 3. Assumptions and Constraints
*   The system heavily relies on the GitHub REST API. Any downtime on GitHub's end will affect our service.
*   Score metrics only consider publicly available data.
*   We're using a free-tier MongoDB cluster, which requires keeping stored documents relatively small. Using a simple TTL setup keeps the database clean.
