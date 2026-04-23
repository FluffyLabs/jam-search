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
