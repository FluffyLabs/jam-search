import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import { writeGraypaperVersions } from "../data/writer.js";
import type { ArchiveMetadata } from "../jobs/graypaperJob.js";

function getExistingVersions(
  dataDir: string
): Array<{ version: string; timestamp: string }> {
  const versionsPath = path.join(dataDir, "graypaper", "versions.md");
  if (!fs.existsSync(versionsPath)) {
    return [];
  }

  const raw = fs.readFileSync(versionsPath, "utf-8");
  const { data: frontmatter } = matter(raw);
  return (
    (frontmatter.versions as Array<{ version: string; timestamp: string }>) ||
    []
  );
}

export async function updateGraypaperVersions(
  dataDir: string,
  metadata: ArchiveMetadata
): Promise<boolean> {
  const existingVersions = getExistingVersions(dataDir);
  const existingSet = new Set(existingVersions.map((v) => v.version));

  let hasNew = false;
  const allVersions = [...existingVersions];

  for (const version of Object.values(metadata.versions)) {
    // Skip legacy versions without a name
    if (!version.name) continue;

    if (!existingSet.has(version.name)) {
      allVersions.push({
        version: version.name,
        timestamp: new Date(version.date).toISOString(),
      });
      hasNew = true;
      console.log(`Added new graypaper version: ${version.name}`);
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
