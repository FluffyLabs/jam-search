---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-imm-dispatcher.ts#L124-L237
title: packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-imm-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 7215eb31a2c75e935db3761c11d5e0a5c964862a65e8c1be8f6533730535997a
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-imm-dispatcher.ts` (lines 124–237)

```typescript
      case Instruction.SHAR_R_IMM_64:
        this.shiftOps.shiftArithmeticRightImmediateU64(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SHAR_R_IMM_ALT_32:
        this.shiftOps.shiftArithmeticRightImmediateAlternativeU32(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SHAR_R_IMM_ALT_64:
        this.shiftOps.shiftArithmeticRightImmediateAlternativeU64(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.OR_IMM:
        this.bitOps.orImmediate(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.AND_IMM:
        this.bitOps.andImmediate(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.XOR_IMM:
        this.bitOps.xorImmediate(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.SET_LT_S_IMM:
        this.booleanOps.setLessThanSignedImmediate(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SET_LT_U_IMM:
        this.booleanOps.setLessThanUnsignedImmediate(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SET_GT_S_IMM:
        this.booleanOps.setGreaterThanSignedImmediate(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.SET_GT_U_IMM:
        this.booleanOps.setGreaterThanUnsignedImmediate(
          args.secondRegisterIndex,
          args.immediateDecoder,
          args.firstRegisterIndex,
        );
        break;

      case Instruction.CMOV_IZ_IMM:
        this.moveOps.cmovIfZeroImmediate(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.CMOV_NZ_IMM:
        this.moveOps.cmovIfNotZeroImmediate(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.STORE_IND_U8:
        this.storeOps.storeIndU8(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.STORE_IND_U16:
        this.storeOps.storeIndU16(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.STORE_IND_U32:
        this.storeOps.storeIndU32(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.STORE_IND_U64:
        this.storeOps.storeIndU64(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.LOAD_IND_U8:
        this.loadOps.loadIndU8(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.LOAD_IND_U16:
        this.loadOps.loadIndU16(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.LOAD_IND_U32:
        this.loadOps.loadIndU32(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.LOAD_IND_U64:
        this.loadOps.loadIndU64(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.LOAD_IND_I8:
        this.loadOps.loadIndI8(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.LOAD_IND_I16:
        this.loadOps.loadIndI16(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
```
