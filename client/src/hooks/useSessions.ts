import { useSupabaseContext } from "@fluffylabs/shared-ui/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import type { AskConversationState } from "@/lib/askTypes";
import {
  type AskSessionRecord,
  type AskSessionRow,
  type AskSessionSummary,
  fromRow,
  toRow,
} from "@/lib/sessionTypes";

export interface UseSessionsApi {
  sessions: AskSessionSummary[] | undefined;
  error: string | null;
  list: () => Promise<void>;
  get: (id: string) => Promise<AskSessionRecord | null>;
  create: (args: {
    id: string;
    title: string | null;
    state: AskConversationState;
  }) => Promise<void>;
  update: (
    id: string,
    patch: Partial<{
      title: string | null;
      isPublic: boolean;
      state: AskConversationState;
    }>,
  ) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

function rowToSummary(row: AskSessionRow): AskSessionSummary {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    isPublic: row.is_public,
    model: row.model,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createUseSessions(deps: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = deps;
  return function useSessions(): UseSessionsApi {
    const [sessions, setSessions] = useState<AskSessionSummary[] | undefined>(
      undefined,
    );
    const [error, setError] = useState<string | null>(null);

    const list = useCallback(async () => {
      const { data, error } = await supabase
        .from("ask_sessions")
        .select("id,user_id,title,is_public,model,created_at,updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (error) {
        setError(error.message);
        return;
      }
      setSessions((data as AskSessionRow[]).map(rowToSummary));
    }, [supabase, userId]);

    const get = useCallback(
      async (id: string) => {
        const { data, error } = await supabase
          .from("ask_sessions")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          setError(error.message);
          return null;
        }
        return fromRow(data as AskSessionRow);
      },
      [supabase],
    );

    const create = useCallback<UseSessionsApi["create"]>(
      async ({ id, title, state }) => {
        const row = toRow({
          id,
          userId,
          title,
          isPublic: false,
          state,
        });
        const { error } = await supabase.from("ask_sessions").insert(row);
        if (error) {
          setError(error.message);
          return;
        }
        await list();
      },
      [list, supabase, userId],
    );

    const update = useCallback<UseSessionsApi["update"]>(
      async (id, patch) => {
        const dbPatch: Record<string, unknown> = {};
        if ("title" in patch) dbPatch.title = patch.title ?? null;
        if ("isPublic" in patch) dbPatch.is_public = patch.isPublic;
        if (patch.state) {
          const row = toRow({
            id,
            userId,
            title: null,
            isPublic: false,
            state: patch.state,
          });
          dbPatch.messages = row.messages;
          dbPatch.cards = row.cards;
          dbPatch.model = row.model;
        }
        const { error } = await supabase
          .from("ask_sessions")
          .update(dbPatch)
          .eq("id", id);
        if (error) setError(error.message);
        else await list();
      },
      [list, supabase, userId],
    );

    const remove = useCallback(
      async (id: string) => {
        const { error } = await supabase
          .from("ask_sessions")
          .delete()
          .eq("id", id);
        if (error) setError(error.message);
        else await list();
      },
      [list, supabase],
    );

    useEffect(() => {
      list();
    }, [list]);

    return { sessions, error, list, get, create, update, remove };
  };
}

export function useSessions(): UseSessionsApi {
  const ctx = useSupabaseContext();
  if (!ctx.user) {
    throw new Error("useSessions requires an authenticated user");
  }
  return createUseSessions({ supabase: ctx.client, userId: ctx.user.id })();
}
