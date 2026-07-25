import { getInsightsLayer2Client } from "../clients/insightsLayer2";
import { getGitHubAppClient } from "../clients/githubApp";
import { getIEEEXploreClient } from "../clients/ieeeXplore";

async function runMockVerification() {
  console.log("=== Phase 1 Client Mock Verification ===");

  const insightsClient = getInsightsLayer2Client();
  const githubClient = getGitHubAppClient();
  const ieeeClient = getIEEEXploreClient();

  console.log("\n1. Testing Insights Layer 2 Client...");
  const signal = await insightsClient.getRealTimeSignal("Satellite AI Compression");
  console.log("Signal Result:", JSON.stringify(signal, null, 2));

  const searchResults = await insightsClient.deepSearch("Satellite AI");
  console.log(`Deep Search returned ${searchResults.length} results.`);

  const clusters = await insightsClient.clusterKnowledge(searchResults);
  console.log(`Cluster Knowledge created ${clusters.length} knowledge clusters.`);

  const plan = await insightsClient.generateProjectPlan("Satellite AI Compression", clusters);
  console.log("Plan Architecture:", plan.architecture.frontend);

  console.log("\n2. Testing IEEE Xplore Client...");
  const papers = await ieeeClient.searchPapers("Satellite Edge ML", 2);
  console.log(`IEEE Xplore returned ${papers.length} papers. First DOI: ${papers[0]?.doi}`);

  console.log("\n3. Testing GitHub App Client...");
  const repo = await githubClient.scaffoldRepo("plan-12345", plan.techStack);
  console.log("Scaffolded Repo URL:", repo.repoUrl);

  const pr = await githubClient.openStarterPR(repo.repoUrl, plan);
  console.log("Starter PR URL:", pr.prUrl);

  const issues = await githubClient.createMilestoneIssues(repo.repoUrl, plan.milestones);
  console.log(`Created ${issues.length} milestone issues.`);

  console.log("\n✅ All 3 client interfaces and mocks verified successfully!");
}

runMockVerification().catch((err) => {
  console.error("❌ Mock verification failed:", err);
  process.exit(1);
});
