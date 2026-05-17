---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/README.md#L267-L306'
title: bin/lib/README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 3
content_sha: f642d8eb5a258f440b857a3e920c8c9f7c4ce284d2dd603de76710e6f4ba039f
language: markdown
---
`bin/lib/README.md` (lines 267–306)

```markdown
import { BytesBlob } from "@typeberry/lib/bytes";

const programHex = "0x0000210408010409010503000277ff07070c528a08980852a905f3528704080409111300499352d500";
const program = BytesBlob.parseBlob(programHex);

const pvm = Interpreter.new();
pvm.resetGeneric(program.raw, 0, tryAsGas(1000));
pvm.runProgram();

// Access register values after execution
const reg0 = pvm.registers.getU64(0);

// Registers contain BigInt values
assert.strictEqual(typeof reg0, "bigint");
```
<!-- /example-code:pvm-registers -->

### PVM Interpreter - Gas Tracking

<!-- example-code:pvm-gas -->
```typescript
import { Interpreter } from "@typeberry/lib/pvm-interpreter";
import { tryAsGas } from "@typeberry/lib/pvm-interface";
import { BytesBlob } from "@typeberry/lib/bytes";

const programHex = "0x0000210408010409010503000277ff07070c528a08980852a905f3528704080409111300499352d500";
const program = BytesBlob.parseBlob(programHex);

const initialGas = tryAsGas(1000);
const pvm = new Interpreter();
pvm.resetGeneric(program.raw, 0, initialGas);
pvm.runProgram();

// Check remaining gas after execution
const remainingGas = pvm.gas.get();

// Gas should have been consumed
assert.ok(remainingGas < initialGas);
```
<!-- /example-code:pvm-gas -->
```
