---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/admin.ts#L102-L111
title: examples/library/assembly/admin.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 1
chunk_total: 2
content_sha: f2f69c9ad5aa3160e39f51c3186de1a1f966ce85a92fc1f9bb3ba1e813ac833d
language: typescript
---
`examples/library/assembly/admin.ts` (lines 102–111)

```typescript
      return Result.ok<AdminCommand, DecodeError>(AdminCommand.forget(Bytes32.wrapUnchecked(hashBytes.raw), length));
    }
    if (tag === u8(AdminCommandKind.Provide)) {
      const preimage = d.bytesVarLen();
      if (d.isError) return Result.err<AdminCommand, DecodeError>(DecodeError.MissingBytes);
      return Result.ok<AdminCommand, DecodeError>(AdminCommand.provide(preimage));
    }
    return Result.err<AdminCommand, DecodeError>(DecodeError.InvalidData);
  }
}
```
