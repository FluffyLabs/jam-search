---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/assurances.test.ts#L218-L340
title: packages/jam/transition/assurances.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 88b3f506405e8ffeb6c8bef5772bf74a4b6297d8a6f0061f121a459ca6e27ddc
language: typescript
---
`packages/jam/transition/assurances.test.ts` (lines 218–340)

```typescript
              "0xdeadbeefa98b2cb44a45082ec9fd9222462b8310115e23df0b4df9959efe90055009dc9c11da1ae59abd076aeb455b4e82883fd0cf35f69ba2cb0f3a8ee3800e",
          },
        ].map(intoAssurances),
      ),
      disputesAvailAssignment: initialState.availabilityAssignment,
    };

    const res = await assurances.transition(input);

    deepEqual(
      res,
      {
        isOk: false,
        isError: true,
        error: AssurancesError.InvalidValidatorIndex,
        details: () => "Invalid validator index: 1023",
      },
      { context: "result" },
    );
    deepEqual(
      assurances.state,
      {
        availabilityAssignment: testAssignment(),
        currentValidatorData: tryAsPerValidator(VALIDATORS, tinyChainSpec),
      },
      { context: "state" },
    );
  });

  it("should reject invalid order", async () => {
    const initialState = {
      availabilityAssignment: testAssignment(),
      currentValidatorData: tryAsPerValidator(VALIDATORS, tinyChainSpec),
    };
    const assurances = new Assurances(tinyChainSpec, initialState, blake2b);

    const input: AssurancesInput = {
      parentHash: DEFAULT_HEADER_HASH,
      slot: tryAsTimeSlot(12),
      assurances: assurancesAsView(
        tinyChainSpec,
        [
          {
            bitfield: "0x01",
            validatorIndex: 1,
            signature:
              "0x08a112654c32d117fb4ceb0e6a7edf92e4de6cb27532d3ceda8bb2fcf8337aeec85a734f7c36531b61e34570a3e090ffe8ab1839f412eaebde451aabf786a500",
          },
          {
            bitfield: "0x02",
            validatorIndex: 0,
            signature:
              "0x8ca67779a98b2cb44a45082ec9fd9222462b8310115e23df0b4df9959efe90055009dc9c11da1ae59abd076aeb455b4e82883fd0cf35f69ba2cb0f3a8ee3800e",
          },
        ].map(intoAssurances),
      ),
      disputesAvailAssignment: initialState.availabilityAssignment,
    };

    const res = await assurances.transition(input);

    deepEqual(
      res,
      {
        isOk: false,
        isError: true,
        error: AssurancesError.InvalidOrder,
        details: () => "order: expected: 2, got: 0",
      },
      { context: "result" },
    );
    deepEqual(
      assurances.state,
      {
        availabilityAssignment: testAssignment(),
        currentValidatorData: tryAsPerValidator(VALIDATORS, tinyChainSpec),
      },
      { context: "state" },
    );
  });
});

function intoAssurances(data: { bitfield: string; validatorIndex: number; signature: string }): AvailabilityAssurance {
  const anchor = DEFAULT_HEADER_HASH;
  const bitfield = BitVec.fromBytes(Bytes.parseBytes(data.bitfield, 1), tinyChainSpec.coresCount);
  const validatorIndex = tryAsValidatorIndex(data.validatorIndex);
  const signature = Bytes.parseBytes(data.signature, ED25519_SIGNATURE_BYTES).asOpaque();

  return AvailabilityAssurance.create({ anchor, bitfield, validatorIndex, signature });
}

function intoValidatorData({ bandersnatch, ed25519 }: { bandersnatch: string; ed25519: string }): ValidatorData {
  return ValidatorData.create({
    ed25519: Bytes.parseBytes(ed25519, ED25519_KEY_BYTES).asOpaque(),
    bandersnatch: Bytes.parseBytes(bandersnatch, BANDERSNATCH_KEY_BYTES).asOpaque(),
    bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
    metadata: Bytes.zero(VALIDATOR_META_BYTES),
  });
}

function newAvailabilityAssignment(core: number, timeout: number): AvailabilityAssignment {
  const source = BytesBlob.parseBlob(testWorkReportHex());
  const report = Decoder.decodeObject(WorkReport.Codec, source, tinyChainSpec);
  const {
    workPackageSpec,
    context,
    authorizerHash,
    authorizationOutput,
    segmentRootLookup,
    results,
    authorizationGasUsed,
  } = report;
  const workReport = WorkReport.create({
    workPackageSpec,
    context,
    coreIndex: tryAsCoreIndex(core),
    authorizerHash,
    authorizationOutput,
    segmentRootLookup,
    results,
    authorizationGasUsed,
  });
  return AvailabilityAssignment.create({ workReport, timeout: tryAsTimeSlot(timeout) });
```
