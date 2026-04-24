import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createUseSessions } from "@/hooks/useSessions";

interface Builder {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
}

function makeClient(rows: unknown[] = []) {
  const builder = {} as Builder;
  builder.select = vi.fn(() => builder);
  builder.eq = vi.fn(() => builder);
  builder.order = vi.fn(() => Promise.resolve({ data: rows, error: null }));
  builder.insert = vi.fn(() =>
    Promise.resolve({ data: rows[0] ?? null, error: null })
  );
  builder.update = vi.fn(() => builder);
  builder.delete = vi.fn(() => builder);
  builder.single = vi.fn(() =>
    Promise.resolve({ data: rows[0] ?? null, error: null })
  );
  builder.maybeSingle = vi.fn(() =>
    Promise.resolve({ data: rows[0] ?? null, error: null })
  );
  const from = vi.fn(() => builder);
  return { client: { from }, from, builder };
}

describe("useSessions", () => {
  it("list() queries ask_sessions ordered by updated_at desc for the user", async () => {
    const { client, from, builder } = makeClient([]);
    const hook = renderHook(() =>
      createUseSessions({ supabase: client as never, userId: "u1" })()
    );
    await waitFor(() =>
      expect(hook.result.current.sessions).not.toBeUndefined()
    );
    expect(from).toHaveBeenCalledWith("ask_sessions");
    expect(builder.select).toHaveBeenCalled();
    expect(builder.eq).toHaveBeenCalledWith("user_id", "u1");
    expect(builder.order).toHaveBeenCalledWith("updated_at", {
      ascending: false,
    });
  });

  it("create() inserts a row with toRow()-shaped payload", async () => {
    const { client, builder } = makeClient();
    const useHook = createUseSessions({
      supabase: client as never,
      userId: "u1",
    });
    const hook = renderHook(() => useHook());
    await hook.result.current.create({
      id: "11111111-1111-1111-1111-111111111111",
      title: "Hello",
      state: {
        model: "m",
        cards: {},
        messages: [{ id: "u", role: "user", content: "hi" }],
      },
    });
    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "11111111-1111-1111-1111-111111111111",
        user_id: "u1",
        title: "Hello",
        is_public: false,
        model: "m",
      })
    );
  });

  it("update(id, {isPublic}) sends is_public patch", async () => {
    const { client, builder } = makeClient();
    const useHook = createUseSessions({
      supabase: client as never,
      userId: "u1",
    });
    const hook = renderHook(() => useHook());
    await hook.result.current.update("abc", { isPublic: true });
    expect(builder.update).toHaveBeenCalledWith(
      expect.objectContaining({ is_public: true })
    );
    expect(builder.eq).toHaveBeenCalledWith("id", "abc");
  });

  it("remove() deletes by id", async () => {
    const { client, builder } = makeClient();
    const useHook = createUseSessions({
      supabase: client as never,
      userId: "u1",
    });
    const hook = renderHook(() => useHook());
    await hook.result.current.remove("abc");
    expect(builder.delete).toHaveBeenCalled();
    expect(builder.eq).toHaveBeenCalledWith("id", "abc");
  });
});
