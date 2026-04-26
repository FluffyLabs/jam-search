---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/nested-pvm-spi/assembly/refine.test.ts#L1-L80
title: examples/nested-pvm-spi/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 312939d2de817953d0db8c3930163d81135d9caf46c312afb220fa822231bff7
language: typescript
---
`examples/nested-pvm-spi/assembly/refine.test.ts` (lines 1–80)

```typescript
import { BytesBlob, Decoder, Encoder, ExitReason } from "@fluffylabs/as-lan";
import { TestEcalli, TestGas, TestMachine } from "@fluffylabs/as-lan/test/test-ecalli";
import { Assert, Test, test } from "@fluffylabs/as-lan/test/utils";
import { AS_ADD_JAM_HEX } from "./as-add-jam";
import { refine } from "./refine";

/**
 * Build a minimal refine argument blob matching `RefineArgsCodec`:
 *   `coreIndex: varU64, itemIndex: varU64, serviceId: varU64,
 *    payload: varLen bytes, workPackageHash: Bytes32`.
 */
function buildRefineArgs(serviceId: u32, payload: BytesBlob): BytesBlob {
  const e = Encoder.create(48 + u32(payload.length));
  e.varU64(0); // coreIndex
  e.varU64(0); // itemIndex
  e.varU64(u64(serviceId));
  e.bytesVarLen(payload);
  // Bytes32 workPackageHash — zeroed for the test.
  for (let i = 0; i < 32; i++) e.u8(0);
  return e.finish();
}

export const TESTS: Test[] = [
  test("embedded as-add.jam parses + strips metadata", () => {
    const a = Assert.create();
    const blob = BytesBlob.parseBlob(`0x${AS_ADD_JAM_HEX}`).okay!;
    a.isEqual(blob.length, 648, "total blob length");

    // Metadata prefix: 0x19 = 25, followed by 25 metadata bytes.
    const d = Decoder.fromBytesBlob(blob);
    const metaLen = d.varU32();
    a.isEqual(metaLen, 25, "metadata length");
    const spiOffset = d.bytesRead() + metaLen; // 1 + 25 = 26
    a.isEqual(spiOffset, 26, "SPI blob starts at offset 26");

    // Decode the SPI header to confirm the shape matches the published fixture.
    d.skip(metaLen);
    const roLength = d.u24();
    const rwLength = d.u24();
    const heapPages = d.u16();
    const stackSize = d.u24();
    a.isEqual(roLength, 1, "roLength");
    a.isEqual(rwLength, 0, "rwLength");
    a.isEqual(heapPages, 260, "heapPages (~1 MiB heap)");
    a.isEqual(stackSize, 65536, "stackSize (16 pages)");
    return a;
  }),

  test("refine: NestedPvm setup fires expected pages/poke sequence", () => {
    TestEcalli.reset();
    TestGas.set(1_000_000);
    // Configure mock so the very first invoke returns Halt — skip any
    // host-call loop so the test focuses on setup.
    TestMachine.setInvokeResult(i64(ExitReason.Halt), 0);

    const a = Assert.create();
    const payload = BytesBlob.parseBlob("0x0102030405060708").okay!; // two u32s
    const args = buildRefineArgs(42, payload);
    refine(u32(args.raw.dataStart), u32(args.length));

    // SPI blob has: roLength=1, rwLength=0, heapPages=260, stackSize=65536
    // (16 pages), argsLength=8. So pages() fires for: RO(1 page) + heap(260
    // pages) + stack(16 pages) + args(1 page, since 8 bytes rounds to 1) =
    // 4 calls. No RW region to allocate.
    a.isEqual(TestMachine.pagesLogLength(), 4, "4 pages() calls (RO + heap + stack + args)");
    // RO start page = 0x10000 / 4096 = 16.
    a.isEqual(TestMachine.pagesLogField(0, 1), 16, "RO start page");
    a.isEqual(TestMachine.pagesLogField(0, 3), 1, "RO access = Read");
    // Last call is args; access = Read.
    a.isEqual(TestMachine.pagesLogField(3, 3), 1, "args access = Read");

    // poke fires for RO (1 byte) and args (8 bytes).
    a.isEqual(TestMachine.pokeLogLength(), 2, "2 poke() calls (RO + args)");
    a.isEqual(TestMachine.pokeLogField(0, 1), 0x0001_0000, "RO poke dest = RO_START");
    a.isEqual(TestMachine.pokeLogField(0, 2), 1, "RO poke length = 1");
    a.isEqual(TestMachine.pokeLogField(1, 1), 0xfeff_0000, "args poke dest = ARGS_START");
    a.isEqual(TestMachine.pokeLogField(1, 2), 8, "args poke length = 8");
    return a;
  }),
];
```
