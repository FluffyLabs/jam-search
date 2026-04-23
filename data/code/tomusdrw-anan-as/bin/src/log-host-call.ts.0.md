---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/src/log-host-call.ts#L1-L47'
title: bin/src/log-host-call.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 522a7f70c9037110718063084d3f4a975d5d620dc1b49182e73e3b834af8487a
language: typescript
---
`bin/src/log-host-call.ts` (lines 1–47)

```typescript
import { pvmReadMemory } from "../../build/release.js";

export const LOG_HOST_CALL_INDEX = 100;
export const LOG_GAS_COST = 10n;
/** The WHAT return value - indicates the host call is not implemented / acknowledged. */
export const WHAT = 0xfffffffffffffffen;

const LOG_LEVELS = ["FATAL", "ERROR", "WARN", "INFO", "DEBUG"];
const MAX_LOG_LEN = 8192;

/**
 * Print the log message from a JIP-1 log host call (ecalli 100).
 *
 * Reads the level, target, and message from the PVM registers and memory,
 * then prints via console.info.
 */
export function printLogHostCall(pvmId: number, registers: bigint[]): void {
  const level = Number(registers[7]);
  const targetPtr = Number(registers[8] & 0xffffffffn);
  const targetLen = Math.min(Math.max(0, Number(registers[9] & 0xffffffffn)), MAX_LOG_LEN);
  const messagePtr = Number(registers[10] & 0xffffffffn);
  const messageLen = Math.min(Math.max(0, Number(registers[11] & 0xffffffffn)), MAX_LOG_LEN);

  const levelStr = LOG_LEVELS[level] ?? `LEVEL(${level})`;

  let target = "";
  if (targetPtr !== 0 && targetLen > 0) {
    const targetBytes = pvmReadMemory(pvmId, targetPtr, targetLen);
    if (targetBytes) {
      target = new TextDecoder().decode(targetBytes);
    }
  }

  let message = "";
  if (messagePtr !== 0 && messageLen > 0) {
    const messageBytes = pvmReadMemory(pvmId, messagePtr, messageLen);
    if (messageBytes) {
      message = new TextDecoder().decode(messageBytes);
    }
  }

  if (target) {
    console.info(`[${levelStr}] ${target}: ${message}`);
  } else {
    console.info(`[${levelStr}] ${message}`);
  }
}
```
