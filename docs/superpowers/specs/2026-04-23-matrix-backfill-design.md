# Matrix job: backfill missing days

## Problem

`backend/src/jobs/matrixJob.ts` fetches only yesterday's messages on each daily
run. If a run fails — as has been the case recently (latest indexed day is
`2026-03-26`, today is `2026-04-23`) — those days are never recovered. The job
should be self-healing: each run should fill in every day that was missed since
the last successful index.

## Constraints

- `fetchArchivedMessages` already downloads the full archive HTML in a single
  HTTP request and filters client-side, so widening the date window has
  near-zero marginal cost.
- `writeMatrixDayFile` merges and dedupes by `messageId`, so re-running the
  same day is idempotent.
- Day files are stored at `data/matrix/<slugify(roomName)>/YYYY-MM-DD.md`.
  A file exists for a day only if that day had at least one message, so file
  presence is not a reliable "day is fully indexed" signal — a file's absence
  can mean either "we never indexed" or "zero messages that day". We need to
  pick a watermark strategy that tolerates this.

## Design

### Watermark strategy: per-room, derived from existing data

For each room, find the most recent `YYYY-MM-DD.md` file in the room's folder
and use that date as the `fromDate`. No new persistent state — the watermark
is derived from data already in the repository.

Re-fetching the watermark day on every run (rather than `watermark + 1`) is
deliberate: it's cheap (see constraints), idempotent (dedup by `messageId`),
and self-corrects if the previous run wrote the day partially.

### New helper

File: `backend/src/scripts/latestIndexedDate.ts`

```ts
findLatestIndexedDate(dataDir: string, roomName: string): string | null
```

- Resolves the folder via the same `slugify(roomName)` used by the writer.
- Returns the lexicographic max of filenames matching `^\d{4}-\d{2}-\d{2}\.md$`
  (ISO dates sort correctly as strings), stripped of the `.md` suffix.
- Returns `null` if the folder is missing or contains no matching files.

Kept separate from `data/writer.ts` so that file stays focused on writing.

### Job logic

`backend/src/jobs/matrixJob.ts`:

```
toDate = yesterday
for each room in ROOMS:
  latest   = findLatestIndexedDate(DATA_DIR, room.name)
  fromDate = latest ?? <fallback: 30 days before yesterday>
  if fromDate > toDate: continue
  log("backfilling <room>: <fromDate>..<toDate>")
  fillArchivedMessages(DATA_DIR, [room], fromDate, toDate)
```

- **Fallback window for empty folders: 30 days before yesterday.** Balances
  "self-healing for reasonable outages" against "no surprise mass-index on a
  new/empty room". A `1970-01-01` fallback would re-scan the archive's full
  history whenever a folder is missing; explicit bound is safer.
- `fillArchivedMessages` is called once per room with a room-specific window;
  its existing signature (`rooms: Room[]`) is reused by passing a single-room
  array. No refactor of the helper is needed.
- Per-room window is logged so CI output makes gaps/backfills obvious.

### Explicitly out of scope (YAGNI)

- No separate state file or frontmatter field for the watermark.
- No special handling for "genuinely zero-message days" — they remain
  file-less and get harmlessly re-scanned on every run. The cost is bounded
  because the archive fetch is a single HTTP request regardless of window.
- No configurable maximum backfill window — the default is fine unless rooms
  grow substantially.
- No change to the GitHub Actions cron schedule.

## Testing

- Unit test `findLatestIndexedDate` against a tmp directory covering:
  - missing folder
  - empty folder
  - folder with only non-matching filenames
  - folder with multiple `YYYY-MM-DD.md` files (verify max)
  - folder with a mix of matching and non-matching filenames
- Verify the matrix job's per-room window logging manually with a dry run
  that skips the HTTP fetch, if one can be wired up cheaply; otherwise rely
  on the unit test above plus a one-shot local execution against real data.
