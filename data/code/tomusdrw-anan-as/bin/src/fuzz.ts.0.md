---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/src/fuzz.ts#L1-L153'
title: bin/src/fuzz.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 0
chunk_total: 2
content_sha: c1cb6080695aeea2f6d7b4a07399f0cf57e41be3b0aea569231c0ea808fbee6d
language: typescript
---
`bin/src/fuzz.ts` (lines 1–153)

```typescript
#!/usr/bin/env node

import "json-bigint-patch";
import fs from "node:fs";
import { tryAsGas } from "@typeberry/lib/pvm-interface";
import { Interpreter } from "@typeberry/lib/pvm-interpreter";
import { disassemble, HasMetadata, InputKind, prepareProgram, runProgram, wrapAsProgram } from "../../build/release.js";

const runNumber = 0;

export function fuzz(data: Uint8Array | number[]) {
  const gas = 200n;
  const pc = 0;
  const vm = Interpreter.new();
  const program = wrapAsProgram(new Uint8Array(data));
  if (program.length > 100) {
    return;
  }

  try {
    vm.resetGeneric(program, pc, tryAsGas(gas));
    vm.runProgram();

    const printDebugInfo = false;
    const registers = Array(13)
      .join(",")
      .split(",")
      .map(() => BigInt(0));
    const exe = prepareProgram(InputKind.Generic, HasMetadata.No, Array.from(program), registers, [], [], [], 0, false);
    const output = runProgram(exe, gas, pc, printDebugInfo);
    const vmRegisters = decodeRegistersFromTypeberry(vm);

    collectErrors((assertFn) => {
      assertFn(normalizeStatus(vm.getStatus()), normalizeStatus(output.status), "status");
      assertFn(vm.gas.get(), output.gas, "gas");
      assertFn(vmRegisters, output.registers, "registers");
      assertFn(vm.getPC(), output.pc, "pc");
    });

    try {
      if (runNumber % 100000 === 0) {
        writeTestCase(
          program,
          {
            pc,
            gas,
            registers,
          },
          {
            status: normalizeStatus(vm.getStatus()),
            gasLeft: vm.gas.get(),
            pc: vm.getPC(),
            registers: vmRegisters,
          },
        );
      }
    } catch (e) {
      console.warn("Unable to write file", e);
    }
  } catch (e) {
    const hex = programHex(program);
    console.log(program);
    console.log(linkTo(hex));
    console.log(disassemble(Array.from(program), InputKind.Generic, HasMetadata.No));
    throw e;
  }
}

import { hexEncode } from "./utils.js";

function programHex(program: Uint8Array) {
  return hexEncode(program, false);
}

function linkTo(programHex: string) {
  return `https://pvm.fluffylabs.dev/?program=0x${programHex}#/`;
}

function decodeRegistersFromTypeberry(vm: Interpreter): bigint[] {
  const registers: bigint[] = [];
  // Try to get up to 13 registers (common register count)
  for (let i = 0; i < 13; i++) {
    try {
      registers.push(vm.registers.getU64(i));
    } catch (_e) {
      // If we can't get a register, break
      break;
    }
  }
  return registers;
}

function normalizeStatus(status: number) {
  if (status === 2) {
    return 1;
  }
  return status;
}

function assert<T>(tb: T, an: T, comment = "") {
  let condition = tb !== an;
  if (Array.isArray(tb) && Array.isArray(an)) {
    condition = tb.toString() !== an.toString();
  }

  if (condition) {
    const alsoAsHex = (f: unknown): string => {
      if (Array.isArray(f)) {
        return `${f.map(alsoAsHex).join(", ")}`;
      }

      if (typeof f === "number" || typeof f === "bigint") {
        if (BigInt(f) !== 0n) {
          return `${f} | 0x${f.toString(16)}`;
        }
        return `${f}`;
      }
      return f as string;
    };

    throw new Error(`Diverging value: ${comment}
\t(typeberry) ${alsoAsHex(tb)}
\t(ananas)    ${alsoAsHex(an)}`);
  }
}

function collectErrors(cb: (assertFn: <T>(tb: T, an: T, comment?: string) => void) => void) {
  const errors: string[] = [];
  cb((tb, an, comment = "") => {
    try {
      assert(tb, an, comment);
    } catch (e) {
      errors.push(`${e}`);
    }
  });

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
type InitialValues = {
  registers: bigint[];
  pc: number;
  gas: bigint;
};
type ExpectedValues = {
  status: number;
  registers: bigint[];
  pc: number;
  gasLeft: bigint;
};
function writeTestCase(program: Uint8Array, initial: InitialValues, expected: ExpectedValues) {
  const hex = programHex(program);
```
