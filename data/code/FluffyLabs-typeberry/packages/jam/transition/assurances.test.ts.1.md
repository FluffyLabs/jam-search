---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/assurances.test.ts#L109-L221
title: packages/jam/transition/assurances.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 4
content_sha: 73e8fd19456be464b1a41e535dbefe4d87e67984e8e7b9c3a6882d2273acb081
language: typescript
---
`packages/jam/transition/assurances.test.ts` (lines 109–221)

```typescript
              "0x08a112654c32d117fb4ceb0e6a7edf92e4de6cb27532d3ceda8bb2fcf8337aeec85a734f7c36531b61e34570a3e090ffe8ab1839f412eaebde451aabf786a500",
          },
          {
            bitfield: "0x03",
            validatorIndex: 2,
            signature:
              "0xdbd50734b049bcc9e25f5c4d2d2b635e22ec1d4eefcc324863de9e1673bacb4b7ac4424a946abae83755908a3f77470776c160e7d5b42991c1b8914bfc16b700",
          },
          {
            bitfield: "0x03",
            validatorIndex: 3,
            signature:
              "0x2e1c0fe5ada7046355c7a8b23320dea86edf0df6410d13126f738755dec8f45652fd8c7ac2c84e682d745d2273977d03916865236fa93c9484bc41ed4318d30a",
          },
          {
            bitfield: "0x03",
            validatorIndex: 4,
            signature:
              "0xa3afee85825aefb49cfe10000b72d22321f6d562f89f57f56da813f62761130774e2540b2c0ce33da3c28fcbffe52ea0d1eccfbd859be46835128c4cc87fb50c",
          },
          {
            bitfield: "0x01",
            validatorIndex: 5,
            signature:
              "0x507b0321d73c495135f311c42022eb1a46c89bfab80bd21e8ca0a38823a84e57e848154bf9c9f2065a63b678bf2d7bc78f449e1bebd2beb69c68fbb14c04eb08",
          },
        ].map(intoAssurances),
      ),
      disputesAvailAssignment: tryAsPerCore(INITIAL_ASSIGNMENT.slice(), tinyChainSpec),
    };

    const res = await assurances.transition(input);

    assert.strictEqual(res.isOk, true);
    deepEqual(res.ok.availableReports, [INITIAL_ASSIGNMENT[0].workReport], { context: "result" });
    const state = copyAndUpdateState(assurances.state, res.ok.stateUpdate);
    deepEqual(
      state,
      {
        availabilityAssignment: testAssignment([null, INITIAL_ASSIGNMENT[1]]),
        currentValidatorData: tryAsPerValidator(VALIDATORS, tinyChainSpec),
      },
      { context: "state" },
    );
  });

  it("should reject invalid signatures", async () => {
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
            bitfield: "0x02",
            validatorIndex: 0,
            signature:
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
        error: AssurancesError.InvalidSignature,
        details: () => "invalid signatures at 0",
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

  it("should reject invalid validator index", async () => {
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
            bitfield: "0x02",
            validatorIndex: 1023,
            signature:
              "0xdeadbeefa98b2cb44a45082ec9fd9222462b8310115e23df0b4df9959efe90055009dc9c11da1ae59abd076aeb455b4e82883fd0cf35f69ba2cb0f3a8ee3800e",
          },
        ].map(intoAssurances),
      ),
```
