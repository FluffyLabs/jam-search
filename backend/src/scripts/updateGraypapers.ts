import { db } from "../db/db.js";
import { graypapersTable } from "../db/schema.js";

interface GitHubRelease {
  tag_name: string;
  published_at: string;
}

async function fetchLatestReleases(): Promise<GitHubRelease[]> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/gavofyork/graypaper/releases"
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    return (await response.json()).map((release: GitHubRelease) => ({
      tag_name: release.tag_name.replace("v", ""),
      published_at: release.published_at,
    }));
  } catch (error) {
    console.error("Error fetching releases:", error);
    return [];
  }
}

async function getExistingVersions(): Promise<string[]> {
  const existingRecords = await db.select().from(graypapersTable);
  return existingRecords.map((record: { version: string }) => record.version);
}

async function addNewRelease(release: GitHubRelease): Promise<void> {
  try {
    await db.insert(graypapersTable).values({
      version: release.tag_name,
      timestamp: new Date(release.published_at),
    });
    console.log(`Added new graypaper version: ${release.tag_name}`);
  } catch (error) {
    console.error(`Error adding version ${release.tag_name}:`, error);
  }
}

export async function updateGraypapers(): Promise<void> {
  const releases = await fetchLatestReleases();
  const existingVersions = await getExistingVersions();

  for (const release of releases) {
    if (!existingVersions.includes(release.tag_name)) {
      await addNewRelease(release);
    }
  }
}

// Run the function if this script is executed directly
// In ESM, we don't have the require.main check, so we can use a condition based on import.meta instead
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  updateGraypapers()
    .then(() => {
      console.log("Graypaper update completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error updating graypapers:", error);
      process.exit(1);
    });
}
