import { useUserData } from "@fluffylabs/shared-ui/supabase";
import { Sparkles } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AskAboutResultsProps {
  searchQuery: string;
}

/**
 * Inline "Ask AI about these results" prompt rendered at the bottom of the
 * results page. Always in Ask AI mode (independent of the top search form's
 * selected mode). If the user is not logged in or has no OpenRouter key, a
 * login prompt is shown instead.
 *
 * On submit, the question is sent to /ask with the original search phrase
 * prepended so the agent has the search context.
 */
export function AskAboutResults({ searchQuery }: AskAboutResultsProps) {
  const navigate = useNavigate();
  const { data: openrouterKey, isLoading } = useUserData("openrouter-api-key", {
    appScoped: true,
  });
  const canAskAI =
    typeof openrouterKey === "string" && openrouterKey.trim().length > 0;

  const [question, setQuestion] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow
  // biome-ignore lint/correctness/useExhaustiveDependencies: question is the trigger
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [question]);

  const submit = () => {
    const trimmed = question.trim();
    if (!trimmed || !canAskAI) return;
    const prompt = `About the search "${searchQuery}": ${trimmed}`;
    const params = new URLSearchParams();
    params.set("q", prompt);
    params.set("autoSubmit", "1");
    navigate(`/ask?${params.toString()}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-3 text-sm">
        <Sparkles className="h-4 w-4 text-brand-dark" />
        <span className="font-medium text-foreground">
          Ask AI about these results
        </span>
      </div>

      {isLoading ? (
        <div className="rounded-md border border-border bg-card/40 p-4 text-sm text-muted-foreground">
          Loading…
        </div>
      ) : canAskAI ? (
        <div className="rounded-xl border border-border bg-card/40 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 transition-all">
          <Textarea
            ref={taRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`What would you like to know about "${searchQuery}"?`}
            rows={1}
            className="border-0 bg-transparent shadow-none resize-none min-h-[44px] focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] leading-6 px-4 py-3"
          />
          <div className="flex items-center justify-between px-3 py-2 border-t border-border/60">
            <span className="text-[11px] text-muted-foreground">
              Your question will be asked together with the current search.
            </span>
            <Button
              onClick={submit}
              disabled={!question.trim()}
              size="sm"
              className="bg-brand-dark text-white hover:bg-brand-dark/90 dark:bg-brand dark:text-background dark:hover:bg-brand/90"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Ask AI
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <Link
            to="/login"
            className="text-brand-dark hover:underline font-medium"
          >
            Log in
          </Link>{" "}
          and add an{" "}
          <Link
            to="/settings"
            className="text-brand-dark hover:underline font-medium"
          >
            OpenRouter API key
          </Link>{" "}
          to ask AI about these results.
        </div>
      )}
    </section>
  );
}
