# Fetch data on start — design

## Problem

The backend Docker image bakes `data/` in via `COPY . .`. Whenever the index
jobs commit fresh data, the image must be rebuilt and redeployed to pick it up.
We want restarts (not rebuilds) to be enough.

## Goal

On container start, the backend fetches the latest `data/` directory from
`FluffyLabs/jam-search` at a configurable ref, then proceeds with normal
indexing. Restart = new data. No image rebuild required.

## Non-goals

- In-process hot reload (no file watcher, no admin endpoint, no SIGHUP).
- Periodic resync while running.
- Serving stale data if the fetch fails.
- Decoupling the data repo from the code repo (data stays in this repo; index
  jobs continue to commit to `main`).

## Approach

On startup, before `loadAllData`, the backend:

1. If `DATA_REPO_URL` is unset → skip fetch, use `DATA_DIR` as-is. This is the
   local dev path.
2. If `DATA_REPO_URL` is set → shallow-clone that repo at `DATA_REF` (default
   `main`) with sparse checkout restricted to `data/`, replacing whatever is at
   `DATA_DIR`. On any failure, log the error and exit non-zero so Docker's
   restart policy retries.

Embeddings cache (`CACHE_DIR`) is unaffected — it's keyed by content, so
unchanged docs reuse cached embeddings and only new/changed docs hit OpenAI.

## Components

### Env (`backend/src/env.ts`)

Add two optional fields:

- `DATA_REPO_URL: z.string().url().optional()` — if set, fetch on start.
- `DATA_REF: z.string().default("main")` — branch, tag, or SHA to check out.

### Fetcher (`backend/src/data/fetcher.ts`, new)

One exported function:

```ts
export async function fetchData(opts: {
  repoUrl: string;
  ref: string;
  dataDir: string;
}): Promise<void>;
```

Behaviour:

1. Safety check: refuse to run if `dataDir` resolves to `/`, `.`, or the
   process cwd. Throw with a clear message. Prevents a misconfigured
   `DATA_DIR` from wiping the repo or the container root.
2. Create a temp dir via `fs.mkdtemp` (sibling of `dataDir` so the final move
   is a same-filesystem rename).
3. Initialize a sparse shallow clone of just `data/`, working uniformly for
   branches, tags, and SHAs:
   ```
   git -C <tmp> init -q
   git -C <tmp> remote add origin <url>
   git -C <tmp> sparse-checkout init --cone
   git -C <tmp> sparse-checkout set data
   git -C <tmp> fetch --depth=1 origin <ref>
   git -C <tmp> checkout FETCH_HEAD
   ```
4. Atomically swap: `fs.rename(dataDir, dataDir + ".old")` if it exists,
   `fs.rename(<tmp>/data, dataDir)`, then `fs.rm(dataDir + ".old")`. This
   keeps the old data on disk until the new data is in place, so a crash
   mid-swap leaves a recoverable state.
5. Remove `<tmp>`.
6. Any subprocess non-zero exit or filesystem error → throw with the captured
   stderr.

Subprocesses: use `node:child_process` `execFile` with a timeout
(`DATA_FETCH_TIMEOUT_MS`, default 60_000) and no shell. Log stdout/stderr from
git so network failures are diagnosable.

### Startup wiring (`backend/src/index.ts`)

Just before `await loadAllData(...)`:

```ts
if (env.DATA_REPO_URL) {
  await fetchData({
    repoUrl: env.DATA_REPO_URL,
    ref: env.DATA_REF,
    dataDir,
  });
}
```

The `main().catch(...)` at the bottom already exits non-zero on throw, which
gives us the "crash fast" behaviour without extra code.

### Dockerfile

- Install git: `RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*`.
- Set defaults: `ENV DATA_REPO_URL=https://github.com/FluffyLabs/jam-search.git` and `ENV DATA_REF=main`.
- `data/` is excluded from the build context via `.dockerignore` (see below),
  so no Dockerfile change is needed to stop copying it.

### `.dockerignore` (new)

```
data/
node_modules/
.git/
```

`node_modules/` and `.git/` aren't strictly required for this feature but
belong in `.dockerignore` for a slim build context. If you'd rather keep this
PR minimal, we can stop at just `data/`.

## Failure modes

| Scenario | Outcome |
|---|---|
| `DATA_REPO_URL` unset | Skip fetch, use local `DATA_DIR`. Dev path. |
| Clone succeeds, ref missing | git exits non-zero → throw → process exits 1 → Docker restarts. |
| Clone succeeds, `data/` missing in repo | Sparse-checkout produces empty dir; `loadAllData` logs `Found 0 markdown files`. Treated as successful fetch. (Acceptable — means someone removed `data/` on purpose.) |
| Network failure / GitHub outage | `execFile` returns non-zero (or times out) → throw → exit 1 → Docker restarts. |
| Clone timeout exceeded | `execFile` kills the process → throw → exit 1. |
| Disk full during move | throw → exit 1. Container will loop-restart until disk is freed. |

## Testing

- Unit test `fetchData` against a local bare git repo set up in a temp dir
  (use `git init --bare` + a commit with a `data/` subtree). Cases:
    - happy path (branch ref) clones and populates `dataDir`
    - SHA ref works via the same `fetch <ref>` path
    - existing `dataDir` is replaced, not merged (stale files from the old
      `data/` must not leak into the new one)
    - missing ref → throws with git's stderr
    - timeout → throws
    - `dataDir` resolving to `/` or cwd → throws before touching anything
- No integration test against the real GitHub URL; fetcher is a pure function
  of (git CLI, filesystem, url).
- `loadAllData` and the rest of the pipeline stay untouched, so their existing
  tests cover post-fetch behaviour.

## Out of scope / follow-ups

- Admin endpoint to trigger a re-fetch without restart.
- Persisting `data/` across restarts as a cache.
- Verifying a pinned commit signature.
- Migrating `data/` to a separate repo.
