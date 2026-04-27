import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import { writeGraypaperVersions } from "../data/writer.js";
import type { ArchiveMetadata } from "../jobs/graypaperJob.js";

interface ExistingVersionsFile {
  versions: Array<{ version: string; timestamp: string }>;
  latestHash: string | null;
  latestVersion: string | null;
}

function getExistingVersions(dataDir: string): ExistingVersionsFile {
  const versionsPath = path.join(dataDir, "graypaper", "versions.md");
  if (!fs.existsSync(versionsPath)) {
    return { versions: [], latestHash: null, latestVersion: null };
  }

  const raw = fs.readFileSync(versionsPath, "utf-8");
  const { data: frontmatter } = matter(raw);
  return {
    versions:
      (frontmatter.versions as Array<{ version: string; timestamp: string }>) ||
      [],
    latestHash: (frontmatter.latest_hash as string) ?? null,
    latestVersion: (frontmatter.latest_version as string) ?? null,
  };
}

function resolveLatest(
  metadata: ArchiveMetadata
): { hash: string; version: string } | null {
  const latestHash = metadata.latest;
  const latest = metadata.versions[latestHash];
  if (!latest?.name) return null;
  return { hash: latestHash, version: latest.name };
}

export async function updateGraypaperVersions(
  dataDir: string,
  metadata: ArchiveMetadata
): Promise<boolean> {
  const existing = getExistingVersions(dataDir);
  const existingSet = new Set(existing.versions.map((v) => v.version));

  let hasNewVersion = false;
  const allVersions = [...existing.versions];

  for (const version of Object.values(metadata.versions)) {
    // Skip legacy versions without a name
    if (!version.name) continue;

    if (!existingSet.has(version.name)) {
      allVersions.push({
        version: version.name,
        timestamp: new Date(version.date).toISOString(),
      });
      hasNewVersion = true;
      console.log(`Added new graypaper version: ${version.name}`);
    }
  }

  const latest = resolveLatest(metadata);
  const latestChanged =
    latest !== null &&
    (latest.hash !== existing.latestHash ||
      latest.version !== existing.latestVersion);

  if (hasNewVersion || latestChanged) {
    writeGraypaperVersions(
      dataDir,
      allVersions.map((v) => ({
        version: v.version,
        timestamp: new Date(v.timestamp),
      })),
      latest ?? undefined
    );
  }

  return hasNewVersion;
}
