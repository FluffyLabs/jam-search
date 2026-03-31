import {
  clearGraypaperSections,
  writeGraypaperSection,
} from "../data/writer.js";
import { updateGraypaperVersions } from "../scripts/updateGraypaperVersions.js";
import {
  splitMarkdownSections,
  stripPandocArtifacts,
} from "../services/markdown-splitter.js";

const ARCHIVE_BASE =
  "https://raw.githubusercontent.com/FluffyLabs/graypaper-archive/main/dist";
const METADATA_URL = `${ARCHIVE_BASE}/metadata.json`;
const DATA_DIR = process.env.DATA_DIR || "./data";

export interface ArchiveVersion {
  name?: string;
  hash: string;
  date: string;
  legacy?: boolean;
}

export interface ArchiveMetadata {
  latest: string;
  versions: Record<string, ArchiveVersion>;
  nightly: { name: string; hash: string; date: string };
}

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in graypaper job:", error);
  process.exit(1);
}

async function main() {
  console.log(
    "Running scheduled graypaper update job at",
    new Date().toISOString()
  );

  // Fetch metadata from the graypaper archive
  const metadataRes = await fetch(METADATA_URL);
  if (!metadataRes.ok) {
    throw new Error(`Failed to fetch metadata: ${metadataRes.status}`);
  }
  const metadata: ArchiveMetadata = await metadataRes.json();

  const hasNewVersion = await updateGraypaperVersions(DATA_DIR, metadata);
  if (!hasNewVersion) {
    console.log("Graypaper Versions: no new version");
    return;
  }

  // Fetch the latest markdown from the archive
  const latestHash = metadata.latest;
  const mdUrl = `${ARCHIVE_BASE}/graypaper-${latestHash}.md`;
  console.log(`Fetching graypaper markdown: ${mdUrl}`);

  const mdRes = await fetch(mdUrl);
  if (!mdRes.ok) {
    throw new Error(`Failed to fetch markdown: ${mdRes.status}`);
  }
  const rawMarkdown = await mdRes.text();

  // Strip Pandoc artifacts and split into sections
  const cleanedMarkdown = stripPandocArtifacts(rawMarkdown);
  const sections = splitMarkdownSections(cleanedMarkdown);

  console.log(`Split into ${sections.length} sections`);

  // Clear existing sections and write new ones
  clearGraypaperSections(DATA_DIR);
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    writeGraypaperSection(DATA_DIR, {
      title: section.title,
      text: section.text,
      index: i + 1,
    });
  }

  console.log(`Wrote ${sections.length} graypaper sections`);
}
