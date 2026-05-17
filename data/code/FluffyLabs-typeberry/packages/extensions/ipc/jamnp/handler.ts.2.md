---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/extensions/ipc/jamnp/handler.ts#L215-L259
title: packages/extensions/ipc/jamnp/handler.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 3
content_sha: c7d47703781a8f02ebaea62f191f90ba5fe525c210f8c7e5c577bb53f3828137
language: typescript
---
`packages/extensions/ipc/jamnp/handler.ts` (lines 215–259)

```typescript
  static new(ipcStreamId: IpcStreamId, sender: IpcSender) {
    return new EnvelopeSender(ipcStreamId, sender);
  }

  private constructor(
    private readonly ipcStreamId: IpcStreamId,
    private readonly sender: IpcSender,
  ) {
    this.streamId = toStreamId(ipcStreamId);
  }

  open(newStream: NewStream) {
    const msg = Encoder.encodeObject(NewStream.Codec, newStream);
    this.sender.send(
      Encoder.encodeObject(
        StreamEnvelope.Codec,
        StreamEnvelope.create({ streamId: this.ipcStreamId, type: StreamEnvelopeType.Open, data: msg }),
      ),
    );
  }

  bufferAndSend(msg: BytesBlob): boolean {
    this.sender.send(
      Encoder.encodeObject(
        StreamEnvelope.Codec,
        StreamEnvelope.create({ streamId: this.ipcStreamId, type: StreamEnvelopeType.Msg, data: msg }),
      ),
    );
    // we are buffering until we run OOM
    return true;
  }

  close(): void {
    this.sender.send(
      Encoder.encodeObject(
        StreamEnvelope.Codec,
        StreamEnvelope.create({
          streamId: this.ipcStreamId,
          type: StreamEnvelopeType.Close,
          data: BytesBlob.blobFromNumbers([]),
        }),
      ),
    );
  }
}
```
