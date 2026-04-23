import { Outlet } from "react-router-dom";
import { AuthGate } from "@/components/ask/AuthGate";

export function AskLayout() {
  return (
    <AuthGate>
      <div className="flex h-full">
        {/* Sidebar added in Task 10 */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </AuthGate>
  );
}
