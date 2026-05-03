---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/test/test-w3f-common.ts#L113-L206
title: test/test-w3f-common.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-27T09:49:56+01:00'
last_modified: '2026-04-27T09:49:56+01:00'
chunk_index: 1
chunk_total: 2
content_sha: 7cb0455a80d4549db7c57b9673388e74bb5544214c184ab2b36147e926b02053
language: typescript
---
`test/test-w3f-common.ts` (lines 113–206)

```typescript
  result.registers = Array.from(result.registers).map((v: bigint | number) =>
    typeof v === "bigint" ? BigInt.asUintN(64, v) : BigInt(v),
  );
  result.gas = typeof result.gas === "bigint" ? result.gas : BigInt(result.gas);

  // Normalize memory chunks to plain objects for comparison.
  // The portable build returns class instances; WASM returns plain objects.
  result.memory = result.memory.map((chunk: Chunk) => ({
    address: chunk.address,
    data: Array.from(chunk.data),
  }));

  // silent mode - just put our vals into expected (comparison done externally)
  if (options.isSilent) {
    data["expected-pc"] = result.pc;
    data["expected-gas"] = result.gas;
    data["expected-status"] = status;
    data["expected-regs"] = result.registers;
    data["expected-page-fault-address"] = result.exitCode;

    return data;
  }

  // compare with expected values
  const expected = {
    // just copy JAM-output result field
    result: result.result,
    status: read(data, "expected-status"),
    registers: read(data, "expected-regs").map((x: number | bigint) => BigInt(x)),
    pc: read(data, "expected-pc"),
    memory: asChunks(read(data, "expected-memory")),
    gas: BigInt(read(data, "expected-gas")),
    exitCode: read(data, "expected-page-fault-address", 0) as number,
  };

  try {
    assert.deepStrictEqual(
      {
        ...result,
        status,
      },
      expected,
    );
    console.log(`${OK} ${data.name}`);
  } catch (e) {
    console.log(`${ERR} ${data.name}`);
    throw e;
  }
  return data;
}

type Chunk = {
  address: number;
  contents?: number[];
  data: number[];
};

function asChunks(chunks: Chunk[]) {
  return chunks.map((chunk: Chunk) => {
    chunk.data = read(chunk, "contents") as number[];
    delete chunk.contents;
    return chunk;
  });
}

type Page = {
  address: number;
  length: number;
  "is-writable": boolean;
  access: Access;
};
enum Access {
  Read = 1,
  Write = 2,
}
function asPageMap(pages: Page[]) {
  return pages.map((page: Page) => {
    page.access = read(page, "is-writable") ? Access.Write : Access.Read;
    return page;
  });
}

function statusAsString(status: number) {
  const map: Record<number, string> = {
    255: "ok",
    0: "halt",
    1: "panic",
    2: "page-fault",
    3: "host",
    4: "oog",
  };

  return map[status] || `unknown(${status})`;
}
```
