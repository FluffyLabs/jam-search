import { Source } from "./sources.js";

export const REPOSITORIES: Repository[] = [
  {
    source: Source.GithubW3fJamTestVectors,
    dbId: "github.com/w3f/jamtestvectors",
    owner: "w3f",
    repo: "jamtestvectors",
  },
  {
    source: Source.GithubW3fJamMilestoneDelivery,
    dbId: "github.com/w3f/jam-milestone-delivery",
    owner: "w3f",
    repo: "jam-milestone-delivery",
  },
  {
    source: Source.GithubDavxyJamConformance,
    dbId: "github.com/davxy/jam-conformance",
    owner: "davxy",
    repo: "jam-conformance",
  },
  {
    source: Source.GithubDavxyJamTestVectors,
    dbId: "github.com/davxy/jam-test-vectors",
    owner: "davxy",
    repo: "jam-test-vectors",
  },
];

export type Repository = {
  source: Source;
  dbId: string;
  owner: string;
  repo: string;
};
