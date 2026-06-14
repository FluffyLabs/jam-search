---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/ce-134-work-package-sharing.ts#L109-L179
title: packages/jam/jamnp-s/protocol/ce-134-work-package-sharing.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: 529adcadbaeb9bcdcf7059b3594a705001f33eb1564f7b990c0a35a0cb450c8c
language: typescript
---
`packages/jam/jamnp-s/protocol/ce-134-work-package-sharing.ts` (lines 109–179)

```typescript
    this.onWorkPackage(request.coreIndex, request.segmentsRootMappings, workPackageBundle)
      .then(({ workReportHash, signature }) => {
        ServerHandler.sendWorkReport(sender, workReportHash, signature);
      })
      .catch((error) => {
        logger.error`[${streamId}] Error processing work package: ${error}`;
        this.onClose(streamId);
      });
  }

  onClose(streamId: StreamId): void {
    this.requestsMap.delete(streamId);
  }
}

export class ClientHandler implements StreamHandler<typeof STREAM_KIND> {
  kind = STREAM_KIND;

  static new() {
    return new ClientHandler();
  }

  private constructor() {}

  private readonly pendingRequests = new Map<
    StreamId,
    {
      resolve: (response: { workReportHash: WorkReportHash; signature: Ed25519Signature }) => void;
      reject: (error: Error) => void;
    }
  >();

  onStreamMessage(sender: StreamMessageSender, message: BytesBlob): void {
    const { streamId } = sender;
    const pendingRequest = this.pendingRequests.get(streamId);
    if (pendingRequest === undefined) {
      throw new Error("Unexpected message received.");
    }

    const response = Decoder.decodeObject(WorkPackageSharingResponse.Codec, message);
    logger.info`[${streamId}] Received work report hash and signature.`;
    pendingRequest.resolve({ workReportHash: response.workReportHash, signature: response.signature });
    sender.close();
  }

  onClose(streamId: StreamId): void {
    const pendingRequest = this.pendingRequests.get(streamId);
    if (pendingRequest !== undefined) {
      pendingRequest.reject(new Error("Stream closed."));
      this.pendingRequests.delete(streamId);
    }
  }

  async sendWorkPackage(
    sender: StreamMessageSender,
    coreIndex: CoreIndex,
    segmentsRootMappings: WorkPackageInfo[],
    workPackageBundle: WorkPackageBundle,
  ): Promise<{ workReportHash: WorkReportHash; signature: Ed25519Signature }> {
    const { streamId } = sender;
    const request = WorkPackageSharingRequest.create({ coreIndex, segmentsRootMappings });
    logger.trace`[${streamId}] Sending core index and segments-root mappings.`;
    sender.bufferAndSend(Encoder.encodeObject(WorkPackageSharingRequest.Codec, request));
    logger.trace`[${streamId}] Sending work package bundle.`;
    sender.bufferAndSend(Encoder.encodeObject(WorkPackageBundleCodec, workPackageBundle));

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(streamId, { resolve, reject });
    });
  }
}
```
