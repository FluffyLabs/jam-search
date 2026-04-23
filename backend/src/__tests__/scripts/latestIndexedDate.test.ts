import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { findLatestIndexedDate } from "../../scripts/latestIndexedDate.js";

describe("findLatestIndexedDate", () => {
  let dataDir: string;

  beforeEach(() => {
    dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "latest-indexed-"));
  });

  afterEach(() => {
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  function writeFile(relPath: string) {
    const full = path.join(dataDir, relPath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, "");
  }

  it("returns null when the matrix folder does not exist", () => {
    expect(findLatestIndexedDate(dataDir, "#graypaper:polkadot.io")).toBeNull();
  });

  it("returns null when the room folder is missing", () => {
    fs.mkdirSync(path.join(dataDir, "matrix"), { recursive: true });
    expect(findLatestIndexedDate(dataDir, "#graypaper:polkadot.io")).toBeNull();
  });

  it("returns null when the room folder is empty", () => {
    fs.mkdirSync(path.join(dataDir, "matrix", "graypaper-polkadot-io"), {
      recursive: true,
    });
    expect(findLatestIndexedDate(dataDir, "#graypaper:polkadot.io")).toBeNull();
  });

  it("returns null when the folder only contains non-matching filenames", () => {
    writeFile("matrix/graypaper-polkadot-io/README.md");
    writeFile("matrix/graypaper-polkadot-io/2024-13-01.md");
    writeFile("matrix/graypaper-polkadot-io/2024-1-1.md");
    writeFile("matrix/graypaper-polkadot-io/notes.txt");
    expect(findLatestIndexedDate(dataDir, "#graypaper:polkadot.io")).toBeNull();
  });

  it("returns the lexicographic max of matching filenames", () => {
    writeFile("matrix/graypaper-polkadot-io/2024-04-17.md");
    writeFile("matrix/graypaper-polkadot-io/2025-12-30.md");
    writeFile("matrix/graypaper-polkadot-io/2026-03-26.md");
    writeFile("matrix/graypaper-polkadot-io/2026-01-12.md");
    expect(findLatestIndexedDate(dataDir, "#graypaper:polkadot.io")).toBe(
      "2026-03-26"
    );
  });

  it("ignores non-matching filenames mixed in with valid ones", () => {
    writeFile("matrix/graypaper-polkadot-io/2026-03-26.md");
    writeFile("matrix/graypaper-polkadot-io/README.md");
    writeFile("matrix/graypaper-polkadot-io/2026-13-99.md");
    writeFile("matrix/graypaper-polkadot-io/2026-03-27.txt");
    expect(findLatestIndexedDate(dataDir, "#graypaper:polkadot.io")).toBe(
      "2026-03-26"
    );
  });

  it("resolves the folder using the same slugify rules as the writer", () => {
    writeFile("matrix/jam-conformance-matrix-org/2026-03-25.md");
    expect(findLatestIndexedDate(dataDir, "#jam-conformance:matrix.org")).toBe(
      "2026-03-25"
    );
  });
});
