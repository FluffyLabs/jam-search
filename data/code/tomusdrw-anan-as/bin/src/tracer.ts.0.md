---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/src/tracer.ts#L1-L88'
title: bin/src/tracer.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 86fad7070982d1bdda52f72061a287aba108524b29e35d49babab56b402b0e1f
language: typescript
---
`bin/src/tracer.ts` (lines 1–88)

```typescript
// Trace output format: https://github.com/FluffyLabs/jam-ecalli-trace/blob/main/ecalli-trace-jip.md

export interface Tracer {
  program(data: Uint8Array): void;
  start(pc: number, gas: bigint, registers: bigint[] | Map<number, bigint>): void;
  ecalli(index: number, pc: number, gas: bigint, registers: bigint[]): void;
  memread(address: number | bigint, data: Uint8Array): void;
  memwrite(address: number | bigint, data: Uint8Array): void;
  setreg(index: number, value: bigint): void;
  setgas(gas: bigint): void;
  termination(type: string, exitCode: number, pc: number, gas: bigint, registers: bigint[]): void;
}

export class ConsoleTracer implements Tracer {
  program(data: Uint8Array): void {
    console.log(`program ${formatHex(data)}`);
  }

  start(pc: number, gas: bigint, registers: bigint[] | Map<number, bigint>): void {
    console.log(`start pc=${pc} gas=${gas} ${formatRegisters(registers)}`);
  }

  ecalli(index: number, pc: number, gas: bigint, registers: bigint[]): void {
    console.log(`ecalli=${index} pc=${pc} gas=${gas} ${formatRegisters(registers)}`);
  }

  memread(address: number | bigint, data: Uint8Array): void {
    console.log(` memread ${formatAddress(address)} len=${data.length} -> ${formatHex(data)}`);
  }

  memwrite(address: number | bigint, data: Uint8Array): void {
    console.log(` memwrite ${formatAddress(address)} len=${data.length} <- ${formatHex(data)}`);
  }

  setreg(index: number, value: bigint): void {
    console.log(` setreg r${index.toString().padStart(2, "0")} <- 0x${value.toString(16)}`);
  }

  setgas(gas: bigint): void {
    console.log(` setgas <- ${gas}`);
  }

  termination(type: string, exitCode: number, pc: number, gas: bigint, registers: bigint[]): void {
    let termLine = `${type}`;
    if (type === "PANIC") {
      termLine += `=${exitCode}`;
    }
    termLine += ` pc=${pc} gas=${gas} ${formatRegisters(registers)}`;
    console.log(termLine);
  }
}

export class NoOpTracer implements Tracer {
  program(): void {}
  start(): void {}
  ecalli(): void {}
  memread(): void {}
  memwrite(): void {}
  setreg(): void {}
  setgas(): void {}
  termination(): void {}
}

function formatRegisters(registers: bigint[] | Map<number, bigint>): string {
  const entries: { idx: number; val: bigint }[] = [];
  if (Array.isArray(registers)) {
    registers.forEach((val, idx) => {
      if (val !== 0n) entries.push({ idx, val });
    });
  } else {
    for (const [idx, val] of registers) {
      if (val !== 0n) entries.push({ idx, val });
    }
  }

  return entries
    .sort((a, b) => a.idx - b.idx)
    .map((e) => `r${e.idx.toString().padStart(2, "0")}=0x${e.val.toString(16)}`)
    .join(" ");
}

function formatAddress(address: number | bigint): string {
  return `0x${Number(address).toString(16).padStart(8, "0")}`;
}

function formatHex(data: Uint8Array): string {
  return `0x${Buffer.from(data).toString("hex")}`;
}
```
