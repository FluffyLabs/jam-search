---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/refine.test.ts#L1-L109
title: examples/library/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 5
content_sha: 6e444c7a2d8fdc24fecc316f82e1bc7cf04b4b5e698db30c7e282e56d6b9b16e
language: typescript
---
`examples/library/assembly/refine.test.ts` (lines 1–109)

```typescript
import { Bytes32, BytesBlob, Decoder, Encoder, InvokeIo, Machine } from "@fluffylabs/as-lan";
import { Assert, Test, TestHistoricalLookup, TestMachine, TestStorage, test } from "@fluffylabs/as-lan/test";
import { AdminCommand, AdminCommandCodec, AdminCommandKind } from "./admin";
import { LibraryEntry, LibraryEntryCodec, libraryKey } from "./storage";
import { callRefine } from "./test-helpers";

function buildDemoInput(name: string, gas: u64, payload: BytesBlob): Uint8Array {
  const enc = Encoder.create();
  enc.u8(0); // demo tag
  enc.bytesVarLen(BytesBlob.encodeAscii(name));
  enc.u64(gas);
  enc.bytesVarLen(payload);
  return enc.finishRaw();
}

/**
 * Minimal valid SPI blob: empty RO/RW/heap/stack, `codeLen` bytes of zero code.
 * Used as a stand-in preimage in tests where real PVM execution is mocked out.
 *
 * Layout: 3+3+2+3 (header) + 0+0 (regions) + 4 (u32 codeLen) + codeLen bytes.
 */
function buildMinimalSpi(codeLen: u32): BytesBlob {
  const enc = Encoder.create();
  enc.u24(0); // roLength
  enc.u24(0); // rwLength
  enc.u16(0); // heapPages
  enc.u24(0); // stackSize
  enc.u32(codeLen);
  for (let i: u32 = 0; i < codeLen; i++) enc.u8(0);
  return enc.finish();
}

function seedLibraryMapping(name: string, hashByte0: u8, length: u32): void {
  const h = Bytes32.zero();
  h.raw[0] = hashByte0;
  const e = LibraryEntry.create(h, length);
  const enc = Encoder.create();
  LibraryEntryCodec.create().encode(e, enc);
  TestStorage.set(libraryKey(name), BytesBlob.wrap(enc.finishRaw()));
}

export const TESTS: Test[] = [
  test("mock: setInvokeIoR7 writes r7 into InvokeIo after invoke", () => {
    const assert = Assert.create();
    TestMachine.setInvokeResult(0, 0); // Halt, r8 = 0
    TestMachine.setInvokeIoR7(0x0000000500000100); // len=5 in high, ptr=0x100 in low

    const r = Machine.create(BytesBlob.zero(4), 0);
    if (r.isError) {
      assert.fail("machine create failed");
      return assert;
    }
    const m = r.okay;
    const io = InvokeIo.create(1000);
    m.invoke(io);
    assert.isEqual(io.getRegister(7), 0x0000000500000100, "r7 written");
    return assert;
  }),

  test("storage: LibraryEntry encode/decode round-trip", () => {
    const assert = Assert.create();
    const hash = Bytes32.zero();
    hash.raw[0] = 0x42;
    const entry = LibraryEntry.create(hash, 1024);
    const codec = LibraryEntryCodec.create();

    const enc = Encoder.create();
    codec.encode(entry, enc);
    const bytes = enc.finishRaw();
    assert.isEqual(bytes.length, 36, "encoded length");

    const decoded = codec.decode(Decoder.fromBlob(bytes)).okay!;
    assert.isEqual(decoded.hash.raw[0], 0x42, "hash byte 0");
    assert.isEqual(decoded.length, 1024, "length");
    return assert;
  }),

  test("storage: libraryKey prepends 'lib:'", () => {
    const assert = Assert.create();
    const key = libraryKey("ed25519");
    const expected = BytesBlob.encodeAscii("lib:ed25519");
    assert.isEqualBytes(key, expected, "key");
    return assert;
  }),

  test("admin: SetMapping round-trip", () => {
    const assert = Assert.create();
    const hash = Bytes32.zero();
    hash.raw[0] = 0xaa;
    const cmd = AdminCommand.setMapping(BytesBlob.encodeAscii("ed25519"), hash, 4096);
    const codec = AdminCommandCodec.create();

    const enc = Encoder.create();
    codec.encode(cmd, enc);
    const decoded = codec.decode(Decoder.fromBlob(enc.finishRaw())).okay!;
    assert.isEqual<u32>(decoded.kind, AdminCommandKind.SetMapping, "kind");
    assert.isEqualBytes(decoded.name!, BytesBlob.encodeAscii("ed25519"), "name");
    assert.isEqual(decoded.hash!.raw[0], 0xaa, "hash");
    assert.isEqual(decoded.length, 4096, "length");
    return assert;
  }),

  test("admin: RemoveMapping round-trip", () => {
    const assert = Assert.create();
    const cmd = AdminCommand.removeMapping(BytesBlob.encodeAscii("blake2b"));
    const codec = AdminCommandCodec.create();

    const enc = Encoder.create();
    codec.encode(cmd, enc);
```
