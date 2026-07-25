import { MilestoneItem } from "@ideaforge/shared";

export interface GitHubAppClient {
  scaffoldRepo(planId: string, techStack: object): Promise<{ repoUrl: string }>;
  openStarterPR(repoUrl: string, plan: object): Promise<{ prUrl: string }>;
  createMilestoneIssues(repoUrl: string, milestones: MilestoneItem[]): Promise<{ url: string }[]>;
  commentWithResearch(issueUrl: string, sources: object[]): Promise<void>;
}

export function getGitHubAppClient(): GitHubAppClient {
  if (process.env.GITHUB_APP_ID && process.env.GITHUB_APP_PRIVATE_KEY) {
    // Octokit GitHub App implementation
    // return new RealGitHubAppClient();
  }
  const { mockGitHubAppClient } = require("../mocks/githubApp.mock");
  return mockGitHubAppClient;
}
