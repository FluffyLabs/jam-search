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

  const parentDir = path.dirname(resolvedDataDir);
  await fsp.mkdir(parentDir, { recursive: true });
  const tmp = await fsp.mkdtemp(path.join(parentDir, ".data-fetch-"));

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
