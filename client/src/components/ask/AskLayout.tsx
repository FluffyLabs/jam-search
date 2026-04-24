import { Outlet, useParams } from "react-router-dom";
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
        onShare={() => {
          // Implemented in Task 10 (flip public + copy + toast).
        }}
      />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
