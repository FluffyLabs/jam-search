import { useSupabaseContext } from "@fluffylabs/shared-ui/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { CitationsPanel } from "@/components/chat/CitationsPanel";
import { Message } from "@/components/chat/Message";
import { Button } from "@/components/ui/button";
import type { AssistantMessage } from "@/lib/askTypes";
import { consumeForkPending, markForkPending } from "@/lib/forkPending";
import {
  type AskSessionRecord,
  type AskSessionRow,
  fromRow,
  toRow,
} from "@/lib/sessionTypes";

async function forkAndGo(args: {
  client: SupabaseClient;
  userId: string;
  source: AskSessionRecord;
  navigate: (path: string) => void;
}) {
  const newId = uuidv4();
  const row = toRow({
    id: newId,
    userId: args.userId,
    title: args.source.title ? `Fork of ${args.source.title}` : null,
    isPublic: false,
    state: args.source.state,
  });
  const { error } = await args.client.from("ask_sessions").insert(row);
  if (error) throw error;
  args.navigate(`/ask/${newId}`);
}

export function AskSharedPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { client, user } = useSupabaseContext();
  const navigate = useNavigate();
  const [record, setRecord] = useState<
    AskSessionRecord | null | "notfound"
  >(null);
  const [forkError, setForkError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await client
        .from("ask_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("is_public", true)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setRecord("notfound");
        return;
      }
      const parsed = fromRow(data as AskSessionRow);
      setRecord(parsed ?? "notfound");
    })();
    return () => {
      cancelled = true;
    };
  }, [client, sessionId]);

  // If we returned here after auth, complete the deferred fork.
  useEffect(() => {
    if (!user || !sessionId || !(record && record !== "notfound")) return;
    const pending = consumeForkPending();
    if (pending === sessionId) {
      forkAndGo({ client, userId: user.id, source: record, navigate }).catch(
        (err) => setForkError((err as Error).message),
      );
    }
  }, [user, sessionId, record, client, navigate]);

  if (record === null) {
    return <div className="p-4">Loading…</div>;
  }
  if (record === "notfound") {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold">Conversation not found</h1>
        <p className="mt-2 text-muted-foreground">
          This link is private, deleted, or never existed.
        </p>
      </div>
    );
  }

  const onFork = async () => {
    if (!sessionId) return;
    if (!user) {
      markForkPending(sessionId);
      navigate("/login");
      return;
    }
    try {
      await forkAndGo({ client, userId: user.id, source: record, navigate });
    } catch (err) {
      setForkError((err as Error).message);
    }
  };

  const lastAssistant = [...record.state.messages]
    .reverse()
    .find((m): m is AssistantMessage => m.role === "assistant");

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="truncate text-lg font-semibold">
          {record.title ?? "Shared conversation"}
        </h1>
        <Button onClick={onFork}>Continue this conversation</Button>
      </header>
      {forkError && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          Couldn't fork: {forkError}
        </div>
      )}
      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="overflow-y-auto rounded-md border border-border bg-card/20 p-4">
          <div className="flex flex-col gap-6">
            {record.state.messages.map((m) => (
              <Message key={m.id} message={m} />
            ))}
          </div>
        </section>
        <aside className="hidden overflow-y-auto rounded-md border border-border bg-card/20 p-4 lg:block">
          <CitationsPanel
            assistant={lastAssistant}
            cards={record.state.cards}
          />
        </aside>
      </div>
    </div>
  );
}
