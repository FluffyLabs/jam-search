---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/346'
title: Clean up JSON parsing code
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-22T14:22:50.000Z'
last_modified: '2025-04-22T14:22:50.000Z'
content_kind: issue
---

# Clean up JSON parsing code

## Issue by @tomusdrw

It seems the JSON code parsing got pretty messy.

Open problems:
1. Handling `Opaque` types - JSON parser is doing some unsafe casting here which is suboptimal.
2. Handling `ChainSpec`-dependent `Opaque` types (related to 1) - we should rather be explicit about it.
3. `TestObject.fromJson` vs `JsonObject.fromJson` vs `jsonObjectFromJson`
4. How to solve potential issue with unaligned json representations (w3f json different than jamduna json, etc)
5. JSON-types vs model-types, i.e. `json.object` doing conversion already.


### Example 1: Class with static property with JSON type defition & static method to convert according to chain spec.
```ts
export class JsonStatisticsData {
  vals_current!: ValidatorStatistics[];
  vals_last!: ValidatorStatistics[];
  cores!: CoreStatistics[];
  services!: ServiceStatiticsEntry[];

  static fromJson: FromJson<JsonStatisticsData> = {
    vals_current: json.array(JsonValidatorStatistics.fromJson),
    vals_last: json.array(JsonValidatorStatistics.fromJson),
    cores: json.array(JsonCoreStatistics.fromJson),
    services: json.array(serviceStatisticsEntryFromJson),
  };

  static toStatisticsData(spec: ChainSpec, statistics: JsonStatisticsData) {
    return StatisticsData.fromCodec({
      current: tryAsPerValidator(statistics.vals_current, spec),
      previous: tryAsPerValidator(statistics.vals_last, spec),
      cores: tryAsPerCore(statistics.cores, spec),
      services: new Map(statistics.services.map(x => [x.id, x.record])),
    })
  }
};
```


### Example 2: `Type` + `const`
```ts
export type ServiceStatiticsEntry = {
  id: ServiceId,
  record: ServiceStatistics,
};

export const serviceStatisticsEntryFromJson: FromJson<ServiceStatiticsEntry> = {
  id: "number",
  record: JsonServiceStatistics.fromJson,
};
```
Issues: how to handle `ChainSpec`-related data? Could be a top level `(spec: ChainSpec): FromJson<..>` function.


### Example 3: static property to convert directly to the model type.

```ts
class JsonServiceStatistics {
  static fromJson = json.object<JsonServiceStatistics, ServiceStatistics>(
    {
      provided_count: "number",
      provided_size: "number",
      refinement_count: "number",
      refinement_gas_used: json.fromNumber(tryAsServiceGas),
      imports: "number",
      exports: "number",
      extrinsic_size: "number",
      extrinsic_count: "number",
      accumulate_count: "number",
      accumulate_gas_used: json.fromNumber(tryAsServiceGas),
      on_transfers_count: "number",
      on_transfers_gas_used: json.fromNumber(tryAsServiceGas),
    },
    ({
      provided_count,
      provided_size,
      refinement_count,
      refinement_gas_used,
      imports,
      exports,
      extrinsic_size,
      extrinsic_count,
      accumulate_count,
      accumulate_gas_used,
      on_transfers_count,
      on_transfers_gas_used,
    }) => {
      return ServiceStatistics.fromCodec({
        providedCount: provided_count,
        providedSize: provided_size,
        refinementCount: refinement_count,
        refinementGasUsed: refinement_gas_used,
        imports,
        exports,
        extrinsicSize: extrinsic_size,
        extrinsicCount: extrinsic_count,
        accumulateCount: accumulate_count,
        accumulateGasUsed: accumulate_gas_used,
        onTransfersCount: on_transfers_count,
        onTransfersGasUsed: on_transfers_gas_used,
      });
    },
  );

  provided_count!: U16;
  provided_size!: U32;
  refinement_count!: U32;
  refinement_gas_used!: ServiceGas;
  imports!: U16;
  exports!: U16;
  extrinsic_size!: U32;
  extrinsic_count!: U16;
  accumulate_count!: U32;
  accumulate_gas_used!: ServiceGas;
  on_transfers_count!: U32;
  on_transfers_gas_used!: ServiceGas;
}
```

Issue: conversion to `spec`-related data. Again could be a `(spec: ChainSpec) => ` `fromJson` function.
