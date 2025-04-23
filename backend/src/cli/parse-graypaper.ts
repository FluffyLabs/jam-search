import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PDFParserService } from "../services/pdf-parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the PDF path from command line argument
const pdfPath = process.argv[2];

if (!pdfPath) {
  console.error("Error: Please provide a PDF file path as an argument");
  console.error("Usage: npm run parse:graypaper -- <path-to-pdf>");
  process.exit(1);
}

try {
  const result = await PDFParserService.getInstance().parsePDF(pdfPath);
  fs.mkdirSync(path.join(__dirname, "../../tmp"), { recursive: true });
  fs.writeFileSync(
    path.join(__dirname, "../../tmp/graypaper.json"),
    JSON.stringify(result, null, 2)
  );
} catch (error) {
  console.error("Error parsing PDF:", error);
  process.exit(1);
}
