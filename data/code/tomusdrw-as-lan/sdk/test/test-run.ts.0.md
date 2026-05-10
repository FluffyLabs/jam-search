---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-run.ts#L1-L43'
title: sdk/test/test-run.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: de5e53362eedbf0f509b599d0633a1fbea110f88a8c7ac6b0ad111cc3b997bb7
language: typescript
---
`sdk/test/test-run.ts` (lines 1–43)

```typescript
import * as byteBuf from "../core/byte-buf.test";
import * as bytes from "../core/bytes.test";
import * as decode from "../core/codec/decode.test";
import * as encode from "../core/codec/encode.test";
import * as roundtrip from "../core/codec/index.test";
import * as blake2b from "../core/crypto/blake2b.test";
import * as accountInfo from "../jam/account-info.test";
import * as admin from "../jam/accumulate/admin.test";
import * as childServices from "../jam/accumulate/child-services.test";
import * as accumulateItem from "../jam/accumulate/item.test";
import * as selfService from "../jam/accumulate/self-service.test";
import * as transferTest from "../jam/accumulate/transfer.test";
import * as context from "../jam/context.test";
import * as machine from "../jam/machine.test";
import * as preimages from "../jam/preimages.test";
import * as nestedPvm from "../jam/refine/nested-pvm.test";
import * as service from "../jam/service.test";
import * as workPackage from "../jam/work-package.test";

import { runTestSuites, TestSuite } from "./utils";

export function runAllTests(): void {
  runTestSuites([
    TestSuite.create(byteBuf.TESTS, "byte-buf.ts"),
    TestSuite.create(bytes.TESTS, "bytes.ts"),
    TestSuite.create(decode.TESTS, "decode.ts"),
    TestSuite.create(encode.TESTS, "encode.ts"),
    TestSuite.create(roundtrip.TESTS, "roundtrip.ts"),
    TestSuite.create(blake2b.TESTS, "blake2b.ts"),
    TestSuite.create(accountInfo.TESTS, "account-info.ts"),
    TestSuite.create(accumulateItem.TESTS, "accumulate-item.ts"),
    TestSuite.create(admin.TESTS, "admin.ts"),
    TestSuite.create(childServices.TESTS, "child-services.ts"),
    TestSuite.create(context.TESTS, "context.ts"),
    TestSuite.create(machine.TESTS, "machine.ts"),
    TestSuite.create(nestedPvm.TESTS, "nested-pvm.ts"),
    TestSuite.create(preimages.TESTS, "preimages.ts"),
    TestSuite.create(selfService.TESTS, "self-service.ts"),
    TestSuite.create(service.TESTS, "service.ts"),
    TestSuite.create(transferTest.TESTS, "transfer.ts"),
    TestSuite.create(workPackage.TESTS, "work-package.ts"),
  ]);
}
```
