import { Source } from "./sources.js";

export type CodeRepository = {
  source: Source;
  dbId: string;
  owner: string;
  repo: string;
  /** Override default branch (auto-detected from clone if omitted). */
  defaultBranch?: string;
};

export const CODE_REPOSITORIES: CodeRepository[] = [
  {
    source: Source.GithubFluffyLabsTypeberry,
    dbId: "github.com/FluffyLabs/typeberry",
    owner: "FluffyLabs",
    repo: "typeberry",
  },
  {
    source: Source.GithubTomusdrwAsLan,
    dbId: "github.com/tomusdrw/as-lan",
    owner: "tomusdrw",
    repo: "as-lan",
  },
  {
    source: Source.GithubTomusdrwAnanAs,
    dbId: "github.com/tomusdrw/anan-as",
    owner: "tomusdrw",
    repo: "anan-as",
  },
];
