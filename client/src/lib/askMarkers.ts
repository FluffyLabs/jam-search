/**
 * Splits text into alternating strings and `[N]` citation marker objects.
 * Example: "foo [1] bar" -> ["foo ", { n: 1 }, " bar"]
 * Returns [] for empty input.
 */
export type MarkerNode = string | { n: number };

const MARKER_RE = /\[(\d+)\]/g;

export function splitCitationMarkers(text: string): MarkerNode[] {
  if (text.length === 0) return [];
  const nodes: MarkerNode[] = [];
  let last = 0;
  MARKER_RE.lastIndex = 0;
  for (;;) {
    const m = MARKER_RE.exec(text);
    if (!m) break;
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    nodes.push({ n: Number(m[1]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
