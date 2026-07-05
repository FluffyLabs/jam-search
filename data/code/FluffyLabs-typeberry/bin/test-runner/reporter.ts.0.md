---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/reporter.ts#L1-L79
title: bin/test-runner/reporter.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a50eaa3afec52b253de14edcd1a77fd9712c8449ae65b77d495a80a3a577ec79
language: typescript
---
`bin/test-runner/reporter.ts` (lines 1–79)

```typescript
import type { WriteStream } from "node:fs";
import { Transform, type TransformCallback } from "node:stream";

export class Reporter extends Transform {
  public headerPrinted = false;
  public currentTest = "";
  public testPassed = 0;
  public testFailed = 0;

  static new(suiteName: string) {
    return new Reporter(suiteName);
  }

  private constructor(public readonly suiteName: string) {
    super({
      writableObjectMode: true,
      transform: myTransform,
    });
  }

  finalize(fileStream: WriteStream) {
    const status = this.testFailed === 0 ? "OK ✅" : "❌";
    fileStream.write(
      `</details>

### ${this.suiteName} test vectors ${this.testPassed}/${this.testPassed + this.testFailed} ${status}
      `,
    );
  }
}

type TestEvent = {
  type: string;
  data: {
    name: string;
    details: {
      error?: Error;
    };
  };
};

function myTransform(this: Reporter, event: TestEvent, _encoding: BufferEncoding, callback: TransformCallback): void {
  switch (event.type) {
    case "test:start":
      this.currentTest = event.data.name;
      if (!this.headerPrinted) {
        callback(
          null,
          `
<details>
<summary>View all</summary>

|  Name  |  Status  | |
|--------|----------|-|
`,
        );
        this.headerPrinted = true;
      } else {
        callback(null);
      }
      break;
    case "test:pass":
      this.testPassed += 1;
      callback(null, `| ${this.currentTest} | ✅ | | \n`);
      break;
    case "test:fail": {
      this.testFailed += 1;
      let errorMsg = "";
      const failureCause = event.data.details.error?.cause;
      if (failureCause instanceof Error) {
        errorMsg = failureCause.message;
      }
      callback(null, `| ${this.currentTest} | ❌ | \`\`\`${errorMsg.replace(/\n/g, " ")}\`\`\`|\n`);
      break;
    }
    default:
      callback(null);
  }
}
```
