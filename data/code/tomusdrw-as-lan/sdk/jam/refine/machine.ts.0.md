---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/machine.ts#L1-L118'
title: sdk/jam/refine/machine.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 3a35161a5512d5d64152dbe01664dc54d8ab6b7cbb5aaaab7503cfbbbb443b6c
language: typescript
---
`sdk/jam/refine/machine.ts` (lines 1–118)

```typescript
import { BytesBlob } from "../../core/bytes";
import { panic } from "../../core/panic";
import { ResultN } from "../../core/result";
import { EcalliResult } from "../../ecalli";
import { expunge as ecalli_expunge } from "../../ecalli/refine/expunge";
import { invoke as ecalli_invoke } from "../../ecalli/refine/invoke";
import { machine as ecalli_machine } from "../../ecalli/refine/machine";
import { pages as ecalli_pages } from "../../ecalli/refine/pages";
import { peek as ecalli_peek } from "../../ecalli/refine/peek";
import { poke as ecalli_poke } from "../../ecalli/refine/poke";

const NUM_REGISTERS: u32 = 13;
const REGISTER_SIZE: u32 = 8; // i64
const GAS_SIZE: u32 = 8; // i64
/** Total size of the invoke I/O structure: gas (8) + 13 registers (8 each) = 112 bytes. */
export const INVOKE_IO_SIZE: u32 = GAS_SIZE + NUM_REGISTERS * REGISTER_SIZE;

/**
 * Typed wrapper over the 112-byte I/O structure used by the `invoke` ecalli.
 *
 * Layout: [gas: i64, r0: i64, r1: i64, ..., r12: i64]
 *
 * The structure is read before invoke (gas limit + initial registers) and
 * written after (gas remaining + final registers). Reuse across invoke calls.
 */
export class InvokeIo {
  static create(gas: u64): InvokeIo {
    const buf = BytesBlob.zero(INVOKE_IO_SIZE);
    const io = new InvokeIo(buf);
    io.gas = gas;
    return io;
  }

  private constructor(readonly buf: BytesBlob) {}

  get gas(): u64 {
    return load<u64>(this.buf.raw.dataStart);
  }

  set gas(value: u64) {
    store<u64>(this.buf.raw.dataStart, value);
  }

  getRegister(index: u32): u64 {
    assert(index < NUM_REGISTERS);
    return load<u64>(this.buf.raw.dataStart + GAS_SIZE + index * REGISTER_SIZE);
  }

  setRegister(index: u32, value: u64): void {
    assert(index < NUM_REGISTERS);
    store<u64>(this.buf.raw.dataStart + GAS_SIZE + index * REGISTER_SIZE, value);
  }
}

/** Result of invoking an inner PVM machine. */
export class InvokeOutcome {
  static create(reason: ExitReason, r8: i64, io: InvokeIo): InvokeOutcome {
    return new InvokeOutcome(reason, r8, io);
  }

  private constructor(
    /** Exit reason (Halt, Panic, Fault, Host, Oob). */
    public readonly reason: ExitReason,
    /** Secondary result: host call index (if Host), fault address (if Fault). */
    public readonly r8: i64,
    /** Reference to the I/O structure — gas and registers reflect post-invoke state. */
    public readonly io: InvokeIo,
  ) {}
}

/** Exit reason from invoking an inner PVM machine. */
export enum ExitReason {
  Halt = 0,
  Panic = 1,
  Fault = 2,
  Host = 3,
  Oob = 4,
}

/** Page access permission for inner machine memory. */
export enum PageAccess {
  Inaccessible = 0,
  Read = 1,
  ReadWrite = 2,
}

/** Error: machine creation failed due to invalid entrypoint. */
export enum InvalidEntryPoint {
  InvalidEntryPoint = 0,
}

/** Error: peek/poke address out of bounds. */
export enum OutOfBounds {
  OutOfBounds = 0,
}

/**
 * High-level wrapper for inner PVM machine lifecycle (ecalli 8-13).
 *
 * Create a machine with {@link Machine.create}, use peek/poke/pages/invoke
 * to interact with it, and call expunge when done.
 */
export class Machine {
  static create(code: BytesBlob, entrypoint: u32): ResultN<Machine, InvalidEntryPoint> {
    const result = ecalli_machine(code.ptr(), code.length, entrypoint);
    if (result === EcalliResult.HUH) {
      return ResultN.err<Machine, InvalidEntryPoint>(InvalidEntryPoint.InvalidEntryPoint);
    }
    return ResultN.ok<Machine, InvalidEntryPoint>(new Machine(u32(result)));
  }

  private constructor(private readonly id: u32) {}

  /** Read data from inner machine memory into the provided buffer. */
  peek(source: u32, dest: BytesBlob): ResultN<bool, OutOfBounds> {
    const result = ecalli_peek(this.id, dest.ptr(), source, dest.length);
    if (result === EcalliResult.WHO) panic("peek: unknown machine ID (WHO)");
    if (result === EcalliResult.OOB) return ResultN.err<bool, OutOfBounds>(OutOfBounds.OutOfBounds);
```
