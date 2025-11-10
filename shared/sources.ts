export enum Source {
  Matrix = "matrix",
  Graypaper = "graypaper",
  Jamchain = "jamchain",
  GithubW3fJamtestvectors = "githubW3fJamtestvectors",
  GithubW3fJamMilestoneDelivery = "githubW3fJamMilestoneDelivery",
  W3f = "w3f",
  Github = "github",
  JamDaoDiscord = "jamDaoDiscord",
  JamWeb3Foundation = "jamWeb3Foundation",
}

export function stringToSource(x: string): Source | undefined {
  for (const val of Object.values(Source)) {
    if (val === x) {
      return val as Source;
    }
  }
  return undefined;
}
