import { IEEEPaper } from "@ideaforge/shared";

export interface IEEEXploreClient {
  searchPapers(query: string, maxResults?: number): Promise<IEEEPaper[]>;
}

export function getIEEEXploreClient(): IEEEXploreClient {
  if (process.env.IEEE_XPLORE_API_KEY) {
    // Real endpoint implementation
    // return new RealIEEEXploreClient();
  }
  const { mockIEEEXploreClient } = require("../mocks/ieeeXplore.mock");
  return mockIEEEXploreClient;
}
