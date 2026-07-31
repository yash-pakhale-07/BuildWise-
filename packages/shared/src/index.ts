export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  sourceType: "web" | "github" | "ieee_xplore" | "arxiv" | "forum";
  meta?: {
    doi?: string;
    venue?: string;
    year?: number;
    stars?: number;
    authors?: string[];
  };
  __mocked?: boolean;
}

export interface Cluster {
  id?: string;
  ideaId?: string;
  type: "existing_solutions" | "academic" | "oss" | "gaps";
  summary: string;
  sources: SearchResult[];
  createdAt?: string;
  __mocked?: boolean;
}

export interface TechStackChoice {
  layer: string;
  choice: string;
  why: string;
}

export interface MilestoneItem {
  id?: string;
  planId?: string;
  title: string;
  dueInDays?: number;
  dueDate?: string;
  status?: "pending" | "in_progress" | "done";
  reminderSent?: boolean;
  githubIssueUrl?: string;
}

export interface DatasetItem {
  name: string;
  url: string;
  description?: string;
}

export interface RepoItem {
  name: string;
  url: string;
  stars?: number;
  description?: string;
}

export interface ProjectPlan {
  id?: string;
  ideaId?: string;
  architecture: {
    frontend?: string;
    backend?: string;
    database?: string;
    aiServices?: string[];
    dataFlow?: string;
    diagramNodes?: { id: string; label: string; type: string }[];
  };
  techStack: TechStackChoice[];
  milestones: MilestoneItem[];
  datasets: DatasetItem[];
  repos: RepoItem[];
  generatedDoc: string;
  createdAt?: string;
  __mocked?: boolean;
}

export interface TrendSignal {
  demandScore: number;
  noveltyScore: number;
  notes: string;
  __mocked?: boolean;
}

export interface IEEEPaper {
  title: string;
  authors: string[];
  doi: string;
  abstract: string;
  venue: string;
  year: number;
  url: string;
  __mocked?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferredLanguage?: string;
  createdAt?: string;
}

export interface Idea {
  id: string;
  userId?: string;
  rawText: string;
  noveltyScore?: number;
  feasibilityNotes?: string;
  status: "validating" | "researching" | "planned" | "scaffolded";
  createdAt?: string;
  clusters?: Cluster[];
  plan?: ProjectPlan;
  githubLink?: GitHubLink;
}

export interface GitHubLink {
  id: string;
  planId: string;
  repoUrl: string;
  starterPrUrl: string;
  installedAt?: string;
  lastSyncedAt?: string;
  __mocked?: boolean;
}

export interface AgentInteraction {
  id: string;
  userId?: string;
  channel: "telegram" | "whatsapp" | "web";
  message: string;
  direction: "inbound" | "outbound";
  createdAt?: string;
}

export interface HackathonReportReference {
  title: string;
  authors?: string[];
  year?: number;
  source: string;
  summary: string;
  url: string;
}

export interface HackathonReport {
  id: string;
  planId?: string;
  ideaId?: string;
  title: string;
  domain: string;
  teamName?: string;
  generatedDate: string;
  coverPage: {
    title: string;
    domain: string;
    teamName: string;
    date: string;
    branding: string;
  };
  executiveSummary: {
    overview: string;
    problem: string;
    solution: string;
    expectedOutcome: string;
    text: string;
  };
  problemStatement: {
    existingProblem: string;
    whoIsAffected: string;
    currentChallenges: string;
    whyItMatters: string;
    text: string;
  };
  proposedSolution: {
    overview: string;
    keyFeatures: string[];
    innovation: string;
    uniqueValueProposition: string;
    competitiveAdvantage: string;
    text: string;
  };
  technicalApproach: {
    architectureOverview: string;
    frontend: string;
    backend: string;
    database: string;
    apis: string[];
    aiModels: string[];
    deployment: string;
    security: string;
    developmentWorkflow: string;
    diagramNodes: { id: string; label: string; type: string }[];
  };
  feasibilityAndViability: {
    technicalFeasibility: string;
    operationalFeasibility: string;
    scalability: string;
    costEffectiveness: string;
    sustainability: string;
    risksAndMitigation: string;
  };
  impactAndBenefits: {
    targetUsers: string;
    businessImpact: string;
    socialImpact: string;
    productivityImprovements: string;
    timeSavings: string;
    futureAdoption: string;
  };
  researchAndReferences: {
    findings: string;
    existingSolutions: string;
    identifiedGap: string;
    howProjectAddressesGap: string;
    references: HackathonReportReference[];
  };
  futureScope: {
    futureImprovements: string;
    aiEnhancements: string;
    mobileApplication: string;
    cloudDeployment: string;
    commercialization: string;
    scalability: string;
  };
  conclusion: {
    summary: string;
    problem: string;
    solution: string;
    innovation: string;
    expectedImpact: string;
    longTermVision: string;
  };
  projectSnapshot: {
    readiness: string;
    techStackSummary: string;
    estimatedTimeline: string;
    researchSourcesCount: number;
    innovationLevel: string;
    scalabilityRating: string;
    feasibilityRating: string;
    aiModelsUsed: string[];
    apisUsed: string[];
  };
  createdAt?: string;
  __mocked?: boolean;
}

