---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.ts#L233-L310
title: packages/core/pvm-interpreter/args-decoder/args-decoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 2
chunk_total: 4
content_sha: f77e293430a2f94a3623a27d0e8a35b4d5fd91854dc47d12bd46f3e24dc3b1a7
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.ts` (lines 233–310)

```typescript
      case ArgumentType.TWO_REGISTERS: {
        const firstByte = this.code[pc + 1];
        this.nibblesDecoder.setByte(firstByte);
        result.firstRegisterIndex = this.nibblesDecoder.getHighNibbleAsRegisterIndex();
        result.secondRegisterIndex = this.nibblesDecoder.getLowNibbleAsRegisterIndex();
        break;
      }

      case ArgumentType.ONE_OFFSET: {
        const offsetLength = Math.min(IMMEDIATE_AND_OFFSET_MAX_LENGTH, nextInstructionDistance - 1);
        const offsetStartIndex = pc + 1;
        const offsetEndIndex = offsetStartIndex + offsetLength;
        const offsetBytes = this.code.subarray(offsetStartIndex, offsetEndIndex);
        this.offsetDecoder.setBytes(offsetBytes);
        const offsetValue = this.offsetDecoder.getSigned();
        result.nextPc = pc + offsetValue;
        break;
      }

      case ArgumentType.ONE_REGISTER_ONE_IMMEDIATE: {
        const firstByte = this.code[pc + 1];
        this.nibblesDecoder.setByte(firstByte);
        result.registerIndex = this.nibblesDecoder.getLowNibbleAsRegisterIndex();

        const immediateLength = Math.min(IMMEDIATE_AND_OFFSET_MAX_LENGTH, Math.max(0, nextInstructionDistance - 2));
        const immediateStartIndex = pc + 2;
        const immediateEndIndex = immediateStartIndex + immediateLength;
        const immediateBytes = this.code.subarray(immediateStartIndex, immediateEndIndex);
        result.immediateDecoder.setBytes(immediateBytes);
        break;
      }

      case ArgumentType.TWO_IMMEDIATES: {
        const firstByte = this.code[pc + 1];
        this.nibblesDecoder.setByte(firstByte);
        const firstImmediateLength = this.nibblesDecoder.getLowNibbleAsLength();
        const firstImmediateStartIndex = pc + 2;
        const firstImmediateEndIndex = firstImmediateStartIndex + firstImmediateLength;
        const firstImmediateBytes = this.code.subarray(firstImmediateStartIndex, firstImmediateEndIndex);
        result.firstImmediateDecoder.setBytes(firstImmediateBytes);

        const secondImmediateLength = Math.min(
          IMMEDIATE_AND_OFFSET_MAX_LENGTH,
          Math.max(0, nextInstructionDistance - 2 - firstImmediateLength),
        );
        const secondImmediateStartIndex = firstImmediateEndIndex;
        const secondImmediateEndIndex = secondImmediateStartIndex + secondImmediateLength;
        const secondImmediateBytes = this.code.subarray(secondImmediateStartIndex, secondImmediateEndIndex);
        result.secondImmediateDecoder.setBytes(secondImmediateBytes);
        break;
      }

      case ArgumentType.ONE_REGISTER_TWO_IMMEDIATES: {
        const firstByte = this.code[pc + 1];
        this.nibblesDecoder.setByte(firstByte);
        result.registerIndex = this.nibblesDecoder.getLowNibbleAsRegisterIndex();

        const firstImmediateLength = this.nibblesDecoder.getHighNibbleAsLength();
        const firstImmediateStartIndex = pc + 2;
        const firstImmediateEndIndex = firstImmediateStartIndex + firstImmediateLength;
        const firstImmediateBytes = this.code.subarray(firstImmediateStartIndex, firstImmediateEndIndex);
        result.firstImmediateDecoder.setBytes(firstImmediateBytes);

        const secondImmediateLength = Math.min(
          IMMEDIATE_AND_OFFSET_MAX_LENGTH,
          Math.max(0, nextInstructionDistance - 2 - firstImmediateLength),
        );
        const secondImmediateStartIndex = firstImmediateEndIndex;
        const secondImmediateEndIndex = secondImmediateStartIndex + secondImmediateLength;
        const secondImmediateBytes = this.code.subarray(secondImmediateStartIndex, secondImmediateEndIndex);
        result.secondImmediateDecoder.setBytes(secondImmediateBytes);
        break;
      }

      case ArgumentType.TWO_REGISTERS_TWO_IMMEDIATES: {
        const firstByte = this.code[pc + 1];
        this.nibblesDecoder.setByte(firstByte);
        result.firstRegisterIndex = this.nibblesDecoder.getLowNibbleAsRegisterIndex();
```
