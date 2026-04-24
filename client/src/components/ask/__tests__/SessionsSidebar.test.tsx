import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { SessionsSidebar } from "@/components/ask/SessionsSidebar";
import type { AskSessionSummary } from "@/lib/sessionTypes";

function sess(id: string, title: string, updated: string): AskSessionSummary {
  return {
    id,
    userId: "u",
    title,
    isPublic: false,
    model: "x",
    createdAt: updated,
    updatedAt: updated,
  };
}

function renderSidebar(sessions: AskSessionSummary[]) {
  return render(
    <MemoryRouter>
      <SessionsSidebar
        sessions={sessions}
        activeId={null}
        now={new Date("2026-04-23T12:00:00Z")}
        onRename={vi.fn()}
        onDelete={vi.fn()}
        onToggleShare={vi.fn()}
        onRegenerateTitle={vi.fn()}
      />
    </MemoryRouter>
  );
}

describe("SessionsSidebar", () => {
  const sessions = [
    sess("a", "Today session", "2026-04-23T08:00:00Z"),
    sess("b", "Yesterday session", "2026-04-22T08:00:00Z"),
  ];

  it("renders group labels and session titles", () => {
    renderSidebar(sessions);
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(screen.getByText("Today session")).toBeInTheDocument();
    expect(screen.getByText("Yesterday session")).toBeInTheDocument();
  });

  it("filter input narrows the list case-insensitively", async () => {
    renderSidebar(sessions);
    await userEvent.type(screen.getByLabelText(/filter/i), "yesterday");
    expect(screen.queryByText("Today session")).not.toBeInTheDocument();
    expect(screen.getByText("Yesterday session")).toBeInTheDocument();
  });

  it("shows empty state when no sessions", () => {
    renderSidebar([]);
    expect(screen.getByText(/no sessions yet/i)).toBeInTheDocument();
  });
});
