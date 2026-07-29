import { MilestoneItem } from "@buildwise/shared";
import { GitHubAppClient } from "../clients/githubApp";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockGitHubAppClient implements GitHubAppClient {
  async scaffoldRepo(planId: string, techStack: object): Promise<{ repoUrl: string }> {
    await sleep(1000);
    const slug = planId.slice(0, 8);
    return {
      repoUrl: `https://github.com/buildwise-org/student-research-${slug}`,
    };
  }

  async openStarterPR(repoUrl: string, plan: object): Promise<{ prUrl: string }> {
    await sleep(800);
    return {
      prUrl: `${repoUrl}/pull/1`,
    };
  }

  async createMilestoneIssues(repoUrl: string, milestones: MilestoneItem[]): Promise<{ url: string }[]> {
    await sleep(900);
    return milestones.map((m, idx) => ({
      url: `${repoUrl}/issues/${idx + 1}`,
    }));
  }

  async commentWithResearch(issueUrl: string, sources: object[]): Promise<void> {
    await sleep(400);
    console.log(`[Mock GitHub App] Posted research context comment to ${issueUrl}`);
  }
}

export const mockGitHubAppClient = new MockGitHubAppClient();
