---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.test.ts#L82-L184
title: >-
  packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 3
content_sha: c4a8dec6daadf3bac58b9f030afa9a93bd3960e6220efba0e0ff368fdf225537
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-one-offset-dispatcher.test.ts` (lines 82–184)

```typescript
      assert.strictEqual(mockFunction.mock.calls.length, 1);
    });

    it("it should call BranchOps.branchGeUnsignedImmediate", () => {
      const mockFunction = mock.fn();
      mock.method(branchOps, "branchGeUnsignedImmediate", mockFunction);
      const oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

      oneRegOneImmOneOffsetDispatcher.dispatch(Instruction.BRANCH_GE_U_IMM, argsMock);

      assert.strictEqual(mockFunction.mock.calls.length, 1);
    });

    it("it should call BranchOps.branchGtUnsignedImmediate", () => {
      const mockFunction = mock.fn();
      mock.method(branchOps, "branchGtUnsignedImmediate", mockFunction);
      const oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

      oneRegOneImmOneOffsetDispatcher.dispatch(Instruction.BRANCH_GT_U_IMM, argsMock);

      assert.strictEqual(mockFunction.mock.calls.length, 1);
    });

    it("it should call BranchOps.branchLtSignedImmediate", () => {
      const mockFunction = mock.fn();
      mock.method(branchOps, "branchLtSignedImmediate", mockFunction);
      const oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

      oneRegOneImmOneOffsetDispatcher.dispatch(Instruction.BRANCH_LT_S_IMM, argsMock);

      assert.strictEqual(mockFunction.mock.calls.length, 1);
    });

    it("it should call BranchOps.branchLeSignedImmediate", () => {
      const mockFunction = mock.fn();
      mock.method(branchOps, "branchLeSignedImmediate", mockFunction);
      const oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

      oneRegOneImmOneOffsetDispatcher.dispatch(Instruction.BRANCH_LE_S_IMM, argsMock);

      assert.strictEqual(mockFunction.mock.calls.length, 1);
    });

    it("it should call BranchOps.branchGeSignedImmediate", () => {
      const mockFunction = mock.fn();
      mock.method(branchOps, "branchGeSignedImmediate", mockFunction);
      const oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

      oneRegOneImmOneOffsetDispatcher.dispatch(Instruction.BRANCH_GE_S_IMM, argsMock);

      assert.strictEqual(mockFunction.mock.calls.length, 1);
    });

    it("it should call BranchOps.branchGtSignedImmediate", () => {
      const mockFunction = mock.fn();
      mock.method(branchOps, "branchGtSignedImmediate", mockFunction);
      const oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);

      oneRegOneImmOneOffsetDispatcher.dispatch(Instruction.BRANCH_GT_S_IMM, argsMock);

      assert.strictEqual(mockFunction.mock.calls.length, 1);
    });
  });

  describe("check if it handles other instructions than expected", () => {
    const regs = Registers.empty();
    const memory = Memory.new();
    const instructionResult = new InstructionResult();
    const basicBlocks = new BasicBlocks();
    const branchOps = BranchOps.new(regs, instructionResult, basicBlocks);
    const loadOps = LoadOps.new(regs, memory, instructionResult);

    const mockFn = mock.fn();

    function mockAllMethods(obj: object) {
      const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)) as (keyof typeof obj)[];

      for (const method of methodNames) {
        mock.method(obj, method, mockFn);
      }
    }

    before(() => {
      mockAllMethods(branchOps);
      mockAllMethods(loadOps);
    });

    after(() => {
      mock.restoreAll();
    });

    beforeEach(() => {
      mockFn.mock.resetCalls();
    });

    const argsMock = {
      immediateDecoder: ImmediateDecoder.new(),
    } as OneRegisterOneImmediateOneOffsetArgs;

    const otherInstructions = Object.entries(Instruction)
      .filter((entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number")
      .filter((entry) => instructionArgumentTypeMap[entry[1]] !== ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET);

```
