---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/fetcher.ts#L89-L127'
title: sdk/jam/fetcher.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 93b5294297db1747127ba296cbb63df6af2c652e8c6df2ab8b0c77354f801f65
language: typescript
---
`sdk/jam/fetcher.ts` (lines 89–127)

```typescript
  return BytesBlob.wrap(fetchRawOrPanic(fb, kind, param1, param2));
}

/**
 * Fetch, decode using the given codec, and verify no trailing bytes.
 * Panics if the data is unavailable or if decoding fails.
 */
export function fetchAndDecode<T>(
  fb: FetchBuffer,
  codec: TryDecode<T>,
  kind: FetchKind,
  param1: u32 = 0,
  param2: u32 = 0,
): T {
  const raw = fetchRawOrPanic(fb, kind, param1, param2);
  const d = Decoder.fromBlob(raw);
  const r = codec.decode(d);
  if (r.isError || !d.isFinished()) panic("fetchAndDecode: host returned malformed data");
  return r.okay!;
}

/**
 * Fetch and decode, returning `Optional.none` when the data is unavailable.
 * Panics if the data is present but decoding fails.
 */
export function fetchAndDecodeOptional<T>(
  fb: FetchBuffer,
  codec: TryDecode<T>,
  kind: FetchKind,
  param1: u32 = 0,
  param2: u32 = 0,
): Optional<T> {
  const raw = fetchRaw(fb, kind, param1, param2);
  if (!raw.isSome) return Optional.none<T>();
  const d = Decoder.fromBlob(raw.val!);
  const r = codec.decode(d);
  if (r.isError || !d.isFinished()) panic("fetchAndDecodeOptional: host returned malformed data");
  return Optional.some<T>(r.okay!);
}
```
