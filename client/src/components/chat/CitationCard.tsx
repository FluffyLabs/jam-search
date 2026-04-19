import { ResultCard } from "@/components/results/ResultCard";
import type { Citation, CitationCardData } from "@/lib/askTypes";
import { formatDate } from "@/lib/utils";

interface CitationCardProps {
  citation: Citation;
  card?: CitationCardData;
}

export function CitationCard({ citation, card }: CitationCardProps) {
  const header = (
    <div className="flex items-baseline justify-between gap-2">
      <span className="font-mono text-xs text-muted-foreground">
        [{citation.n}]
      </span>
      <span className="flex-1 truncate">{renderHeader(citation, card)}</span>
    </div>
  );

  const content = (
    <div className="whitespace-pre-wrap">
      {card?.preview ?? "Loading card data…"}
    </div>
  );

  const footer = renderFooter(citation, card);

  return (
    <div id={`citation-${citation.n}`}>
      <ResultCard header={header} content={content} footer={footer} />
    </div>
  );
}

function renderHeader(
  citation: Citation,
  card: CitationCardData | undefined
): React.ReactNode {
  if (!card) return capitalize(citation.sourceType);
  switch (citation.sourceType) {
    case "graypaper":
      return card.title ?? "Graypaper section";
    case "page":
      return card.title ?? card.url ?? "Page";
    case "discord":
      return `${card.sender ?? "discord"}${
        card.channelName ? ` · #${card.channelName}` : ""
      }`;
    case "matrix":
      return `${card.sender ?? "matrix"}${
        card.roomName ? ` · ${card.roomName}` : ""
      }`;
  }
}

function renderFooter(
  citation: Citation,
  card: CitationCardData | undefined
): React.ReactNode {
  const badge = (
    <span className="uppercase tracking-wide text-[10px] text-muted-foreground">
      {citation.sourceType}
    </span>
  );
  if (!card) return badge;
  if (card.url) {
    return (
      <div className="flex items-center justify-between w-full">
        {badge}
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          View source ↗
        </a>
      </div>
    );
  }
  if (card.timestamp) {
    return (
      <div className="flex items-center justify-between w-full">
        {badge}
        <span className="text-xs text-muted-foreground">
          {formatDate(new Date(card.timestamp).toISOString())}
        </span>
      </div>
    );
  }
  return badge;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
