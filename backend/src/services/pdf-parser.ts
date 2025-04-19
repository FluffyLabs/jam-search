import type {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/legacy/build/pdf.mjs";

export interface PDFSection {
  title: string;
  text: string;
}

export type PDFParseResult = PDFSection[];

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
      .map((item: any) => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private async processOutlineItem(
    item: {
      title: string;
      bold: boolean;
      italic: boolean;
      /**
       * - The color in RGB format to use for
       * display purposes.
       */
      color: Uint8ClampedArray;
      dest: string | Array<any> | null;
      url: string | null;
      unsafeUrl: string | undefined;
      newWindow: boolean | undefined;
      count: number | undefined;
      items: Array</*elided*/ any>;
    },
    doc: PDFDocumentProxy
  ): Promise<PDFSection[]> {
    let sections: PDFSection[] = [];
    let text = "";

    if (item.dest) {
      let pageNumber: number;

      if (Array.isArray(item.dest)) {
        // Handle array destination format
        if (typeof item.dest[0] === "object" && item.dest[0] !== null) {
          // If first element is a page reference object
          pageNumber = await doc.getPageIndex(item.dest[0]);
        } else if (typeof item.dest[0] === "number") {
          // If first element is a direct page number
          pageNumber = item.dest[0];
        } else {
          // If it's a named destination
          const namedDest = await doc.getDestination(item.dest[0]);
          if (namedDest) {
            pageNumber = await doc.getPageIndex(namedDest[0]);
          } else {
            throw new Error(`Could not resolve destination: ${item.dest[0]}`);
          }
        }
      } else if (typeof item.dest === "string") {
        // Handle string destination format
        const namedDest = await doc.getDestination(item.dest);
        if (namedDest) {
          pageNumber = await doc.getPageIndex(namedDest[0]);
        } else {
          throw new Error(`Could not resolve destination: ${item.dest}`);
        }
      } else {
        throw new Error("Invalid destination format");
      }

      // PDF.js uses 0-based page numbers internally, but getPage expects 1-based
      const page = await doc.getPage(pageNumber + 1);
      text = await this.getPageText(page);
    }

    // Add the current section to the flat list
    sections.push({
      title: item.title,
      text: text,
    });

    // Process all children recursively and add them to the flat list
    if (item.items && item.items.length > 0) {
      const childSections = await Promise.all(
        item.items.map((child) => this.processOutlineItem(child, doc))
      );
      sections = sections.concat(...childSections);
    }

    return sections;
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

    // Process each outline item recursively and flatten the structure
    const sectionsArrays = await Promise.all(
      outline.map((item) => this.processOutlineItem(item, doc))
    );

    // Flatten the array of arrays into a single array
    return sectionsArrays.flat();
  }
}
