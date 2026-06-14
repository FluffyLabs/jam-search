---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/src/trace-parse.ts#L166-L302'
title: bin/src/trace-parse.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-12T09:48:57+02:00'
last_modified: '2026-06-12T09:48:57+02:00'
chunk_index: 1
chunk_total: 3
content_sha: e794126f57fb5fa496658aff1547786a7a5b664dce1afbcbc147d0265ad831b6
language: typescript
---
`bin/src/trace-parse.ts` (lines 166–302)

```typescript
  const match = LINE_PATTERN.exec(line);
  if (!match || match.index === undefined) {
    return null;
  }
  return line.slice(match.index).trim();
}

function parseStart(line: string): TraceData["start"] {
  const match = /^start pc=(\d+) gas=(\d+)(.*)$/.exec(line);
  if (!match) {
    throw new Error(`Invalid start line: ${line}`);
  }
  return {
    pc: parseInt(match[1], 10),
    gas: BigInt(match[2]),
    registers: parseRegisterDump(match[3]),
  };
}

function parseEcalli(line: string): EcalliEntry {
  const match = /^ecalli=(\d+) pc=(\d+) gas=(\d+)(.*)$/.exec(line);
  if (!match) {
    throw new Error(`Invalid ecalli line: ${line}`);
  }
  return {
    index: parseInt(match[1], 10),
    pc: parseInt(match[2], 10),
    gas: BigInt(match[3]),
    registers: parseRegisterDump(match[4]),
    memReads: [],
    memWrites: [],
    setRegs: [],
  };
}

function parseMemWrite(line: string): MemWrite {
  const match = /^memwrite\s+0x([0-9a-f]+)\s+len=(\d+)\s+<-\s+0x([0-9a-f]+)$/i.exec(line);
  if (!match) {
    throw new Error(`Invalid memwrite line: ${line}`);
  }
  const address = parseInt(match[1], 16);
  const data = parseHexBytes(`0x${match[3]}`);
  const len = parseInt(match[2], 10);
  if (data.length !== len) {
    throw new Error(`memwrite length mismatch: expected ${len}, got ${data.length}`);
  }
  return { address, data };
}

function parseMemRead(line: string): MemRead {
  const match = /^memread\s+0x([0-9a-f]+)\s+len=(\d+)\s+->\s+0x([0-9a-f]+)$/i.exec(line);
  if (!match) {
    throw new Error(`Invalid memread line: ${line}`);
  }
  const address = parseInt(match[1], 16);
  const data = parseHexBytes(`0x${match[3]}`);
  const len = parseInt(match[2], 10);
  if (data.length !== len) {
    throw new Error(`memread length mismatch: expected ${len}, got ${data.length}`);
  }
  return { address, data };
}

function parseSetReg(line: string) {
  const match = /^setreg\s+r(\d+)\s+<-\s+0x([0-9a-f]+)$/i.exec(line);
  if (!match) {
    throw new Error(`Invalid setreg line: ${line}`);
  }
  const index = parseInt(match[1], 10);
  if (index < 0 || index >= NO_OF_REGISTERS) {
    throw new Error(`Register index out of range: ${index}`);
  }
  return {
    index,
    value: BigInt(`0x${match[2]}`),
  };
}

function parseSetGas(line: string): bigint {
  const match = /^setgas\s+<-\s+(\d+)$/i.exec(line);
  if (!match) {
    throw new Error(`Invalid setgas line: ${line}`);
  }
  return BigInt(match[1]);
}

function parseTermination(line: string): TraceData["termination"] {
  if (line.startsWith("HALT ")) {
    const match = /^HALT pc=(\d+) gas=(\d+)(.*)$/.exec(line);
    if (!match) {
      throw new Error(`Invalid HALT line: ${line}`);
    }
    return {
      type: "HALT",
      pc: parseInt(match[1], 10),
      gas: BigInt(match[2]),
      registers: parseRegisterDump(match[3]),
    };
  }
  if (line.startsWith("OOG ")) {
    const match = /^OOG pc=(\d+) gas=(\d+)(.*)$/.exec(line);
    if (!match) {
      throw new Error(`Invalid OOG line: ${line}`);
    }
    return {
      type: "OOG",
      pc: parseInt(match[1], 10),
      gas: BigInt(match[2]),
      registers: parseRegisterDump(match[3]),
    };
  }
  if (line.startsWith("PANIC=")) {
    const match = /^PANIC=([^\s]+) pc=(\d+) gas=(\d+)(.*)$/.exec(line);
    if (!match) {
      throw new Error(`Invalid PANIC line: ${line}`);
    }
    return {
      type: "PANIC",
      pc: parseInt(match[2], 10),
      gas: BigInt(match[3]),
      registers: parseRegisterDump(match[4]),
      panicArg: parseNumber(match[1]),
    };
  }

  throw new Error(`Unknown termination line: ${line}`);
}

function parseRegisterDump(input: string): RegisterDump {
  const dump = new Map<number, bigint>();
  const regex = /r(\d+)=0x([0-9a-f]+)/gi;
  for (const match of input.matchAll(regex)) {
    const index = parseInt(match[1], 10);
    if (index < 0 || index >= NO_OF_REGISTERS) {
      throw new Error(`Register index out of range: ${index}`);
    }
    const value = BigInt(`0x${match[2]}`);
```
