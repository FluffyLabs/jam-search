---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/test-run.ts#L1-L57'
title: assembly/test-run.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-20T20:20:54Z'
last_modified: '2026-05-20T20:20:54Z'
chunk_index: 0
chunk_total: 1
content_sha: f91b8aa7694050fa4552888445b960844134f3d431b2d4ac8b68393fd880cb3d
language: typescript
---
`assembly/test-run.ts` (lines 1–57)

```typescript
import * as bit from "./instructions/bit.test";
import * as branch from "./instructions/branch.test";
import * as logic from "./instructions/logic.test";
import * as math from "./instructions/math.test";
import * as rot from "./instructions/rot.test";
import * as memory from "./memory.test";
import * as program from "./program.test";
import * as spi from "./spi.test";
import { Assert, Test } from "./test";

export function runAllTests(): void {
  let a: u64 = 0;

  a += run(bit.TESTS, "bit.ts");
  a += run(branch.TESTS, "branch.ts");
  a += run(logic.TESTS, "logic.ts");
  a += run(math.TESTS, "math.ts");
  a += run(memory.TESTS, "memory.ts");
  a += run(program.TESTS, "program.ts");
  a += run(rot.TESTS, "rot.ts");
  a += run(spi.TESTS, "spi.ts");

  const okay = u32(a >> 32);
  const total = u32(a);

  printSummary("\n\nTotal", okay, total);
  if (okay !== total) {
    throw new Error("Some tests failed.");
  }
}

function run(tests: Test[], file: string): u64 {
  let ok = 0;
  console.log(`> ${file}`);
  for (let i = 0; i < tests.length; i++) {
    console.log(`  >>> ${tests[i].name}`);
    const res = tests[i].ptr(new Assert());
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
