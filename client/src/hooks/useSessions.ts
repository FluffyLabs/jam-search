import { useSupabaseContext } from "@fluffylabs/shared-ui/supabase/context";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
    // `supabase` and `userId` are captured from the factory closure; they are
    // stable for the lifetime of this hook instance, so they are omitted from
    // the dep arrays below (the linter cannot tell).
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
      onSuccess: (_data, args) => {
        // Optimistic insert: put the new row at the top of the cached list
        // so the sidebar reflects it immediately, before the refetch lands.
        queryClient.setQueryData<AskSessionSummary[]>(key, (old) => {
          const now = new Date().toISOString();
          const summary: AskSessionSummary = {
            id: args.id,
            userId,
            title: args.title,
            isPublic: false,
            model: args.state.model,
            createdAt: now,
            updatedAt: now,
          };
          return old ? [summary, ...old] : [summary];
        });
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
      onSuccess: (_data, args) => {
        // Only invalidate when something the sidebar actually displays
        // changed. State-only saves (the 100ms autosave path) bump
        // `updated_at` but nothing visible — and invalidating from there
        // would churn the save effect via refetch-triggered renders,
        // which is the whole autosave-loop bug we're preventing.
        if ("title" in args.patch || "isPublic" in args.patch) {
          // Patch the cached summary immediately for instant sidebar feedback.
          queryClient.setQueryData<AskSessionSummary[]>(key, (old) =>
            old
              ? old.map((s) =>
                  s.id === args.id
                    ? {
                        ...s,
                        ...("title" in args.patch
                          ? { title: args.patch.title ?? null }
                          : {}),
                        ...("isPublic" in args.patch
                          ? { isPublic: args.patch.isPublic ?? s.isPublic }
                          : {}),
                      }
                    : s
                )
              : old
          );
          void invalidate();
        }
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
      onSuccess: (_data, id) => {
        // Optimistic remove so the deleted row disappears from the
        // sidebar without waiting for the refetch.
        queryClient.setQueryData<AskSessionSummary[]>(key, (old) =>
          old ? old.filter((s) => s.id !== id) : old
        );
        void invalidate();
      },
    });

    const list = useCallback(async () => {
      await queryClient.refetchQueries({ queryKey: key });
    }, [queryClient, key]);

    const get = useCallback(async (id: string) => {
      return fetchSessionById(supabase, id);
    }, []);

    const create: UseSessionsApi["create"] = async (args) => {
      await createMutation.mutateAsync(args);
    };

    const update: UseSessionsApi["update"] = async (id, patch) => {
      await updateMutation.mutateAsync({ id, patch });
    };

    const remove: UseSessionsApi["remove"] = async (id) => {
      await removeMutation.mutateAsync(id);
    };

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
 * Imperative cache invalidation for paths that write to `ask_sessions`
 * outside the hook — currently `askShared.tsx::forkAndGo`, which inserts
 * directly via the Supabase client and then navigates. Call after the
 * insert so the sidebar picks up the new row on the next render instead
 * of waiting for the next natural refetch.
 */
export function invalidateSessions(
  queryClient: QueryClient,
  userId: string
): void {
  void queryClient.invalidateQueries({ queryKey: sessionsKey(userId) });
}
