---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/in-memory-state-codec.ts#L125-L211
title: packages/jam/state-merkleization/in-memory-state-codec.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 2
content_sha: a67f43a95d35710f861fe6576d6018977af0b967ffea33d1522cbb7be288a57e
language: typescript
---
`packages/jam/state-merkleization/in-memory-state-codec.ts` (lines 125–211)

```typescript
      return entries;
    },
    (items): HashDictionary<PreimageHash, LookupHistoryItem[]> => {
      const dict = HashDictionary.new<PreimageHash, LookupHistoryItem[]>();
      for (const { key, data } of items) {
        const items = dict.get(key) ?? [];
        items.push(...data);
        dict.set(key, items);
      }
      return dict;
    },
  );

class ServiceWithCodec extends InMemoryService {
  static Codec = codec.Class(ServiceWithCodec, {
    serviceId: codec.u32.asOpaque<ServiceId>(),
    data: codec.object<InMemoryService["data"]>({
      info: ServiceAccountInfo.Codec,
      preimages: codecHashDictionary(PreimageItem.Codec, (x) => x.hash),
      lookupHistory: lookupHistoryCodec,
      storage: codecMap(StorageItem.Codec, (x) => x.key.toString()),
    }),
  });

  private constructor(id: ServiceId, data: InMemoryService["data"]) {
    super(id, data);
  }

  static create({ serviceId, data }: CodecRecord<ServiceWithCodec>) {
    return new ServiceWithCodec(serviceId, data);
  }
}

export const inMemoryStateCodec = (spec: ChainSpec) =>
  codec.Class(
    class State extends InMemoryState {
      static create(data: CodecRecord<InMemoryState>) {
        return InMemoryState.new(spec, data);
      }
    },
    {
      // alpha
      authPools: serialize.authPools.Codec,
      // phi
      authQueues: serialize.authQueues.Codec,
      // beta
      recentBlocks: serialize.recentBlocks.Codec,
      // gamma_k
      nextValidatorData: codecPerValidator(ValidatorData.Codec),
      // gamma_z
      epochRoot: codec.bytes(BANDERSNATCH_RING_ROOT_BYTES).asOpaque<BandersnatchRingRoot>(),
      // gamma_s
      sealingKeySeries: SafroleSealingKeysData.Codec,
      // gamma_a
      ticketsAccumulator: codec
        .readonlyArray(codec.sequenceVarLen(Ticket.Codec))
        .convert<State["ticketsAccumulator"]>((x) => x, asKnownSize),
      // psi
      disputesRecords: serialize.disputesRecords.Codec,
      // eta
      entropy: serialize.entropy.Codec,
      // iota
      designatedValidatorData: serialize.designatedValidators.Codec,
      // kappa
      currentValidatorData: serialize.currentValidators.Codec,
      // lambda
      previousValidatorData: serialize.previousValidators.Codec,
      // rho
      availabilityAssignment: serialize.availabilityAssignment.Codec,
      // tau
      timeslot: serialize.timeslot.Codec,
      // chi
      privilegedServices: serialize.privilegedServices.Codec,
      // pi
      statistics: serialize.statistics.Codec,
      // omega
      accumulationQueue: serialize.accumulationQueue.Codec,
      // xi
      recentlyAccumulated: serialize.recentlyAccumulated.Codec,
      // theta
      accumulationOutputLog: serialize.accumulationOutputLog.Codec,
      // delta
      services: codec.dictionary(codec.u32.asOpaque<ServiceId>(), ServiceWithCodec.Codec, {
        sortKeys: (a, b) => a - b,
      }),
    },
  );
```
