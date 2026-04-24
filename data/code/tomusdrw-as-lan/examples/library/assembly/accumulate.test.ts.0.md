---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/accumulate.test.ts#L1-L98
title: examples/library/assembly/accumulate.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 2
content_sha: 57277fc4c8ef39b3e703601f7e7464451f10b24d6fbc4902e81d481c543f0afc
language: typescript
---
`examples/library/assembly/accumulate.test.ts` (lines 1–98)

```typescript
import { AccumulateContext, Bytes32, BytesBlob, CurrentServiceData, Decoder, Encoder } from "@fluffylabs/as-lan";
import { Assert, Test, TestAccumulate, TestPreimages, TestStorage, test } from "@fluffylabs/as-lan/test";
import { AdminCommand, AdminCommandCodec } from "./admin";
import { LibraryEntry, LibraryEntryCodec, libraryKey } from "./storage";
import { buildAdminOperand, callAccumulate } from "./test-helpers";

function encodeAdmin(cmd: AdminCommand): Uint8Array {
  const enc = Encoder.create();
  AdminCommandCodec.create().encode(cmd, enc);
  return enc.finishRaw();
}

export const TESTS: Test[] = [
  test("mock: solicit counter increments on call", () => {
    const assert = Assert.create();
    TestPreimages.resetCounters();

    const ctx = AccumulateContext.create();
    ctx.preimages().solicit(Bytes32.zero(), 64);

    assert.isEqual(TestPreimages.getSolicitCount(), 1, "solicit count");
    assert.isEqual(TestPreimages.getForgetCount(), 0, "forget count");
    assert.isEqual(TestPreimages.getProvideCount(), 0, "provide count");
    return assert;
  }),

  test("accumulate: RemoveMapping deletes storage entry", () => {
    const assert = Assert.create();
    const hash = Bytes32.zero();
    hash.raw[0] = 0x11;
    const entryEnc = Encoder.create();
    LibraryEntryCodec.create().encode(LibraryEntry.create(hash, 32), entryEnc);
    TestStorage.set(libraryKey("blake2b"), BytesBlob.wrap(entryEnc.finishRaw()));

    const cmd = AdminCommand.removeMapping(BytesBlob.encodeAscii("blake2b"));
    TestAccumulate.setItem(0, buildAdminOperand(encodeAdmin(cmd)));
    callAccumulate(1);

    const got = CurrentServiceData.create().read(libraryKey("blake2b"));
    assert.isEqual(got.isSome, false, "entry removed");
    return assert;
  }),

  test("accumulate: Solicit calls solicit ecalli", () => {
    const assert = Assert.create();
    TestPreimages.resetCounters();
    const hash = Bytes32.zero();
    hash.raw[0] = 0x22;
    const cmd = AdminCommand.solicit(hash, 1024);
    TestAccumulate.setItem(0, buildAdminOperand(encodeAdmin(cmd)));
    callAccumulate(1);
    assert.isEqual(TestPreimages.getSolicitCount(), 1, "solicit count");
    return assert;
  }),

  test("accumulate: Forget calls forget ecalli", () => {
    const assert = Assert.create();
    TestPreimages.resetCounters();
    const hash = Bytes32.zero();
    hash.raw[0] = 0x33;
    const cmd = AdminCommand.forget(hash, 512);
    TestAccumulate.setItem(0, buildAdminOperand(encodeAdmin(cmd)));
    callAccumulate(1);
    assert.isEqual(TestPreimages.getForgetCount(), 1, "forget count");
    return assert;
  }),

  test("accumulate: Provide calls provide ecalli", () => {
    const assert = Assert.create();
    TestPreimages.resetCounters();
    const cmd = AdminCommand.provide(BytesBlob.parseBlob("0xdeadbeef").okay!);
    TestAccumulate.setItem(0, buildAdminOperand(encodeAdmin(cmd)));
    callAccumulate(1);
    assert.isEqual(TestPreimages.getProvideCount(), 1, "provide count");
    return assert;
  }),

  test("accumulate: malformed operand bytes are skipped silently", () => {
    const assert = Assert.create();
    TestPreimages.resetCounters();
    TestAccumulate.setItem(0, buildAdminOperand(BytesBlob.parseBlob("0x99ff").okay!.raw));
    const hash = Bytes32.zero();
    const good = encodeAdmin(AdminCommand.solicit(hash, 1));
    TestAccumulate.setItem(1, buildAdminOperand(good));
    callAccumulate(2);
    assert.isEqual(TestPreimages.getSolicitCount(), 1, "good operand still dispatched");
    return assert;
  }),

  test("accumulate: operands dispatched in index order", () => {
    const assert = Assert.create();
    // Set then Remove → storage ends empty. Reversed order would leave the
    // entry present. Observable side-effect therefore depends on ordering.
    TestStorage.set(libraryKey("ordered"), null);
    const hash = Bytes32.zero();
    hash.raw[0] = 0x55;
    TestAccumulate.setItem(
      0,
```
