import { sql } from "drizzle-orm";

import { db } from "../db/db.js";
import { graypaperSectionsTable } from "../db/schema.js";
import { updateGraypaperVersions } from "../scripts/updateGraypaperVersions.js";
import { PDFParserService } from "../services/pdf-parser.js";

const LATEST_GP_PDF = "https://graypaper.com/graypaper.pdf";

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error('Error in graypaper job:', error);
  process.exit(1);
}

async function main() {
  console.log(
    "Running scheduled graypaper update job at",
    new Date().toISOString()
  );

  const hasNewVersion = await updateGraypaperVersions();
  if (!hasNewVersion) {
    console.log("Graypaper Versions: no new version");
    await db.$client.end();
    return;
  }

  console.log("Fetching newest Graypaper");
  const result = await PDFParserService.getInstance().parsePDF(LATEST_GP_PDF);
  const flattenedSections = result.sections.flatMap((section) => [
    section,
    ...section.subsections,
  ]);

  console.log(`Updating Graypaper sections from PDF: ${result.filename}`);

  await db.transaction(async (tx) => {
    await tx.delete(graypaperSectionsTable);
    await tx.insert(graypaperSectionsTable).values(
      flattenedSections.map((section) => ({
        title: section.title,
        text: section.text,
      }))
    );
    console.log("Reindexing graypaper_search_idx");
    await tx.execute(sql`REINDEX INDEX graypaper_search_idx;`);
  });
  console.log("Done! Closing connection...");

  await db.$client.end();
}
