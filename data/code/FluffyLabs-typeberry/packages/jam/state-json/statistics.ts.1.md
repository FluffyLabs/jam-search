---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/statistics.ts#L138-L163
title: packages/jam/state-json/statistics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: e37c7f83e0a13cdd94713d91b6b400a284d6a0863876bfa6c7870e263541d2c7
language: typescript
---
`packages/jam/state-json/statistics.ts` (lines 138–163)

```typescript
  vals_last!: ValidatorStatistics[];
  cores!: CoreStatistics[] | null;
  services!: ServiceStatisticsEntry[] | null;

  static fromJson: FromJson<JsonStatisticsData> = {
    vals_current: json.array(JsonValidatorStatistics.fromJson),
    vals_last: json.array(JsonValidatorStatistics.fromJson),
    cores: json.nullable(json.array(JsonCoreStatistics.fromJson)),
    services: json.nullable(json.array(serviceStatisticsEntryFromJson)),
  };

  static toStatisticsData(spec: ChainSpec, statistics: JsonStatisticsData) {
    return StatisticsData.create({
      current: tryAsPerValidator(statistics.vals_current, spec),
      previous: tryAsPerValidator(statistics.vals_last, spec),
      cores:
        statistics.cores === null
          ? tryAsPerCore(
              Array.from({ length: spec.coresCount }, () => CoreStatistics.empty()),
              spec,
            )
          : tryAsPerCore(statistics.cores, spec),
      services: statistics.services === null ? new Map() : new Map(statistics.services.map((x) => [x.id, x.record])),
    });
  }
}
```
