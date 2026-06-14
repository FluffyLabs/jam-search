---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/helpers/generate-full-genesis.ts#L99-L161
title: bin/jam/helpers/generate-full-genesis.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: 4e68353d407efa14183248f3477d48d13b3099459af8d23199f7590c218958e4
language: typescript
---
`bin/jam/helpers/generate-full-genesis.ts` (lines 99–161)

```typescript
  const stateRoot = stateEntries.getRootHash(blake2b);
  console.error(`Genesis state root: ${stateRoot}`);

  console.error("Building genesis header...");
  const hasher = await TransitionHasher.create();
  const extrinsic = Extrinsic.create({
    tickets: asOpaqueType(asKnownSize([])),
    preimages: [],
    guarantees: asOpaqueType(asKnownSize([])),
    assurances: asOpaqueType(asKnownSize([])),
    disputes: DisputesExtrinsic.create({ verdicts: [], culprits: [], faults: [] }),
  });
  const extrinsicView = reencodeAsView(Extrinsic.Codec, extrinsic, spec);
  const extrinsicHash = hasher.extrinsic(extrinsicView).hash;

  const header = Header.create({
    parentHeaderHash: Bytes.zero(32).asOpaque(),
    priorStateRoot: Bytes.zero(32).asOpaque(),
    extrinsicHash,
    timeSlotIndex: tryAsTimeSlot(0),
    epochMarker: null,
    ticketsMarker: null,
    bandersnatchBlockAuthorIndex: tryAsValidatorIndex(0xffff),
    entropySource: Bytes.zero(96).asOpaque(),
    offendersMarker: [],
    seal: Bytes.zero(96).asOpaque(),
  });
  const encodedHeader = Encoder.encodeObject(Header.Codec, header, spec);

  // Sanity check: roundtrip the genesis block through codec under fullChainSpec
  // so we catch any size/shape mismatches now instead of at node startup.
  reencodeAsView(Block.Codec, Block.create({ header, extrinsic }), spec);

  console.error("Encoding JSON...");
  const stateMap: Record<string, string> = {};
  for (const [key, value] of stateEntries) {
    stateMap[hexNoPrefix(key.raw)] = hexNoPrefix(value.raw);
  }

  const out = {
    $schema: "https://fluffylabs.dev/typeberry/schemas/config-v1.schema.json",
    version: 1,
    flavor: "full",
    authorship: {},
    chain_spec: {
      id: "typeberry-dev-full",
      bootnodes: [],
      genesis_header: hexNoPrefix(encodedHeader.raw),
      genesis_state: stateMap,
    },
  };
  process.stdout.write(JSON.stringify(out, null, 2));
  process.stdout.write("\n");
}

function hexNoPrefix(bytes: Uint8Array): string {
  return BytesBlob.blobFrom(bytes).toString().slice(2);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
```
