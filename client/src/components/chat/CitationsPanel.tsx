import type { AssistantMessage, CitationCardData } from "@/lib/askTypes";
import { CitationCard } from "./CitationCard";

interface CitationsPanelProps {
  assistant: AssistantMessage | undefined;
  cards: Record<string, CitationCardData>;
}

export function CitationsPanel({ assistant, cards }: CitationsPanelProps) {
  const citations = assistant?.citations ?? [];

  if (citations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sources will appear here as the agent cites them.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {citations.map((c) => (
        <CitationCard key={c.n} citation={c} card={cards[c.docId]} />
      ))}
    </div>
  );
}
