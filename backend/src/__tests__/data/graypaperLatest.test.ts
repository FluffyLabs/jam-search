import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getGraypaperLatest,
  resetGraypaperLatestCache,
} from "../../data/graypaperLatest.js";
import { writeGraypaperVersions } from "../../data/writer.js";

function makeTmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "graypaper-latest-"));
}

describe("getGraypaperLatest", () => {
  let dataDir: string;

  beforeEach(() => {
    resetGraypaperLatestCache();
    dataDir = makeTmpDir();
  });

  afterEach(() => {
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it("returns the persisted latest hash and version", () => {
    writeGraypaperVersions(
      dataDir,
      [{ version: "0.7.2", timestamp: new Date("2025-09-15") }],
      { hash: "ab2cdbd5b070ba2176e8dd830b06401ce05a954d", version: "0.7.2" }
    );

    expect(getGraypaperLatest(dataDir)).toEqual({
      hash: "ab2cdbd5b070ba2176e8dd830b06401ce05a954d",
      version: "0.7.2",
    });
  });

  it("returns nulls when versions.md is absent", () => {
    expect(getGraypaperLatest(dataDir)).toEqual({ hash: null, version: null });
  });

  it("invalidates cache when versions.md mtime changes", () => {
    writeGraypaperVersions(
      dataDir,
      [{ version: "0.7.2", timestamp: new Date("2025-09-15") }],
      { hash: "aaaaaaaaaaaa", version: "0.7.2" }
    );
    expect(getGraypaperLatest(dataDir).hash).toBe("aaaaaaaaaaaa");

    // Out-of-process update: rewrite versions.md with a newer mtime.
    const versionsPath = path.join(dataDir, "graypaper", "versions.md");
    const futureMs = fs.statSync(versionsPath).mtimeMs + 5_000;
    writeGraypaperVersions(
      dataDir,
      [{ version: "0.8.0", timestamp: new Date("2025-12-01") }],
      { hash: "bbbbbbbbbbbb", version: "0.8.0" }
    );
    fs.utimesSync(versionsPath, futureMs / 1000, futureMs / 1000);

    expect(getGraypaperLatest(dataDir)).toEqual({
      hash: "bbbbbbbbbbbb",
      version: "0.8.0",
    });
  });
});

describe("writeGraypaperVersions latest semantics", () => {
  let dataDir: string;

  beforeEach(() => {
    resetGraypaperLatestCache();
    dataDir = makeTmpDir();
  });

  afterEach(() => {
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it("preserves existing latest when called without the latest arg", () => {
    writeGraypaperVersions(
      dataDir,
      [{ version: "0.7.2", timestamp: new Date("2025-09-15") }],
      { hash: "preserved-hash", version: "0.7.2" }
    );

    // Re-write WITHOUT passing latest (simulates exportToMarkdown).
    writeGraypaperVersions(dataDir, [
      { version: "0.7.2", timestamp: new Date("2025-09-15") },
    ]);

    resetGraypaperLatestCache();
    expect(getGraypaperLatest(dataDir)).toEqual({
      hash: "preserved-hash",
      version: "0.7.2",
    });
  });

  it("clears the pin when called with latest=null", () => {
    writeGraypaperVersions(
      dataDir,
      [{ version: "0.7.2", timestamp: new Date("2025-09-15") }],
      { hash: "to-be-cleared", version: "0.7.2" }
    );

    writeGraypaperVersions(
      dataDir,
      [{ version: "0.7.2", timestamp: new Date("2025-09-15") }],
      null
    );

    resetGraypaperLatestCache();
    expect(getGraypaperLatest(dataDir)).toEqual({ hash: null, version: null });
  });
});
