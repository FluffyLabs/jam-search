import { execFile } from "node:child_process";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
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

  // Stage everything *inside* resolvedDataDir so all rename(2) calls stay on
  // the same filesystem. Required when resolvedDataDir is a mount point
  // (Docker volume / bind mount): the mount itself can't be renamed, and
  // crossing the mount boundary fails with EXDEV.
  const parentDir = path.dirname(resolvedDataDir);
  await fsp.mkdir(parentDir, { recursive: true });
  let createdDataDir = false;
  try {
    await fsp.mkdir(resolvedDataDir);
    createdDataDir = true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
  }
  const tmp = await fsp.mkdtemp(path.join(resolvedDataDir, ".data-fetch-"));
  let succeeded = false;

  try {
    await git(["init", "-q"], tmp, timeoutMs);
    await git(["remote", "add", "origin", opts.repoUrl], tmp, timeoutMs);
    await git(["sparse-checkout", "init", "--cone"], tmp, timeoutMs);
    await git(["sparse-checkout", "set", "data"], tmp, timeoutMs);
    await git(["fetch", "--depth=1", "origin", opts.ref], tmp, timeoutMs);
    await git(["checkout", "-q", "FETCH_HEAD"], tmp, timeoutMs);

    const fetchedData = path.join(tmp, "data");
    if (!fs.existsSync(fetchedData)) {
      throw new Error(
        `fetchData: repo at ${opts.repoUrl}@${opts.ref} has no data/ directory`
      );
    }

    await swapDirContents(resolvedDataDir, fetchedData, path.basename(tmp));
    succeeded = true;
  } finally {
    await fsp.rm(tmp, { recursive: true, force: true });
    if (!succeeded && createdDataDir) {
      await fsp.rmdir(resolvedDataDir).catch(() => {});
    }
  }
}

// Replace the top-level entries of `target` with the top-level entries of
// `source`. Operates only on `target`'s children — never on `target` itself —
// so it works when `target` is a mount point. `excludeFromTarget` is the
// basename of an entry in `target` that must be left in place (the staging
// dir holding the new data).
async function swapDirContents(
  target: string,
  source: string,
  excludeFromTarget: string
): Promise<void> {
  const backupDir = await fsp.mkdtemp(path.join(target, ".data-backup-"));
  const backupName = path.basename(backupDir);
  try {
    const existing = (await fsp.readdir(target)).filter(
      (e) => e !== excludeFromTarget && e !== backupName
    );
    for (const entry of existing) {
      await fsp.rename(path.join(target, entry), path.join(backupDir, entry));
    }
    try {
      const newEntries = await fsp.readdir(source);
      for (const entry of newEntries) {
        await fsp.rename(path.join(source, entry), path.join(target, entry));
      }
    } catch (err) {
      const restored = await fsp.readdir(backupDir);
      for (const entry of restored) {
        await fsp
          .rename(path.join(backupDir, entry), path.join(target, entry))
          .catch(() => {});
      }
      throw err;
    }
  } finally {
    await fsp.rm(backupDir, { recursive: true, force: true });
  }
}
