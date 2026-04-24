import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, describe, expect, it } from "vitest";
import { createSearchDB, insertDoc } from "../../data/searchIndex.js";
import { createMcpServer } from "../../mcp/server.js";

describe("mcp server", () => {
  const opened: Array<() => Promise<void>> = [];

  afterEach(async () => {
    await Promise.all(opened.map((close) => close()));
    opened.length = 0;
  });

  async function connectClient(db = createSearchDB()) {
    const server = createMcpServer(db, "./data");
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "0.0.0" });
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
    opened.push(async () => {
      // close() is idempotent in the MCP SDK; closing both sides cleans up
      // protocol state, transport handlers, and linked transport pair.
      await Promise.all([client.close(), server.close()]);
    });
    return { client, db };
  }

  it("lists exactly the two /ask tools", async () => {
    const { client } = await connectClient();
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(["get_full_document", "search_all"]);
  });

  it("does not mark `limit` as required on search_all", async () => {
    const { client } = await connectClient();
    const { tools } = await client.listTools();
    const searchAll = tools.find((t) => t.name === "search_all");
    expect(searchAll).toBeDefined();
    const required = (searchAll?.inputSchema as { required?: string[] })
      .required;
    expect(required).toEqual(["query"]);
  });

  it("calls search_all and returns a text content block", async () => {
    const db = createSearchDB();
    insertDoc(db, {
      type: "graypaper_section",
      title: "Accumulate",
      content: "The accumulate function processes work results.",
    });
    const { client } = await connectClient(db);

    const result = await client.callTool({
      name: "search_all",
      arguments: { query: "accumulate" },
    });

    expect(result.isError).toBeFalsy();
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0].type).toBe("text");
    const parsed = JSON.parse(content[0].text) as Array<{ id: string }>;
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
    expect(typeof parsed[0].id).toBe("string");
  });

  it("calls get_full_document and returns the doc body", async () => {
    const db = createSearchDB();
    const id = insertDoc(db, {
      type: "graypaper_section",
      title: "Accumulate",
      content: "Full body of the accumulate section...",
    });
    const { client } = await connectClient(db);

    const result = await client.callTool({
      name: "get_full_document",
      arguments: { id },
    });

    expect(result.isError).toBeFalsy();
    const content = result.content as Array<{ type: string; text: string }>;
    const parsed = JSON.parse(content[0].text) as {
      id: string;
      content: string;
    };
    expect(parsed.id).toBe(id);
    expect(parsed.content).toContain("Full body of the accumulate section");
  });

  it("returns isError for get_full_document with an unknown id", async () => {
    const { client } = await connectClient();
    const result = await client.callTool({
      name: "get_full_document",
      arguments: { id: "does-not-exist" },
    });
    expect(result.isError).toBe(true);
  });
});
