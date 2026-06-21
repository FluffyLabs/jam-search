---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/src/fuzz.ts#L147-L189'
title: bin/src/fuzz.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 6e4b796fb13ef26cfd642b769d34daac4aee53803af44f7a2801c879ee3a0806
language: typescript
---
`bin/src/fuzz.ts` (lines 147–189)

```typescript
  status: number;
  registers: bigint[];
  pc: number;
  gasLeft: bigint;
};
function writeTestCase(program: Uint8Array, initial: InitialValues, expected: ExpectedValues) {
  const hex = programHex(program);
  fs.mkdirSync(`../tests/length_${hex.length}`, { recursive: true });
  fs.writeFileSync(
    `../tests/length_${hex.length}/${hex}.json`,
    JSON.stringify({
      name: linkTo(hex),
      "initial-regs": initial.registers,
      "initial-pc": initial.pc,
      "initial-page-map": [],
      "initial-memory": [],
      "initial-gas": initial.gas,
      program: Array.from(program),
      "expected-status": statusToStr(expected.status),
      "expected-regs": Array.from(expected.registers),
      "expected-pc": expected.pc,
      "expected-gas": expected.gasLeft,
      "expected-memory": [],
    }),
  );
}

function statusToStr(status: number) {
  if (status === 0) {
    return "halt";
  }
  if (status === 1) {
    return "trap";
  }
  if (status === 4) {
    return "oog";
  }
  if (status === 3) {
    return "host";
  }

  throw new Error(`unexpected status: ${status}`);
}
```
