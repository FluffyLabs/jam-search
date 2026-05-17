---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.test.ts#L249-L339
title: packages/jam/transition/accumulate/accumulate.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 3
chunk_total: 13
content_sha: f98129f0cd79810af2e3bbe013d55900827c8f0eff4b4be2a547459145b8af81
language: typescript
---
`packages/jam/transition/accumulate/accumulate.test.ts` (lines 249–339)

```typescript
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

        const accumulate = new Accumulate(tinyChainSpec, blake2b, state, options);

        const mod = 2 ** 32 - MIN_PUBLIC_SERVICE_INDEX - 2 ** 8;
        const offset = MIN_PUBLIC_SERVICE_INDEX;

        const createdIds: ServiceId[] = [];
        let currentId = tryAsServiceId(MIN_PUBLIC_SERVICE_INDEX);

        for (let i = 0; i < 10; i++) {
          createdIds.push(currentId);
          currentId = tryAsServiceId(((currentId - offset + 42 + mod) % mod) + offset);
        }

        // create no duplications
        assert.ok(!accumulate.hasDuplicatedServiceIdCreated(createdIds), "Should not trigger duplicated service id!");

        // create duplication
        createdIds.push(tryAsServiceId(MIN_PUBLIC_SERVICE_INDEX));
        assert.ok(accumulate.hasDuplicatedServiceIdCreated(createdIds), "Should detect duplicated service id!");
      });
    });
  });
});

const hashFromString = <T>(blob: string): T => {
  return Bytes.parseBytes(blob, HASH_SIZE).asOpaque();
};

const createServices = (
  items: [ServiceId, OpaqueHash, BytesBlob, TestServiceInfo][],
): Map<ServiceId, InMemoryService> => {
  const services = new Map<ServiceId, InMemoryService>();
  for (const [serviceId, hash, blob, info] of items) {
    services.set(serviceId, createService(serviceId, hash, blob, info));
  }
  return services;
};

const createService = (serviceId: ServiceId, hash: OpaqueHash, blob: BytesBlob, info: TestServiceInfo) => {
  const preimages = HashDictionary.new<PreimageHash, PreimageItem>();
```
