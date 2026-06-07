---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/test.utils.ts#L330-L391
title: packages/jam/state/test.utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 4
chunk_total: 47
content_sha: 6a8a16c8188efbcbb8040dcb6228c08e55030139b16affbf4e355eaf93b0770b
language: typescript
---
`packages/jam/state/test.utils.ts` (lines 330–391)

```typescript
          b32("0xf16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d"),
          b32("0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d"),
          b32("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
          b32("0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d"),
          b32("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
          b32("0x3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0"),
          b32("0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d"),
          b32("0x3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0"),
          b32("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
        ],
        spec,
      ),
    ),
    // gamma_z
    epochRoot: Bytes.parseBytes(
      "0x85f9095f4abd040839d793d89ab5ff25c61e50c844ab6765e2c0b22373b5a8f6fbe5fc0cd61fdde580b3d44fe1be127197e33b91960b10d2c6fc75aec03f36e16c2a8204961097dbc2c5ba7655543385399cc9ef08bf2e520ccf3b0a7569d88492e630ae2b14e758ab0960e372172203f4c9a41777dadd529971d7ab9d23ab29fe0e9c85ec450505dde7f5ac038274cf",
      BANDERSNATCH_RING_ROOT_BYTES,
    ).asOpaque(),
    accumulationOutputLog: SortedArray.fromArray(accumulationOutputComparator, []),
    privilegedServices: PrivilegedServices.create({
      manager: tryAsServiceId(0),
      assigners: tryAsPerCore(new Array(spec.coresCount).fill(tryAsServiceId(0)), spec),
      delegator: tryAsServiceId(0),
      registrar: tryAsServiceId(MAX_VALUE_U32),
      autoAccumulateServices: new Map(),
    }),
  });
  return state;
};

const emptyHash = () => b32("0x0000000000000000000000000000000000000000000000000000000000000000");
const testAuth = () => b32("0x0b27478648cd19b4f812f897a26976ecf312eac28508b4368d0c63ea949c7cb0");

const attempt = (x: number) => tryAsTicketAttempt(x);
const b32 = (s: string) => Bytes.parseBytes(s, HASH_SIZE).asOpaque();
const repeat = <T>(len: number, factory: () => T) => Array.from({ length: len }, factory);

const activityRecord = (
  blocks: number,
  tickets: number,
  preimages: number,
  preimagesSize: number,
  guarantees: number,
  assurances: number,
) => {
  return ValidatorStatistics.create({
    blocks: tryAsU32(blocks),
    tickets: tryAsU32(tickets),
    preImages: tryAsU32(preimages),
    preImagesSize: tryAsU32(preimagesSize),
    guarantees: tryAsU32(guarantees),
    assurances: tryAsU32(assurances),
  });
};

const testValidatorData = () =>
  Decoder.decodeObject(codecPerValidator(ValidatorData.Codec), BytesBlob.parseBlob(TEST_VALIDATOR_DATA), spec);

const TEST_AVAILABILITY_ASSIGNMENT =
  "0xac9928d4eb0c942a07c40157fa4498b2efbbc65136819517dc94d50ff2ca9f490e010000ebb6b040a0ea039a8f9593e3a4b29005b1ebea1c5465c2753db1031a3ef30c85000000000000000000000000000000000000000000000000000000000000000000001a7d753af2e2be12f88dfcb7ca5c704641534094b061c8c3aa258d4b0acbf5c85e8f73cf5d9f94cb3a8313361a3b48e97968a9ac52ab9c29b4e88f4159c21560ad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb53a31fd60656cb3de2c6ba9fafb8dee8d4c45d4bc87ca248cdda7625a68b987fb0e00000000000b27478648cd19b4f812f897a26976ecf312eac28508b4368d0c63ea949c7cb0000000010000000015f8485e3a88e86182e63280720d5ec9892578f0e577fb1bcdda5cf49795081584796f4f11ace690fc5a5bdb847db1e63cb36c97ef8f90f067a0846b654bf1c294260000000000000024ccbea4bf12716bc7f7583dd834aac2ca1b05af8dc5be285336156d0de73d9b9e20620000000000000010000000";

const TEST_VALIDATOR_DATA =
```
