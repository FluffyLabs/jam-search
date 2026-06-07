---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/test.utils.ts#L214-L321
title: packages/jam/transition/reports/test.utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 8dfd418e073f5637328ee4aa5521ae9e3018ff9dca13acf3711b770788803f41
language: typescript
---
`packages/jam/transition/reports/test.utils.ts` (lines 214–321)

```typescript
          reported: reportedInRecentBlocks,
        },
        {
          headerHash: Bytes.parseBytes(
            "0xbed5792b7df998e5520dfbb8c91386cf2117b2c07b7837094c79d5c0b4de9de7",
            HASH_SIZE,
          ).asOpaque(),
          accumulationResult: Bytes.parseBytes(
            "0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5",
            HASH_SIZE,
          ).asOpaque(),
          postStateRoot: Bytes.parseBytes(
            "0x1324bad2e35946c1a95dd25380a6e9199fbd40045ae49eacfc67599cbd23cda7",
            HASH_SIZE,
          ).asOpaque(),
          reported: HashDictionary.new(),
        },
        {
          headerHash: Bytes.parseBytes(
            "0xc0564c5e0de0942589df4343ad1956da66797240e2a2f2d6f8116b5047768986",
            HASH_SIZE,
          ).asOpaque(),
          accumulationResult: Bytes.zero(HASH_SIZE),
          postStateRoot: Bytes.parseBytes(
            "0xf6967658df626fa39cbfb6014b50196d23bc2cfbfa71a7591ca7715472dd2b48",
            HASH_SIZE,
          ).asOpaque(),
          reported: HashDictionary.new(),
        },
      ]),
      accumulationLog: {
        peaks: [
          Bytes.zero(HASH_SIZE),
          Bytes.parseBytes("0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5", HASH_SIZE),
        ],
      },
    }),
    services,
  });
}

function getAuthPools(source: number[], spec: ChainSpec): PerCore<AuthorizationPool> {
  return tryAsPerCore(
    [
      asOpaqueType(source.map((x) => Bytes.fill(HASH_SIZE, x).asOpaque())),
      asOpaqueType(source.map((x) => Bytes.fill(HASH_SIZE, x).asOpaque())),
    ],
    spec,
  );
}

function getEntropy(e0: number, e1: number, e2: number, e3: number): ReportsState["entropy"] {
  return FixedSizeArray.new(
    [
      Bytes.fill(HASH_SIZE, e0).asOpaque(),
      Bytes.fill(HASH_SIZE, e1).asOpaque(),
      Bytes.fill(HASH_SIZE, e2).asOpaque(),
      Bytes.fill(HASH_SIZE, e3).asOpaque(),
    ],
    ENTROPY_ENTRIES,
  );
}

function newAvailabilityAssignment({ core, timeout }: { core: number; timeout: number }): AvailabilityAssignment {
  const workReport = newWorkReport({ core });
  return AvailabilityAssignment.create({ workReport, timeout: tryAsTimeSlot(timeout) });
}

function intoValidatorData({ bandersnatch, ed25519 }: { bandersnatch: string; ed25519: string }): ValidatorData {
  return ValidatorData.create({
    ed25519: Bytes.parseBytes(ed25519, ED25519_KEY_BYTES).asOpaque(),
    bandersnatch: Bytes.parseBytes(bandersnatch, BANDERSNATCH_KEY_BYTES).asOpaque(),
    bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
    metadata: Bytes.zero(VALIDATOR_META_BYTES),
  });
}

export const initialAssignment = (): AvailabilityAssignment[] => [
  newAvailabilityAssignment({ core: 0, timeout: 11 }),
  newAvailabilityAssignment({ core: 1, timeout: 11 }),
];

export const initialValidators = (): ValidatorData[] =>
  [
    {
      bandersnatch: "0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d",
      ed25519: "0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
    },
    {
      bandersnatch: "0x3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0",
      ed25519: "0x22351e22105a19aabb42589162ad7f1ea0df1c25cebf0e4a9fcd261301274862",
    },
    {
      bandersnatch: "0xaa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc",
      ed25519: "0xe68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00",
    },
    {
      bandersnatch: "0x7f6190116d118d643a98878e294ccf62b509e214299931aad8ff9764181a4e33",
      ed25519: "0xb3e0e096b02e2ec98a3441410aeddd78c95e27a0da6f411a09c631c0f2bea6e9",
    },
    {
      bandersnatch: "0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3",
      ed25519: "0x5c7f34a4bd4f2d04076a8c6f9060a0c8d2c6bdd082ceb3eda7df381cb260faff",
    },
    {
      bandersnatch: "0xf16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d",
      ed25519: "0x837ce344bc9defceb0d7de7e9e9925096768b7adb4dad932e532eb6551e0ea02",
    },
```
