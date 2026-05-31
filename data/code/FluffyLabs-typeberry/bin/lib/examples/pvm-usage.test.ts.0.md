---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/examples/pvm-usage.test.ts#L1-L53
title: bin/lib/examples/pvm-usage.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a96d0cff25f4a997cb9ce9266a8c056a46d6049c2d9224deede902b01c0fb2ee
language: typescript
---
`bin/lib/examples/pvm-usage.test.ts` (lines 1–53)

```typescript
// biome-ignore-all lint/suspicious/noConsole: We do want to print that.

import assert from "node:assert";
import { describe, it } from "node:test";

describe("PVM Examples", () => {
  it("should demonstrate running a PVM program", async () => {
    // <!-- example:pvm-basic -->
    const { Interpreter } = await import("@typeberry/lib/pvm-interpreter");
    const { tryAsGas, Status } = await import("@typeberry/lib/pvm-interface");
    const { BytesBlob } = await import("@typeberry/lib/bytes");

    // Load a PVM program from hex
    const programHex = "0x0000213308013309012803009577ff51070c648ac8980864a928f3648733083309013200499352d500";
    const program = BytesBlob.parseBlob(programHex);

    // Create interpreter and initialize with program
    const pvm = Interpreter.new();
    pvm.resetGeneric(program.raw, 0, tryAsGas(1000));

    // dump the program data
    console.table(pvm.dumpProgram());

    // Run the program
    pvm.runProgram();

    // Program executed successfully
    assert.equal(pvm.getStatus(), Status.OOG);
    assert.equal(pvm.getPC(), 12);
    // <!-- /example:pvm-basic -->
  });

  it("should demonstrate accessing PVM registers after execution", async () => {
    // <!-- example:pvm-registers -->
    const { Interpreter } = await import("@typeberry/lib/pvm-interpreter");
    const { tryAsGas } = await import("@typeberry/lib/pvm-interface");
    const { BytesBlob } = await import("@typeberry/lib/bytes");

    const programHex = "0x0000210408010409010503000277ff07070c528a08980852a905f3528704080409111300499352d500";
    const program = BytesBlob.parseBlob(programHex);

    const pvm = Interpreter.new();
    pvm.resetGeneric(program.raw, 0, tryAsGas(1000));
    pvm.runProgram();

    // Access register values after execution
    const reg0 = pvm.registers.getU64(0);

    // Registers contain BigInt values
    assert.strictEqual(typeof reg0, "bigint");
    // <!-- /example:pvm-registers -->
  });
});
```
