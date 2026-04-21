import { Source } from "./sources.js";

export type Repository = {
  source: Source;
  dbId: string;
  owner: string;
  repo: string;
  /** Index issues, pull requests, and discussions. Default: true. */
  indexIssues?: boolean;
  /** Clone and index source code files. Default: false. */
  indexCode?: boolean;
  /** Override default branch for code indexing (auto-detected if omitted). */
  defaultBranch?: string;
};

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
  {
    source: Source.GithubFluffyLabsJamTesting,
    dbId: "github.com/FluffyLabs/jam-testing",
    owner: "FluffyLabs",
    repo: "jam-testing",
  },
  {
    source: Source.GithubFluffyLabsTypeberry,
    dbId: "github.com/FluffyLabs/typeberry",
    owner: "FluffyLabs",
    repo: "typeberry",
    indexCode: true,
  },
  {
    source: Source.GithubTomusdrwAsLan,
    dbId: "github.com/tomusdrw/as-lan",
    owner: "tomusdrw",
    repo: "as-lan",
    indexCode: true,
  },
  {
    source: Source.GithubTomusdrwAnanAs,
    dbId: "github.com/tomusdrw/anan-as",
    owner: "tomusdrw",
    repo: "anan-as",
    indexCode: true,
  },
];
