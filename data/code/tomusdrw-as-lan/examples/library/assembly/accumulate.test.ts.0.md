---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/accumulate.test.ts#L1-L110
title: examples/library/assembly/accumulate.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 01e889396114028d5ef812ec554953d8d2cec15ac1722531cb9bccce08476928
language: typescript
---
`examples/library/assembly/accumulate.test.ts` (lines 1–110)

```typescript
import { AccumulateContext, Bytes32, BytesBlob, CurrentServiceData, Decoder, Encoder } from "@fluffylabs/as-lan";
import {
  AccumulateCall,
  Assert,
  OperandItem,
  Test,
  TestAccumulate,
  TestPreimages,
  TestStorage,
  test,
} from "@fluffylabs/as-lan/test";
import { accumulate } from "./accumulate";
import { AdminCommand, AdminCommandCodec } from "./admin";
import { LibraryEntry, LibraryEntryCodec, libraryKey } from "./storage";

function encodeAdmin(cmd: AdminCommand): BytesBlob {
  const enc = Encoder.create();
  AdminCommandCodec.create().encode(cmd, enc);
  return enc.finish();
}

/** Wrap admin command bytes in an Operand item. */
function adminOperand(bytes: BytesBlob): BytesBlob {
  return OperandItem.create().withOkBlob(bytes).build();
}

/** Run accumulate with `argsLength` operands pre-seeded via TestAccumulate.setItem. */
function callAccumulate(argsLength: u32): BytesBlob {
  return AccumulateCall.create().call(accumulate, argsLength);
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
    TestStorage.set(libraryKey("blake2b"), entryEnc.finish());

    const cmd = AdminCommand.removeMapping(BytesBlob.encodeAscii("blake2b"));
    TestAccumulate.setItem(0, adminOperand(encodeAdmin(cmd)));
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
    TestAccumulate.setItem(0, adminOperand(encodeAdmin(cmd)));
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
    TestAccumulate.setItem(0, adminOperand(encodeAdmin(cmd)));
    callAccumulate(1);
    assert.isEqual(TestPreimages.getForgetCount(), 1, "forget count");
    return assert;
  }),

  test("accumulate: Provide calls provide ecalli", () => {
    const assert = Assert.create();
    TestPreimages.resetCounters();
    const cmd = AdminCommand.provide(BytesBlob.parseBlob("0xdeadbeef").okay!);
    TestAccumulate.setItem(0, adminOperand(encodeAdmin(cmd)));
    callAccumulate(1);
    assert.isEqual(TestPreimages.getProvideCount(), 1, "provide count");
    return assert;
  }),

  test("accumulate: malformed operand bytes are skipped silently", () => {
    const assert = Assert.create();
    TestPreimages.resetCounters();
    TestAccumulate.setItem(0, adminOperand(BytesBlob.parseBlob("0x99ff").okay!));
    const hash = Bytes32.zero();
    const good = encodeAdmin(AdminCommand.solicit(hash, 1));
    TestAccumulate.setItem(1, adminOperand(good));
    callAccumulate(2);
    assert.isEqual(TestPreimages.getSolicitCount(), 1, "good operand still dispatched");
    return assert;
  }),

  test("accumulate: operands dispatched in index order", () => {
    const assert = Assert.create();
```
