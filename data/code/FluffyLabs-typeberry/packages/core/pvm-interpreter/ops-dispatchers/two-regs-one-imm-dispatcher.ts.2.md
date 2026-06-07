---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-imm-dispatcher.ts#L233-L261
title: packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-imm-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 3
content_sha: fc3629a4c2f446fae40ab2185e341b1f80bce4d0392a21a76616cd5bb225a257
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/two-regs-one-imm-dispatcher.ts` (lines 233–261)

```typescript
        this.loadOps.loadIndI8(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.LOAD_IND_I16:
        this.loadOps.loadIndI16(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.LOAD_IND_I32:
        this.loadOps.loadIndI32(args.firstRegisterIndex, args.secondRegisterIndex, args.immediateDecoder);
        break;

      case Instruction.ROT_R_64_IMM:
        this.bitRotationOps.rotR64Imm(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.ROT_R_64_IMM_ALT:
        this.bitRotationOps.rotR64ImmAlt(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.ROT_R_32_IMM:
        this.bitRotationOps.rotR32Imm(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;

      case Instruction.ROT_R_32_IMM_ALT:
        this.bitRotationOps.rotR32ImmAlt(args.secondRegisterIndex, args.immediateDecoder, args.firstRegisterIndex);
        break;
    }
  }
}
```
