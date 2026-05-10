---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/args.test.ts#L141-L230
title: bin/convert/args.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: fdcb83decef4e38e22a1bf9f71f61de5cce0d79f1588c2b10d15be1278eeece7
language: typescript
---
`bin/convert/args.test.ts` (lines 141–230)

```typescript
  });

  it("should throw on repl and destination", () => {
    assert.throws(
      () => {
        const _args = parse(["./test.bin", "state-dump", "as-root-hash", "to-repl", "./test.js"]);
      },
      {
        message: "Dumping to file is not supported for to-repl",
      },
    );
  });

  it("should throw on print and destination", () => {
    assert.throws(
      () => {
        const _args = parse(["./test.bin", "state-dump", "as-root-hash", "to-print", "./test.js"]);
      },
      {
        message: "Dumping to file is not supported for to-print",
      },
    );
  });

  it("should throw on processing + destination", () => {
    assert.throws(
      () => {
        const _args = parse(["./test.bin", "state-dump", "as-root-hash", "./dest.json"]);
      },
      {
        message: "Invalid output format: './dest.json'.",
      },
    );
  });

  it("should throw on unsupported output format with processing", () => {
    assert.throws(
      () => {
        const _args = parse(["./test.bin", "state-dump", "as-root-hash", "to-something"]);
      },
      {
        message: "Invalid output format: 'to-something'.",
      },
    );
  });

  it("should throw on unsupported output format or processing", () => {
    assert.throws(
      () => {
        const _args = parse(["./test.bin", "header", "to-something"]);
      },
      {
        message: "'to-something' is neither output format nor processing parameter.",
      },
    );
  });

  it("should throw on invalid syntax", () => {
    assert.throws(
      () => {
        const _args = parse(["./test.bin", "header", "into", "something", "x", "x"]);
      },
      {
        message: "Unexpected command: 'x'",
      },
    );
  });

  it("should throw on missing input type", () => {
    assert.throws(
      () => {
        const _args = parse(["./header.json"]);
      },
      {
        message: "Missing input type.",
      },
    );
  });

  it("should throw on unsupported type", () => {
    assert.throws(
      () => {
        const _args = parse(["./header.json", "unknown"]);
      },
      {
        message: "Unsupported input type: 'unknown'.",
      },
    );
  });
});
```
