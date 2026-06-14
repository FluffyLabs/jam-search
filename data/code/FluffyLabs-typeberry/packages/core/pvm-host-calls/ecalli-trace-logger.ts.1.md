---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/ecalli-trace-logger.ts#L120-L253
title: packages/core/pvm-host-calls/ecalli-trace-logger.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 3
content_sha: fa62157d1d9ce052c8898dae90463f3ed7c699a45463ece2370c3b6517f5f45b
language: typescript
---
`packages/core/pvm-host-calls/ecalli-trace-logger.ts` (lines 120–253)

```typescript
   * Format: `memread {hex-encoded-address} len={blob-byte-length} -> {hex-encoded-data-read}`
   */
  logMemRead(address: number, len: number, data: string): void {
    this.output(`memread ${toHexAddress(address)} len=${len} -> ${data}`);
  }

  /**
   * Log memory write operation.
   *
   * Format: `memwrite {hex-encoded-address} len={blob-byte-length} <- {hex-encoded-bytes}`
   */
  logMemWrite(address: number, len: number, data: string): void {
    this.output(`memwrite ${toHexAddress(address)} len=${len} <- ${data}`);
  }

  /**
   * Log register write operation.
   *
   * Format: `setreg r{idx} <- {hex-encoded-value}`
   */
  logSetReg(index: number, value: bigint): void {
    const paddedIdx = index.toString().padStart(2, "0");
    this.output(`setreg r${paddedIdx} <- 0x${value.toString(16)}`);
  }

  /**
   * Log gas overwrite operation.
   *
   * Format: `setgas <- {gas}`
   */
  logSetGas(gas: Gas): void {
    this.output(`setgas <- ${gas}`);
  }

  /**
   * Log all host actions from a single ecalli invocation.
   * Actions are logged in the order specified by JIP-6:
   * 1. Memory reads (sorted by address)
   * 2. Memory writes (sorted by address)
   * 3. Register writes (sorted by index)
   * 4. Gas overwrite
   */
  logHostActions(ioTracker: IoTraceTracker | null, gasBefore: Gas, gasAfter: Gas): void {
    if (ioTracker === null) {
      return;
    }

    const reads = ioTracker.reads.sort((a, b) => a.address - b.address);
    for (const op of reads) {
      this.logMemRead(op.address, op.len, op.hex);
    }

    const writes = ioTracker.writes.sort((a, b) => a.address - b.address);
    for (const op of writes) {
      this.logMemWrite(op.address, op.len, op.hex);
    }

    const sortedRegWrites = [...ioTracker.registers.entries()].sort((a, b) => a[0] - b[0]);
    for (const op of sortedRegWrites) {
      this.logSetReg(op[0], op[1]);
    }

    if (gasBefore !== gasAfter) {
      this.logSetGas(gasAfter);
    }
  }

  /**
   * Log PANIC termination.
   *
   * Format: `PANIC={argument} pc={pc} gas={gas} {register-dump}`
   */
  logPanic(argument: number, pc: number, gas: Gas, registers: HostCallRegisters): void {
    const line = `PANIC=${argument} pc=${pc} gas=${gas} ${registers}`;
    this.output(line);
  }

  /**
   * Log OOG (out of gas) termination.
   *
   * Format: `OOG pc={pc} gas={gas} {register-dump}`
   */
  logOog(pc: number, gas: Gas, registers: HostCallRegisters): void {
    const line = `OOG pc=${pc} gas=${gas} ${registers}`;
    this.output(line);
  }

  /**
   * Log HALT termination.
   *
   * Format: `HALT pc={pc} gas={gas} {register-dump}`
   */
  logHalt(pc: number, gas: Gas, registers: HostCallRegisters): void {
    const line = `HALT pc=${pc} gas=${gas} ${registers}`;
    this.output(line);
  }
}

/**
 * Convert 32-bit address to 0x-prefixed hex string.
 */
function toHexAddress(address: number): string {
  return `0x${address.toString(16).padStart(8, "0")}`;
}

type MemoryOperation = { address: number; hex: string; len: number };

/**
 * IoTracker implementation that records all I/O operations for trace logging.
 *
 * Stores memory reads, writes, and register modifications as hex-encoded strings
 * for output via IoTraceLogger.
 */
export class IoTraceTracker implements IoTracker {
  /** Recorded memory read operations (address + hex data + len). */
  reads: MemoryOperation[] = [];
  /** Recorded memory write operations (address + hex data + len). */
  writes: MemoryOperation[] = [];
  /** Recorded register write operations (index -> value). */
  registers: Map<number, U64> = new Map();

  setReg(idx: number, val: U64): void {
    this.registers.set(idx, val);
  }

  memRead(address: U32, data: Uint8Array): void {
    this.reads.push({ address, hex: BytesBlob.blobFrom(data).toString(), len: data.length });
  }

  memWrite(address: U32, data: Uint8Array): void {
    this.writes.push({ address, hex: BytesBlob.blobFrom(data).toString(), len: data.length });
  }

  clear(): void {
```
