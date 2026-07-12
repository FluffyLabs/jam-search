---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.ts#L307-L345
title: packages/core/pvm-interpreter/args-decoder/args-decoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 3
chunk_total: 4
content_sha: f87c7c51a4ed2e63dc5caf386100aaf1d97927bfd9defa0a99caf8a8bae9f81f
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.ts` (lines 307–345)

```typescript
      case ArgumentType.TWO_REGISTERS_TWO_IMMEDIATES: {
        const firstByte = this.code[pc + 1];
        this.nibblesDecoder.setByte(firstByte);
        result.firstRegisterIndex = this.nibblesDecoder.getLowNibbleAsRegisterIndex();
        result.secondRegisterIndex = this.nibblesDecoder.getHighNibbleAsRegisterIndex();

        const secondByte = this.code[pc + 2];
        this.nibblesDecoder.setByte(secondByte);
        const firstImmediateLength = this.nibblesDecoder.getLowNibbleAsLength();
        const firstImmediateStartIndex = pc + 3;
        const firstImmediateEndIndex = firstImmediateStartIndex + firstImmediateLength;
        const firstImmediateBytes = this.code.subarray(firstImmediateStartIndex, firstImmediateEndIndex);
        result.firstImmediateDecoder.setBytes(firstImmediateBytes);

        const secondImmediateLength = Math.min(
          IMMEDIATE_AND_OFFSET_MAX_LENGTH,
          Math.max(0, nextInstructionDistance - 3 - firstImmediateLength),
        );
        const secondImmediateStartIndex = firstImmediateEndIndex;
        const secondImmediateEndIndex = secondImmediateStartIndex + secondImmediateLength;
        const secondImmediateBytes = this.code.subarray(secondImmediateStartIndex, secondImmediateEndIndex);
        result.secondImmediateDecoder.setBytes(secondImmediateBytes);
        break;
      }

      case ArgumentType.ONE_REGISTER_ONE_EXTENDED_WIDTH_IMMEDIATE: {
        const firstByte = this.code[pc + 1];
        this.nibblesDecoder.setByte(firstByte);
        result.registerIndex = this.nibblesDecoder.getLowNibbleAsRegisterIndex();

        const immediateStartIndex = pc + 2;
        const immediateEndIndex = immediateStartIndex + 8;
        const immediateBytes = this.code.subarray(immediateStartIndex, immediateEndIndex);
        result.immediateDecoder.setBytes(immediateBytes);
        break;
      }
    }
  }
}
```
