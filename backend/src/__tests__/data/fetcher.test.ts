import { execFile } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { fetchData } from "../../data/fetcher.js";

const exec = promisify(execFile);

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
      expect(fs.readFileSync(path.join(dataDir, "a.md"), "utf-8")).toBe(
        "hello"
      );
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
      expect(fs.readFileSync(path.join(dataDir, "a.md"), "utf-8")).toBe(
        "hello"
      );
    } finally {
      fs.rmSync(workDir, { recursive: true, force: true });
      fixture.cleanup();
    }
  });

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
});

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

  it("throws when the repo has no data/ directory", async () => {
    const fixture = await makeFixtureRepo({
      dataFiles: {},
      nonDataFiles: { "README.md": "no data here" },
    });
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "fetcher-work-"));
    const dataDir = path.join(workDir, "data");
    try {
      await expect(
        fetchData({
          repoUrl: fixture.bareUrl,
          ref: "main",
          dataDir,
        })
      ).rejects.toThrow(/no data\/ directory/i);
      expect(fs.existsSync(dataDir)).toBe(false);
    } finally {
      fs.rmSync(workDir, { recursive: true, force: true });
      fixture.cleanup();
    }
  });
});
