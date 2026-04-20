import type { AssistantMessage, CitationCardData } from "@/lib/askTypes";
import { CitationCard } from "./CitationCard";

interface CitationsPanelProps {
  assistant: AssistantMessage | undefined;
  cards: Record<string, CitationCardData>;
}

export function CitationsPanel({ assistant, cards }: CitationsPanelProps) {
  const citations = assistant?.citations ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-foreground">Sources</h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {citations.length}
        </span>
      </div>

      {citations.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sources will appear here as the agent cites them.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {citations.map((c) => (
            <CitationCard key={c.n} citation={c} card={cards[c.docId]} />
          ))}
        </div>
      )}
    </div>
  );
}
