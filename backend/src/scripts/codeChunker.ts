export interface CodeChunk {
  /** 1-based inclusive line where chunk starts. */
  startLine: number;
  /** 1-based inclusive line where chunk ends. */
  endLine: number;
  /** Chunk text (original line endings preserved). */
  text: string;
  chunkIndex: number;
  chunkTotal: number;
}

export interface ChunkOptions {
  /** Approximate soft cap in JS string length (UTF-16 code units), not bytes. */
  maxChars: number;
  /** Trailing characters from the prior chunk re-included as overlap. */
  overlapChars: number;
}

/**
 * Split a text file into line-based chunks. Greedy: pack whole lines into the
 * current chunk until adding the next line would exceed maxChars. When emitting
 * a chunk, rewind by approximately overlapChars worth of trailing lines so the
 * next chunk re-includes them as overlap. A line longer than maxChars becomes
 * its own chunk untouched.
 */
export function chunkCodeFile(text: string, opts: ChunkOptions): CodeChunk[] {
  if (text.length === 0) return [];

  // Split preserving newline endings. `match` with /[^\n]*\n?/g handles the
  // trailing line-without-newline case.
  const rawLines = text.match(/[^\n]*\n?/g) ?? [];
  // The regex always appends one empty trailing match; drop it if present.
  const lines = rawLines[rawLines.length - 1] === "" ? rawLines.slice(0, -1) : rawLines;
  if (lines.length === 0) return [];

  const chunks: Omit<CodeChunk, "chunkIndex" | "chunkTotal">[] = [];

  let i = 0;
  while (i < lines.length) {
    let j = i;
    let size = 0;

    // Pack whole lines until the next one would exceed maxChars
    while (j < lines.length) {
      const next = lines[j];
      if (size > 0 && size + next.length > opts.maxChars) break;
      size += next.length;
      j++;
      // Oversized single line: emit it alone
      if (j === i + 1 && next.length > opts.maxChars) break;
    }

    const chunkLines = lines.slice(i, j);
    chunks.push({
      startLine: i + 1,
      endLine: j,
      text: chunkLines.join(""),
    });

    if (j >= lines.length) break;

    // Rewind by overlapChars worth of trailing lines
    let overlapSize = 0;
    let overlapStart = j;
    while (overlapStart > i + 1 && overlapSize < opts.overlapChars) {
      overlapStart--;
      overlapSize += lines[overlapStart].length;
    }
    i = overlapStart;
  }

  return chunks.map((c, idx) => ({
    ...c,
    chunkIndex: idx,
    chunkTotal: chunks.length,
  }));
}
