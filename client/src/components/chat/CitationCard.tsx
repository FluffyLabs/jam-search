import { ResultCard } from "@/components/results/ResultCard";
import { ViewEmbedded } from "@/components/ViewEmbedded";
import type { Citation, CitationCardData, SourceType } from "@/lib/askTypes";
import { formatDate } from "@/lib/utils";

interface CitationCardProps {
  citation: Citation;
  card?: CitationCardData;
}

export function CitationCard({ citation, card }: CitationCardProps) {
  // Validate the timestamp before calling toISOString() — an out-of-range or
  // corrupted value would otherwise throw RangeError at render time.
  const iso = toIsoOrNull(card?.timestamp);

  const header = (
    <div className="flex items-center gap-2 min-w-0 w-full">
      <span className="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded bg-brand-light text-brand-dark text-[11px] tabular-nums shrink-0">
        {citation.n}
      </span>
      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground shrink-0">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: sourceColor(citation.sourceType) }}
        />
        {sourceLabel(citation.sourceType)}
      </span>
      <span className="flex-1 min-w-0 truncate text-foreground text-xs">
        {renderTitle(citation, card)}
      </span>
      {iso && (
        <time
          dateTime={iso}
          className="text-[10px] text-muted-foreground tabular-nums shrink-0"
        >
          {formatDate(iso)}
        </time>
      )}
    </div>
  );

  const content = (
    <div className="text-xs text-muted-foreground font-light leading-relaxed">
      {card?.preview ?? "Loading source…"}
    </div>
  );

  const footer = card?.url ? (
    <ViewEmbedded
      url={card.url}
      searchQuery=""
      results={[]}
      noEmbed={citation.sourceType === "discord"}
      label={openLabel(citation.sourceType)}
    />
  ) : (
    <span className="text-[10px] text-muted-foreground italic">
      No link available
    </span>
  );

  return (
    <div id={`citation-${citation.n}`} className="scroll-mt-4">
      <ResultCard header={header} content={content} footer={footer} />
    </div>
  );
}

function toIsoOrNull(ts: number | null | undefined): string | null {
  if (ts === null || ts === undefined) return null;
  const d = new Date(ts);
  return Number.isFinite(d.getTime()) ? d.toISOString() : null;
}

function openLabel(type: SourceType): string {
  switch (type) {
    case "page":
      return "Open page";
    case "graypaper":
      return "Open reader";
    case "discord":
      return "Open Discord ↗";
    case "matrix":
      return "Open message";
  }
}

function sourceLabel(type: SourceType): string {
  switch (type) {
    case "graypaper":
      return "Graypaper";
    case "discord":
      return "Discord";
    case "matrix":
      return "Matrix";
    case "page":
      return "Page";
  }
}

function sourceColor(type: SourceType): string {
  switch (type) {
    case "graypaper":
      return "var(--brand-dark)";
    case "discord":
      return "hsl(235 85% 65%)";
    case "matrix":
      return "hsl(145 60% 45%)";
    case "page":
      return "hsl(25 85% 55%)";
  }
}

function renderTitle(
  citation: Citation,
  card: CitationCardData | undefined
): React.ReactNode {
  if (!card) return "—";
  switch (citation.sourceType) {
    case "graypaper":
      return card.title ?? "Graypaper section";
    case "page":
      return card.title ?? card.url ?? "Page";
    case "discord":
      return card.channelName
        ? `${card.sender ?? "discord"} · #${card.channelName}`
        : (card.sender ?? "discord");
    case "matrix":
      return card.roomName
        ? `${card.sender ?? "matrix"} · ${card.roomName}`
        : (card.sender ?? "matrix");
  }
}
