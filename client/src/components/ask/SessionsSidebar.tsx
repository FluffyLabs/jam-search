import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SessionRow } from "@/components/ask/SessionRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { groupSessions } from "@/lib/groupSessions";
import type { AskSessionSummary } from "@/lib/sessionTypes";

export function SessionsSidebar({
  sessions,
  activeId,
  now,
  onRename,
  onDelete,
  onShare,
}: {
  sessions: AskSessionSummary[];
  activeId: string | null;
  now?: Date;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}) {
  const [filter, setFilter] = useState("");
  const filtered = useMemo(() => {
    if (!filter.trim()) return sessions;
    const needle = filter.toLowerCase();
    return sessions.filter((s) =>
      (s.title ?? "Untitled").toLowerCase().includes(needle)
    );
  }, [sessions, filter]);
  const groups = useMemo(() => groupSessions(filtered, now), [filtered, now]);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card/50 text-foreground">
      <div className="p-2">
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link to="/ask">
            <Plus className="size-4" /> New chat
          </Link>
        </Button>
      </div>
      <div className="px-2 pb-2">
        <Input
          placeholder="Filter…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter sessions"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {groups.map((group) => (
          <div key={group.label} className="mb-3">
            <div className="px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </div>
            {group.sessions.map((s) => (
              <SessionRow
                key={s.id}
                session={s}
                active={s.id === activeId}
                onRename={onRename}
                onDelete={onDelete}
                onShare={onShare}
              />
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {sessions.length === 0 ? "No sessions yet." : "No matches."}
          </div>
        )}
      </div>
    </aside>
  );
}
