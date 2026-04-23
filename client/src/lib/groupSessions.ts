import type { AskSessionSummary } from "@/lib/sessionTypes";

export interface SessionGroup {
  label: string;
  sessions: AskSessionSummary[];
}

const LABELS = [
  "Today",
  "Yesterday",
  "Previous 7 Days",
  "Previous 30 Days",
  "Older",
] as const;

function bucketIndex(updated: Date, now: Date): number {
  const day = 24 * 60 * 60 * 1000;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const updatedDay = new Date(
    updated.getFullYear(),
    updated.getMonth(),
    updated.getDate(),
  );
  const daysDiff = Math.round(
    (today.getTime() - updatedDay.getTime()) / day,
  );
  if (daysDiff <= 0) return 0;
  if (daysDiff === 1) return 1;
  const ms = now.getTime() - updated.getTime();
  if (ms < 7 * day) return 2;
  if (ms < 30 * day) return 3;
  return 4;
}

export function groupSessions(
  sessions: AskSessionSummary[],
  now: Date = new Date(),
): SessionGroup[] {
  const buckets: AskSessionSummary[][] = LABELS.map(() => []);
  for (const s of sessions) {
    buckets[bucketIndex(new Date(s.updatedAt), now)].push(s);
  }
  return buckets
    .map((sessions, i) => ({ label: LABELS[i], sessions }))
    .filter((g) => g.sessions.length > 0);
}
