import {
  clearGraypaperSections,
  writeGraypaperSection,
} from "../data/writer.js";
import { updateGraypaperVersions } from "../scripts/updateGraypaperVersions.js";
import { PDFParserService } from "../services/pdf-parser.js";

const LATEST_GP_PDF = "https://graypaper.com/graypaper.pdf";
const DATA_DIR = process.env.DATA_DIR || "./data";

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

  const hasNewVersion = await updateGraypaperVersions(DATA_DIR);
  if (!hasNewVersion) {
    console.log("Graypaper Versions: no new version");
    return;
  }

  console.log("Fetching newest Graypaper");
  const result = await PDFParserService.getInstance().parsePDF(LATEST_GP_PDF);
  const flattenedSections = result.sections.flatMap((section) => [
    section,
    ...section.subsections,
  ]);

  console.log(`Updating Graypaper sections from PDF: ${result.filename}`);

  // Clear existing sections and write new ones
  clearGraypaperSections(DATA_DIR);
  for (let i = 0; i < flattenedSections.length; i++) {
    const section = flattenedSections[i];
    writeGraypaperSection(DATA_DIR, {
      title: section.title,
      text: section.text,
      index: i + 1,
    });
  }

  console.log(`Wrote ${flattenedSections.length} graypaper sections`);
}
