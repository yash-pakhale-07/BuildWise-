import { IEEEPaper } from "@buildwise/shared";
import { IEEEXploreClient } from "../clients/ieeeXplore";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockIEEEXploreClient implements IEEEXploreClient {
  async searchPapers(query: string, maxResults: number = 5): Promise<IEEEPaper[]> {
    await sleep(950);
    return [
      {
        title: "Adaptive Neural Compression for Ultra-Low Power Spaceborne Sensors",
        authors: ["Dr. Aris Thorne", "Elena Vance", "Marcus Brody"],
        doi: "10.1109/TGRS.2022.3190821",
        abstract: "Proposes an onboard sub-vector quantized neural image codec achieving high-ratio data reduction with minimal compute overhead on nanosatellites.",
        venue: "IEEE Transactions on Geoscience and Remote Sensing",
        year: 2022,
        url: "https://ieeexplore.ieee.org/document/9845120",
        __mocked: true,
      },
      {
        title: "Autonomous Task Scheduling & Consensus in Edge Micro-Satellites",
        authors: ["K. Takahashi", "S. Patel", "J. R. Miller"],
        doi: "10.1109/IOTJ.2023.3267119",
        abstract: "Demonstrates dynamic workload distribution across interconnected CubeSat constellations using low-bandwidth wireless inter-satellite links.",
        venue: "IEEE Internet of Things Journal",
        year: 2023,
        url: "https://ieeexplore.ieee.org/document/10123984",
        __mocked: true,
      },
      {
        title: "Real-Time Telemetry Anomaly Detection via Federated Edge Learning",
        authors: ["L. Chen", "M. Rossi", "A. Al-Hassan"],
        doi: "10.1109/TNSM.2023.3298412",
        abstract: "Evaluates lightweight autoencoder models deployed on microcontrollers for instant telemetry fault prediction.",
        venue: "IEEE Transactions on Network and Service Management",
        year: 2023,
        url: "https://ieeexplore.ieee.org/document/10214890",
        __mocked: true,
      },
    ].slice(0, maxResults);
  }
}

export const mockIEEEXploreClient = new MockIEEEXploreClient();
