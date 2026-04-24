import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AskSessionSummary } from "@/lib/sessionTypes";
import { cn } from "@/lib/utils";

export function SessionRow({
  session,
  active,
  onRename,
  onDelete,
  onShare,
}: {
  session: AskSessionSummary;
  active: boolean;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent",
        active && "bg-accent"
      )}
    >
      <Link
        to={`/ask/${session.id}`}
        className="flex-1 min-w-0 truncate text-foreground"
        title={session.title ?? "Untitled"}
      >
        {session.title ?? "Untitled"}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-foreground"
          aria-label="Session actions"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onRename(session.id)}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare(session.id)}>
            Share…
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(session.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
