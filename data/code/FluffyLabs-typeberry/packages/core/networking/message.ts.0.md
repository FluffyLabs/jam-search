---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/message.ts#L1-L57
title: packages/core/networking/message.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1b4d17b0414b28c4be8ee6a7be2e0c125755870df6250c106f1758ae4c01431d
language: typescript
---
`packages/core/networking/message.ts` (lines 1–57)

```typescript
import { Buffer } from "node:buffer";
import { tryAsU32, u32AsLeBytes } from "@typeberry/numbers";

export const MSG_LEN_PREFIX_BYTES = 4;

const MAX_MESSAGE_BYTES = 16 * 1024 * 1024;

/** Encode message length into a buffer. */
export function encodeMessageLength(message: Uint8Array) {
  return u32AsLeBytes(tryAsU32(message.length));
}

/**
 * Only triggers the `callback` in case full data blob is received.
 *
 * Each message should be prefixed with a single U32 denoting the length of the next data
 * frame that should be interpreted as single chunk.
 */
export function handleMessageFragmentation(
  callback: (data: Uint8Array) => void,
  onOverflow: () => void,
): (data: Uint8Array) => void {
  let buffer = Buffer.alloc(0);
  let expectedLength = -1;

  return (data: Uint8Array) => {
    buffer = Buffer.concat([buffer, data]);
    do {
      // we now expect a length prefix.
      if (expectedLength === -1) {
        // not enough data to parse the length, wait for more.
        if (buffer.length < MSG_LEN_PREFIX_BYTES) {
          break;
        }

        expectedLength = buffer.readUint32LE();
        buffer = buffer.subarray(MSG_LEN_PREFIX_BYTES);
      }

      // we don't have enough data, so let's wait.
      if (buffer.length < expectedLength) {
        break;
      }

      if (buffer.length > MAX_MESSAGE_BYTES) {
        onOverflow();
        break;
      }

      // full chunk can be parsed now, but there might be some more.
      const chunk = buffer.subarray(0, expectedLength);
      buffer = buffer.subarray(expectedLength);
      expectedLength = -1;
      callback(new Uint8Array(chunk));
    } while (buffer.length > 0);
  };
}
```
