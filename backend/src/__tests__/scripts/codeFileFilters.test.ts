import { describe, expect, it } from "vitest";
import {
  isBinary,
  languageFor,
  shouldIndexPath,
} from "../../scripts/codeFileFilters.js";

describe("shouldIndexPath", () => {
  it("keeps allowed extensions at repo root", () => {
    expect(shouldIndexPath("README.md")).toBe(true);
    expect(shouldIndexPath("Cargo.toml")).toBe(true);
    expect(shouldIndexPath("src/main.rs")).toBe(true);
    expect(shouldIndexPath("src/index.ts")).toBe(true);
  });

  it("rejects disallowed extensions", () => {
    expect(shouldIndexPath("logo.png")).toBe(false);
    expect(shouldIndexPath("bundle.min.js.map")).toBe(false);
    expect(shouldIndexPath("archive.zip")).toBe(false);
  });

  it("rejects blocklisted directories even with allowed extension", () => {
    expect(shouldIndexPath("node_modules/foo/index.ts")).toBe(false);
    expect(shouldIndexPath("target/release/build.rs")).toBe(false);
    expect(shouldIndexPath("dist/main.js")).toBe(false);
    expect(shouldIndexPath("build/out.ts")).toBe(false);
    expect(shouldIndexPath(".git/config")).toBe(false);
  });

  it("rejects blocklisted filenames", () => {
    expect(shouldIndexPath("package-lock.json")).toBe(false);
    expect(shouldIndexPath("Cargo.lock")).toBe(false);
    expect(shouldIndexPath("pnpm-lock.yaml")).toBe(false);
    expect(shouldIndexPath("yarn.lock")).toBe(false);
    expect(shouldIndexPath("subdir/package-lock.json")).toBe(false);
  });

  it("is case-insensitive for extensions", () => {
    expect(shouldIndexPath("README.MD")).toBe(true);
    expect(shouldIndexPath("Main.TS")).toBe(true);
  });
});

describe("languageFor", () => {
  it("maps known extensions", () => {
    expect(languageFor("src/main.ts")).toBe("typescript");
    expect(languageFor("ui/app.tsx")).toBe("typescript");
    expect(languageFor("x.js")).toBe("javascript");
    expect(languageFor("x.rs")).toBe("rust");
    expect(languageFor("a.py")).toBe("python");
    expect(languageFor("README.md")).toBe("markdown");
    expect(languageFor("Cargo.toml")).toBe("toml");
    expect(languageFor("config.yml")).toBe("yaml");
    expect(languageFor("script.sh")).toBe("bash");
  });

  it("falls back to empty string for unknown extension", () => {
    expect(languageFor("mystery")).toBe("");
  });
});

describe("isBinary", () => {
  it("detects null byte in first 8KB", () => {
    const buf = Buffer.concat([Buffer.from("hello\0world"), Buffer.alloc(100)]);
    expect(isBinary(buf)).toBe(true);
  });

  it("considers plain text as non-binary", () => {
    const buf = Buffer.from("export const a = 1;\n// comment\n");
    expect(isBinary(buf)).toBe(false);
  });
});
