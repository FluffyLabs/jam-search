export interface MarkdownSection {
  title: string;
  text: string;
}

/**
 * Strip Pandoc-specific markup from markdown converted from LaTeX.
 * Preserves math notation ($...$, $$...$$) and standard markdown.
 */
export function stripPandocArtifacts(markdown: string): string {
  return (
    markdown
      // Remove YAML frontmatter
      .replace(/^---\n[\s\S]*?\n---\n*/, "")
      // Remove ::: multicols N (directive + column count on next line)
      .replace(/^:::\s*multicols\s*\n\d+\s*$/gm, "")
      // Remove ::: directives (center, description, etc. and closing :::)
      .replace(/^:::.*$/gm, "")
      // Remove empty anchor spans: []{#label label="..."}
      .replace(/\[\]\{[^}]+\}/g, "")
      // Remove image references with local assets
      .replace(/!\[[^\]]*\]\(assets\/[^)]+\)(\{[^}]*\})?/g, "")
      // Handle smallcaps: [text]{.smallcaps} → TEXT
      .replace(
        /\[([^\]]+)\]\{\.smallcaps\}/g,
        (_match, text: string) => text.toUpperCase(),
      )
      // Remove reference-type attributes from links and convert internal links to text
      .replace(
        /\[((?:[^\]\\]|\\.)*)\]\(#[^)]*\)\{reference-type=[^}]+\}/g,
        "$1",
      )
      // Remove remaining reference-type attributes from other links
      .replace(
        /(\[(?:[^\]\\]|\\.)*\]\([^)]*\))\{reference-type=[^}]+\}/g,
        "$1",
      )
      // Convert remaining internal anchor links [text](#ref) to just text
      .replace(/\[((?:[^\]\\]|\\.)*)\]\(#[^)]*\)/g, "$1")
      // Remove remaining Pandoc attributes on links/images: {width="..."}, {#id}, etc.
      .replace(/(\[[^\]]*\]\([^)]*\))\{[^}]+\}/g, "$1")
      // Remove \label{...}
      .replace(/\\label\{[^}]+\}/g, "")
      // Unescape Pandoc backslash-escaped brackets
      .replace(/\\\[/g, "[")
      .replace(/\\\]/g, "]")
      // Clean up multiple blank lines
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/**
 * Split markdown into sections by headings.
 * Each heading (any level: #, ##, ###, etc.) starts a new section.
 * Content before the first heading becomes an "Abstract" section.
 */
export function splitMarkdownSections(markdown: string): MarkdownSection[] {
  const lines = markdown.split("\n");
  const sections: MarkdownSection[] = [];

  let currentTitle = "Abstract";
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      // Save previous section
      const text = currentLines.join("\n").trim();
      if (text || currentTitle !== "Abstract") {
        sections.push({ title: currentTitle, text });
      }
      // Strip Pandoc anchor attributes like {#sec:name} from heading titles
      currentTitle = headingMatch[2].replace(/\s*\{#[^}]+\}\s*$/, "").trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  // Save last section
  const text = currentLines.join("\n").trim();
  if (text) {
    sections.push({ title: currentTitle, text });
  }

  return sections;
}
