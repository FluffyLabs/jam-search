import { useUserData } from "@fluffylabs/shared-ui/supabase";
import { Outlet, useParams } from "react-router-dom";
import { AuthGate } from "@/components/ask/AuthGate";
import { SessionsSidebar } from "@/components/ask/SessionsSidebar";
import { useSessions } from "@/hooks/useSessions";
import { requestTitle } from "@/lib/askTitleClient";

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
  const { data: keyData } = useUserData("openrouter-api-key", {
    appScoped: true,
  });
  const apiKey = typeof keyData === "string" ? keyData : null;

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
            window.confirm(
              "Delete this session? Any public link will 404.",
            )
          ) {
            sessions.remove(id);
          }
        }}
        onToggleShare={(id, next) => sessions.update(id, { isPublic: next })}
        onRegenerateTitle={async (id) => {
          if (!apiKey) {
            window.alert(
              "Add an OpenRouter API key in Settings before regenerating titles.",
            );
            return;
          }
          const record = await sessions.get(id);
          const first = record?.state.messages.find((m) => m.role === "user");
          if (!first || first.role !== "user") return;
          const title = await requestTitle({
            question: first.content,
            openrouterKey: apiKey,
          });
          if (title) await sessions.update(id, { title });
        }}
      />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
