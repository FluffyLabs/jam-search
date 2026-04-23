# Matrix Job Backfill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `matrixJob.ts` self-healing by backfilling every day between each room's latest indexed day and yesterday, instead of fetching only yesterday.

**Architecture:** Add a small helper that finds the latest `YYYY-MM-DD.md` file in a room's data folder. The job calls it per room, derives a `fromDate` (falling back to 30 days before yesterday if the folder is empty), and calls the existing `fillArchivedMessages` once per room with a room-specific window. Writer-level deduplication makes re-fetching the watermark day safe.

**Tech Stack:** TypeScript (Node, ESM), `date-fns`, `vitest`, `node:fs`, `node:path`. The existing `slugify` from `backend/src/data/writer.ts` maps room names to folder names.

**Spec:** `docs/superpowers/specs/2026-04-23-matrix-backfill-design.md`

---

## File Structure

- **Create** `backend/src/scripts/latestIndexedDate.ts` — exports `findLatestIndexedDate(dataDir, roomName)`. Kept separate from `data/writer.ts` so that file stays focused on writing.
- **Create** `backend/src/__tests__/scripts/latestIndexedDate.test.ts` — unit tests using `vitest` and temporary directories via `node:fs`/`node:os`.
- **Modify** `backend/src/jobs/matrixJob.ts` — replace single-day window with per-room watermark + fallback logic.

Note: `backend/src/scripts/fillArchivedMessages.ts` is **not** modified — its existing `rooms: Room[]` signature is reused by passing a single-element array per call.

---

## Task 1: Add `findLatestIndexedDate` helper (TDD)

**Files:**
- Create: `backend/src/scripts/latestIndexedDate.ts`
- Test: `backend/src/__tests__/scripts/latestIndexedDate.test.ts`

### - [ ] Step 1: Write the failing tests

Create `backend/src/__tests__/scripts/latestIndexedDate.test.ts`:

```ts
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
    // "#jam-conformance:matrix.org" -> "jam-conformance-matrix-org"
    writeFile("matrix/jam-conformance-matrix-org/2026-03-25.md");
    expect(
      findLatestIndexedDate(dataDir, "#jam-conformance:matrix.org")
    ).toBe("2026-03-25");
  });
});
```

### - [ ] Step 2: Run tests to verify they fail

Run: `npm --prefix backend test -- latestIndexedDate`
Expected: FAIL — module `../../scripts/latestIndexedDate.js` cannot be resolved.

### - [ ] Step 3: Implement the helper

Create `backend/src/scripts/latestIndexedDate.ts`:

```ts
import * as fs from "node:fs";
import * as path from "node:path";
import { slugify } from "../data/writer.js";

const DATE_FILENAME_RE = /^(\d{4}-\d{2}-\d{2})\.md$/;

/**
 * Returns the most recent YYYY-MM-DD of an existing matrix day-file for the
 * given room, or null if none exists. ISO dates sort correctly as strings,
 * so a lexicographic max works.
 */
export function findLatestIndexedDate(
  dataDir: string,
  roomName: string
): string | null {
  const dir = path.join(dataDir, "matrix", slugify(roomName));
  if (!fs.existsSync(dir)) {
    return null;
  }

  let latest: string | null = null;
  for (const entry of fs.readdirSync(dir)) {
    const match = DATE_FILENAME_RE.exec(entry);
    if (!match) continue;
    const date = match[1];
    if (latest === null || date > latest) {
      latest = date;
    }
  }
  return latest;
}
```

### - [ ] Step 4: Run tests to verify they pass

Run: `npm --prefix backend test -- latestIndexedDate`
Expected: PASS (7 tests).

### - [ ] Step 5: Run typecheck

Run: `npm --prefix backend run typecheck`
Expected: no errors.

### - [ ] Step 6: Commit

```bash
git add backend/src/scripts/latestIndexedDate.ts \
        backend/src/__tests__/scripts/latestIndexedDate.test.ts
git commit -m "feat(matrix): add findLatestIndexedDate helper"
```

---

## Task 2: Wire watermark + fallback into `matrixJob.ts`

**Files:**
- Modify: `backend/src/jobs/matrixJob.ts` (full rewrite of `main()`; current file is 33 lines)

### - [ ] Step 1: Replace the job logic

Overwrite `backend/src/jobs/matrixJob.ts` with:

```ts
import { format, subDays } from "date-fns";
import * as matrix from "../../../shared/matrix.js";
import { fillArchivedMessages } from "../scripts/fillArchivedMessages.js";
import { findLatestIndexedDate } from "../scripts/latestIndexedDate.js";

const DATA_DIR = process.env.DATA_DIR || "./data";
// Fallback backfill window when a room has no indexed days yet. Bounds the
// work done for new/empty rooms; self-healing for outages up to ~a month.
const FALLBACK_BACKFILL_DAYS = 30;

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in matrix job:", error);
  process.exit(1);
}

async function main() {
  console.log("Running matrix message fetch job at", new Date().toISOString());

  const yesterday = subDays(new Date(), 1);
  const toDate = format(yesterday, "yyyy-MM-dd");
  const fallbackFrom = format(
    subDays(yesterday, FALLBACK_BACKFILL_DAYS),
    "yyyy-MM-dd"
  );

  const errors: unknown[] = [];
  for (const room of matrix.ROOMS) {
    const latest = findLatestIndexedDate(DATA_DIR, room.name);
    const fromDate = latest ?? fallbackFrom;

    if (fromDate > toDate) {
      console.log(
        `Skipping ${room.name}: latest indexed day ${fromDate} is after ${toDate}`
      );
      continue;
    }

    console.log(
      `Backfilling ${room.name}: ${fromDate}..${toDate}` +
        (latest ? ` (watermark)` : ` (fallback, no prior data)`)
    );

    try {
      await fillArchivedMessages(DATA_DIR, [room], fromDate, toDate);
    } catch (error) {
      console.error(`Error backfilling ${room.name}:`, error);
      errors.push(error);
    }
  }

  if (errors.length) {
    throw new AggregateError(
      errors,
      `Matrix backfill failed for ${errors.length} room(s)`
    );
  }

  console.log("Message fetch job completed successfully");
}
```

**Why this shape:**
- Loops rooms at the job level so each gets its own window (existing `fillArchivedMessages` loop still runs, but with a single-element array).
- Catches per-room failures so one broken room doesn't abort the others, then re-raises via `AggregateError` so CI still fails. This matches the existing `fillArchivedMessages` error aggregation style.
- Removed the inner `try/catch` that previously swallowed errors and returned exit code 0 — a silent failure was part of why data fell behind.

### - [ ] Step 2: Run typecheck

Run: `npm --prefix backend run typecheck`
Expected: no errors.

### - [ ] Step 3: Run the full backend test suite

Run: `npm --prefix backend test`
Expected: all tests pass (including the new `latestIndexedDate` tests).

### - [ ] Step 4: Smoke-test the job locally (network required)

Run from repo root:

```bash
DATA_DIR=$(pwd)/data npm exec tsx -w backend -- ./src/jobs/matrixJob.ts
```

Expected log output includes, for each room, a line like:
`Backfilling #graypaper:polkadot.io: 2026-03-26..2026-04-22 (watermark)`
and the job exits 0. Verify with `git status` that new `data/matrix/<slug>/YYYY-MM-DD.md` files appeared for previously-missing days (where messages existed).

If network access is unavailable in the execution environment, document this in the task completion note and skip — the unit tests plus typecheck cover the logic.

### - [ ] Step 5: Commit

```bash
git add backend/src/jobs/matrixJob.ts
git commit -m "fix(matrix): backfill every missing day, not just yesterday"
```

### - [ ] Step 6: Commit any newly backfilled data (optional, only if Step 4 ran)

If the smoke test fetched new day-files, commit them separately so the code change and data change are reviewable independently:

```bash
git add data/matrix
git commit -m "index: backfill missing matrix messages"
```

If no new files appeared (e.g., genuinely zero messages in the gap), skip this step.

---

## Out of scope (explicit non-goals from spec)

- No new state file or frontmatter watermark.
- No special casing for zero-message days.
- No configurable max-backfill knob beyond the `FALLBACK_BACKFILL_DAYS` constant.
- No change to `.github/workflows/index-matrix.yml` (cron stays the same).
- No change to `fillArchivedMessages.ts`.
