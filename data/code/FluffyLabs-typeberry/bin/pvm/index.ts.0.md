---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/pvm/index.ts#L1-L49'
title: bin/pvm/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0ea4d7ca24fd7217e3b9e5f17c35b43a57c6b3389a760b5058ad1185add3dfa8
language: typescript
---
`bin/pvm/index.ts` (lines 1–49)

```typescript
// biome-ignore-all lint/suspicious/noConsole: bin file

import { Status, tryAsGas } from "@typeberry/pvm-interface";
import { Interpreter } from "@typeberry/pvm-interpreter";
import { AnanasInterpreter } from "@typeberry/pvm-interpreter-ananas";

const program = new Uint8Array([
  0, 0, 35, 173, 101, 126, 173, 255, 239, 101, 101, 101, 101, 101, 194, 101, 101, 101, 174, 120, 44, 0, 0, 0, 0, 178,
  230, 174, 73, 44, 0, 0, 0, 0, 178, 230, 174, 120, 73, 85, 65, 2, 4,
]);

const pvmTb = Interpreter.new({ useSbrkGas: true });
const pvmAnanas = await AnanasInterpreter.new();

pvmTb.resetGeneric(program, 0, tryAsGas(200n));
pvmAnanas.resetGeneric(program, 0, tryAsGas(200n));

const instructions = pvmTb.dumpProgram();
console.table(instructions);

let i = 0;
let ananas = pvmAnanas.nextStep();
let tb = Status.OK;

while (ananas || tb === Status.OK) {
  console.info(`Instruction ${i}: ${instructions[i]}`);
  console.info(`🫐 Registers: ${pvmTb.registers.getAllU64()}`);
  console.info(`🍍 Registers: ${pvmAnanas.registers.getAllU64()}`);
  console.info(`Status: 🫐 ${pvmTb.getStatus()} | 🍍 ${pvmAnanas.getStatus()}`);
  console.info(`Gas: 🫐 ${pvmTb.gas.get()}| 🍍 ${pvmAnanas.gas.get()}`);
  console.info(`PC: 🫐 ${pvmTb.getPC()} | 🍍 ${pvmAnanas.getPC()}`);
  console.info();
  i++;
  if (tb === Status.OK) {
    tb = pvmTb.nextStep();
  }
  if (ananas) {
    ananas = pvmAnanas.nextStep();
  }
}

console.info(`Instruction ${i}: ${instructions[i]}`);
console.info(`🫐 Registers: ${pvmTb.registers.getAllU64()}`);
console.info(`🍍 Registers: ${pvmAnanas.registers.getAllU64()}`);
console.info(`Status: 🫐 ${pvmTb.getStatus()} | 🍍 ${pvmAnanas.getStatus()}`);
// TODO [MaSo] Check why they not finished with same gas.
console.info(`Gas: 🫐 ${pvmTb.gas.get()}| 🍍 ${pvmAnanas.gas.get()}`);
console.info(`PC: 🫐 ${pvmTb.getPC()} | 🍍 ${pvmAnanas.getPC()}`);
console.info();
```
