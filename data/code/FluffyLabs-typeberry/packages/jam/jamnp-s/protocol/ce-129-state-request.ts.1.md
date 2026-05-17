---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/ce-129-state-request.ts#L114-L167
title: packages/jam/jamnp-s/protocol/ce-129-state-request.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: 0f967ffc6243554c9d8bda6337a29f48f3dc5946ae672c6076d671729ed9f632
language: typescript
---
`packages/jam/jamnp-s/protocol/ce-129-state-request.ts` (lines 114–167)

```typescript
      logger.info`[${streamId}][server]: Received request.`;

      if (this.getBoundaryNodes === undefined || this.getKeyValuePairs === undefined) {
        return;
      }

      const request = Decoder.decodeObject(StateRequest.Codec, message);

      const boundaryNodes = this.getBoundaryNodes(request.headerHash, request.startKey, request.endKey);
      const keyValuePairs = this.getKeyValuePairs(request.headerHash, request.startKey, request.endKey);

      logger.info`[${streamId}][server]: <-- responding with boundary nodes and key value pairs.`;
      sender.bufferAndSend(Encoder.encodeObject(codec.sequenceVarLen(trieNodeCodec), boundaryNodes));
      sender.bufferAndSend(Encoder.encodeObject(StateResponse.Codec, StateResponse.create({ keyValuePairs })));
      sender.close();

      return;
    }

    if (!this.boundaryNodes.has(streamId)) {
      this.boundaryNodes.set(streamId, Decoder.decodeObject(codec.sequenceVarLen(trieNodeCodec), message));
      logger.info`[${streamId}][client]: Received boundary nodes.`;
      return;
    }

    this.onResponse.get(streamId)?.(Decoder.decodeObject(StateResponse.Codec, message));
    logger.info`[${streamId}][client]: Received state values.`;
  }

  onClose(streamId: StreamId) {
    this.boundaryNodes.delete(streamId);
    this.onResponse.delete(streamId);
  }

  getStateByKey(
    sender: StreamMessageSender,
    headerHash: HeaderHash,
    startKey: StateRequest["startKey"],
    onResponse: (state: StateResponse) => void,
  ) {
    const { streamId } = sender;
    if (this.onResponse.has(streamId)) {
      throw new Error("It is disallowed to use the same stream for multiple requests.");
    }
    this.onResponse.set(streamId, onResponse);
    sender.bufferAndSend(
      Encoder.encodeObject(
        StateRequest.Codec,
        StateRequest.create({ headerHash, startKey, endKey: startKey, maximumSize: tryAsU32(4096) }),
      ),
    );
    sender.close();
  }
}
```
