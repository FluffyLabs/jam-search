---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/ecalli-trace-logger.ts#L1-L128
title: packages/core/pvm-host-calls/ecalli-trace-logger.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 3
content_sha: ca91719fbaca10431cba6de75adff4dd4e7aa263f39ab3f0e3e37cacf879855c
language: typescript
---
`packages/core/pvm-host-calls/ecalli-trace-logger.ts` (lines 1–128)

```typescript
import { BytesBlob } from "@typeberry/bytes";
import { Level, Logger } from "@typeberry/logger";
import type { U32, U64 } from "@typeberry/numbers";
import type { Gas } from "@typeberry/pvm-interface";
import type { IoTracker } from "./ecalli-io-tracker.js";
import type { HostCallIndex } from "./host-call-handler.js";
import type { HostCallRegisters } from "./host-call-registers.js";

const ecalliLogger = Logger.new(import.meta.filename, "ecalli");

/**
 * Output function type for IO trace logging.
 * Each call should output a single line.
 */
export type IoTraceOutput = (line: string) => void;

const defaultOutput: IoTraceOutput = (line) => {
  ecalliLogger.trace`${line}`;
};
const emptyOutput: IoTraceOutput = () => {};

/**
 * Ecalli PVM IO Trace Logger.
 *
 * Implements the logging format specified for PVM execution tracing.
 * This format is designed to be:
 * - Human-readable, newline-delimited text
 * - Self-contained for stateless re-execution
 * - Comparable using simple textual diff tools
 *
 * @see https://github.com/tomusdrw/JIPs/pull/2
 */
export class EcalliTraceLogger {
  /** Returns a tracker for IO operations. */
  tracker(): IoTraceTracker | null {
    return this.output === emptyOutput ? null : new IoTraceTracker();
  }

  /**
   * Returns `true` if the `ecalli` module logger is configured for at least TRACE level.
   * Enable with: `JAM_LOG=ecalli=trace` or `JAM_LOG=trace`
   */
  static isTraceEnabled(): boolean {
    return ecalliLogger.getLevel() <= Level.TRACE;
  }

  /**
   * Create an IoTraceLogger that outputs to the `ecalli` module logger.
   *
   * Returns `null` if the `ecalli` logger is not configured for at least TRACE level.
   * Enable with: `JAM_LOG=ecalli=trace` or `JAM_LOG=trace`
   */
  static create(): EcalliTraceLogger | null {
    if (!EcalliTraceLogger.isTraceEnabled()) {
      return null;
    }

    return EcalliTraceLogger.new(defaultOutput);
  }

  /**
   * Create a no-op IoTraceLogger that discards all output.
   * Used when tracing is disabled.
   */
  static noop(): EcalliTraceLogger {
    return new EcalliTraceLogger(emptyOutput);
  }

  static new(output: IoTraceOutput): EcalliTraceLogger {
    return new EcalliTraceLogger(output);
  }

  private constructor(private readonly output: IoTraceOutput) {}

  /**
   * Log optional context lines (implementation metadata, execution environment).
   */
  logContext(context: string): void {
    this.output(context);
  }

  /**
   * Log the program blob being executed and the write data (if any)
   *
   * Format: `program {hex-encoded-program-with-metadata}`
   * Format: `memwrite {hex-encoded-address} len={blob-byte-length} <- {hex-encoded-bytes}`
   */
  logProgram(program: Uint8Array, args: Uint8Array): void {
    const SPI_ARGS_SEGMENT = 0xfe_ff_00_00;
    this.output(`program ${BytesBlob.blobFrom(program)}`);

    if (args.length > 0) {
      this.output(`memwrite ${toHexAddress(SPI_ARGS_SEGMENT)} len=${args.length} <- ${BytesBlob.blobFrom(args)}`);
    }
  }

  /**
   * Log initial execution state (prelude).
   *
   * Format: `start pc={pc} gas={gas} {register-dump}`
   */
  logStart(pc: number, gas: Gas, registers: HostCallRegisters): void {
    const line = `start pc=${pc} gas=${gas} ${registers}`;
    this.output(line);
  }

  /**
   * Log ecalli invocation with register dump.
   *
   * Format: `ecalli={index} pc={pc} gas={gas} {register-dump}`
   */
  logEcalli(index: HostCallIndex, pc: number, gas: Gas, registers: HostCallRegisters): void {
    const line = `ecalli=${index} pc=${pc} gas=${gas} ${registers}`;
    this.output(line);
  }

  /**
   * Log memory read operation.
   *
   * Format: `memread {hex-encoded-address} len={blob-byte-length} -> {hex-encoded-data-read}`
   */
  logMemRead(address: number, len: number, data: string): void {
    this.output(`memread ${toHexAddress(address)} len=${len} -> ${data}`);
  }

  /**
   * Log memory write operation.
   *
```
