import { PDFParserService } from "../services/pdf-parser.js";

import { db } from "../db/db.js";
import { graypaperSectionsTable } from "../db/schema.js";
import { sql } from "drizzle-orm";

// Get the PDF path from command line argument
const pdfPath = "https://graypaper.com/graypaper.pdf";

try {
  const result = await PDFParserService.getInstance().parsePDF(pdfPath);
  const flattenedSections = result.sections.flatMap(
    (section) => section.subsections
  );

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
} catch (error) {
  console.error("Error updating Graypaper sections from PDF:", error);
  process.exit(1);
}
