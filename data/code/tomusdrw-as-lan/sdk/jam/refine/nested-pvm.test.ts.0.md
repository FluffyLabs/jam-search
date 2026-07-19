---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/nested-pvm.test.ts#L1-L96
title: sdk/jam/refine/nested-pvm.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 746f9b67a37cbe1c7ad89d4fdcc91c8fec3fb719d55400202edd518ff45a20ab
language: typescript
---
`sdk/jam/refine/nested-pvm.test.ts` (lines 1–96)

```typescript
import { BytesBlob } from "../../core/bytes";
import { Encoder } from "../../core/codec/encode";
import { EcalliResult } from "../../ecalli";
import { TestEcalli, TestMachine } from "../../test/test-ecalli";
import { Assert, Test, test } from "../../test/utils";
import { ExitReason } from "./machine";
import { NestedPvm, SpiError } from "./nested-pvm";

const U24_MAX: u32 = 0x00ff_ffff;

/** Build an SPI blob with the given regions. Fails loud on header-field overflow. */
function buildSpi(
  roBytes: BytesBlob,
  rwBytes: BytesBlob,
  heapPages: u16,
  stackSize: u32,
  codeBytes: BytesBlob,
): BytesBlob {
  assert(u32(roBytes.length) <= U24_MAX, "buildSpi: roLength exceeds u24");
  assert(u32(rwBytes.length) <= U24_MAX, "buildSpi: rwLength exceeds u24");
  assert(stackSize <= U24_MAX, "buildSpi: stackSize exceeds u24");

  const e = Encoder.create(64);
  // Header: u24 roLength, u24 rwLength, u16 heapPages, u24 stackSize.
  e.u24(u32(roBytes.length));
  e.u24(u32(rwBytes.length));
  e.u16(heapPages);
  e.u24(stackSize);
  // Regions.
  e.bytesFixLen(roBytes);
  e.bytesFixLen(rwBytes);
  e.u32(u32(codeBytes.length));
  e.bytesFixLen(codeBytes);
  return e.finish();
}

export const TESTS: Test[] = [
  test("NestedPvm.fromSpi decodes header and slices", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ro = BytesBlob.parseBlob("0x010203").okay!;
    const rw = BytesBlob.parseBlob("0x0908").okay!;
    const code = BytesBlob.parseBlob("0xaa0000bb").okay!;
    const blob = buildSpi(ro, rw, 2, 4096, code);
    const args = BytesBlob.empty();
    const vm = NestedPvm.fromSpi(blob, args, 1_000_000);
    a.isEqual(vm.getRegister(0), 0xffff_0000, "r0 initial");
    a.isEqual(vm.getRegister(1), 0xfefe_0000, "r1 = stack segment end");
    a.isEqual(vm.getRegister(7), 0xfeff_0000, "r7 = args segment start");
    a.isEqual(vm.getRegister(8), 0, "r8 = args length");
    a.isEqual(vm.remainingGas(), 1_000_000, "gas");
    return a;
  }),

  test("NestedPvm.fromSpi allocates RO pages then pokes RO bytes", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ro = BytesBlob.zero(10);
    for (let i = 0; i < 10; i++) ro.raw[i] = u8(i + 1);
    const blob = buildSpi(ro, BytesBlob.empty(), 0, 0, BytesBlob.zero(4));
    NestedPvm.fromSpi(blob, BytesBlob.empty(), 1_000);

    a.isEqual(TestMachine.pagesLogLength(), 1, "exactly one pages() call");
    const roStartPage: u32 = 0x0001_0000 / 4096; // = 16
    a.isEqual(TestMachine.pagesLogField(0, 1), roStartPage, "RO start page");
    a.isEqual(TestMachine.pagesLogField(0, 2), 1, "RO page count (10 bytes → 1 page)");
    a.isEqual(TestMachine.pagesLogField(0, 3), 1, "RO access = Read");

    a.isEqual(TestMachine.pokeLogLength(), 1, "exactly one poke() call");
    a.isEqual(TestMachine.pokeLogField(0, 1), 0x0001_0000, "poke dest = RO start");
    a.isEqual(TestMachine.pokeLogField(0, 2), 10, "poke length = ro length");
    const copied = BytesBlob.zero(10);
    TestMachine.pokeLogData(0, copied);
    a.isEqualBytes(copied, ro, "poked bytes");
    return a;
  }),

  test("NestedPvm.fromSpi configures RW, heap, stack, args regions", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const rw = BytesBlob.parseBlob("0xaa0000bb").okay!;
    const args = BytesBlob.zero(5);
    args.raw[0] = 0xcc;
    const stackSize: u32 = 2 * 4096 + 1; // rounds up to 3 pages.
    const heapPages: u16 = 2;
    const blob = buildSpi(BytesBlob.empty(), rw, heapPages, stackSize, BytesBlob.zero(4));
    NestedPvm.fromSpi(blob, args, 1_000);

    const rwPage: u32 = 0x0002_0000 / 4096; // 32
    const heapPage: u32 = rwPage + 1;
    const stackPages: u32 = 3;
    const stackPage: u32 = (0xfefe_0000 - stackPages * 4096) / 4096;
    const argsPage: u32 = 0xfeff_0000 / 4096;
    const n = TestMachine.pagesLogLength();
    a.isEqual(n, 4, "four pages() calls");
    a.isEqual(TestMachine.pagesLogField(0, 1), rwPage, "rw start page");
```
