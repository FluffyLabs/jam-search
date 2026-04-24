import { useSupabaseContext } from "@fluffylabs/shared-ui/supabase/context";
import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useMemo } from "react";
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
    }>
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

function sessionsKey(userId: string): readonly unknown[] {
  return ["ask_sessions", userId] as const;
}

async function fetchSessions(
  supabase: SupabaseClient,
  userId: string
): Promise<AskSessionSummary[]> {
  const { data, error } = await supabase
    .from("ask_sessions")
    .select("id,user_id,title,is_public,model,created_at,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as AskSessionRow[]).map(rowToSummary);
}

async function fetchSessionById(
  supabase: SupabaseClient,
  id: string
): Promise<AskSessionRecord | null> {
  const { data, error } = await supabase
    .from("ask_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return fromRow(data as AskSessionRow);
}

/**
 * Factory kept so tests can inject a stub Supabase client + userId without
 * going through the SupabaseContext. Consumers in app code use the default
 * `useSessions` export below.
 */
export function createUseSessions(deps: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = deps;
  return function useSessions(): UseSessionsApi {
    const queryClient = useQueryClient();
    const key = useMemo(() => sessionsKey(userId), []);

    const query = useQuery<AskSessionSummary[], Error>({
      queryKey: key,
      queryFn: () => fetchSessions(supabase, userId),
    });

    const invalidate = useCallback(
      () => queryClient.invalidateQueries({ queryKey: key }),
      [queryClient, key]
    );

    const createMutation = useMutation({
      mutationFn: async (args: {
        id: string;
        title: string | null;
        state: AskConversationState;
      }) => {
        const row = toRow({
          id: args.id,
          userId,
          title: args.title,
          isPublic: false,
          state: args.state,
        });
        const { error } = await supabase.from("ask_sessions").insert(row);
        if (error) throw new Error(error.message);
      },
      onSuccess: () => {
        void invalidate();
      },
    });

    const updateMutation = useMutation({
      mutationFn: async (args: {
        id: string;
        patch: Partial<{
          title: string | null;
          isPublic: boolean;
          state: AskConversationState;
        }>;
      }) => {
        const dbPatch: Record<string, unknown> = {};
        if ("title" in args.patch) dbPatch.title = args.patch.title ?? null;
        if ("isPublic" in args.patch) dbPatch.is_public = args.patch.isPublic;
        if (args.patch.state) {
          const row = toRow({
            id: args.id,
            userId,
            title: null,
            isPublic: false,
            state: args.patch.state,
          });
          dbPatch.messages = row.messages;
          dbPatch.cards = row.cards;
          dbPatch.model = row.model;
        }
        const { error } = await supabase
          .from("ask_sessions")
          .update(dbPatch)
          .eq("id", args.id);
        if (error) throw new Error(error.message);
      },
      onSuccess: () => {
        void invalidate();
      },
    });

    const removeMutation = useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from("ask_sessions")
          .delete()
          .eq("id", id);
        if (error) throw new Error(error.message);
      },
      onSuccess: () => {
        void invalidate();
      },
    });

    const list = useCallback(async () => {
      await queryClient.refetchQueries({ queryKey: key });
    }, [queryClient, key]);

    const get = useCallback(async (id: string) => {
      return fetchSessionById(supabase, id);
    }, []);

    const create = useCallback<UseSessionsApi["create"]>(
      async (args) => {
        await createMutation.mutateAsync(args);
      },
      [createMutation]
    );

    const update = useCallback<UseSessionsApi["update"]>(
      async (id, patch) => {
        await updateMutation.mutateAsync({ id, patch });
      },
      [updateMutation]
    );

    const remove = useCallback(
      async (id: string) => {
        await removeMutation.mutateAsync(id);
      },
      [removeMutation]
    );

    const mutationError =
      createMutation.error?.message ??
      updateMutation.error?.message ??
      removeMutation.error?.message ??
      null;
    const error = query.error?.message ?? mutationError ?? null;

    return {
      sessions: query.data,
      error,
      list,
      get,
      create,
      update,
      remove,
    };
  };
}

export function useSessions(): UseSessionsApi {
  const ctx = useSupabaseContext();
  if (!ctx.user) {
    throw new Error("useSessions requires an authenticated user");
  }
  return createUseSessions({ supabase: ctx.client, userId: ctx.user.id })();
}

/**
 * Helper for forcibly refreshing the sessions cache outside the hook (e.g.
 * after a fork from the shared-view page). Rarely needed.
 */
export function invalidateSessions(
  queryClient: QueryClient,
  userId: string
): void {
  void queryClient.invalidateQueries({ queryKey: sessionsKey(userId) });
}
