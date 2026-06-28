---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/three-regs-dispatcher.ts#L93-L186
title: packages/core/pvm-interpreter/ops-dispatchers/three-regs-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 33276814218d6b92f90a060e38c4aaa7cc97a396d9182d7ec35420ede93dad2f
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/three-regs-dispatcher.ts` (lines 93–186)

```typescript
      case Instruction.SHLO_R_64:
        this.shiftOps.shiftLogicalRightU64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.SHAR_R_32:
        this.shiftOps.shiftArithmeticRightU32(
          args.firstRegisterIndex,
          args.secondRegisterIndex,
          args.thirdRegisterIndex,
        );
        break;

      case Instruction.SHAR_R_64:
        this.shiftOps.shiftArithmeticRightU64(
          args.firstRegisterIndex,
          args.secondRegisterIndex,
          args.thirdRegisterIndex,
        );
        break;

      case Instruction.OR:
        this.bitOps.or(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.AND:
        this.bitOps.and(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.XOR:
        this.bitOps.xor(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.SET_LT_S:
        this.booleanOps.setLessThanSigned(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.SET_LT_U:
        this.booleanOps.setLessThanUnsigned(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.CMOV_IZ:
        this.moveOps.cmovIfZero(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;
      case Instruction.CMOV_NZ:
        this.moveOps.cmovIfNotZero(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.ROT_L_64:
        this.bitRotationOps.rotL64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.ROT_L_32:
        this.bitRotationOps.rotL32(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.ROT_R_64:
        this.bitRotationOps.rotR64(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.ROT_R_32:
        this.bitRotationOps.rotR32(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.AND_INV:
        this.bitOps.andInv(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.OR_INV:
        this.bitOps.orInv(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.XNOR:
        this.bitOps.xnor(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.MAX:
        this.mathOps.max(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.MAX_U:
        this.mathOps.maxU(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;

      case Instruction.MIN:
        this.mathOps.min(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);

        break;

      case Instruction.MIN_U:
        this.mathOps.minU(args.firstRegisterIndex, args.secondRegisterIndex, args.thirdRegisterIndex);
        break;
    }
  }
}
```
