---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/codec.ts#L150-L162'
title: assembly/codec.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 1
chunk_total: 2
content_sha: c58741ba7ee44af21ea320e4f55e1ecb829b2a533d41eea9db2083c5d1c287e3
language: typescript
---
`assembly/codec.ts` (lines 150–162)

```typescript
      for (let i = 1; i < 1 + l; i += 1) {
        dest[i] = u8(rest);
        rest >>= u64(8);
      }
      return dest;
    }
    // move one power down
    maxEncoded = minEncoded;
    minEncoded >>= u64(7);
  }

  throw new Error(`Unhandled number encoding: ${v}`);
}
```
