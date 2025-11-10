import { Source } from "./sources.js";

export const REPOSITORIES: Repository[] = [
  {
    source: Source.GithubW3fJamtestvectors,
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
];

type Repository = {
  source: Source;
  dbId: string;
  owner: string;
  repo: string;
};
