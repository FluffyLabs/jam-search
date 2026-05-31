---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/two-regs-two-imms-dispatcher.test.ts#L103-L116
title: >-
  packages/core/pvm-interpreter/ops-dispatchers/two-regs-two-imms-dispatcher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 5d3e9c2aa859dff311017cace62979ae5df70efd8b49a20e325e1ff5a95d04e7
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/two-regs-two-imms-dispatcher.test.ts` (lines 103–116)

```typescript
      .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
      .filter((entry) => instructionArgumentTypeMap[entry[1]] !== ArgumentType.TWO_REGISTERS_TWO_IMMEDIATES);

    for (const [name, instruction] of otherInstructions) {
      it(`checks if instruction ${name} = ${instruction} is not handled by TwoRegsOneImmDispatcher`, () => {
        const dispatcher = new TwoRegsTwoImmsDispatcher(loadOps, dynamicJumpOps);

        dispatcher.dispatch(instruction, argsMock);

        assert.strictEqual(mockFn.mock.calls.length, 0);
      });
    }
  });
});
```
