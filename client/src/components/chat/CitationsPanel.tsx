import type { AssistantMessage, CitationCardData } from "@/lib/askTypes";
import { CitationCard } from "./CitationCard";

interface CitationsPanelProps {
  assistant: AssistantMessage | undefined;
  cards: Record<string, CitationCardData>;
}

export function CitationsPanel({ assistant, cards }: CitationsPanelProps) {
  if (!assistant || assistant.citations.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4">
        Sources will appear here as the agent cites them.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 p-4">
      {assistant.citations.map((c) => (
        <CitationCard key={c.n} citation={c} card={cards[c.docId]} />
      ))}
    </div>
  );
}
