---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/pvm-instance-manager.ts#L1-L51
title: packages/core/pvm-host-calls/pvm-instance-manager.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f37d6d5949196021779052e6c9bfb35f243ddfe43f1a9270dc6b1fc3b51d3485
language: typescript
---
`packages/core/pvm-host-calls/pvm-instance-manager.ts` (lines 1–51)

```typescript
import { PvmBackend } from "@typeberry/config";
import type { IPvmInterpreter } from "@typeberry/pvm-interface";
import { Interpreter } from "@typeberry/pvm-interpreter";
import { AnanasInterpreter } from "@typeberry/pvm-interpreter-ananas";
import { assertNever } from "@typeberry/utils";

type ResolveFn = (pvm: IPvmInterpreter) => void;

// TODO [MaSo] Delete this & also make host calls independent from intepreters.
export class PvmInstanceManager {
  private waitingQueue: ResolveFn[] = [];

  private constructor(private readonly instances: IPvmInterpreter[]) {}

  static async new(interpreter: PvmBackend): Promise<PvmInstanceManager> {
    const instances: IPvmInterpreter[] = [];
    switch (interpreter) {
      case PvmBackend.BuiltIn:
        instances.push(
          Interpreter.new({
            useSbrkGas: false,
          }),
        );
        break;
      case PvmBackend.Ananas:
        instances.push(await AnanasInterpreter.new());
        break;
      default:
        assertNever(interpreter);
    }
    return new PvmInstanceManager(instances);
  }

  async getInstance(): Promise<IPvmInterpreter> {
    const instance = this.instances.pop();
    if (instance !== undefined) {
      return Promise.resolve(instance);
    }
    return new Promise((resolve) => {
      this.waitingQueue.push(resolve);
    });
  }

  releaseInstance(pvm: IPvmInterpreter) {
    const waiting = this.waitingQueue.shift();
    if (waiting !== undefined) {
      return waiting(pvm);
    }
    this.instances.push(pvm);
  }
}
```
