import { Idea } from "@buildwise/shared";

export const mockIdeas: Idea[] = [
  {
    id: "idea-food-waste-2026",
    userId: "user-student-01",
    rawText: "Build an AI solution to reduce food waste in college hostels.",
    noveltyScore: 89,
    feasibilityNotes: "High practical feasibility. 28% growth in IEEE IoT smart bin literature. Primary gap: lack of integrated mess-count prediction with real-time plate-waste detection.",
    status: "scaffolded",
    createdAt: "2026-07-25T08:00:00Z",
  },
  {
    id: "idea-sat-ai-2026",
    userId: "user-student-01",
    rawText: "Real-time satellite imagery compression microservice using onboard FPGA edge neural codecs for nanosatellites under low-earth orbit bandwidth constraints.",
    noveltyScore: 88,
    feasibilityNotes: "High student research innovation potential. 34% growth in related IEEE paper submissions over the last 12 months. Primary gap: sub-50ms latency on low-power microcontrollers.",
    status: "planned",
    createdAt: "2026-07-24T10:30:00Z",
  },
];

export const defaultIdea = mockIdeas[0];
