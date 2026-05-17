---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/descriptors.ts#L683-L715
title: packages/core/codec/descriptors.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 5
chunk_total: 6
content_sha: 736c5d8c7bccc3dcb76e3c7c4bc07bc9271252236275a2bd55c58d2cf7d22de2
language: typescript
---
`packages/core/codec/descriptors.ts` (lines 683–715)

```typescript
      skipper(Skipper.new(d));
      return view;
    },
    skipper,
  );
}

function sequenceViewFixLen<T, V>(
  type: Descriptor<T, V>,
  { fixedLength }: { fixedLength: number },
): Descriptor<SequenceView<T, V>> {
  const typeBytes = type.sizeHint.bytes;
  const sizeHint = { bytes: typeBytes * fixedLength, isExact: type.sizeHint.isExact };

  const skipper = (s: Skipper) => s.sequenceFixLen(type, fixedLength);

  const view = type.name !== type.View.name ? `, ${type.View.name}` : "";
  const name = `SeqView<${type.name}${view}>[${fixedLength}]`;
  return Descriptor.new(
    name,
    sizeHint,
    (e, t) => {
      const encoded = t.encoded();
      e.bytes(Bytes.fromBlob(encoded.raw, encoded.length));
    },
    (d) => {
      const view = new SequenceView(d.clone(), type, fixedLength);
      skipper(Skipper.new(d));
      return view;
    },
    skipper,
  );
}
```
