---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/fibonacci/assembly/fibonacci.ts#L1-L46
title: examples/fibonacci/assembly/fibonacci.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 90d1cd9a680d01c29cebc05900776c4163044e2268242062ba24cab5fad650b8
language: typescript
---
`examples/fibonacci/assembly/fibonacci.ts` (lines 1–46)

```typescript
import { AccumulateContext, Bytes32, LogMsg, RefineContext } from "@fluffylabs/as-lan";

// LogMsg is a lightweight buffer-based logger that avoids pulling in
// AssemblyScript's String machinery (~24% smaller WASM than Logger).
// You can also use `Logger.create("fib")` with template literals for convenience.
const logger: LogMsg = LogMsg.create("fib");

export function accumulate(ptr: u32, len: u32): u64 {
  const ctx = AccumulateContext.create();
  const args = ctx.parseArgs(ptr, len);
  logger.str("Fibonacci Service Accumulate, ").u32(args.serviceId).str(" @").u32(args.slot).info();

  const n: u64 = args.argsLength > 0 ? u64(args.argsLength) : 10;
  const fibResult = fibonacci(n);
  logger.str("fibonacci(").u64(n).str(") = ").u64(fibResult).info();

  // Encode the fibonacci result as a CodeHash (little-endian u64 in the first 8 bytes)
  const raw = new Uint8Array(32);
  for (let i = 0; i < 8; i++) {
    raw[i] = u8((fibResult >> (i * 8)) & 0xff);
  }
  return ctx.yieldHash(Bytes32.wrapUnchecked(raw));
}

export function refine(ptr: u32, len: u32): u64 {
  const ctx = RefineContext.create();
  const args = ctx.parseArgs(ptr, len);
  logger.str("Fibonacci Service Refine, ").u32(args.serviceId).info();
  return args.payload.toPtrAndLen();
}

/// Calculate fibonacci number using accumulator pattern (iterative approach)
function fibonacci(n: u64): u64 {
  if (n === 0) {
    return 0;
  }

  let a: u64 = 0;
  let b: u64 = 1;
  for (let i: u64 = 0; i < n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return a;
}
```
