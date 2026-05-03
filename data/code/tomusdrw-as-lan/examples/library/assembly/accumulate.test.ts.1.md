---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/accumulate.test.ts#L93-L133
title: examples/library/assembly/accumulate.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 1
chunk_total: 2
content_sha: c09a31a5cc3456612d2ca1cfdf77666f95ef94762abc2d5f9e138c438f9e1d91
language: typescript
---
`examples/library/assembly/accumulate.test.ts` (lines 93–133)

```typescript
    // entry present. Observable side-effect therefore depends on ordering.
    TestStorage.set(libraryKey("ordered"), null);
    const hash = Bytes32.zero();
    hash.raw[0] = 0x55;
    TestAccumulate.setItem(
      0,
      buildAdminOperand(encodeAdmin(AdminCommand.setMapping(BytesBlob.encodeAscii("ordered"), hash, 16))),
    );
    TestAccumulate.setItem(
      1,
      buildAdminOperand(encodeAdmin(AdminCommand.removeMapping(BytesBlob.encodeAscii("ordered")))),
    );
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
    TestAccumulate.setItem(0, buildAdminOperand(encodeAdmin(cmd)));
    callAccumulate(1);

    const sd = CurrentServiceData.create();
    const got = sd.read(libraryKey("ed25519"));
    if (!got.isSome) {
      assert.fail("entry not written");
      return assert;
    }
    const decoded = LibraryEntryCodec.create().decode(Decoder.fromBlob(got.val!.raw)).okay!;
    assert.isEqual(decoded.hash.raw[0], 0xab, "hash");
    assert.isEqual(decoded.length, 8192, "length");
    return assert;
  }),
];
```
