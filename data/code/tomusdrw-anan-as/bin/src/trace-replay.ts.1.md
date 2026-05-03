---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/bin/src/trace-replay.ts#L116-L203
title: bin/src/trace-replay.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-27T09:49:56+01:00'
last_modified: '2026-04-27T09:49:56+01:00'
chunk_index: 1
chunk_total: 2
content_sha: b9312e759ffc467f6dd2bb3918fb60ac9ae37dc4ff333ed5cc42cfa2221e5e45
language: typescript
---
`bin/src/trace-replay.ts` (lines 116–203)

```typescript
        for (const read of expectedEcalli.memReads) {
          tracer.memread(read.address, read.data);
          if (options.verify) {
            const actualData = pvmReadMemory(id, read.address, read.data.length);
            if (!actualData) {
              throw new Error(`Failed to read memory at 0x${read.address.toString(16)}`);
            }
            assertMemEq(actualData, read.data, `memread at 0x${read.address.toString(16)}`);
          }
        }

        // Apply memory writes
        for (const write of expectedEcalli.memWrites) {
          tracer.memwrite(write.address, write.data);
          const written = pvmWriteMemory(id, write.address, write.data);
          if (!written) {
            throw new Error(`Failed to write memory at 0x${write.address.toString(16)} for PVM ${id}`);
          }
        }

        // Apply register writes
        const regs = pause.registers;
        for (const setReg of expectedEcalli.setRegs) {
          tracer.setreg(setReg.index, setReg.value);
          regs[setReg.index] = setReg.value;
        }
        pvmSetRegisters(id, regs);

        // Update gas
        if (expectedEcalli.setGas !== undefined) {
          tracer.setgas(expectedEcalli.setGas);
          gas = expectedEcalli.setGas;
        } else {
          gas = pause.gas;
        }

        // Advance PC
        pc = pause.nextPc;
      } else {
        // Termination
        const type = statusToTermination(pause.status);

        tracer.termination(type, pause.exitCode, pause.pc, pause.gas, pause.registers);

        if (options.verify) {
          assertEq(ecalliEntries.length, 0, "more host calls expected!");
          assertEq(type, termination.type, "termination type");
          assertEq(pause.pc, termination.pc, "termination pc");
          assertEq(pause.gas, termination.gas, "termination gas");
        }
        break;
      }
    }

    return {
      success: true,
      ecalliCount: initialEcalliCount,
      termination: trace.termination,
    };
  } finally {
    // after we are done, make sure to release resources
    pvmDestroy(id);
  }
}

function assertEq(actual: unknown, expected: unknown, label: string) {
  if (actual !== expected) {
    throw new Error(`\nMismatch ${label}:\n${expected} (expected)\n${actual} (got)`);
  }
}

function assertRegisters(actual: bigint[], expected: Map<number, bigint>) {
  for (let i = 0; i < actual.length; i++) {
    const actualValue = actual[i];
    const expectedValue = expected.get(i) ?? 0n;
    if (actualValue !== expectedValue) {
      throw new Error(
        `\nRegister mismatch r${i}:\n0x${expectedValue.toString(16)} (expected)\n0x${actualValue.toString(16)} (got)`,
      );
    }
  }
}

function assertMemEq(actual: Uint8Array, expected: Uint8Array, label: string) {
  const actualString = hexEncode(actual);
  const expectedString = hexEncode(expected);
  assertEq(actualString, expectedString, label);
}
```
