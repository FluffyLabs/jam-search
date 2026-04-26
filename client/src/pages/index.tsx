import { useSupabaseContext } from "@fluffylabs/shared-ui/supabase/context";
import { MessageSquareText, Sparkles, Star, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { useSessions } from "@/hooks/useSessions";

const Header = () => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-2 flex items-center flex-col sm:flex-row">
        Search in{" "}
        <span className="bg-gradient-to-r from-[#0d7277] to-[#032c2f] text-white px-3 py-1 ml-2 rounded">
          JAM knowledge base
        </span>
      </h1>

      <p className="text-center font-light text-sm text-foreground mt-4 mb-12">
        Single place to search Matrix, Discord, GitHub, the Gray Paper and
        others.
      </p>
    </>
  );
};
/**
 * Inner component that queries `useSessions` — safe to render only when we
 * know the user is authenticated (the hook throws otherwise). Shows a subtle
 * link to `/ask` when the user has at least one previous conversation.
 */
const PreviousConversationsLinkInner = () => {
  const sessions = useSessions();
  const count = sessions.sessions?.length ?? 0;
  if (count === 0) return null;
  return (
    <Link
      to="/ask"
      className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <MessageSquareText className="size-3.5" />
      Continue a previous conversation
      <span className="text-muted-foreground/70 tabular-nums">({count})</span>
    </Link>
  );
};

const PreviousConversationsLink = () => {
  const { user } = useSupabaseContext();
  if (!user) return null;
  return <PreviousConversationsLinkInner />;
};

const Features = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 rounded-md">
          <Star className="h-6 w-6 text-brand-dark dark:text-brand" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Clear and precise</h3>
        <p className="text-muted-foreground text-sm">
          Get direct code references and docs without endless searching.
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 rounded-md">
          <Target className="h-6 w-6 text-brand-dark dark:text-brand" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Targeted solutions</h3>
        <p className="text-muted-foreground text-sm">
          Relevant answers based on your query and context.
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 rounded-md">
          <Sparkles className="h-6 w-6 text-brand-dark dark:text-brand" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Code-driven efficiency</h3>
        <p className="text-muted-foreground text-sm">
          Debug and implement faster with AI-powered search.
        </p>
      </div>
    </div>
  );
};

export const IndexPage = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl w-full bg-card text-foreground p-4 relative overflow-hidden min-h-full">
      <div className="max-w-3xl w-full flex flex-col items-center mt-16 relative z-10">
        <Header />

        <SearchForm
          redirectToResults
          instantSearch={false}
          showSearchOptions={false}
        />

        <PreviousConversationsLink />

        <Features />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-brand/20 via-brand/10 to-transparent dark:from-brand-dark dark:via-brand-dark/80 dark:to-transparent opacity-90" />
    </div>
  );
};
