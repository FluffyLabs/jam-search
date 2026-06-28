---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.ts#L149-L236
title: packages/core/pvm-interpreter/args-decoder/args-decoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 4
content_sha: a9d3df55516393621c8a5140ef9137c65f04da6c7aa66cd3641c1fc3851c00b0
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.ts` (lines 149–236)

```typescript
  private code: Uint8Array = new Uint8Array();
  private mask: Mask = Mask.empty();

  reset(code: Uint8Array, mask: Mask) {
    this.code = code;
    this.mask = mask;
  }

  fillArgs<T extends Args>(pc: number, result: T): void {
    const nextInstructionDistance = 1 + this.mask.getNoOfBytesToNextInstruction(pc + 1);
    result.noOfBytesToSkip = nextInstructionDistance;

    switch (result.type) {
      case ArgumentType.NO_ARGUMENTS:
        break;

      case ArgumentType.ONE_IMMEDIATE: {
        const immediateLength = Math.min(IMMEDIATE_AND_OFFSET_MAX_LENGTH, nextInstructionDistance - 1);
        const argsStartIndex = pc + 1;
        result.immediateDecoder.setBytes(this.code.subarray(argsStartIndex, argsStartIndex + immediateLength));
        break;
      }

      case ArgumentType.THREE_REGISTERS: {
        const firstByte = this.code[pc + 1];
        const secondByte = this.code[pc + 2];
        this.nibblesDecoder.setByte(firstByte);
        result.firstRegisterIndex = this.nibblesDecoder.getLowNibbleAsRegisterIndex();
        result.secondRegisterIndex = this.nibblesDecoder.getHighNibbleAsRegisterIndex();
        this.nibblesDecoder.setByte(secondByte);
        result.thirdRegisterIndex = this.nibblesDecoder.getLowNibbleAsRegisterIndex();
        break;
      }

      case ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE: {
        const firstByte = this.code[pc + 1];
        this.nibblesDecoder.setByte(firstByte);
        result.firstRegisterIndex = this.nibblesDecoder.getLowNibbleAsRegisterIndex();
        result.secondRegisterIndex = this.nibblesDecoder.getHighNibbleAsRegisterIndex();

        const immediateLength = Math.min(IMMEDIATE_AND_OFFSET_MAX_LENGTH, Math.max(0, nextInstructionDistance - 2));
        const immediateStartIndex = pc + 2;
        const immediateEndIndex = immediateStartIndex + immediateLength;
        result.immediateDecoder.setBytes(this.code.subarray(immediateStartIndex, immediateEndIndex));
        break;
      }

      case ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET: {
        const firstByte = this.code[pc + 1];
        this.nibblesDecoder.setByte(firstByte);
        result.registerIndex = this.nibblesDecoder.getLowNibbleAsRegisterIndex();

        const immediateLength = this.nibblesDecoder.getHighNibbleAsLength();
        const immediateStartIndex = pc + 2;
        const immediateEndIndex = immediateStartIndex + immediateLength;
        result.immediateDecoder.setBytes(this.code.subarray(immediateStartIndex, immediateEndIndex));

        const offsetLength = Math.min(
          IMMEDIATE_AND_OFFSET_MAX_LENGTH,
          Math.max(0, nextInstructionDistance - 2 - immediateLength),
        );
        const offsetStartIndex = pc + 2 + immediateLength;
        const offsetEndIndex = offsetStartIndex + offsetLength;
        this.offsetDecoder.setBytes(this.code.subarray(offsetStartIndex, offsetEndIndex));

        result.nextPc = pc + this.offsetDecoder.getSigned();
        break;
      }

      case ArgumentType.TWO_REGISTERS_ONE_OFFSET: {
        const firstByte = this.code[pc + 1];
        this.nibblesDecoder.setByte(firstByte);
        result.firstRegisterIndex = this.nibblesDecoder.getLowNibbleAsRegisterIndex();
        result.secondRegisterIndex = this.nibblesDecoder.getHighNibbleAsRegisterIndex();

        const offsetLength = Math.min(IMMEDIATE_AND_OFFSET_MAX_LENGTH, Math.max(0, nextInstructionDistance - 2));
        const offsetStartIndex = pc + 2;
        const offsetEndIndex = offsetStartIndex + offsetLength;
        this.offsetDecoder.setBytes(this.code.subarray(offsetStartIndex, offsetEndIndex));

        result.nextPc = pc + this.offsetDecoder.getSigned();
        break;
      }

      case ArgumentType.TWO_REGISTERS: {
        const firstByte = this.code[pc + 1];
        this.nibblesDecoder.setByte(firstByte);
        result.firstRegisterIndex = this.nibblesDecoder.getHighNibbleAsRegisterIndex();
```
