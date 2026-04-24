import { describe, expect, it } from "vitest";
import { createApp } from "../../api.js";
import { createSearchDB, insertDoc } from "../../data/searchIndex.js";

function initBody() {
  return {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "handler-test", version: "0.0.1" },
    },
  };
}

function mcpHeaders() {
  return {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
}

describe("/mcp HTTP handler", () => {
  it("handles initialize stateless (no CORS, no session id) and returns SSE body", async () => {
    const db = createSearchDB();
    insertDoc(db, {
      type: "graypaper_section",
      title: "Accumulate",
      content: "The accumulate function processes work results.",
    });
    const app = createApp(db, "./data");

    const res = await app.fetch(
      new Request("http://x/mcp", {
        method: "POST",
        headers: mcpHeaders(),
        body: JSON.stringify(initBody()),
      })
    );

    expect(res.status).toBe(200);
    // CORS must not be advertised for server-to-server endpoint.
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
    // Stateless: transport must not mint a session id.
    expect(res.headers.get("mcp-session-id")).toBeNull();

    const text = await res.text();
    expect(text).toContain("protocolVersion");
    expect(text).toContain("jam-search");
  });

  it("rejects initialize when Accept header is missing text/event-stream", async () => {
    const app = createApp(createSearchDB(), "./data");
    const res = await app.fetch(
      new Request("http://x/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initBody()),
      })
    );
    // MCP transport rejects with 406 when the client didn't advertise SSE.
    expect(res.status).toBe(406);
  });

  it("applies CORS to non-MCP routes (sanity check)", async () => {
    const app = createApp(createSearchDB(), "./data");
    const res = await app.fetch(
      new Request("http://x/health", {
        headers: { Origin: "https://example.com" },
      })
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).not.toBeNull();
  });
});
