---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.test.ts#L94-L177
title: packages/jam/transition/accumulate/accumulate.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 13
content_sha: 0d87a874f1c05b0627960003b7cad5b58f53eb7179b9d75d901c65e91ad622dc
language: typescript
---
`packages/jam/transition/accumulate/accumulate.test.ts` (lines 94–177)

```typescript
            ].map((x) => HashSet.from(x.map((x) => hashFromString<WorkPackageHash>(x)))),
            tinyChainSpec,
          ),
          accumulationQueue: tryAsPerEpochBlock(
            [
              [],
              [
                createNotAccumulatedWorkReport(
                  hashFromString("0xa7a66c1635f45e0413cec365f60fb46fa0489c4d2df75f6fd9c00d1da3729222"),
                  [hashFromString("0x38b7a75bd6d296f01fc6b4b6569c38980af6ba2ea34e22d429cccfb6f5b7432a")],
                  [hashFromString("0x38b7a75bd6d296f01fc6b4b6569c38980af6ba2ea34e22d429cccfb6f5b7432a")],
                  tryAsServiceId(1729),
                ),
              ],
              [],
              [],
              [],
              [],
              [
                createNotAccumulatedWorkReport(
                  hashFromString("0x38b7a75bd6d296f01fc6b4b6569c38980af6ba2ea34e22d429cccfb6f5b7432a"),
                  [hashFromString("0x17e5809e4d5e9daf50361fb6557a00814301159fc81a39cd4d2687e110e0b7be")],
                  [hashFromString("0x17e5809e4d5e9daf50361fb6557a00814301159fc81a39cd4d2687e110e0b7be")],
                  tryAsServiceId(1729),
                ),
                createNotAccumulatedWorkReport(
                  hashFromString("0x17e5809e4d5e9daf50361fb6557a00814301159fc81a39cd4d2687e110e0b7be"),
                  [hashFromString("0x36a748779db31316ac26eebc08dadbeda8a8d4794892f6e340e32ab69e0d4d80")],
                  [hashFromString("0x36a748779db31316ac26eebc08dadbeda8a8d4794892f6e340e32ab69e0d4d80")],
                  tryAsServiceId(1729),
                ),
              ],
              [],
              [],
              [],
              [
                createNotAccumulatedWorkReport(
                  hashFromString("0x36a748779db31316ac26eebc08dadbeda8a8d4794892f6e340e32ab69e0d4d80"),
                  [hashFromString("0xd3d0ac423a2e9451db2e88bd75cc143b19424747fbcf2696792987436e8722a6")],
                  [hashFromString("0xd3d0ac423a2e9451db2e88bd75cc143b19424747fbcf2696792987436e8722a6")],
                  tryAsServiceId(1729),
                ),
              ],
              [
                createNotAccumulatedWorkReport(
                  hashFromString("0x18176cfbff4a8b40f2d9cba3c2ddc4a5b75e9152c8c41452cda90bebc0632013"),
                  [hashFromString("0xa7a66c1635f45e0413cec365f60fb46fa0489c4d2df75f6fd9c00d1da3729222")],
                  [hashFromString("0xa7a66c1635f45e0413cec365f60fb46fa0489c4d2df75f6fd9c00d1da3729222")],
                  tryAsServiceId(1729),
                ),
                createNotAccumulatedWorkReport(
                  hashFromString("0xf5983aaa6fe1e7428902ace29d14be81a664a65f6dfca1138ccb99136547324e"),
                  [hashFromString("0x18176cfbff4a8b40f2d9cba3c2ddc4a5b75e9152c8c41452cda90bebc0632013")],
                  [hashFromString("0x18176cfbff4a8b40f2d9cba3c2ddc4a5b75e9152c8c41452cda90bebc0632013")],
                  tryAsServiceId(1729),
                ),
              ],
            ],
            tinyChainSpec,
          ),
        });

        const expectedServices = createServices([
          [
            tryAsServiceId(1729),
            hashFromString("0x3ecc56accce719e5214e8dbb034f49d5cf0c6942da3e5f3f047d1693cc60c74a"),
            preimageBlob,
            { lastAccumulation: tryAsTimeSlot(47) },
          ],
        ]);
        const expectedState: AccumulateState = InMemoryState.partial(tinyChainSpec, {
          timeslot: input.slot,
          services: expectedServices,
          privilegedServices: state.privilegedServices,
          recentlyAccumulated: tryAsPerEpochBlock(
            [
              [],
              [],
              [],
              [],
              ["0x04f5f2b6509d847d49487d5db1275e8105225018952c7aec9d2d90f039c50e45"],
              ["0x506524cb141b83715705c05983d17ebc7760c64d2ce81f15b6bc2dd1eeb55551"],
              ["0x7bbdd7961afb2db642f7cdb87021fb053c67d2ac79d69a87fc9fbcf6786e30b9"],
              [],
```
