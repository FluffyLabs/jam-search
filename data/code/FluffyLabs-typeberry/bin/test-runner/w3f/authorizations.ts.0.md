---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/authorizations.ts#L1-L86
title: bin/test-runner/w3f/authorizations.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: f9e67ca01b0b6fa85315659b5682735de950cce48da4adb5fb3a0fb0f7a13938
language: typescript
---
`bin/test-runner/w3f/authorizations.ts` (lines 1–86)

```typescript
import type { CoreIndex, TimeSlot } from "@typeberry/block";
import type { AuthorizerHash } from "@typeberry/block/refine-context.js";
import { fromJson } from "@typeberry/block-json";
import { HashSet } from "@typeberry/collections/hash-set.js";
import { type FromJson, json } from "@typeberry/json-parser";
import {
  Authorization,
  type AuthorizationInput,
  type AuthorizationState,
} from "@typeberry/transition/authorization.js";
import { copyAndUpdateState } from "@typeberry/transition/test.utils.js";
import { deepEqual } from "@typeberry/utils";
import type { RunOptions } from "../common.js";

class TestCoreAuthorizer {
  static fromJson: FromJson<TestCoreAuthorizer> = {
    core: "number",
    auth_hash: fromJson.bytes32(),
  };

  core!: CoreIndex;
  auth_hash!: AuthorizerHash;
}
class Input {
  static fromJson = json.object<Input, AuthorizationInput>(
    {
      slot: "number",
      auths: json.array(TestCoreAuthorizer.fromJson),
    },
    ({ slot, auths }) => {
      const input: AuthorizationInput = {
        slot,
        used: new Map(),
      };
      for (const { core, auth_hash } of auths) {
        const perCore = input.used.get(core) ?? HashSet.new();
        perCore.insert(auth_hash);
        input.used.set(core, perCore);
      }
      return input;
    },
  );

  slot!: TimeSlot;
  auths!: TestCoreAuthorizer[];
}

class TestState {
  static fromJson = json.object<TestState, AuthorizationState>(
    {
      auth_pools: ["array", json.array(fromJson.bytes32())],
      auth_queues: ["array", json.array(fromJson.bytes32())],
    },
    ({ auth_pools, auth_queues }) => {
      return {
        authPools: auth_pools,
        authQueues: auth_queues,
      };
    },
  );

  auth_pools!: AuthorizationState["authPools"];
  auth_queues!: AuthorizationState["authQueues"];
}

export class AuthorizationsTest {
  static fromJson: FromJson<AuthorizationsTest> = {
    input: Input.fromJson,
    pre_state: TestState.fromJson,
    output: json.fromAny(() => null),
    post_state: TestState.fromJson,
  };

  input!: AuthorizationInput;
  pre_state!: AuthorizationState;
  output!: null;
  post_state!: AuthorizationState;
}

export async function runAuthorizationsTest(test: AuthorizationsTest, { chainSpec }: RunOptions) {
  const authorization = new Authorization(chainSpec, test.pre_state);
  const update = authorization.transition(test.input);
  const result = copyAndUpdateState(test.pre_state, update);

  deepEqual(result, test.post_state);
}
```
