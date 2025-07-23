export enum Source {
  Matrix = "matrix",
  Graypaper = "graypaper",
  Jamchain = "jamchain",
  GithubW3fJamtestvectors = "githubW3fJamtestvectors",
  GithubW3fJamMilestoneDelivery = "githubW3fJamMilestoneDelivery",
  W3f = "w3f",
  Github = "github",
  JamDaoDiscord = "jamDaoDiscord",
}

export function stringToSource(x: string): Source | undefined {
  for (const val of Object.values(Source)) {
    if (val === x) {
      return val as Source;
    }
  }
  return undefined;
}

export const SOURCE_OPTIONS = [
  { label: "Matrix channels", value: Source.Matrix },
  { label: "Graypaper.pdf", value: Source.Graypaper },
  { label: "docs.jamcha.in", value: Source.Jamchain },
  {
    label: "github.com/w3f/jamtestvectors",
    value: Source.GithubW3fJamtestvectors,
  },
  { label: "JAM DAO", value: Source.JamDaoDiscord },
  {
    label: "github.com/w3f/jam-milestone-delivery",
    value: Source.GithubW3fJamMilestoneDelivery,
  },
];

export const initialSources = [
  Source.Matrix,
  Source.Graypaper,
  Source.Jamchain,
  Source.GithubW3fJamtestvectors,
  // Source.GithubW3fJamMilestoneDelivery,
  Source.JamDaoDiscord,
];
