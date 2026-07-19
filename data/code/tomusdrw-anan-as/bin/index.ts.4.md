---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/index.ts#L461-L514'
title: bin/index.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-15T12:24:45+02:00'
last_modified: '2026-07-15T12:24:45+02:00'
chunk_index: 4
chunk_total: 5
content_sha: 633871e57aacd7f20057d9cd433412f61b78cd12dea8b1725d9e95b66d7415f9
language: typescript
---
`bin/index.ts` (lines 461–514)

```typescript
    let hexStr = spec.slice(colonIdx + 1).trim();

    const address = parseNum(addrStr);
    if (Number.isNaN(address)) {
      throw new Error(`--mem entry ${i} has invalid address "${addrStr}".`);
    }

    // Strip 0x prefix from hex data
    if (hexStr.startsWith("0x") || hexStr.startsWith("0X")) {
      hexStr = hexStr.slice(2);
    }

    if (hexStr.length % 2 !== 0) {
      throw new Error(`--mem entry ${i} hex data has odd length.`);
    }

    const data: number[] = [];
    for (let j = 0; j < hexStr.length; j += 2) {
      const pair = hexStr.slice(j, j + 2);
      if (!/^[0-9a-fA-F]{2}$/.test(pair)) {
        throw new Error(`--mem entry ${i} has invalid hex byte at position ${j}: "${pair}".`);
      }
      const byte = parseInt(pair, 16);
      data.push(byte);
    }

    return { address, data };
  });
}

function parseDump(dumpStr?: string): { address: number; length: number }[] {
  if (dumpStr === undefined) {
    return [];
  }

  // Format: "addr:len;addr:len"
  // Example: "0x20000:64;0x20100:32"
  const specs = dumpStr.split(";").filter((s) => s.trim().length > 0);
  return specs.map((spec, i) => {
    const parts = spec.split(":");
    if (parts.length !== 2) {
      throw new Error(`--dump entry ${i} ("${spec}") must be "addr:len".`);
    }

    const address = parseNum(parts[0]);
    const length = parseNum(parts[1]);

    if (Number.isNaN(address) || Number.isNaN(length) || length <= 0) {
      throw new Error(`--dump entry ${i} ("${spec}") has invalid address or length.`);
    }

    return { address, length };
  });
}
```
