import { getGitHubAppClient } from "../clients/githubApp";
import { getDbPool, memoryDb, isDbConnected } from "../db/db";
import { randomUUID } from "crypto";

export async function scaffoldGitHubRepo(planId: string) {
  const pool = getDbPool();
  let planObj: any = null;

  if (isDbConnected() && pool) {
    const res = await pool.query("SELECT * FROM project_plans WHERE id = $1", [planId]);
    if (res.rows.length > 0) {
      planObj = res.rows[0];
      planObj.techStack = typeof planObj.tech_stack === "string" ? JSON.parse(planObj.tech_stack) : planObj.tech_stack;
      planObj.milestones = typeof planObj.milestones === "string" ? JSON.parse(planObj.milestones) : planObj.milestones;
    }
  } else {
    planObj = memoryDb.project_plans.find((p) => p.id === planId);
  }

  if (!planObj) {
    planObj = {
      id: planId,
      ideaId: "mock-idea",
      techStack: [{ layer: "Frontend", choice: "Next.js" }],
      milestones: [{ title: "Initial Setup", dueInDays: 3 }],
    };
  }

  const githubClient = getGitHubAppClient();

  // 1. Scaffold Repo
  const { repoUrl } = await githubClient.scaffoldRepo(planId, planObj.techStack);
  // 2. Open Starter PR
  const { prUrl } = await githubClient.openStarterPR(repoUrl, planObj);
  // 3. Create Milestone Issues
  const issueUrls = await githubClient.createMilestoneIssues(repoUrl, planObj.milestones);

  // 4. Post research context comments to first issue
  if (issueUrls[0]) {
    await githubClient.commentWithResearch(issueUrls[0].url, [
      { doi: "10.1109/TGRS.2022.3190821", title: "IEEE Satellite Neural Compression" },
    ]);
  }

  const linkId = randomUUID();
  const installedAt = new Date().toISOString();

  // Persist github_links and update milestones
  if (isDbConnected() && pool) {
    await pool.query(
      `INSERT INTO github_links (id, plan_id, repo_url, starter_pr_url, installed_at, last_synced_at)
       VALUES ($1, $2, $3, $4, $5, $5)`,
      [linkId, planId, repoUrl, prUrl, installedAt]
    );

    const msRes = await pool.query("SELECT id FROM milestones WHERE plan_id = $1", [planId]);
    for (let i = 0; i < msRes.rows.length; i++) {
      if (issueUrls[i]) {
        await pool.query("UPDATE milestones SET github_issue_url = $1 WHERE id = $2", [
          issueUrls[i].url,
          msRes.rows[i].id,
        ]);
      }
    }

    if (planObj.ideaId || planObj.idea_id) {
      await pool.query("UPDATE ideas SET status = 'scaffolded' WHERE id = $1", [planObj.ideaId || planObj.idea_id]);
    }
  } else {
    memoryDb.github_links.push({
      id: linkId,
      planId,
      repoUrl,
      starterPrUrl: prUrl,
      installedAt,
      lastSyncedAt: installedAt,
      __mocked: true,
    });

    const localMs = memoryDb.milestones.filter((m) => m.planId === planId);
    localMs.forEach((m, idx) => {
      if (issueUrls[idx]) m.githubIssueUrl = issueUrls[idx].url;
    });

    const foundIdea = memoryDb.ideas.find((i) => i.id === (planObj.ideaId || planObj.idea_id));
    if (foundIdea) foundIdea.status = "scaffolded";
  }

  return {
    linkId,
    planId,
    repoUrl,
    starterPrUrl: prUrl,
    issuesCreated: issueUrls.length,
    __mocked: true,
  };
}
