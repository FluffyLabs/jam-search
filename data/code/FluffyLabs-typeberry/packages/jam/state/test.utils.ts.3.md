---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/test.utils.ts#L221-L332
title: packages/jam/state/test.utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 3
chunk_total: 47
content_sha: 8bff0069dc5c9a906860e272ba1a24cc25ec69dabdc7273ad939153393188694
language: typescript
---
`packages/jam/state/test.utils.ts` (lines 221–332)

```typescript
          activityRecord(0, 0, 0, 0, 0, 0),
          activityRecord(0, 0, 0, 0, 0, 0),
          activityRecord(0, 0, 0, 0, 0, 0),
          activityRecord(0, 0, 0, 0, 0, 0),
        ],
        spec,
      ),
      cores: tryAsPerCore(
        [
          CoreStatistics.create({
            dataAvailabilityLoad: tryAsU32(0),
            gasUsed: tryAsServiceGas(0),
            extrinsicCount: tryAsU16(0),
            extrinsicSize: tryAsU32(0),
            popularity: tryAsU16(0),
            imports: tryAsU16(0),
            exports: tryAsU16(0),
            bundleSize: tryAsU32(270),
          }),
          CoreStatistics.empty(),
        ],
        spec,
      ),
      services: new Map([
        [
          tryAsServiceId(0),
          ServiceStatistics.create({
            extrinsicCount: tryAsU16(0),
            extrinsicSize: tryAsU32(0),
            imports: tryAsU16(0),
            exports: tryAsU16(0),
            providedCount: tryAsU16(0),
            providedSize: tryAsU32(0),
            refinementCount: tryAsU32(1),
            refinementGasUsed: tryAsServiceGas(0),
            accumulateCount: tryAsU32(0),
            accumulateGasUsed: tryAsServiceGas(0),
          }),
        ],
      ]),
    }),
    // theta
    accumulationQueue: tryAsPerEpochBlock(
      repeat(spec.epochLength, () => []),
      spec,
    ),
    // xi
    recentlyAccumulated: tryAsPerEpochBlock(
      repeat(spec.epochLength, () => HashSet.new()),
      spec,
    ),
    // gamma_a
    ticketsAccumulator: asKnownSize([
      Ticket.create({
        id: b32("0x0b7537993b0a700def26bb16e99ed0bfb530f616e4c13cf63ecb60bcbe83387d"),
        attempt: attempt(2),
      }),
      Ticket.create({
        id: b32("0x1912baa74049a4cad89dc3f0646144459b691b926cf8b9c1c4a5bbfa1ee0c331"),
        attempt: attempt(1),
      }),
      Ticket.create({
        id: b32("0x22fdcfa858e5195e222174597d7d33bd66d97748c413b876f7a132134ce9baef"),
        attempt: attempt(0),
      }),
      Ticket.create({
        id: b32("0x23bd628fd365a0f3ecd10db746dd04ec5efe61f96da19ae070c44b97d3c9a7b8"),
        attempt: attempt(2),
      }),
      Ticket.create({
        id: b32("0x31d6a25525ff4bd6e47e611646d7b5835b94b5c0a69c225371b2b762c93095a2"),
        attempt: attempt(1),
      }),
      Ticket.create({
        id: b32("0x31e9b8070f42d7c9083eca5879e5528191259a395761b8fcc068dcdd36b06be4"),
        attempt: attempt(1),
      }),
      Ticket.create({
        id: b32("0x39120d5b82981c7f5aba8247925f358afb9539839b61602a0726f51efb35ef4c"),
        attempt: attempt(0),
      }),
      Ticket.create({
        id: b32("0x39e2d23807ff3788156eac40cc0a622a9fd23e9468bf962aebe48079c0fd2f1a"),
        attempt: attempt(0),
      }),
      Ticket.create({
        id: b32("0x39f7d99b86f90cada4aa3b08adfe310024813fca0bdcdff944873a2cc2e47074"),
        attempt: attempt(1),
      }),
      Ticket.create({
        id: b32("0x665df13fd353ffe92e9bd68ae952f4511681f04bd2ffb9a6da1b1f5f706c53ec"),
        attempt: attempt(2),
      }),
      Ticket.create({
        id: b32("0x6b5cc620ed50042cd517ec8267706c82482f07ebcb3c65bfb6288ef5984141a7"),
        attempt: attempt(1),
      }),
      Ticket.create({
        id: b32("0x71dd32fb8a1580b4aa3213c3616d8fbbcb9edc00467c4e4548ff8a1fd815811c"),
        attempt: attempt(2),
      }),
    ]),
    // gamma_s
    sealingKeySeries: SafroleSealingKeysData.keys(
      tryAsPerEpochBlock(
        [
          b32("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
          b32("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
          b32("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
          b32("0xf16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d"),
          b32("0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d"),
          b32("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
```
