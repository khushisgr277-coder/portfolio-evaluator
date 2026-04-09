# Project Overview

## 1. Introduction
The **Developer Portfolio Evaluator** is an internal tool designed to quickly analyze and score developer profiles on GitHub. By aggregating public repository and commit data, it benchmarks a candidate's activity, diversity of skills, and open-source contribution patterns.

## 2. Background & Problem Statement
During standard recruitment and code review cycles, we found ourselves manually digging through candidate repositories to assess the quality of their work. This was tedious and often subjective. We needed a systematic way to look at a developer's GitHub footprint and derive a relatively objective "scorecard."

## 3. Goals and Objectives
*   **Time Savings**: Reduce the time spent evaluating initial candidate profiles from 10-15 minutes down to seconds.
*   **Consistency**: Apply the same scoring algorithm across all candidates to ensure fairness.
*   **Insightful Visualization**: Provide easily understandable charts (Radar, Rings) that highlight a developer's strengths (e.g., highly active vs. huge community impact).

## 4. Target Audience
*   **Hiring Managers and Recruiters**: To quickly screen incoming applicants.
*   **Engineering Leads**: To get a high-level view of a developer's expertise and community involvement.
*   **Developers**: To self-evaluate and see how their open-source profile holds up.

## 5. Scope
Currently, the tool supports single-profile analysis via GitHub usernames or standard profile URLs. It is limited to public data available through the GitHub REST API (v3). Private repositories are not analyzed unless an authenticated token with specific scopes is provided (by default, we do not require user authentication). In the future, we may extend this to support GitLab or Bitbucket.
