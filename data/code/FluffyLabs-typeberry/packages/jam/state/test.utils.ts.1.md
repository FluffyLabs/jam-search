---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/test.utils.ts#L123-L180
title: packages/jam/state/test.utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 47
content_sha: c167943fe00035dd5be4c7cfcf9874363a5e6d0dc218333937ebabbc17a77cf1
language: typescript
---
`packages/jam/state/test.utils.ts` (lines 123–180)

```typescript
          accumulationResult: emptyHash(),
          postStateRoot: b32("0x59642abe3120e645f4cda9e464d1e594743f146404dd948f146cf5daf2e99660"),
          reported: HashDictionary.new(),
        }),
        BlockState.create({
          headerHash: b32("0xbed5792b7df998e5520dfbb8c91386cf2117b2c07b7837094c79d5c0b4de9de7"),
          accumulationResult: b32("0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5"),
          postStateRoot: b32("0x1324bad2e35946c1a95dd25380a6e9199fbd40045ae49eacfc67599cbd23cda7"),
          reported: HashDictionary.new(),
        }),
        BlockState.create({
          headerHash: b32("0x6ce5d0b9ec42d803bee92d7dead697df3379836b50e6ed361068ed0561b5a2b5"),
          accumulationResult: b32("0x675f9e53123c83ddcdb2c1f5231f13646378aefc83837a4571d052ac80014837"),
          postStateRoot: b32("0x331f8a5b07cfc35cd75749c605146d48a4863af1b8a578160f188f4a725c1236"),
          reported: HashDictionary.new(),
        }),
        BlockState.create({
          headerHash: b32("0x7897a9dd7529d62d8be3a0e1ddc2e36795e2fbcacdd738cd9d75b4e00b186d33"),
          accumulationResult: b32("0xb4c11951957c6f8f642c4af61cd6b24640fec6dc7fc607ee8206a99e92410d30"),
          postStateRoot: b32("0xfbae2505572f332ad18dd75ecfa1aa4be7959f1666ed75d3241505c4ca3dd3fc"),
          reported: HashDictionary.new(),
        }),
        BlockState.create({
          headerHash: b32("0x72b9718488b532a4e93788865bf47291e57cfd7ca9bce755814fd8e2db2d41c8"),
          accumulationResult: b32("0xe884038e46068eaab1df24317c855e78fe94335d4adb7aa6c62920ce1352eed7"),
          postStateRoot: emptyHash(),
          reported: HashDictionary.new(),
        }),
      ]),
      accumulationLog: {
        peaks: [emptyHash(), null, b32("0xb4c11951957c6f8f642c4af61cd6b24640fec6dc7fc607ee8206a99e92410d30")],
      },
    }),
    services: new Map([
      [
        tryAsServiceId(0),
        InMemoryService.new(tryAsServiceId(0), {
          info: ServiceAccountInfo.create({
            codeHash: b32("0x15f8485e3a88e86182e63280720d5ec9892578f0e577fb1bcdda5cf497950815"),
            balance: tryAsU64(10000000000),
            accumulateMinGas: tryAsServiceGas(100),
            onTransferMinGas: tryAsServiceGas(100),
            storageUtilisationBytes: tryAsU64(1296),
            storageUtilisationCount: tryAsU32(4),
            gratisStorage: tryAsU64(1024),
            created: tryAsTimeSlot(10),
            lastAccumulation: tryAsTimeSlot(15),
            parentService: tryAsServiceId(1),
          }),
          preimages: HashDictionary.fromEntries(
            [
              PreimageItem.create({
                hash: b32("0xc16326432b5b3213dfd1609495e13c6b276cb474d679645337e5c2c09f19b53c"),
                blob: BytesBlob.parseBlob("0x09626f6f74737472617000000000000000000020000a00000000000628023307320015"),
              }),
              PreimageItem.create({
                hash: b32("0x15f8485e3a88e86182e63280720d5ec9892578f0e577fb1bcdda5cf497950815"),
                blob: BytesBlob.parseBlob(
```
