---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/block-generator.ts#L202-L272
title: packages/workers/block-authorship/block-generator.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 2
chunk_total: 3
content_sha: 9d7157851258aa2fb85a20e5c8fb48c592ea9fe77b4a00d751ddb16fd00665c7
language: typescript
---
`packages/workers/block-authorship/block-generator.ts` (lines 202–272)

```typescript
    const isContestPeriod = slotInEpoch < this.chainSpec.contestLength;

    // Include tickets only during contest period
    const ticketsForExtrinsic = isContestPeriod ? await this.prepareTicketsExtrinsic(pendingTickets, lastState) : [];

    const extrinsic = Extrinsic.create({
      tickets: asOpaqueType(ticketsForExtrinsic),
      preimages: [],
      guarantees: asOpaqueType([]),
      assurances: asOpaqueType([]),
      disputes: DisputesExtrinsic.create({
        verdicts: [],
        culprits: [],
        faults: [],
      }),
    });

    const extrinsicView = reencodeAsView(Extrinsic.Codec, extrinsic, this.chainSpec);
    const extrinsicHash = hasher.extrinsic(extrinsicView).hash;

    const safrole = new Safrole(this.chainSpec, this.blake2b, lastState);
    const safroleResult = await safrole.blockAuthorshipTransition({
      entropy: entropyHash.asOpaque(),
      slot: timeSlot,
      extrinsic: extrinsic.tickets,
      punishSet: lastState.disputesRecords.punishSet,
    });

    if (safroleResult.isError) {
      throw new Error(`Safrole transition error: ${safroleResult.error}`);
    }

    // create header
    const headerData = {
      parentHeaderHash: lastHeaderHash,
      priorStateRoot: await stateRoot,
      extrinsicHash,
      timeSlotIndex: timeSlot,
      epochMarker: safroleResult.ok.epochMark,
      ticketsMarker: safroleResult.ok.ticketsMark,
      offendersMarker: [],
      bandersnatchBlockAuthorIndex: validatorIndex,
      entropySource: entropySource.ok,
    };

    const unsealedHeader = Header.create({
      ...headerData,
      seal: Bytes.zero(BANDERSNATCH_VRF_SIGNATURE_BYTES).asOpaque(),
    });

    const sealResult = await bandersnatchVrf.generateSeal(
      this.bandersnatch,
      bandersnatchSecret,
      sealPayload,
      encodeUnsealedHeader(reencodeAsView(Header.Codec, unsealedHeader, this.chainSpec)),
    );

    if (sealResult.isError) {
      throw new Error(`Seal generation failed: ${sealResult.error}`);
    }
    const header = Header.create({
      ...headerData,
      seal: sealResult.ok,
    });

    const duration = now() - startTime;
    this.metrics.recordBlockAuthored(timeSlot, duration);

    return Block.create({ header, extrinsic });
  }
}
```
