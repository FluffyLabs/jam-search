import { Outlet, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AuthGate } from "@/components/ask/AuthGate";
import { SessionsSidebar } from "@/components/ask/SessionsSidebar";
import { useSessions } from "@/hooks/useSessions";

export function AskLayout() {
  return (
    <AuthGate>
      <LayoutInner />
    </AuthGate>
  );
}

function shareUrlFor(sessionId: string): string {
  return `${window.location.origin}${window.location.pathname}#/ask/s/${sessionId}`;
}

function LayoutInner() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const sessions = useSessions();

  return (
    <div className="flex h-full">
      <SessionsSidebar
        sessions={sessions.sessions ?? []}
        activeId={sessionId ?? null}
        onRename={(id) => {
          const nextTitle = window.prompt("New title?");
          if (nextTitle !== null && nextTitle.trim() !== "") {
            sessions.update(id, { title: nextTitle.trim() });
          }
        }}
        onDelete={(id) => {
          if (
            window.confirm("Delete this session? Any public link will 404.")
          ) {
            sessions.remove(id);
          }
        }}
        onShare={async (id) => {
          const session = sessions.sessions?.find((s) => s.id === id);
          const wasPublic = session?.isPublic === true;
          let madePublic = false;
          try {
            if (!wasPublic) {
              await sessions.update(id, { isPublic: true });
              madePublic = true;
            }
          } catch (err) {
            toast.error(
              `Couldn't share: ${(err as Error).message ?? "unknown error"}`
            );
            return;
          }
          try {
            await navigator.clipboard.writeText(shareUrlFor(id));
            toast.success(
              madePublic ? "Link copied. Session is public now" : "Link copied"
            );
          } catch (err) {
            const reason = (err as Error).message ?? "unknown error";
            toast.error(
              madePublic
                ? `Couldn't copy link — session is public now: ${reason}`
                : `Couldn't copy link: ${reason}`
            );
          }
        }}
      />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
