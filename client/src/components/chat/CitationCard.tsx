import { ResultCard } from "@/components/results/ResultCard";
import type { Citation, CitationCardData, SourceType } from "@/lib/askTypes";
import { formatDate } from "@/lib/utils";

interface CitationCardProps {
  citation: Citation;
  card?: CitationCardData;
}

export function CitationCard({ citation, card }: CitationCardProps) {
  const header = (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded bg-brand-light text-brand-dark text-[11px] font-medium tabular-nums shrink-0">
        {citation.n}
      </span>
      <span className="flex-1 min-w-0 truncate font-medium text-foreground text-sm">
        {renderTitle(citation, card)}
      </span>
    </div>
  );

  const content = (
    <div className="text-xs text-muted-foreground leading-relaxed">
      {card?.preview ?? "Loading source…"}
    </div>
  );

  const footer = (
    <div className="flex items-center justify-between w-full gap-2">
      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: sourceColor(citation.sourceType) }}
        />
        {sourceLabel(citation.sourceType)}
      </span>
      {renderMeta(card)}
    </div>
  );

  return (
    <div id={`citation-${citation.n}`} className="scroll-mt-4">
      <ResultCard header={header} content={content} footer={footer} />
    </div>
  );
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

function renderMeta(card: CitationCardData | undefined): React.ReactNode {
  if (!card) return null;
  if (card.url) {
    return (
      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-brand-dark hover:underline truncate max-w-[12rem]"
      >
        {new URL(card.url).hostname.replace(/^www\./, "")} ↗
      </a>
    );
  }
  if (card.timestamp) {
    return (
      <time
        dateTime={new Date(card.timestamp).toISOString()}
        className="text-[11px] text-muted-foreground tabular-nums"
      >
        {formatDate(new Date(card.timestamp).toISOString())}
      </time>
    );
  }
  return null;
}
