---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/statistics.ts#L139-L218
title: packages/jam/state/statistics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 9658891c1fc4b1d730a7d6e892c622ff5a4ea2a9fc5bd7a62a0999a0354528e0
language: typescript
---
`packages/jam/state/statistics.ts` (lines 139–218)

```typescript
    refinementCount: codec.varU32,
    refinementGasUsed: codecVarGas,
    imports: codecVarU16,
    extrinsicCount: codecVarU16,
    extrinsicSize: codec.varU32,
    exports: codecVarU16,
    accumulateCount: codec.varU32,
    accumulateGasUsed: codecVarGas,
  });

  static create(v: CodecRecord<ServiceStatistics>) {
    return new ServiceStatistics(
      v.providedCount,
      v.providedSize,
      v.refinementCount,
      v.refinementGasUsed,
      v.imports,
      v.exports,
      v.extrinsicSize,
      v.extrinsicCount,
      v.accumulateCount,
      v.accumulateGasUsed,
    );
  }

  private constructor(
    /** `p.0` */
    public providedCount: U16,
    /** `p.1` */
    public providedSize: U32,
    /** `r.0` */
    public refinementCount: U32,
    /** `r.1` */
    public refinementGasUsed: ServiceGas,
    /** `i` */
    public imports: U16,
    /** `e` */
    public exports: U16,
    /** `z` */
    public extrinsicSize: U32,
    /** `x` */
    public extrinsicCount: U16,
    /** `a.0` */
    public accumulateCount: U32,
    /** `a.1` */
    public accumulateGasUsed: ServiceGas,
  ) {}

  static empty() {
    const zero = tryAsU32(0);
    const zero16 = tryAsU16(0);
    const zeroGas = tryAsServiceGas(0);
    return new ServiceStatistics(zero16, zero, zero, zeroGas, zero16, zero16, zero, zero16, zero, zeroGas);
  }
}

/** `pi`: Statistics of each validator, cores statistics and services statistics. */
export class StatisticsData {
  static Codec = codec.Class(StatisticsData, {
    current: codecPerValidator(ValidatorStatistics.Codec),
    previous: codecPerValidator(ValidatorStatistics.Codec),
    cores: codecPerCore(CoreStatistics.Codec),
    services: codec.dictionary(codec.u32.asOpaque<ServiceId>(), ServiceStatistics.Codec, {
      sortKeys: (a, b) => a - b,
    }),
  });

  static create(v: CodecRecord<StatisticsData>) {
    return new StatisticsData(v.current, v.previous, v.cores, v.services);
  }

  private constructor(
    public readonly current: PerValidator<ValidatorStatistics>,
    public readonly previous: PerValidator<ValidatorStatistics>,
    public readonly cores: PerCore<CoreStatistics>,
    public readonly services: Map<ServiceId, ServiceStatistics>,
  ) {}
}

export type StatisticsDataView = DescribedBy<typeof StatisticsData.Codec.View>;
```
