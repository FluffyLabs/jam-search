---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/test/utils.ts#L1-L126'
title: sdk/test/utils.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f488f6eb6ce99702678a3de23d88a19c58f33fdd8b7a33ca62fb492cf6e61ab4
language: typescript
---
`sdk/test/utils.ts` (lines 1–126)

```typescript
import { BytesBlob } from "../core/bytes";
import { readFromMemory } from "../core/mem";

export class Test {
  static create(name: string, ptr: () => Assert): Test {
    return new Test(name, ptr);
  }

  private constructor(
    public name: string,
    public ptr: () => Assert,
  ) {}
}

export class Assert {
  public isOkay: boolean = true;
  public errors: string[] = [];

  static create(): Assert {
    return new Assert();
  }

  static todo(): Assert {
    const r = Assert.create();
    r.fail("Not implemented yet!");
    return r;
  }

  fail(msg: string): void {
    this.isOkay = false;
    this.errors.push(msg);
  }

  isTrue(condition: bool, msg: string = ""): void {
    if (!condition) {
      this.isOkay = false;
      this.errors.push(`Expected true @ ${msg}`);
    }
  }

  isEqualBytes(actual: BytesBlob, expected: BytesBlob, msg: string = ""): void {
    this.isEqual(actual.toString(), expected.toString(), msg);
  }

  isEqual<T>(actual: T, expected: T, msg: string = ""): void {
    if (actual !== expected) {
      this.isOkay = false;
      const actualDisplay = isInteger(actual) ? `${actual} (0x${actual.toString(16)})` : `${actual}`;
      const expectDisplay = isInteger(expected) ? `${expected} (0x${expected.toString(16)})` : `${expected}`;
      this.errors.push(`Got: ${actualDisplay}, expected: ${expectDisplay} @ ${msg}`);
    }
  }
}

export function test(name: string, ptr: () => Assert): Test {
  return Test.create(name, ptr);
}

/** Wrap a string as a BytesBlob (via ASCII encoding). */
export function strBlob(s: string): BytesBlob {
  return BytesBlob.encodeAscii(s);
}

/**
 * Unpack a ptrAndLen-packed u64 result and read the bytes from WASM memory.
 * The packing is (len << 32) | ptr.
 */
export function unpackResult(result: u64): Uint8Array {
  const len = u32(result >> 32);
  const ptr = u32(result & 0xffffffff);
  return readFromMemory(ptr, len);
}

export class TestSuite {
  static create(tests: Test[], name: string): TestSuite {
    return new TestSuite(tests, name);
  }

  private constructor(
    public tests: Test[],
    public name: string,
  ) {}
}

/** Run all test suites, print results, and throw on failure. */
export function runTestSuites(suites: TestSuite[]): void {
  let a: u64 = 0;
  for (let s = 0; s < suites.length; s++) {
    a += runSuite(suites[s].tests, suites[s].name);
  }

  const okay = u32(a >> 32);
  const total = u32(a);

  printSummary("\n\nTotal", okay, total);
  if (okay !== total) {
    throw new Error("Some tests failed.");
  }
}

function runSuite(tests: Test[], file: string): u64 {
  let ok: u32 = 0;
  console.log(`> ${file}`);
  for (let i = 0; i < tests.length; i++) {
    console.log(`  >>> ${tests[i].name}`);
    const res = tests[i].ptr();
    if (res.isOkay) {
      console.log(`  <<< ${tests[i].name} ✅`);
      ok += 1;
    } else {
      for (let j = 0; j < res.errors.length; j++) {
        console.log(`    ${res.errors[j]}`);
      }
      console.log(`  <<< ${tests[i].name} 🔴`);
    }
  }

  printSummary(`< ${file}`, ok, tests.length);

  return (u64(ok) << 32) + tests.length;
}

function printSummary(msg: string, okay: u32, total: u32): void {
  const ico = okay === total ? "✅" : "🔴";
  console.log(`${msg} ${okay} / ${total} ${ico}`);
}
```
