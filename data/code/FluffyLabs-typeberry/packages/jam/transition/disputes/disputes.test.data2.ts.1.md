---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.test.data2.ts#L89-L195
title: packages/jam/transition/disputes/disputes.test.data2.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 525928625bb67cf83bdf6822a03b003c9508e67d98010e750fc3b29000528ab3
language: typescript
---
`packages/jam/transition/disputes/disputes.test.data2.ts` (lines 89–195)

```typescript
          "0xddcd6ca7a180fca910a5d57569d4ac464d43a072311ad9843c7440a0c11a8c0b2ac7c6c1a209479749ed427292ecc484075f5c050b6a287d756f100cb0033e0d",
      },
      {
        vote: true,
        index: 2,
        signature:
          "0xac267be8396a0c9439ed6c4dba397adfdc496c8bf6807b585251a3d9b695e1703a07bf79c7b127a0c190d6b13ebadd5ab6aeb39b5162dbd56f1049f831ae000c",
      },
      {
        vote: true,
        index: 3,
        signature:
          "0x797cb99686ab8ddda3d0ee39afb9e8268d83f77ad315b8034f8ec2ac73e57a74cc5d9becfdb6b7ff52b551f5cfda21035e9e373b1c2f68428d4c530455888606",
      },
      {
        vote: true,
        index: 4,
        signature:
          "0x5a7239242231c3322ef376f99c737893897f273db46746b24f5306970739b0464910fe334fa456b957cc6fda1eac1f97c822368310b81a1fd6405d8a496d380f",
      },
    ],
  },
  {
    target: "0xb02d0c733076bb73458333c09682905985c7a0c62ae1f5dcf2e5b7f045f999e2",
    age: 0,
    votes: [
      {
        vote: false,
        index: 0,
        signature:
          "0x6da825821a51ebb2a299247bd9d96ecd8156c1dac2319dc68b2dd6138c2cfdda0c08683602ef6f7863b7fc552c695dbff1f4da22afaf3be6a7f0970095848805",
      },
      {
        vote: false,
        index: 1,
        signature:
          "0xfa91463cc1143b6ba63fdd6f276a989ee52b5d8e02b286bcc02372a878721ff421a3d97d1bee8749508fba1c633808dd6d68c36f7749973713ae61c543e6cf05",
      },
      {
        vote: false,
        index: 2,
        signature:
          "0xa0137a732ad9d31263ac1b391515cf774b23bb2a6f36ea1283fb8a3c0937e810543ba123162f4310a978a7a485a565fd33d58aa9a9115dbe230e542b3efeef0e",
      },
      {
        vote: false,
        index: 3,
        signature:
          "0xba192030e9425e931628a510c82c2609b12cc2a7b9b720add4a41a6637561097201e5db7fb1e80afb8fd6787f81c25939e3b881f82a2537359882ea8a6649c0b",
      },
      {
        vote: false,
        index: 4,
        signature:
          "0x6e05d3e3ea4e7e17eab6cef96a4ddb360db3d65f3607718852e03932ab3898f667f5741cbb1c372e9d3c1508c66686e1dbee80bac0ba43428653a8ba9a3ddc0c",
      },
    ],
  },
].map(createVerdict);

export const culprits = [
  {
    target: "0xb02d0c733076bb73458333c09682905985c7a0c62ae1f5dcf2e5b7f045f999e2",
    key: "0x4418fb8c85bb3985394a8c2756d3643457ce614546202a2f50b093d762499ace",
    signature:
      "0x7dd47778df5a92612c2d1965c7b0e34fd7a0c4ad8298646ad67baf68bda9d54bd2f839aaa4e263991eba388e6963ea16eb536709a00257a88201c51bd3956800",
  },
  {
    target: "0xb02d0c733076bb73458333c09682905985c7a0c62ae1f5dcf2e5b7f045f999e2",
    key: "0xad93247bd01307550ec7acd757ce6fb805fcf73db364063265b30a949e90d933",
    signature:
      "0xd7d972345ae1daef5d57dcf3cf5c4f084c58b6d930cae48feae7bfca9c33b0c80468fa3b4162110897cd99248a973a662cd3162504ae3322d2d5ebee0ee8b30d",
  },
].map(createCulprit);

export const faults = [
  {
    target: "0x253a07e4ceacf3541a6b529c5d8089180a226d3acb9d10b9c3026cd2744a893b",
    vote: false,
    key: "0xf30aa5444688b3cab47697b37d5cac5707bb3289e986b19b17db437206931a8d",
    signature:
      "0xac99e7bae95acaaed8c983d5cad35faeffd51b1a23e977d6e4b1c3f24f9585a0960184d42a4bd0d6cc216f88119e69e2c219cedd74ca46b64944307474646e0d",
  },
].map(createFault);

export function workReport(packageHash: WorkPackageHash, coreIndex: number) {
  const workPackageSpec = WorkPackageSpec.create({
    hash: packageHash,
    length: tryAsU32(0),
    erasureRoot: Bytes.zero(HASH_SIZE).asOpaque(),
    exportsRoot: Bytes.zero(HASH_SIZE).asOpaque(),
    exportsCount: tryAsU16(0),
  });
  const context = RefineContext.create({
    anchor: Bytes.zero(HASH_SIZE).asOpaque(),
    stateRoot: Bytes.zero(HASH_SIZE).asOpaque(),
    beefyRoot: Bytes.zero(HASH_SIZE).asOpaque(),
    lookupAnchor: Bytes.zero(HASH_SIZE).asOpaque(),
    lookupAnchorSlot: tryAsTimeSlot(0),
    prerequisites: [],
  });
  return WorkReport.create({
    workPackageSpec,
    context,
    coreIndex: tryAsCoreIndex(coreIndex),
    authorizerHash: Bytes.zero(HASH_SIZE).asOpaque(),
    authorizationOutput: BytesBlob.parseBlob("0x030201"),
```
