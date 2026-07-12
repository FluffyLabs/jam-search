---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/statistics.ts#L1-L143
title: packages/jam/state-json/statistics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 1699af4d87fe0081f4dbc41677ac177cf04d53d444394cbc110b271115444436
language: typescript
---
`packages/jam/state-json/statistics.ts` (lines 1–143)

```typescript
import { type ServiceGas, type ServiceId, tryAsPerValidator, tryAsServiceGas } from "@typeberry/block";
import type { ChainSpec } from "@typeberry/config";
import { type FromJson, json } from "@typeberry/json-parser";
import type { U16, U32 } from "@typeberry/numbers";
import { CoreStatistics, ServiceStatistics, StatisticsData, tryAsPerCore, ValidatorStatistics } from "@typeberry/state";

export class JsonValidatorStatistics {
  static fromJson = json.object<JsonValidatorStatistics, ValidatorStatistics>(
    {
      blocks: "number",
      tickets: "number",
      pre_images: "number",
      pre_images_size: "number",
      guarantees: "number",
      assurances: "number",
    },
    ({ blocks, tickets, pre_images, pre_images_size, guarantees, assurances }) => {
      return ValidatorStatistics.create({
        blocks,
        tickets,
        preImages: pre_images,
        preImagesSize: pre_images_size,
        guarantees,
        assurances,
      });
    },
  );

  blocks!: U32;
  tickets!: U32;
  pre_images!: U32;
  pre_images_size!: U32;
  guarantees!: U32;
  assurances!: U32;
}

export class JsonCoreStatistics {
  static fromJson = json.object<JsonCoreStatistics, CoreStatistics>(
    {
      da_load: "number",
      popularity: "number",
      imports: "number",
      exports: "number",
      extrinsic_size: "number",
      extrinsic_count: "number",
      bundle_size: "number",
      gas_used: json.fromBigInt(tryAsServiceGas),
    },
    ({ da_load, popularity, imports, exports, extrinsic_size, extrinsic_count, bundle_size, gas_used }) => {
      return CoreStatistics.create({
        dataAvailabilityLoad: da_load,
        popularity,
        imports,
        exports,
        extrinsicSize: extrinsic_size,
        extrinsicCount: extrinsic_count,
        bundleSize: bundle_size,
        gasUsed: gas_used,
      });
    },
  );

  da_load!: U32;
  popularity!: U16;
  imports!: U16;
  exports!: U16;
  extrinsic_size!: U32;
  extrinsic_count!: U16;
  bundle_size!: U32;
  gas_used!: ServiceGas;
}

class JsonServiceStatistics {
  static fromJson = json.object<JsonServiceStatistics, ServiceStatistics>(
    {
      provided_count: "number",
      provided_size: "number",
      refinement_count: "number",
      refinement_gas_used: json.fromBigInt(tryAsServiceGas),
      imports: "number",
      exports: "number",
      extrinsic_size: "number",
      extrinsic_count: "number",
      accumulate_count: "number",
      accumulate_gas_used: json.fromBigInt(tryAsServiceGas),
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
    }) => {
      return ServiceStatistics.create({
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
}

export type ServiceStatisticsEntry = {
  id: ServiceId;
  record: ServiceStatistics;
};

export const serviceStatisticsEntryFromJson: FromJson<ServiceStatisticsEntry> = {
  id: "number",
  record: JsonServiceStatistics.fromJson,
};

export class JsonStatisticsData {
  vals_current!: ValidatorStatistics[];
  vals_last!: ValidatorStatistics[];
  cores!: CoreStatistics[] | null;
  services!: ServiceStatisticsEntry[] | null;

  static fromJson: FromJson<JsonStatisticsData> = {
    vals_current: json.array(JsonValidatorStatistics.fromJson),
```
