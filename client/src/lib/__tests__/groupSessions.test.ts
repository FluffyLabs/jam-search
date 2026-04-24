import { describe, expect, it } from "vitest";
import { groupSessions } from "@/lib/groupSessions";
import type { AskSessionSummary } from "@/lib/sessionTypes";

function sess(id: string, updated: string): AskSessionSummary {
  return {
    id,
    userId: "u",
    title: id,
    isPublic: false,
    model: "x",
    createdAt: updated,
    updatedAt: updated,
  };
}

describe("groupSessions", () => {
  const now = new Date("2026-04-23T12:00:00Z");

  it("buckets by age relative to `now`", () => {
    const sessions = [
      sess("today", "2026-04-23T08:00:00Z"),
      sess("yesterday", "2026-04-22T10:00:00Z"),
      sess("week", "2026-04-20T10:00:00Z"),
      sess("month", "2026-04-10T10:00:00Z"),
      sess("old", "2026-01-01T10:00:00Z"),
    ];
    const groups = groupSessions(sessions, now);
    expect(groups.map((g) => [g.label, g.sessions.map((s) => s.id)])).toEqual([
      ["Today", ["today"]],
      ["Yesterday", ["yesterday"]],
      ["Previous 7 Days", ["week"]],
      ["Previous 30 Days", ["month"]],
      ["Older", ["old"]],
    ]);
  });

  it("omits empty buckets", () => {
    const groups = groupSessions([sess("a", "2026-04-23T08:00:00Z")], now);
    expect(groups.map((g) => g.label)).toEqual(["Today"]);
  });

  it("preserves input order within a bucket", () => {
    const groups = groupSessions(
      [sess("a", "2026-04-23T09:00:00Z"), sess("b", "2026-04-23T10:00:00Z")],
      now
    );
    expect(groups[0].sessions.map((s) => s.id)).toEqual(["a", "b"]);
  });
});
