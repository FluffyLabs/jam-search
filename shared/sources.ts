/** When adding here, make sure to check SOURCE_OPTIONS in client. */
export enum Source {
  GithubDavxyJamConformance = "GithubDavxyJamConformance",
  GithubDavxyJamTestVectors = "GithubDavxyJamTestVectors",
  GithubFluffyLabsJamTesting = "GithubFluffyLabsJamTesting",
  GithubW3fJamMilestoneDelivery = "githubW3fJamMilestoneDelivery",
  GithubW3fJamTestVectors = "githubW3fJamTestVectors",
  Graypaper = "graypaper",
  JamDaoDiscord = "jamDaoDiscord",
  JamWeb3Foundation = "jamWeb3Foundation",
  Jamchain = "jamchain",
  Matrix = "matrix",
}

export function stringToSource(x: string): Source | undefined {
  for (const val of Object.values(Source)) {
    if (val === x) {
      return val as Source;
    }
  }
  return undefined;
}
