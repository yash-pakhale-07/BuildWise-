export const mockGitHubByIdea: Record<string, any> = {
  "idea-food-waste-2026": {
    repoUrl: "https://github.com/buildwise-org/student-research-food-waste",
    starterPrUrl: "https://github.com/buildwise-org/student-research-food-waste/pull/1",
    installedAt: new Date().toISOString(),
    issues: [
      {
        id: "issue-fw-1",
        number: 1,
        title: "Scaffold Core API Monorepo & Postgres Schema",
        url: "https://github.com/buildwise-org/student-research-food-waste/issues/1",
        status: "done",
        researchComment: "Posted reference: IEEE IoT Journal (DOI: 10.1109/JIOT.2023.3298101)",
      },
      {
        id: "issue-fw-2",
        number: 2,
        title: "Train LSTM Hostel Mess Attendance Forecasting Model",
        url: "https://github.com/buildwise-org/student-research-food-waste/issues/2",
        status: "in_progress",
        researchComment: "Posted reference: IEEE Trans. Comput. Social Syst. (DOI: 10.1109/TCSS.2023.3241908)",
      },
      {
        id: "issue-fw-3",
        number: 3,
        title: "Deploy ESP32-CAM Smart Bin Load Cell Telemetry Firmware",
        url: "https://github.com/buildwise-org/student-research-food-waste/issues/3",
        status: "pending",
      },
      {
        id: "issue-fw-4",
        number: 4,
        title: "Integrate Automated GitHub App Repo & PR Scaffolder",
        url: "https://github.com/buildwise-org/student-research-food-waste/issues/4",
        status: "pending",
      },
    ],
    __mocked: true,
  },
  "idea-sat-ai-2026": {
    repoUrl: "https://github.com/buildwise-org/student-research-sat-ai",
    starterPrUrl: "https://github.com/buildwise-org/student-research-sat-ai/pull/1",
    installedAt: new Date().toISOString(),
    issues: [
      {
        id: "issue-sat-1",
        number: 1,
        title: "Scaffold Core API Monorepo & Postgres Schema",
        url: "https://github.com/buildwise-org/student-research-sat-ai/issues/1",
        status: "done",
        researchComment: "Posted reference: IEEE Trans. Geoscience (DOI: 10.1109/TGRS.2022.3190821)",
      },
    ],
    __mocked: true,
  },
};
