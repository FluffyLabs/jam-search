---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-data.test.ts#L1-L109
title: packages/jam/transition/accumulate/accumulate-data.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 2
content_sha: e0542ee7c314eb1dc8c5da35ccfc819595505cc5e2eacd7d792b107bcc2d811e
language: typescript
---
`packages/jam/transition/accumulate/accumulate-data.test.ts` (lines 1–109)

```typescript
import { describe, it } from "node:test";
import { type ServiceGas, type ServiceId, tryAsServiceGas, tryAsServiceId } from "@typeberry/block";
import { testWorkReportHex } from "@typeberry/block/test-helpers.js";
import { WorkReport } from "@typeberry/block/work-report.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { Decoder } from "@typeberry/codec";
import { ArrayView } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { PendingTransfer, TRANSFER_MEMO_BYTES } from "@typeberry/jam-host-calls";
import { tryAsU64 } from "@typeberry/numbers";
import { deepEqual } from "@typeberry/utils";
import { AccumulateData } from "./accumulate-data.js";
import { Operand } from "./operand.js";

const getWorkReport = () => {
  const hex = testWorkReportHex();
  return Decoder.decodeObject(WorkReport.Codec, BytesBlob.parseBlob(hex), tinyChainSpec);
};

const getTransfer = (serviceId: ServiceId) => {
  return PendingTransfer.create({
    source: tryAsServiceId(0),
    destination: serviceId,
    amount: tryAsU64(0),
    gas: tryAsServiceGas(0),
    memo: Bytes.zero(TRANSFER_MEMO_BYTES),
  });
};

const createAutoAccumulate = (autoAccumulateEntries: [number, bigint][]) => {
  const autoAccumulate = new Map<ServiceId, ServiceGas>();

  for (const [serviceId, gasCost] of autoAccumulateEntries) {
    autoAccumulate.set(tryAsServiceId(serviceId), tryAsServiceGas(gasCost));
  }

  return autoAccumulate;
};

const transformReportToOperands = (report: WorkReport) => {
  const operands: Operand[] = [];

  for (const result of report.results) {
    operands.push(
      Operand.new({
        gas: result.gas, // g
        payloadHash: result.payloadHash, // y
        result: result.result, // d
        authorizationOutput: report.authorizationOutput, // o
        exportsRoot: report.workPackageSpec.exportsRoot, // e
        hash: report.workPackageSpec.hash, // h
        authorizerHash: report.authorizerHash, // a
      }),
    );
  }

  return operands;
};

describe("AccumulateData", () => {
  describe("getOperands", () => {
    it("should return correct operands for a report", () => {
      const serviceId = tryAsServiceId(129);
      const report = getWorkReport();
      const reports = ArrayView.from([report]);
      const accumulateData = new AccumulateData(reports, [], new Map());
      const expectedOperands = transformReportToOperands(report);

      const result = accumulateData.getOperands(serviceId);

      deepEqual(result, expectedOperands);
    });
  });

  describe("getReportsLength", () => {
    it("should return correct reports length for a report", () => {
      const serviceId = tryAsServiceId(129);
      const report = getWorkReport();
      const reports = ArrayView.from([report]);
      const accumulateData = new AccumulateData(reports, [], new Map());
      const expectedLength = report.results.length;

      const result = accumulateData.getReportsLength(serviceId);

      deepEqual(result, expectedLength);
    });
  });

  describe("getGasCost", () => {
    it("should return correct gas cost for a report", () => {
      const serviceId = tryAsServiceId(129);
      const report = getWorkReport();
      const reports = ArrayView.from([report]);
      const accumulateData = new AccumulateData(reports, [], new Map());
      const expectedGasCost = report.results.reduce((acc, result) => acc + result.gas, 0n);

      const result = accumulateData.getGasLimit(serviceId);

      deepEqual(result, expectedGasCost);
    });

    it("should return correct gas cost for a report and auto accumulate service", () => {
      const serviceId = tryAsServiceId(129);
      const report = getWorkReport();
      const autoAccumulateGas = 100n;
      const autoAccumulateServices = createAutoAccumulate([[129, autoAccumulateGas]]);

      const reports = ArrayView.from([report]);
      const accumulateData = new AccumulateData(reports, [], autoAccumulateServices);
```
