import katex from "katex";
import "katex/dist/katex.min.css";
import type { ReactNode } from "react";

/**
 * Render a LaTeX math string to HTML using KaTeX.
 * Returns a span with rendered math, or the raw string on error.
 */
function MathSpan({ latex, display }: { latex: string; display: boolean }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: display,
  });
  // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX produces trusted HTML from math notation
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Process a text string and render inline/display math ($...$, $$...$$).
 * Returns an array of ReactNode elements.
 */
export function renderMathInText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // Match $$...$$ (display) or $...$ (inline), non-greedy
  const regex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(regex)) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      // Display math $$...$$
      parts.push(<MathSpan key={key++} latex={match[1]} display={true} />);
    } else if (match[2] !== undefined) {
      // Inline math $...$
      parts.push(<MathSpan key={key++} latex={match[2]} display={false} />);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * Process an array of ReactNodes (as returned by getTextToDisplay/highlightText)
 * and render math within string segments.
 */
export function withMathRendering(
  input: ReactNode[] | string,
): ReactNode[] {
  const nodes = typeof input === "string" ? [input] : input;
  return nodes.flatMap((node) => {
    if (typeof node === "string") {
      return renderMathInText(node);
    }
    return node;
  });
}
