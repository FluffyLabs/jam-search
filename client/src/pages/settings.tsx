import { Settings, useUserData } from "@fluffylabs/shared-ui/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SettingsPage() {
  const navigate = useNavigate();
  const { data, isLoading, save } = useUserData("openrouter-api-key", {
    appScoped: true,
  });
  const savedKey = typeof data === "string" ? data : "";
  const [apiKey, setApiKey] = useState(savedKey);
  const [lastSavedKey, setLastSavedKey] = useState(savedKey);
  const [saving, setSaving] = useState(false);

  // Sync the input when the persisted value arrives or is refetched.
  if (savedKey !== lastSavedKey) {
    setLastSavedKey(savedKey);
    setApiKey(savedKey);
  }

  const isDirty = !isLoading && apiKey !== savedKey;

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      await save(apiKey || null);
    } finally {
      setSaving(false);
    }
  };

  const handleOk = async () => {
    if (isDirty) await handleSave();
    navigate("/");
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-6">
      <Settings className="!mx-0 !p-0" />
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">
            OpenRouter API Key
          </p>
          <p className="text-xs text-muted-foreground">
            Used for AI-powered search features
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={isLoading ? "Loading..." : "sk-or-..."}
            disabled={isLoading}
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            disabled={saving || isLoading || !isDirty}
            onClick={handleSave}
            className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving || isLoading}
          className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleOk}
        >
          {isDirty ? "Save & close" : "OK"}
        </button>
      </div>
    </div>
  );
}
