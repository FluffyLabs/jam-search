import { Plus, Search } from "lucide-react";
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
    <aside className="flex w-64 shrink-0 flex-col border-r-1 border-r-[#D4D4D4] dark:border-r-[#181818] bg-card/50 text-foreground font-light">
      {/* Fixed "Search" header — matches the main section and sources aside
          heights so the horizontal line under all three columns aligns.
          Muted divider: only the light highlight line on the next row, no
          dark shadow on this header's bottom. */}
      <div className="h-12 shrink-0 px-2 flex items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Search sessions"
            className="h-8 pl-7 text-xs"
          />
        </div>
      </div>
      <div className="shrink-0 p-2 border-t-1 border-t-white dark:border-t-[#353535]">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="w-full gap-1.5 font-light"
        >
          <Link to="/ask">
            <Plus className="size-4" />
            New chat
          </Link>
        </Button>
      </div>
      {/* No border between "New chat" and the session list — they read as
          one continuous block. */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {groups.map((group) => (
          <div key={group.label} className="mb-3">
            <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
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
          <div className="p-4 text-center text-xs text-muted-foreground">
            {sessions.length === 0 ? "No sessions yet." : "No matches."}
          </div>
        )}
      </div>
    </aside>
  );
}
