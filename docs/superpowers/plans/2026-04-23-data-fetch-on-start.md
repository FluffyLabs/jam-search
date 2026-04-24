# Data Fetch-On-Start Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Backend fetches the latest `data/` directory from the repo at startup (configurable ref, default `main`), so new data only requires a container restart — not an image rebuild.

**Architecture:** On startup, if `DATA_REPO_URL` is set, shallow-clone that repo at `DATA_REF` with sparse checkout of `data/` only, atomically swap into `DATA_DIR`, then continue with `loadAllData`. If `DATA_REPO_URL` is unset (dev mode), skip the fetch and use `DATA_DIR` as-is. On any fetch failure, the process exits non-zero and Docker's restart policy retries.

**Tech Stack:** Node 25, TypeScript, zod, vitest, `node:child_process` `execFile`, `git` (installed in image via apt), Docker.

**Spec:** `docs/superpowers/specs/2026-04-23-data-fetch-on-start-design.md`

---

## File Structure

- **Create `backend/src/data/fetcher.ts`** — single `fetchData()` function that drives git + filesystem operations. Pure function of `{repoUrl, ref, dataDir, timeoutMs?}`; no env access, no logging beyond re-throwing with captured stderr.
- **Create `backend/src/__tests__/data/fetcher.test.ts`** — tests against a local bare git repo in a temp dir. No network.
- **Modify `backend/src/env.ts`** — add `DATA_REPO_URL` (optional URL) and `DATA_REF` (default `"main"`).
- **Modify `backend/src/index.ts`** — call `fetchData` before `loadAllData` when `DATA_REPO_URL` is set.
- **Create `.dockerignore`** — exclude `data/`, `node_modules/`, `.git/` from the build context.
- **Modify `Dockerfile`** — install git, set `DATA_REPO_URL` and `DATA_REF` defaults.

---

### Task 1: Env schema — add `DATA_REPO_URL` and `DATA_REF`

**Files:**
- Modify: `backend/src/env.ts`

- [ ] **Step 1: Update the env schema**

Replace the body of `envSchema` in `backend/src/env.ts` to add the two fields (keep all existing fields and the `superRefine`):

```ts
export const envSchema = z
  .object({
    OPENAI_API_KEY: z.string().default(""),
    GITHUB_TOKEN: z.string(),
    DISCORD_TOKEN: z.string(),
    DATA_DIR: z.string().default("./data"),
    CACHE_DIR: z.string().default("./cache"),
    PORT: z.coerce.number().default(3000),
    EMBEDDINGS_ENABLED: z
      .union([z.literal("true"), z.literal("false")])
      .default("true")
      .transform((v) => v === "true"),
    DATA_REPO_URL: z.string().url().optional(),
    DATA_REF: z.string().default("main"),
  })
  .superRefine((parsed, ctx) => {
    if (parsed.EMBEDDINGS_ENABLED && !parsed.OPENAI_API_KEY.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["OPENAI_API_KEY"],
        message: "OPENAI_API_KEY is required when EMBEDDINGS_ENABLED=true",
      });
    }
  });
```

- [ ] **Step 2: Typecheck**

Run: `npm run -w backend typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add backend/src/env.ts
git commit -m "feat(env): add DATA_REPO_URL and DATA_REF"
```

---

### Task 2: Fetcher — safety check on `dataDir`

**Files:**
- Create: `backend/src/data/fetcher.ts`
- Create: `backend/src/__tests__/data/fetcher.test.ts`

- [ ] **Step 1: Write the failing test**

Create `backend/src/__tests__/data/fetcher.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -w backend -- fetcher`
Expected: FAIL — `fetcher.js` does not exist.

- [ ] **Step 3: Create the fetcher with just the safety check**

Create `backend/src/data/fetcher.ts`:

```ts
import * as path from "node:path";

export interface FetchDataOptions {
  repoUrl: string;
  ref: string;
  dataDir: string;
  timeoutMs?: number;
}

function assertSafeDataDir(dataDir: string): string {
  if (!dataDir || dataDir.trim() === "") {
    throw new Error(
      `fetchData: refusing to operate on empty dataDir`
    );
  }
  const resolved = path.resolve(dataDir);
  const cwd = path.resolve(process.cwd());
  if (resolved === path.parse(resolved).root) {
    throw new Error(
      `fetchData: refusing to operate on filesystem root (${resolved})`
    );
  }
  if (resolved === cwd) {
    throw new Error(
      `fetchData: refusing to operate on current working directory (${resolved})`
    );
  }
  return resolved;
}

export async function fetchData(opts: FetchDataOptions): Promise<void> {
  assertSafeDataDir(opts.dataDir);
  throw new Error("fetchData: not implemented yet");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -w backend -- fetcher`
Expected: PASS (all four safety cases).

- [ ] **Step 5: Commit**

```bash
git add backend/src/data/fetcher.ts backend/src/__tests__/data/fetcher.test.ts
git commit -m "feat(fetcher): reject unsafe dataDir values"
```

---

### Task 3: Fetcher — happy path clone with sparse checkout

**Files:**
- Modify: `backend/src/data/fetcher.ts`
- Modify: `backend/src/__tests__/data/fetcher.test.ts`

**Test strategy:** Create a bare git repo in a temp dir containing a `data/` subtree with known files plus some non-data files, then point `fetchData` at it via `file://` URL. Assert `dataDir` ends up populated with only `data/`'s contents.

- [ ] **Step 1: Add a test helper for building a fixture repo**

Append to `backend/src/__tests__/data/fetcher.test.ts` (leave the existing `describe` block in place):

```ts
import { execFile } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import { promisify } from "node:util";

const exec = promisify(execFile);

async function makeFixtureRepo(opts: {
  dataFiles: Record<string, string>;
  nonDataFiles?: Record<string, string>;
  branch?: string;
}): Promise<{ bareUrl: string; sha: string; cleanup: () => void }> {
  const branch = opts.branch ?? "main";
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "fetcher-fixture-"));
  const workTree = path.join(tmpRoot, "work");
  const bare = path.join(tmpRoot, "bare.git");
  fs.mkdirSync(workTree, { recursive: true });

  for (const [rel, contents] of Object.entries(opts.dataFiles)) {
    const full = path.join(workTree, "data", rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, contents);
  }
  for (const [rel, contents] of Object.entries(opts.nonDataFiles ?? {})) {
    const full = path.join(workTree, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, contents);
  }

  const git = (args: string[], cwd: string) =>
    exec("git", args, {
      cwd,
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: "t",
        GIT_AUTHOR_EMAIL: "t@t",
        GIT_COMMITTER_NAME: "t",
        GIT_COMMITTER_EMAIL: "t@t",
      },
    });

  await git(["init", "-q", "-b", branch], workTree);
  await git(["add", "."], workTree);
  await git(["commit", "-q", "-m", "fixture"], workTree);
  const { stdout: shaOut } = await git(["rev-parse", "HEAD"], workTree);
  const sha = shaOut.trim();
  await git(["clone", "-q", "--bare", workTree, bare], tmpRoot);

  return {
    bareUrl: `file://${bare}`,
    sha,
    cleanup: () => fs.rmSync(tmpRoot, { recursive: true, force: true }),
  };
}
```

- [ ] **Step 2: Write the failing happy-path test**

Append a new `describe` block:

```ts
describe("fetchData — happy path", () => {
  it("clones only data/ from the given branch into dataDir", async () => {
    const fixture = await makeFixtureRepo({
      branch: "main",
      dataFiles: {
        "a.md": "hello",
        "sub/b.md": "world",
      },
      nonDataFiles: {
        "README.md": "should not appear",
        "src/code.ts": "should not appear",
      },
    });
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "fetcher-work-"));
    const dataDir = path.join(workDir, "data");
    try {
      await fetchData({
        repoUrl: fixture.bareUrl,
        ref: "main",
        dataDir,
      });
      expect(fs.readFileSync(path.join(dataDir, "a.md"), "utf-8")).toBe("hello");
      expect(fs.readFileSync(path.join(dataDir, "sub/b.md"), "utf-8")).toBe(
        "world"
      );
      expect(fs.existsSync(path.join(dataDir, "README.md"))).toBe(false);
      expect(fs.existsSync(path.join(dataDir, "src"))).toBe(false);
    } finally {
      fs.rmSync(workDir, { recursive: true, force: true });
      fixture.cleanup();
    }
  });

  it("works with a SHA ref", async () => {
    const fixture = await makeFixtureRepo({
      dataFiles: { "a.md": "hello" },
    });
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "fetcher-work-"));
    const dataDir = path.join(workDir, "data");
    try {
      await fetchData({
        repoUrl: fixture.bareUrl,
        ref: fixture.sha,
        dataDir,
      });
      expect(fs.readFileSync(path.join(dataDir, "a.md"), "utf-8")).toBe("hello");
    } finally {
      fs.rmSync(workDir, { recursive: true, force: true });
      fixture.cleanup();
    }
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -w backend -- fetcher`
Expected: FAIL with `fetchData: not implemented yet`.

- [ ] **Step 4: Implement the happy path**

Replace `backend/src/data/fetcher.ts` with:

```ts
import { execFile } from "node:child_process";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface FetchDataOptions {
  repoUrl: string;
  ref: string;
  dataDir: string;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 60_000;

function assertSafeDataDir(dataDir: string): string {
  if (!dataDir || dataDir.trim() === "") {
    throw new Error(`fetchData: refusing to operate on empty dataDir`);
  }
  const resolved = path.resolve(dataDir);
  const cwd = path.resolve(process.cwd());
  if (resolved === path.parse(resolved).root) {
    throw new Error(
      `fetchData: refusing to operate on filesystem root (${resolved})`
    );
  }
  if (resolved === cwd) {
    throw new Error(
      `fetchData: refusing to operate on current working directory (${resolved})`
    );
  }
  return resolved;
}

async function git(
  args: string[],
  cwd: string,
  timeoutMs: number
): Promise<void> {
  try {
    await execFileAsync("git", args, { cwd, timeout: timeoutMs });
  } catch (err) {
    const e = err as NodeJS.ErrnoException & {
      stderr?: string;
      stdout?: string;
    };
    const stderr = (e.stderr ?? "").toString().trim();
    throw new Error(
      `git ${args.join(" ")} failed in ${cwd}: ${stderr || e.message}`
    );
  }
}

export async function fetchData(opts: FetchDataOptions): Promise<void> {
  const resolvedDataDir = assertSafeDataDir(opts.dataDir);
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const parentDir = path.dirname(resolvedDataDir);
  await fsp.mkdir(parentDir, { recursive: true });
  const tmp = await fsp.mkdtemp(path.join(parentDir, ".data-fetch-"));

  try {
    await git(["init", "-q"], tmp, timeoutMs);
    await git(["remote", "add", "origin", opts.repoUrl], tmp, timeoutMs);
    await git(["sparse-checkout", "init", "--cone"], tmp, timeoutMs);
    await git(["sparse-checkout", "set", "data"], tmp, timeoutMs);
    await git(
      ["fetch", "--depth=1", "origin", opts.ref],
      tmp,
      timeoutMs
    );
    await git(["checkout", "-q", "FETCH_HEAD"], tmp, timeoutMs);

    const fetchedData = path.join(tmp, "data");
    if (!fs.existsSync(fetchedData)) {
      throw new Error(
        `fetchData: repo at ${opts.repoUrl}@${opts.ref} has no data/ directory`
      );
    }

    // Atomic swap
    const backup = `${resolvedDataDir}.old-${process.pid}`;
    const hadExisting = fs.existsSync(resolvedDataDir);
    if (hadExisting) {
      await fsp.rename(resolvedDataDir, backup);
    }
    try {
      await fsp.rename(fetchedData, resolvedDataDir);
    } catch (err) {
      if (hadExisting) {
        // Restore previous data on failure
        await fsp.rename(backup, resolvedDataDir).catch(() => {});
      }
      throw err;
    }
    if (hadExisting) {
      await fsp.rm(backup, { recursive: true, force: true });
    }
  } finally {
    await fsp.rm(tmp, { recursive: true, force: true });
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -w backend -- fetcher`
Expected: PASS — all safety + happy-path + SHA cases green.

- [ ] **Step 6: Commit**

```bash
git add backend/src/data/fetcher.ts backend/src/__tests__/data/fetcher.test.ts
git commit -m "feat(fetcher): sparse-clone data/ from remote ref"
```

---

### Task 4: Fetcher — replace existing `dataDir` cleanly

**Files:**
- Modify: `backend/src/__tests__/data/fetcher.test.ts`

Verifies the atomic swap doesn't merge old + new contents.

- [ ] **Step 1: Write the failing test**

Append to the `describe("fetchData — happy path"` block in the test file:

```ts
  it("replaces existing dataDir contents rather than merging", async () => {
    const fixture = await makeFixtureRepo({
      dataFiles: { "new.md": "new" },
    });
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "fetcher-work-"));
    const dataDir = path.join(workDir, "data");
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, "stale.md"), "stale");
    try {
      await fetchData({
        repoUrl: fixture.bareUrl,
        ref: "main",
        dataDir,
      });
      expect(fs.existsSync(path.join(dataDir, "new.md"))).toBe(true);
      expect(fs.existsSync(path.join(dataDir, "stale.md"))).toBe(false);
    } finally {
      fs.rmSync(workDir, { recursive: true, force: true });
      fixture.cleanup();
    }
  });
```

- [ ] **Step 2: Run the test to verify it passes**

The existing implementation already handles this via the atomic swap, so the test should pass on first run.

Run: `npm test -w backend -- fetcher`
Expected: PASS (the new test, plus everything from Task 3).

If it fails, fix the implementation before continuing — likely the `backup` → `rename` → `rm` sequence has a bug.

- [ ] **Step 3: Commit**

```bash
git add backend/src/__tests__/data/fetcher.test.ts
git commit -m "test(fetcher): verify existing dataDir is replaced, not merged"
```

---

### Task 5: Fetcher — error on missing ref

**Files:**
- Modify: `backend/src/__tests__/data/fetcher.test.ts`

- [ ] **Step 1: Write the failing test**

Append a new `describe` block to the test file:

```ts
describe("fetchData — errors", () => {
  it("throws with git stderr when the ref does not exist", async () => {
    const fixture = await makeFixtureRepo({
      dataFiles: { "a.md": "hello" },
    });
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "fetcher-work-"));
    const dataDir = path.join(workDir, "data");
    try {
      await expect(
        fetchData({
          repoUrl: fixture.bareUrl,
          ref: "does-not-exist",
          dataDir,
        })
      ).rejects.toThrow(/git fetch/i);
      // Existing dataDir absence confirmed — nothing got created
      expect(fs.existsSync(dataDir)).toBe(false);
    } finally {
      fs.rmSync(workDir, { recursive: true, force: true });
      fixture.cleanup();
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it passes**

Run: `npm test -w backend -- fetcher`
Expected: PASS. The implementation already throws with git's stderr via the `git()` helper.

If it fails because git's error message differs, inspect the error and relax the regex or tighten the implementation.

- [ ] **Step 3: Commit**

```bash
git add backend/src/__tests__/data/fetcher.test.ts
git commit -m "test(fetcher): surface git stderr on missing ref"
```

---

### Task 6: Wire fetcher into startup

**Files:**
- Modify: `backend/src/index.ts`

- [ ] **Step 1: Update `main()` to call `fetchData` when `DATA_REPO_URL` is set**

Replace the relevant section of `backend/src/index.ts`. Add the import at the top:

```ts
import { fetchData } from "./data/fetcher.js";
```

And update `main()`:

```ts
async function main() {
  const {
    DATA_DIR: dataDir,
    CACHE_DIR: cacheDir,
    OPENAI_API_KEY: openaiApiKey,
    EMBEDDINGS_ENABLED: embeddingsEnabled,
    DATA_REPO_URL: dataRepoUrl,
    DATA_REF: dataRef,
  } = env;

  if (!embeddingsEnabled) {
    printEmbeddingsDisabledWarning();
  }

  if (dataRepoUrl) {
    console.log(`Fetching data from ${dataRepoUrl}@${dataRef}...`);
    await fetchData({ repoUrl: dataRepoUrl, ref: dataRef, dataDir });
    console.log("Fetched data.");
  } else {
    console.log(
      "DATA_REPO_URL not set; using local DATA_DIR as-is (dev mode)."
    );
  }

  // Create and populate the in-memory search index
  console.log("Initializing search index...");
  const db = createSearchDB();
  await loadAllData(db, dataDir, cacheDir, openaiApiKey, embeddingsEnabled);
  // ...rest unchanged
```

Keep the rest of `main()` (server start, shutdown handling) unchanged. The top-level `main().catch(...)` already exits non-zero on throw.

- [ ] **Step 2: Typecheck**

Run: `npm run -w backend typecheck`
Expected: no errors.

- [ ] **Step 3: Run existing test suite**

Run: `npm test -w backend`
Expected: all tests pass — the change is in `main()` only, which isn't covered by tests.

- [ ] **Step 4: Smoke test locally (no DATA_REPO_URL)**

Start the backend in dev mode with no `DATA_REPO_URL`:

Run: `cd backend && npx tsx ./src/index.ts`
Expected: logs `"DATA_REPO_URL not set; using local DATA_DIR as-is (dev mode)."` and starts the HTTP server on port 3000, indexing the local `data/` dir as before.

Stop it with Ctrl-C.

- [ ] **Step 5: Commit**

```bash
git add backend/src/index.ts
git commit -m "feat(backend): fetch data on start when DATA_REPO_URL is set"
```

---

### Task 7: Add `.dockerignore`

**Files:**
- Create: `.dockerignore`

- [ ] **Step 1: Create the file**

Create `.dockerignore` at the repo root:

```
data/
node_modules/
.git/
```

- [ ] **Step 2: Commit**

```bash
git add .dockerignore
git commit -m "chore: exclude data/, node_modules/, .git/ from Docker build context"
```

---

### Task 8: Update Dockerfile — install git, set defaults

**Files:**
- Modify: `Dockerfile`

- [ ] **Step 1: Update the Dockerfile**

Replace `Dockerfile` with:

```dockerfile
FROM node:25-slim

WORKDIR /app

EXPOSE 3000

# git is required for on-start data fetching (see backend/src/data/fetcher.ts).
RUN apt-get update \
  && apt-get install -y --no-install-recommends git \
  && rm -rf /var/lib/apt/lists/*

# Copy all source files and install dependencies
# NOTE because of workspace we don't optimize this step
COPY . .
RUN npm ci

# Build TypeScript
RUN npm run build

# Embeddings cache volume — mount persistent storage here
# to avoid regenerating embeddings on every restart.
# Example: docker run -v embeddings-cache:/app/cache ...
ENV CACHE_DIR=/app/cache
VOLUME /app/cache

# Fetch data on start from the repo. Override DATA_REF to pin to a specific
# commit; leave DATA_REPO_URL empty to serve whatever's at /app/data (not
# recommended for prod — the image no longer bundles data/).
ENV DATA_REPO_URL=https://github.com/FluffyLabs/jam-search.git
ENV DATA_REF=main

CMD ["npm", "start", "-w", "backend"]
```

- [ ] **Step 2: Build the image locally**

Run: `docker build -t jam-search:fetch-test .`
Expected: build succeeds. No `data/` inside the image (verify in next step).

- [ ] **Step 3: Verify `data/` is absent from the image**

Run: `docker run --rm jam-search:fetch-test ls /app`
Expected: output includes `backend`, `client`, `shared`, `package.json`, etc., but NOT `data`.

Run: `docker run --rm jam-search:fetch-test ls /app/data 2>&1 || true`
Expected: `ls: cannot access '/app/data': No such file or directory`.

- [ ] **Step 4: Smoke test the container end-to-end**

Set up the required secrets (use real values or dummies — OPENAI only matters if `EMBEDDINGS_ENABLED=true`):

Run:
```bash
docker run --rm \
  -e GITHUB_TOKEN=x \
  -e DISCORD_TOKEN=x \
  -e EMBEDDINGS_ENABLED=false \
  -p 3000:3000 \
  jam-search:fetch-test
```

Expected: logs include
```
Fetching data from https://github.com/FluffyLabs/jam-search.git@main...
Fetched data.
Initializing search index...
Loading data from ./data...
Found <N> markdown files
```
Server should start on port 3000.

In another terminal: `curl -s http://localhost:3000/api/health` — expect a 200.

Stop with Ctrl-C.

- [ ] **Step 5: Commit**

```bash
git add Dockerfile
git commit -m "build(docker): install git, configure DATA_REPO_URL defaults"
```

---

## Verification checklist (run before opening PR)

- [ ] `npm run -w backend typecheck` — passes
- [ ] `npm test -w backend` — passes
- [ ] `docker build -t jam-search:verify .` — succeeds
- [ ] Image does NOT contain `data/` (verified via `docker run ... ls /app`)
- [ ] Running the container with default env fetches from GitHub, populates `/app/data`, and serves requests
- [ ] Running locally (`npm run dev -w backend`) without `DATA_REPO_URL` still works against the checked-out `data/`
- [ ] Running the container with a bogus `DATA_REF` causes the container to exit non-zero (not hang, not succeed)
