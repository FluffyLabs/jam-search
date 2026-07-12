---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/index.ts#L330-L468'
title: bin/index.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 3
chunk_total: 5
content_sha: b07262fe82131db517ac721f808735779fb2d3f425150becc7fe1dd2c3594f25
language: typescript
---
`bin/index.ts` (lines 330–468)

```typescript
    console.error(`Error replaying trace ${file}:`, error);
    process.exit(1);
  }
}

function parseGas(gasStr?: string): bigint {
  if (gasStr === undefined) {
    return BigInt(10_000);
  }

  // Reject floats and non-integer strings
  if (gasStr.includes(".") || !/^-?\d+$/.test(gasStr)) {
    console.error("Error: --gas must be a valid integer.");
    process.exit(1);
  }

  let gasValue: bigint;
  try {
    gasValue = BigInt(gasStr);
  } catch (_e) {
    console.error("Error: --gas must be a valid integer.");
    process.exit(1);
  }

  const MAX_I64 = (1n << 63n) - 1n;
  if (gasValue < 0n || gasValue > MAX_I64) {
    console.error("Error: --gas must be a non-negative integer <= 2^63-1.");
    process.exit(1);
  }
  return gasValue;
}

function parseSpiArgs(spiArgsStr?: string): number[] {
  if (!spiArgsStr) {
    return [];
  }

  try {
    return Array.from(hexDecode(spiArgsStr));
  } catch (e) {
    console.log(`Attempting to read ${spiArgsStr} as a file, since it's not a hex value: ${e}`);
    return Array.from(readFileSync(spiArgsStr));
  }
}

function parsePc(pcStr?: string): number {
  if (pcStr === undefined) {
    return 0;
  }

  // Reject floats and non-integer strings
  if (pcStr.includes(".") || !/^-?\d+$/.test(pcStr)) {
    console.error("Error: --pc must be a valid integer.");
    process.exit(1);
  }

  const pcValue = parseInt(pcStr, 10);
  if (!Number.isInteger(pcValue) || pcValue < 0 || pcValue > 0xffffffff) {
    console.error("Error: --pc must be a non-negative integer <= 2^32-1.");
    process.exit(1);
  }
  return pcValue;
}

function parseRegs(regsStr?: string): bigint[] {
  if (regsStr === undefined) {
    return [];
  }

  const parts = regsStr.split(",");
  if (parts.length !== 13) {
    throw new Error(
      `--regs must have exactly 13 comma-separated values (got ${parts.length}).\nFormat: --regs r0,r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12`,
    );
  }

  return parts.map((s, i) => {
    try {
      return BigInt.asUintN(64, BigInt(s.trim()));
    } catch (_e) {
      throw new Error(`--regs value at index ${i} ("${s.trim()}") is not a valid integer.`);
    }
  });
}

function parseNum(s: string): number {
  return Number(s.trim());
}

function parsePages(pagesStr?: string): { address: number; length: number; access: number }[] {
  if (pagesStr === undefined) {
    return [];
  }

  // Format: "addr:size;addr:size" — all pages are writable
  // Or "addr:size:ro" (or "addr:size:r") for read-only
  const specs = pagesStr.split(";").filter((s) => s.trim().length > 0);
  return specs.map((spec, i) => {
    const parts = spec.split(":");
    if (parts.length < 2 || parts.length > 3) {
      throw new Error(`--pages entry ${i} ("${spec}") must be "addr:size" or "addr:size:ro" (or "addr:size:r").`);
    }

    const address = parseNum(parts[0]);
    const length = parseNum(parts[1]);
    const flag = parts[2]?.trim();
    const access = flag === "ro" || flag === "r" ? ACCESS_READ : ACCESS_WRITE;

    if (Number.isNaN(address) || Number.isNaN(length) || length <= 0) {
      throw new Error(`--pages entry ${i} ("${spec}") has invalid address or size.`);
    }

    return { address, length, access };
  });
}

function parseMem(memStr?: string): { address: number; data: number[] }[] {
  if (memStr === undefined) {
    return [];
  }

  // Format: "addr:hexbytes;addr:hexbytes"
  // Example: "0x20000:0500000000000000;0x20008:0300000000000000"
  const specs = memStr.split(";").filter((s) => s.trim().length > 0);
  return specs.map((spec, i) => {
    const colonIdx = spec.indexOf(":");
    if (colonIdx === -1) {
      throw new Error(`--mem entry ${i} ("${spec}") must be "addr:hexbytes".`);
    }

    const addrStr = spec.slice(0, colonIdx).trim();
    let hexStr = spec.slice(colonIdx + 1).trim();

    const address = parseNum(addrStr);
    if (Number.isNaN(address)) {
      throw new Error(`--mem entry ${i} has invalid address "${addrStr}".`);
    }

    // Strip 0x prefix from hex data
```
