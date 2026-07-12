---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/src/test-json.ts#L1-L153'
title: bin/src/test-json.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 0
chunk_total: 2
content_sha: a285a5d173be233deaffd46e3ff7de291ced96c5395de4970e54e8ac8dfd404d
language: typescript
---
`bin/src/test-json.ts` (lines 1–153)

```typescript
#!/usr/bin/env node

import "json-bigint-patch";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export const OK = "🟢";
export const ERR = "🔴";

export type ProcessableData = {
  name?: string;
};

export interface TestOptions {
  /** print some additional debug info. */
  isDebug: boolean;
  /** don't print anything (jsonin-jsonout mode) */
  isSilent: boolean;
}

type ProcessJsonFn<T extends ProcessableData> = (data: T, options: TestOptions, filePath: string) => T;

interface TestStatus {
  all: number;
  ok: Array<{ filePath: string; name: string }>;
  fail: Array<{ filePath: string; name: string }>;
}

// Main function
export function run<T extends ProcessableData>(processJson: ProcessJsonFn<T>, options: TestOptions) {
  // Get the JSON file arguments from the command line
  const args = process.argv.slice(2);

  for (;;) {
    if (args.length === 0) {
      break;
    }
    if (args[0] === "--debug") {
      args.shift();
      options.isDebug = true;
    } else {
      break;
    }
  }

  if (args.length === 0) {
    console.error("Error: No JSON files provided.");
    console.error("Usage: index.js [--debug] <file1.json> [file2.json ...]");
    console.error("read from stdin: index.js [--debug] -");
    process.exit(1);
  }

  if (args[0] === "-") {
    if (options.isDebug) {
      throw new Error("debug needs to be disabled!");
    }
    readFromStdin(processJson, options);
    return;
  }

  const status: TestStatus = {
    all: 0,
    ok: [],
    fail: [],
  };

  // Process each file
  args.forEach((filePath) => {
    // try whole directory
    let dir: string[] | null = null;
    try {
      dir = readdirSync(filePath);
    } catch (_e) {
      // Not a directory or inaccessible, will try as file
    }

    if (dir !== null) {
      status.all += dir.length;
      for (const file of dir) {
        processFile(processJson, options, status, join(filePath, file));
      }
    } else {
      status.all += 1;
      // or just process file
      processFile(processJson, options, status, filePath);
      // TODO print results to stdout
    }
  });

  if (!options.isSilent) {
    const icon = status.ok.length === status.all ? OK : ERR;
    console.log(`${icon} Tests status: ${status.ok.length}/${status.all}`);
  }
  if (status.fail.length) {
    console.error("Failures:");
    for (const e of status.fail) {
      console.error(`❗ ${e.filePath} (${e.name})`);
    }
    process.exit(-1);
  }
}

function readFromStdin<T extends ProcessableData>(processJson: ProcessJsonFn<T>, options: TestOptions) {
  process.stdin.setEncoding("utf8");
  process.stderr.write("awaiting input\n");
  options.isSilent = true;

  // Read from stdin
  let buffer = "";
  process.stdin.on("data", (data) => {
    buffer += data;
    if (buffer.endsWith("\n\n")) {
      const json = JSON.parse(buffer);
      const out = processJson(json, options, "-");
      // clear previous buffer
      buffer = "";

      console.log(JSON.stringify(out));
      console.log();
    }
  });
}

function processFile<T extends ProcessableData>(
  processJson: ProcessJsonFn<T>,
  options: TestOptions,
  status: TestStatus,
  filePath: string,
) {
  let jsonData: T;
  try {
    // Resolve the full file path
    const absolutePath = resolve(filePath);

    // Read the file synchronously
    const fileContent = readFileSync(absolutePath, "utf-8");

    // Parse the JSON content
    jsonData = JSON.parse(fileContent);
  } catch (error) {
    status.fail.push({ filePath, name: "<unknown>" });
    console.error(`Error reading file: ${filePath}`);
    console.error((error as Error).message);
    return;
  }

  try {
    // Process the parsed JSON
    const result = processJson(jsonData, options, filePath);
    status.ok.push({ filePath, name: jsonData.name ?? filePath });
    return result;
  } catch (error) {
    status.fail.push({ filePath, name: jsonData.name ?? filePath });
```
