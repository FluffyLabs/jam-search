---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/scripts/extract-examples.ts#L1-L118
title: bin/lib/scripts/extract-examples.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 2
content_sha: a9f88ea52ff1f9789abd53596f0eb35b9a288b55dddcc631bc6b307202cfaaba
language: typescript
---
`bin/lib/scripts/extract-examples.ts` (lines 1–118)

```typescript
#!/usr/bin/env tsx

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXAMPLES_DIR = path.join(__dirname, "../examples");
const README_PATH = path.join(__dirname, "../README.md");

/**
 * Convert dynamic imports to static imports for documentation
 */
function convertDynamicImportsToStatic(code: string): string {
  // Match patterns like: const { X, Y } = await import("@typeberry/lib/module");
  const dynamicImportRegex = /const\s+\{([^}]+)\}\s+=\s+await\s+import\s*\(\s*["']([^"']+)["']\s*\)\s*;?/g;

  // Collect all imports
  const imports: Array<{ fullMatch: string; modulePath: string; imports: string[] }> = [];
  const importMap = new Map<string, string[]>();

  let match: RegExpMatchArray | null;
  const regex = new RegExp(dynamicImportRegex);
  for (match of code.matchAll(regex)) {
    const [fullMatch, importsMatch, modulePathMatch] = match;
    if (!importMap.has(modulePathMatch)) {
      importMap.set(modulePathMatch, []);
    }
    // Split and clean import names
    const importNames = importsMatch
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    const existingImports = importMap.get(modulePathMatch);
    if (existingImports !== undefined) {
      existingImports.push(...importNames);
    }

    imports.push({ fullMatch, modulePath: modulePathMatch, imports: importNames });
  }

  // Remove duplicate imports and build static import statements
  const staticImports: string[] = [];
  for (const [modulePath, importNames] of importMap) {
    // Remove duplicates and sort
    const uniqueImports = [...new Set(importNames)].sort();
    staticImports.push(`import { ${uniqueImports.join(", ")} } from "${modulePath}";`);
  }

  // Remove all dynamic import lines
  let result = code;
  for (const { fullMatch } of imports) {
    result = result.replace(fullMatch, "");
  }

  // Clean up excessive blank lines (more than 1 consecutive blank line)
  result = result.replace(/\n\n\n+/g, "\n\n");

  // Remove empty lines at the start
  const lines = result.split("\n");
  while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
  }
  result = lines.join("\n");

  // Prepend static imports if any exist
  if (staticImports.length > 0) {
    result = `${staticImports.join("\n")}\n\n${result}`;
  }

  return result;
}

/**
 * Extract code examples from test files
 */
function extractExamples(filePath: string): Record<string, string> {
  const content = fs.readFileSync(filePath, "utf-8");
  const examples: Record<string, string> = {};

  // Match examples marked with <!-- example:name --> ... <!-- /example:name -->
  const exampleRegex = /\/\/ <!-- example:(\w+[-\w]*) -->([\s\S]*?)\/\/ <!-- \/example:\1 -->/g;

  const matches = [...content.matchAll(exampleRegex)];
  for (const match of matches) {
    const [, name, code] = match;

    // Clean up the code: remove leading/trailing whitespace from each line
    // but preserve relative indentation
    const lines = code.split("\n");

    // Remove empty lines at start and end
    while (lines.length > 0 && lines[0].trim() === "") {
      lines.shift();
    }
    while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
      lines.pop();
    }

    // Find minimum indentation (excluding empty lines)
    const minIndent = lines
      .filter((line) => line.trim() !== "")
      .reduce((min, line) => {
        const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
        return Math.min(min, indent);
      }, Number.POSITIVE_INFINITY);

    // Remove the minimum indentation from all lines
    let cleanedCode = lines.map((line) => (line.trim() === "" ? "" : line.slice(minIndent))).join("\n");

    // Convert dynamic imports to static imports for better readability in docs
    cleanedCode = convertDynamicImportsToStatic(cleanedCode);

    examples[name] = cleanedCode;
  }

```
