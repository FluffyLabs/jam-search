---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/common.test.ts#L1-L95
title: bin/test-runner/common.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 328eea9e33df4fb9268b323e0dcd2b687656995105e9790d2eef287dcd71db74
language: typescript
---
`bin/test-runner/common.test.ts` (lines 1–95)

```typescript
import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { deepEqual } from "@typeberry/utils";
import { HELP_MESSAGE, parseArgs, SelectedPvm } from "./common.js";

describe("test runner common", () => {
  it("should parse pvm argument", () => {
    const args = ["--pvm", "ananas", "file1.json", "file2.json"];

    const result = parseArgs(args);

    deepEqual(result, {
      initialFiles: ["file1.json", "file2.json"],
      pvms: [SelectedPvm.Ananas],
      accumulateSequentially: false,
    });
  });

  it("should have both pvms by default", () => {
    const args = ["file1.json", "file2.json"];

    const result = parseArgs(args);

    deepEqual(result, {
      initialFiles: ["file1.json", "file2.json"],
      pvms: [SelectedPvm.Ananas, SelectedPvm.Builtin],
      accumulateSequentially: false,
    });
  });

  it("should throw on invalid pvm", () => {
    const args = ["--pvm=invalid", "file1.json", "file2.json"];

    assert.throws(
      () => {
        const _result = parseArgs(args);
      },
      {
        message: "Unknown pvm value: invalid. Use one of ananas, builtin.",
      },
    );
  });

  it("should parse --accumulate-sequentially without value as true", () => {
    const args = ["--accumulate-sequentially", "file1.json"];

    const result = parseArgs(args);

    deepEqual(result, {
      initialFiles: ["file1.json"],
      pvms: [SelectedPvm.Ananas, SelectedPvm.Builtin],
      accumulateSequentially: true,
    });
  });

  it("should parse --accumulate-sequentially=something as true", () => {
    const args = ["--accumulate-sequentially=something", "file1.json"];

    const result = parseArgs(args);

    deepEqual(result, {
      initialFiles: ["file1.json"],
      pvms: [SelectedPvm.Ananas, SelectedPvm.Builtin],
      accumulateSequentially: true,
    });
  });

  it("should parse --accumulate-sequentially=false as false", () => {
    const args = ["--accumulate-sequentially=false", "file1.json"];

    const result = parseArgs(args);

    deepEqual(result, {
      initialFiles: ["file1.json"],
      pvms: [SelectedPvm.Ananas, SelectedPvm.Builtin],
      accumulateSequentially: false,
    });
  });

  it("should print help with --help", () => {
    const args = ["--help"];
    const logMock = mock.method(console, "log");
    const exitMock = mock.method(process, "exit");

    parseArgs(args);

    logMock.mock.restore();
    exitMock.mock.restore();

    assert.strictEqual(exitMock.mock.calls.length, 1);
    assert.strictEqual(logMock.mock.calls.length, 1);
    const output = logMock.mock.calls[0].arguments[0] as string;
    assert.strictEqual(output, HELP_MESSAGE);
  });
});
```
