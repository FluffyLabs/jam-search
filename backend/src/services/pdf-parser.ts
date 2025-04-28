import type {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api.js";

export interface PDFSection {
  title: string;
  text: string;
  subsections: PDFSection[];
}

export type PDFParseResult = {
  sections: PDFSection[];
  filename: string;
  version: string;
};

export class PDFParserService {
  private static instance: PDFParserService;

  private constructor() {}

  public static getInstance(): PDFParserService {
    if (!PDFParserService.instance) {
      PDFParserService.instance = new PDFParserService();
    }
    return PDFParserService.instance;
  }

  private async getPageText(page: PDFPageProxy): Promise<string> {
    const textContent = await page.getTextContent();
    return textContent.items
      .map((item) => (item as TextItem).str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  public async parsePDF(source: string): Promise<PDFParseResult> {
    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // Load the PDF document
    const doc = await getDocument({
      url: source,
    }).promise;

    // Get the outline
    const outline = await doc.getOutline();
    if (!outline) {
      throw new Error("No outline found in the PDF");
    }

    // Get all text from the PDF
    const pageTexts: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      pageTexts.push(await this.getPageText(page));
    }
    const allText = pageTexts
      .join(" ")
      .replace(/(?<=[a-zA-Z0-9])- /gu, "")
      .replace(/ -(?=[a-zA-Z0-9])/gu, "-")
      .replace(/ \. /gu, ". ")
      .replace(/ , /gu, ", ")
      .replace(/ \)/gu, ")")
      .replace(/\( /gu, "(")
      .replace(/(?<= )Snark s(?=[ ,\.])/gu, "Snarks")
      .replace(/(?<= )snark s(?=[ ,\.])/gu, "snarks")
      .replace(/(?<= )Zk-snark s(?=[ ,\.])/gu, "Zk-snarks")
      .replace(/snark - based/gu, "snarkbased")
      .replace(/(?<= )Polka vm(?=[ ,\.])/gu, "Polkavm")
      .replace(/(?<= )J am(?=[ ,\.])/gu, "Jam");

    // Helper: flatten outline to get all titles in order (for splitting)
    function flattenOutline(
      outlineItems: Array<{ title: string; items?: unknown[] }>
    ): string[] {
      const titles: string[] = [];
      for (const item of outlineItems) {
        if (item.title) titles.push(item.title.trim());
        if (item.items && item.items.length > 0) {
          titles.push(
            ...flattenOutline(
              item.items as Array<{ title: string; items?: unknown[] }>
            )
          );
        }
      }
      return titles;
    }
    const allTitles = flattenOutline(outline);

    // Helper: find all indices of titles in the text
    function findTitleIndices(
      text: string,
      titles: string[]
    ): { title: string; index: number }[] {
      const indices: { title: string; index: number }[] = [];
      for (const title of titles) {
        const idx = text.indexOf(title);
        if (idx === -1) {
          throw new Error(`Title not found: ${title}`);
        }
        indices.push({ title, index: idx });
      }
      // Sort by index in text
      indices.sort((a, b) => a.index - b.index);
      return indices;
    }
    const titleIndices = findTitleIndices(allText, allTitles);

    // Helper: recursively build PDFSection tree from outline
    function buildSections(
      outlineItems: Array<{ title: string; items?: unknown[] }>,
      text: string,
      indices: Array<{ title: string; index: number }>,
      startIdx: number,
      endIdx: number | undefined
    ): PDFSection[] {
      const sections: PDFSection[] = [];
      for (let i = 0; i < outlineItems.length; i++) {
        const item = outlineItems[i];
        const title = item.title.trim();
        // Find this section's start and end in the text
        const thisIdxObj = indices.find((t) => t.title === title);
        const thisIdx = thisIdxObj ? thisIdxObj.index : startIdx;
        let nextIdx = endIdx;
        // If there is a next outline item at this level, use its index as end
        if (i + 1 < outlineItems.length) {
          const nextTitle = outlineItems[i + 1].title.trim();
          const nextObj = indices.find((t) => t.title === nextTitle);
          if (nextObj) nextIdx = nextObj.index;
        }
        // If this item has children, recursively build subsections
        let subsections: PDFSection[] = [];
        if (item.items && item.items.length > 0) {
          subsections = buildSections(
            item.items as Array<{ title: string; items?: unknown[] }>,
            text,
            indices,
            thisIdxObj
              ? thisIdxObj.index + (title ? title.length : 0)
              : thisIdx,
            nextIdx
          );
        }
        // Extract text for this section (between thisIdx+title.length and nextIdx)
        let sectionText = "";
        if (thisIdxObj) {
          const firstSubsectionIndex =
            subsections.length > 0
              ? indices.find((t) => t.title === subsections[0].title)?.index
              : undefined;
          const from = thisIdxObj.index + (title ? title.length : 0);
          const to =
            firstSubsectionIndex !== undefined
              ? firstSubsectionIndex
              : nextIdx !== undefined
                ? nextIdx
                : text.length;
          sectionText = text.slice(from, to).replace(/^\./, "").trim();
        }
        sections.push({
          title,
          text: sectionText,
          subsections,
        });
      }
      return sections;
    }

    // Special case: the very first section (before any outline title)
    let sections: PDFSection[] = [];
    if (titleIndices.length > 0 && titleIndices[0].index > 0) {
      // There is a preamble before the first outline title
      const preambleText = allText.slice(0, titleIndices[0].index).trim();
      sections.push({
        title: "Abstract",
        text: preambleText,
        subsections: [],
      });
    }
    // Now build the rest of the sections from the outline
    sections = sections.concat(
      buildSections(outline, allText, titleIndices, 0, undefined)
    );

    const filename = (doc._transport?._fullReader?._filename ?? "") as string;
    const version = filename.split("-").pop()?.split(".pdf")[0] ?? "";

    return {
      sections,
      filename,
      version,
    };
  }
}
