---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-data.test.ts#L106-L188
title: packages/jam/transition/accumulate/accumulate-data.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 61ecaa08223581f3164521c872656d406d571d1b81ee0fc877b3fe494ad8b706
language: typescript
---
`packages/jam/transition/accumulate/accumulate-data.test.ts` (lines 106–188)

```typescript
      const autoAccumulateServices = createAutoAccumulate([[129, autoAccumulateGas]]);

      const reports = ArrayView.from([report]);
      const accumulateData = new AccumulateData(reports, [], autoAccumulateServices);
      const expectedGasCost = report.results.reduce((acc, result) => acc + result.gas, 0n) + autoAccumulateGas;

      const result = accumulateData.getGasLimit(serviceId);

      deepEqual(result, expectedGasCost);
    });
  });

  describe("getServiceIds", () => {
    it("should return empty array when no reports and auto accumulate services", () => {
      const accumulateData = new AccumulateData(ArrayView.from([]), [], new Map());

      const result = accumulateData.getServiceIds();

      deepEqual(result, []);
    });

    it("should return unique service ids from reports", () => {
      const reports = ArrayView.from([getWorkReport(), getWorkReport()]);
      const expectedServiceIds = [129].map(tryAsServiceId);
      const accumulateData = new AccumulateData(reports, [], new Map());

      const result = accumulateData.getServiceIds();

      deepEqual(result, expectedServiceIds);
    });

    it("should return unique service ids from auto accumulate services", () => {
      const autoAccumulateServices = createAutoAccumulate([
        [129, 0n],
        [129, 0n],
      ]);
      const expectedServiceIds = [129].map(tryAsServiceId);
      const accumulateData = new AccumulateData(ArrayView.from([]), [], autoAccumulateServices);

      const result = accumulateData.getServiceIds();

      deepEqual(result, expectedServiceIds);
    });

    it("should return unique service ids from reports and auto accumulate services", () => {
      const reports = ArrayView.from([getWorkReport()]);
      const autoAccumulateServices = createAutoAccumulate([[129, 0n]]);
      const expectedServiceIds = [129].map(tryAsServiceId);
      const accumulateData = new AccumulateData(reports, [], autoAccumulateServices);

      const result = accumulateData.getServiceIds();

      deepEqual(result, expectedServiceIds);
    });
  });

  describe("getTransfers", () => {
    it("should return transfers for a service id", () => {
      const serviceId = tryAsServiceId(129);
      const transfer = getTransfer(serviceId);
      const transfers = [transfer];
      const accumulateData = new AccumulateData(ArrayView.from([]), transfers, new Map());

      const result = accumulateData.getTransfers(serviceId);

      deepEqual(result, transfers);
    });
  });

  describe("getOperands", () => {
    it("should return operands for a service id", () => {
      const serviceId = tryAsServiceId(129);
      const report = getWorkReport();
      const reports = ArrayView.from([report]);
      const accumulateData = new AccumulateData(reports, [], new Map());
      const expectedOperands = transformReportToOperands(report);

      const result = accumulateData.getOperands(serviceId);

      deepEqual(result, expectedOperands);
    });
  });
});
```
