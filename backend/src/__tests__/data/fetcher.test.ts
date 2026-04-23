import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { fetchData } from "../../data/fetcher.js";

describe("fetchData — safety", () => {
  it("refuses dataDir that resolves to '/'", async () => {
    await expect(
      fetchData({
        repoUrl: "https://example.invalid/repo.git",
        ref: "main",
        dataDir: "/",
      })
    ).rejects.toThrow(/refusing to operate on/i);
  });

  it("refuses dataDir that resolves to the cwd", async () => {
    await expect(
      fetchData({
        repoUrl: "https://example.invalid/repo.git",
        ref: "main",
        dataDir: process.cwd(),
      })
    ).rejects.toThrow(/refusing to operate on/i);
  });

  it("refuses dataDir that resolves to cwd via '.'", async () => {
    await expect(
      fetchData({
        repoUrl: "https://example.invalid/repo.git",
        ref: "main",
        dataDir: ".",
      })
    ).rejects.toThrow(/refusing to operate on/i);
  });

  it("refuses an empty dataDir", async () => {
    await expect(
      fetchData({
        repoUrl: "https://example.invalid/repo.git",
        ref: "main",
        dataDir: "",
      })
    ).rejects.toThrow(/refusing to operate on/i);
  });
});
