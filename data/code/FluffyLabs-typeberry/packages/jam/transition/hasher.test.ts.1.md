---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/hasher.test.ts#L81-L168
title: packages/jam/transition/hasher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 5
content_sha: fb6452d6d7dfc95f8de64e62083a214fa034fe567b33e8c49e3af0fe49218012
language: typescript
---
`packages/jam/transition/hasher.test.ts` (lines 81–168)

```typescript
              prerequisites: report.context.prerequisites.map((p) => Bytes.parseBytes(p, HASH_SIZE).asOpaque()),
              stateRoot: Bytes.parseBytes(report.context.state_root, HASH_SIZE).asOpaque(),
            }),
            coreIndex: tryAsCoreIndex(report.core_index),
            results: asKnownSize(
              report.results.map((result) =>
                WorkResult.create({
                  codeHash: Bytes.parseBytes(result.code_hash, HASH_SIZE).asOpaque(),
                  gas: tryAsServiceGas(result.accumulate_gas),
                  load: WorkRefineLoad.create({
                    exportedSegments: tryAsU32(result.refine_load.exports),
                    extrinsicCount: tryAsU32(result.refine_load.extrinsic_count),
                    extrinsicSize: tryAsU32(result.refine_load.extrinsic_size),
                    gasUsed: tryAsServiceGas(result.refine_load.gas_used),
                    importedSegments: tryAsU32(result.refine_load.imports),
                  }),
                  payloadHash: Bytes.parseBytes(result.payload_hash, HASH_SIZE).asOpaque(),
                  result: WorkExecResult.ok(BytesBlob.parseBlob(result.result.ok)),
                  serviceId: tryAsServiceId(result.service_id),
                }),
              ),
            ),
            segmentRootLookup: report.segment_root_lookup.map((l) => WorkPackageInfo.create(l)),
          }),
          slot: tryAsTimeSlot(slot),
          credentials: asOpaqueType(
            signatures.map(({ signature, validator_index }) =>
              Credential.create({
                validatorIndex: tryAsValidatorIndex(validator_index),
                signature: Bytes.parseBytes(signature, ED25519_SIGNATURE_BYTES).asOpaque(),
              }),
            ),
          ),
        }),
      );
    }

    it("should correctly return extrinsic hash of empty extrinsic", async () => {
      const hasher = await prepareHasher();
      const extrinsicView = prepareExtrinsicView({});
      const expectedResult: ExtrinsicHash = Bytes.parseBytes(
        "0x189d15af832dfe4f67744008b62c334b569fcbb4c261e0f065655697306ca252",
        HASH_SIZE,
      ).asOpaque();

      const result = hasher.extrinsic(extrinsicView).hash;

      deepEqual(result, expectedResult);
    });

    it("should correctly return extrinsic hash of extrinsic that includes only tickets", async () => {
      const hasher = await prepareHasher();
      const tickets = prepareTickets();
      const extrinsicView = prepareExtrinsicView({ tickets: asOpaqueType(tickets) });
      const expectedResult: ExtrinsicHash = Bytes.parseBytes(
        "0x9ac8334917373bfacc7878c1a534f29a3b06cf251384f68caa8b07908e862730",
        HASH_SIZE,
      ).asOpaque();

      const result = hasher.extrinsic(extrinsicView).hash;

      deepEqual(result, expectedResult);
    });

    it("should correctly return extrinsic hash of extrinsic that includes tickets and guarantees", async () => {
      const hasher = await prepareHasher();
      const tickets = prepareTickets();
      const guarantees = prepareGuarantees();
      const extrinsicView = prepareExtrinsicView({
        tickets: asOpaqueType(tickets),
        guarantees: asOpaqueType(guarantees),
      });
      const expectedResult: ExtrinsicHash = Bytes.parseBytes(
        "0xfc365cc4a1e5fffac3bf9a0189fc8fca444b9c5dff670b6b3ad4e4b6d925551c",
        HASH_SIZE,
      ).asOpaque();

      const result = hasher.extrinsic(extrinsicView).hash;

      deepEqual(result, expectedResult);
    });
  });
});

const rawTickets = [
  {
    attempt: 2,
    signature:
```
