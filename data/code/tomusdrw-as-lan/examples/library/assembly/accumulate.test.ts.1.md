---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/accumulate.test.ts#L105-L149
title: examples/library/assembly/accumulate.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 3344276901d5658e1b80beb33db333221ccbf5872378d075f337ba38bde10806
language: typescript
---
`examples/library/assembly/accumulate.test.ts` (lines 105–149)

```typescript
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
      adminOperand(encodeAdmin(AdminCommand.setMapping(BytesBlob.encodeAscii("ordered"), hash, 16))),
    );
    TestAccumulate.setItem(1, adminOperand(encodeAdmin(AdminCommand.removeMapping(BytesBlob.encodeAscii("ordered")))));
    callAccumulate(2);

    const got = CurrentServiceData.create().read(libraryKey("ordered"));
    assert.isEqual(got.isSome, false, "Remove ran after Set");
    return assert;
  }),

  test("accumulate: SetMapping writes LibraryEntry to storage", () => {
    const assert = Assert.create();
    TestStorage.set(libraryKey("ed25519"), null);

    const hash = Bytes32.zero();
    hash.raw[0] = 0xab;
    const cmd = AdminCommand.setMapping(BytesBlob.encodeAscii("ed25519"), hash, 8192);
    TestAccumulate.setItem(0, adminOperand(encodeAdmin(cmd)));
    callAccumulate(1);

    const sd = CurrentServiceData.create();
    const got = sd.read(libraryKey("ed25519"));
    if (!got.isSome) {
      assert.fail("entry not written");
      return assert;
    }
    const decoded = LibraryEntryCodec.create().decode(Decoder.fromBytesBlob(got.val!)).okay!;
    assert.isEqualBytes(decoded.hash.bytes, hash.bytes, "hash");
    assert.isEqual(decoded.length, 8192, "length");
    return assert;
  }),
];
```
