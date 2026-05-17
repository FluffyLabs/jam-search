---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/tci/args.test.ts#L145-L172
title: bin/tci/args.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: 093cb05f69a8609f53f04e9c0706639d5b54a4513ef0f6ebf473d86bf61ae951
language: typescript
---
`bin/tci/args.test.ts` (lines 145–172)

```typescript
        "Invalid value '0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f2021' for flag '--bls': Error: Input string too long. Expected 32, got 33",
    });
  });

  it("should throw value cannot be parsed as a number", () => {
    assert.throws(() => parseArgs(["--ts", "test"]), {
      message: "Invalid value 'test' for flag '--ts': Error: Cannot parse 'test' as a number.",
    });
  });

  it("should throw value required", () => {
    assert.throws(() => parseArgs(["--port"]), {
      message: "Option --port requires an argument.",
    });
  });

  it("should throw unexpected command", () => {
    assert.throws(() => parseArgs(["unknown"]), {
      message: "Unexpected commands: unknown",
    });
  });

  it("should throw unrecognized flag", () => {
    assert.throws(() => parseArgs(["--unknown", "value"]), {
      message: "Unrecognized flags: unknown",
    });
  });
});
```
