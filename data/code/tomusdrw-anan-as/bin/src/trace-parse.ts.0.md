---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/src/trace-parse.ts#L1-L173'
title: bin/src/trace-parse.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-12T09:48:57+02:00'
last_modified: '2026-06-12T09:48:57+02:00'
chunk_index: 0
chunk_total: 3
content_sha: ad3164c0ebfa6871c40863825937ccd573cf34cb52ede69fa5d749e746142a5b
language: typescript
---
`bin/src/trace-parse.ts` (lines 1–173)

```typescript
// Trace format: https://github.com/FluffyLabs/jam-ecalli-trace/blob/main/ecalli-trace-jip.md
const NO_OF_REGISTERS = 13;

// Access.Write = 2 from assembly/memory-page.ts
const ACCESS_WRITE = 2;

export const STATUS = {
  OK: 255,
  HALT: 0,
  PANIC: 1,
  FAULT: 2,
  HOST: 3,
  OOG: 4,
} as const;

export const ARGS_SEGMENT_START = 0xfeff0000;

export type TraceSummary = {
  success: boolean;
  ecalliCount: number;
  termination: {
    type: "HALT" | "OOG" | "PANIC";
    pc: number;
    gas: bigint;
    panicArg?: number;
  };
};

export type RegisterDump = Map<number, bigint>;

export type MemWrite = {
  address: number;
  data: Uint8Array;
};

export type MemRead = {
  address: number;
  data: Uint8Array;
};

export type EcalliEntry = {
  index: number;
  pc: number;
  gas: bigint;
  registers: RegisterDump;
  memReads: MemRead[];
  memWrites: MemWrite[];
  setRegs: Array<{ index: number; value: bigint }>;
  setGas?: bigint;
};

export type TraceData = {
  program: Uint8Array;
  initialMemWrites: MemWrite[];
  start: {
    pc: number;
    gas: bigint;
    registers: RegisterDump;
  };
  ecalliEntries: EcalliEntry[];
  termination: {
    type: "HALT" | "OOG" | "PANIC";
    pc: number;
    gas: bigint;
    registers: RegisterDump;
    panicArg?: number;
  };
};

const LINE_PATTERN =
  /(program\s+0x|memwrite\s+0x|start\s+pc=|ecalli=\d+|memread\s+0x|setreg\s+r\d+|setgas\s+<-|HALT\s+pc=|OOG\s+pc=|PANIC=)/;

export function parseTrace(input: string): TraceData {
  const lines = input.split(/\r?\n/);
  let program: Uint8Array | null = null;
  const initialMemWrites: MemWrite[] = [];
  let start: TraceData["start"] | null = null;
  const ecalliEntries: EcalliEntry[] = [];
  let currentEntry: EcalliEntry | null = null;
  let termination: TraceData["termination"] | null = null;

  for (const rawLine of lines) {
    const line = extractPayload(rawLine);
    if (!line) {
      continue;
    }

    if (line.startsWith("program ")) {
      program = parseHexBytes(line.replace("program ", "").trim());
      continue;
    }

    if (line.startsWith("memwrite ")) {
      const memwrite = parseMemWrite(line);
      if (currentEntry) {
        currentEntry.memWrites.push(memwrite);
      } else {
        initialMemWrites.push(memwrite);
      }
      continue;
    }

    if (line.startsWith("start ")) {
      start = parseStart(line);
      continue;
    }

    if (line.startsWith("ecalli=")) {
      const entry = parseEcalli(line);
      ecalliEntries.push(entry);
      currentEntry = entry;
      continue;
    }

    if (line.startsWith("memread ")) {
      if (!currentEntry) {
        throw new Error(`memread without active ecalli: ${line}`);
      }
      currentEntry.memReads.push(parseMemRead(line));
      continue;
    }

    if (line.startsWith("setreg ")) {
      if (!currentEntry) {
        throw new Error(`setreg without active ecalli: ${line}`);
      }
      const setReg = parseSetReg(line);
      currentEntry.setRegs.push(setReg);
      continue;
    }

    if (line.startsWith("setgas ")) {
      if (!currentEntry) {
        throw new Error(`setgas without active ecalli: ${line}`);
      }
      currentEntry.setGas = parseSetGas(line);
      continue;
    }

    if (line.startsWith("HALT ") || line.startsWith("OOG ") || line.startsWith("PANIC=")) {
      termination = parseTermination(line);
      currentEntry = null;
    }
  }

  if (!program) {
    throw new Error("Missing program line in trace");
  }
  if (!start) {
    throw new Error("Missing start line in trace");
  }
  if (!termination) {
    throw new Error("Missing termination line in trace");
  }

  return {
    program,
    initialMemWrites,
    start,
    ecalliEntries,
    termination,
  };
}

function extractPayload(line: string): string | null {
  const match = LINE_PATTERN.exec(line);
  if (!match || match.index === undefined) {
    return null;
  }
  return line.slice(match.index).trim();
}

function parseStart(line: string): TraceData["start"] {
```
