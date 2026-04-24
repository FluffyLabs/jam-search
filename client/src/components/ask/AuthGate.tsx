import { useSupabaseContext } from "@fluffylabs/shared-ui/supabase/context";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSupabaseContext();
  const location = useLocation();
  if (isLoading) return <div className="p-4">Loading…</div>;
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  return <>{children}</>;
}
