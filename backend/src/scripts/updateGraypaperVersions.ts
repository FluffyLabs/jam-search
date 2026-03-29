import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import { writeGraypaperVersions } from "../data/writer.js";

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

function getExistingVersions(
  dataDir: string
): Array<{ version: string; timestamp: string }> {
  const versionsPath = path.join(dataDir, "graypaper", "versions.md");
  if (!fs.existsSync(versionsPath)) {
    return [];
  }

  const raw = fs.readFileSync(versionsPath, "utf-8");
  const { data: frontmatter } = matter(raw);
  return (frontmatter.versions as Array<{ version: string; timestamp: string }>) || [];
}

export async function updateGraypaperVersions(
  dataDir: string
): Promise<boolean> {
  const releases = await fetchLatestReleases();
  const existingVersions = getExistingVersions(dataDir);
  const existingSet = new Set(existingVersions.map((v) => v.version));

  let hasNew = false;
  const allVersions = [...existingVersions];

  for (const release of releases) {
    if (!existingSet.has(release.tag_name)) {
      allVersions.push({
        version: release.tag_name,
        timestamp: release.published_at,
      });
      hasNew = true;
      console.log(`Added new graypaper version: ${release.tag_name}`);
    }
  }

  if (hasNew) {
    writeGraypaperVersions(
      dataDir,
      allVersions.map((v) => ({
        version: v.version,
        timestamp: new Date(v.timestamp),
      }))
    );
  }

  return hasNew;
}
