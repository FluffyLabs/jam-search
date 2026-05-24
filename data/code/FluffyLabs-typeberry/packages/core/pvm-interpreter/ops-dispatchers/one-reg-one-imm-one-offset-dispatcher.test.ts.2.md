---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.test.ts#L182-L195
title: >-
  packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 2
chunk_total: 3
content_sha: f17302cebd650f266012c83e1c3f7a535162894a8f37c123bbac8475b451e30e
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.test.ts` (lines 182–195)

```typescript
      .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
      .filter((entry) => instructionArgumentTypeMap[entry[1]] !== ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET);

    for (const [name, instruction] of otherInstructions) {
      it(`checks if instruction ${name} = ${instruction} is not handled by OneRegisterOneImmediateOneOffsetDispatcher`, () => {
        const dispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

        dispatcher.dispatch(instruction, argsMock);

        assert.strictEqual(mockFn.mock.calls.length, 0);
      });
    }
  });
});
```
