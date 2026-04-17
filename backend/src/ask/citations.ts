import type { SourceType } from "./types.js";

export interface ParsedCitation {
  n: number;
  docId: string;
  sourceType?: SourceType;
}

export interface ParseResult {
  text: string;
  citations: ParsedCitation[];
}

/**
 * Streaming parser for `<cite n="N" doc="..." sourceType="..." />` tags.
 *
 * The LLM emits these tags before citation markers so the frontend can match
 * [N] markers to source cards. Tags may span chunk boundaries; the parser
 * buffers a potential partial tag until it can decide.
 */
export function createCiteParser() {
  let buffer = "";

  function consume(input: string): ParseResult {
    buffer += input;
    let text = "";
    const citations: ParsedCitation[] = [];

    // Process the buffer left-to-right, extracting tags and plain text.
    while (buffer.length > 0) {
      const ltIdx = buffer.indexOf("<");
      if (ltIdx === -1) {
        // No '<' anywhere; the whole buffer is text.
        text += buffer;
        buffer = "";
        break;
      }

      // Emit text before the '<'.
      if (ltIdx > 0) {
        text += buffer.slice(0, ltIdx);
        buffer = buffer.slice(ltIdx);
      }

      // Now buffer starts with '<'. Look for a complete tag.
      const gtIdx = buffer.indexOf(">");
      if (gtIdx === -1) {
        // Incomplete; keep buffer, wait for more input.
        break;
      }

      const tag = buffer.slice(0, gtIdx + 1);
      buffer = buffer.slice(gtIdx + 1);

      const cite = parseCiteTag(tag);
      if (cite) {
        citations.push(cite);
      } else {
        // Not a cite tag (or malformed): pass through as plain text.
        text += tag;
      }
    }

    return { text, citations };
  }

  function flush(): ParseResult {
    const out = { text: buffer, citations: [] as ParsedCitation[] };
    buffer = "";
    return out;
  }

  return { feed: consume, flush };
}

const CITE_TAG_RE = /^<cite\s+([^>]*?)\/?>$/i;

function parseCiteTag(tag: string): ParsedCitation | null {
  const m = CITE_TAG_RE.exec(tag);
  if (!m) return null;
  const attrs = m[1];
  const n = Number(/n\s*=\s*"(\d+)"/i.exec(attrs)?.[1]);
  const docId = /doc\s*=\s*"([^"]+)"/i.exec(attrs)?.[1];
  const sourceTypeStr = /sourceType\s*=\s*"([^"]+)"/i.exec(attrs)?.[1];
  if (!Number.isInteger(n) || n <= 0) return null;
  if (!docId) return null;
  const valid: SourceType[] = ["graypaper", "discord", "matrix", "page"];
  const sourceType = valid.includes(sourceTypeStr as SourceType)
    ? (sourceTypeStr as SourceType)
    : undefined;
  return { n, docId, sourceType };
}
