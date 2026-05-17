---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/ce-134-work-package-sharing.ts#L1-L113
title: packages/jam/jamnp-s/protocol/ce-134-work-package-sharing.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 2
content_sha: d83119f5ca61fdc575131b12b985b5592a1889cfcae4009ddabc75d7066d104a
language: typescript
---
`packages/jam/jamnp-s/protocol/ce-134-work-package-sharing.ts` (lines 1–113)

```typescript
import type { CoreIndex, WorkReportHash } from "@typeberry/block";
import { WorkPackageInfo } from "@typeberry/block/refine-context.js";
import type { BytesBlob } from "@typeberry/bytes";
import { type CodecRecord, codec, Decoder, Encoder } from "@typeberry/codec";
import { ED25519_SIGNATURE_BYTES, type Ed25519Signature } from "@typeberry/crypto";
import { HASH_SIZE } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import { WithDebug } from "@typeberry/utils";
import { type StreamHandler, type StreamId, type StreamMessageSender, tryAsStreamKind } from "./stream.js";

/**
 * JAMNP-S CE 134 Stream
 *
 * Work-package sharing between guarantors.
 *
 * https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-134-work-package-sharing
 */

// temporary type until we have a proper type for auditable work packages

type WorkPackageBundle = BytesBlob;
const WorkPackageBundleCodec = codec.blob;

export const STREAM_KIND = tryAsStreamKind(134);

export class WorkPackageSharingRequest extends WithDebug {
  static Codec = codec.Class(WorkPackageSharingRequest, {
    coreIndex: codec.u16.asOpaque<CoreIndex>(),
    segmentsRootMappings: codec.sequenceVarLen(WorkPackageInfo.Codec),
  });

  static create({ coreIndex, segmentsRootMappings }: CodecRecord<WorkPackageSharingRequest>) {
    return new WorkPackageSharingRequest(coreIndex, segmentsRootMappings);
  }

  private constructor(
    public readonly coreIndex: CoreIndex,
    public readonly segmentsRootMappings: WorkPackageInfo[],
  ) {
    super();
  }
}

export class WorkPackageSharingResponse extends WithDebug {
  static Codec = codec.Class(WorkPackageSharingResponse, {
    workReportHash: codec.bytes(HASH_SIZE).asOpaque<WorkReportHash>(),
    signature: codec.bytes(ED25519_SIGNATURE_BYTES).asOpaque<Ed25519Signature>(),
  });

  static create({ workReportHash, signature }: CodecRecord<WorkPackageSharingResponse>) {
    return new WorkPackageSharingResponse(workReportHash, signature);
  }

  private constructor(
    public readonly workReportHash: WorkReportHash,
    public readonly signature: Ed25519Signature,
  ) {
    super();
  }
}

const logger = Logger.new(import.meta.filename, "protocol/ce-134");

export class ServerHandler implements StreamHandler<typeof STREAM_KIND> {
  kind = STREAM_KIND;

  static new(
    onWorkPackage: (
      coreIndex: CoreIndex,
      segmentsRootMappings: WorkPackageInfo[],
      workPackageBundle: WorkPackageBundle,
    ) => Promise<{ workReportHash: WorkReportHash; signature: Ed25519Signature }>,
  ) {
    return new ServerHandler(onWorkPackage);
  }

  private constructor(
    private readonly onWorkPackage: (
      coreIndex: CoreIndex,
      segmentsRootMappings: WorkPackageInfo[],
      workPackageBundle: WorkPackageBundle,
    ) => Promise<{ workReportHash: WorkReportHash; signature: Ed25519Signature }>,
  ) {}

  private readonly requestsMap = new Map<StreamId, WorkPackageSharingRequest>();

  private static sendWorkReport(
    sender: StreamMessageSender,
    workReportHash: WorkReportHash,
    signature: Ed25519Signature,
  ) {
    const workReport = WorkPackageSharingResponse.create({ workReportHash, signature });
    sender.bufferAndSend(Encoder.encodeObject(WorkPackageSharingResponse.Codec, workReport));
    sender.close();
  }

  onStreamMessage(sender: StreamMessageSender, message: BytesBlob): void {
    const { streamId } = sender;
    const request = this.requestsMap.get(streamId);

    if (request === undefined) {
      const receivedRequest = Decoder.decodeObject(WorkPackageSharingRequest.Codec, message);
      this.requestsMap.set(streamId, receivedRequest);
      return;
    }

    const workPackageBundle = Decoder.decodeObject(WorkPackageBundleCodec, message);

    this.onWorkPackage(request.coreIndex, request.segmentsRootMappings, workPackageBundle)
      .then(({ workReportHash, signature }) => {
        ServerHandler.sendWorkReport(sender, workReportHash, signature);
      })
      .catch((error) => {
```
