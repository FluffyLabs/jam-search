---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter-ananas/index.ts#L1-L146
title: packages/core/pvm-interpreter-ananas/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 2
content_sha: ea22ac5accbc7dd9341690e754c9cf9462c05448e1cbe59e9f7cccaa2f15fd0e
language: typescript
---
`packages/core/pvm-interpreter-ananas/index.ts` (lines 1–146)

```typescript
import { instantiate } from "@fluffylabs/anan-as/release-stub-inline";
import { tryAsU32, type U32 } from "@typeberry/numbers";
import {
  type Gas,
  getPageStartAddress,
  type IGasCounter,
  type IMemory,
  type IPvmInterpreter,
  type IRegisters,
  NO_OF_REGISTERS,
  type PageFault,
  REGISTER_BYTE_SIZE,
  Status,
  tryAsBigGas,
  tryAsGas,
} from "@typeberry/pvm-interface";
import { check, OK, Result } from "@typeberry/utils";

type Ananas = Awaited<ReturnType<typeof instantiate>>;

// Max u32 value
const INF_STEPS = 2 ** 32 - 1;

class AnanasRegisters implements IRegisters {
  static new(instance: Ananas) {
    return new AnanasRegisters(instance);
  }

  private constructor(private readonly instance: Ananas) {}

  getAllEncoded(): Uint8Array {
    return this.instance.getRegisters();
  }

  setAllEncoded(bytes: Uint8Array): void {
    check`${bytes.length === NO_OF_REGISTERS * REGISTER_BYTE_SIZE}
          Incorrect size of input registers. Got: ${bytes.length},
          need: ${NO_OF_REGISTERS * REGISTER_BYTE_SIZE}`;
    this.instance.setRegisters(lowerBytes(bytes));
  }

  getAllU64(): BigUint64Array {
    const bytes = this.getAllEncoded();
    return new BigUint64Array(bytes.buffer, bytes.byteOffset);
  }
}

class AnanasMemory implements IMemory {
  static new(instance: Ananas) {
    return new AnanasMemory(instance);
  }

  private constructor(private readonly instance: Ananas) {}

  store(address: U32, bytes: Uint8Array): Result<OK, PageFault> {
    if (this.instance.setMemory(address, bytes)) {
      return Result.ok(OK);
    }
    return Result.error({ address: getPageStartAddress(address) }, () => "Memory is unwritable!");
  }

  read(address: U32, result: Uint8Array): Result<OK, PageFault> {
    if (result.length === 0) {
      return Result.ok(OK);
    }
    const newResult = this.instance.getMemory(address, result.length);
    if (newResult === null) {
      return Result.error({ address: getPageStartAddress(address) }, () => "Memory is inaccessible!");
    }
    result.set(newResult, 0);
    return Result.ok(OK);
  }
}

class AnanasGasCounter implements IGasCounter {
  initialGas: Gas = tryAsGas(0n);

  static new(instance: Ananas) {
    return new AnanasGasCounter(instance);
  }

  private constructor(private readonly instance: Ananas) {}

  get(): Gas {
    return tryAsGas(this.instance.getGasLeft());
  }

  set(g: Gas): void {
    this.instance.setGasLeft(BigInt(g));
  }

  sub(g: Gas): boolean {
    const result = this.instance.getGasLeft() - BigInt(g);
    if (result >= 0n) {
      this.instance.setGasLeft(result);
      return false;
    }
    this.instance.setGasLeft(0n);
    return true;
  }

  used(): Gas {
    const gasConsumed = BigInt(this.initialGas) - BigInt(this.get());

    if (gasConsumed < 0) {
      return this.initialGas;
    }

    return tryAsBigGas(gasConsumed);
  }
}

const USE_BLOCK_GAS = false;
const PAGES_TO_PREALLOCATE = 192;

export class AnanasInterpreter implements IPvmInterpreter {
  readonly registers: AnanasRegisters;
  readonly memory: AnanasMemory;
  readonly gas: AnanasGasCounter;

  private constructor(private readonly instance: Ananas) {
    this.registers = AnanasRegisters.new(instance);
    this.memory = AnanasMemory.new(instance);
    this.gas = AnanasGasCounter.new(instance);
  }

  static async new() {
    const instance = await instantiate({
      env: {
        abort: () => {
          throw new Error("Abort called from WASM");
        },
      },
    });
    return new AnanasInterpreter(instance);
  }

  resetJam(program: Uint8Array, args: Uint8Array, pc: number, gas: Gas): void {
    const programArr = lowerBytes(program);
    const argsArr = lowerBytes(args);
    this.gas.initialGas = gas;
    this.instance.resetJAM(programArr, pc, BigInt(gas), argsArr, true, USE_BLOCK_GAS, PAGES_TO_PREALLOCATE);
  }

  resetGeneric(program: Uint8Array, _pc: number, gas: Gas): void {
    const programArr = lowerBytes(program);
```
