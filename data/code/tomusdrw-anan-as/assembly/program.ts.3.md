---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/program.ts#L368-L405'
title: assembly/program.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-12T09:48:57+02:00'
last_modified: '2026-06-12T09:48:57+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 9217c53e266d4987b2d0c565bdaf65d140a3172db7860b48aaa133e77c3a0a1b
language: typescript
---
`assembly/program.ts` (lines 368–405)

```typescript
      resolved.a = registers[Inst.reg(u64(args.a))];
      resolved.b = Inst.u32SignExtend(args.b);
      resolved.c = Inst.u32SignExtend(args.c);
      return resolved;
    case Arguments.OneRegOneImmOneOff:
      resolved.a = registers[Inst.reg(u64(args.a))];
      resolved.b = Inst.u32SignExtend(args.b);
      resolved.c = Inst.u32SignExtend(args.c);
      return resolved;
    case Arguments.TwoReg:
      resolved.a = registers[Inst.reg(u64(args.a))];
      resolved.b = registers[Inst.reg(u64(args.b))];
      return resolved;
    case Arguments.TwoRegOneImm:
      resolved.a = registers[Inst.reg(u64(args.a))];
      resolved.b = registers[Inst.reg(u64(args.b))];
      resolved.c = Inst.u32SignExtend(args.c);
      return resolved;
    case Arguments.TwoRegOneOff:
      resolved.a = registers[Inst.reg(u64(args.a))];
      resolved.b = registers[Inst.reg(u64(args.b))];
      resolved.c = Inst.u32SignExtend(args.c);
      return resolved;
    case Arguments.TwoRegTwoImm:
      resolved.a = registers[Inst.reg(u64(args.a))];
      resolved.b = registers[Inst.reg(u64(args.b))];
      resolved.c = Inst.u32SignExtend(args.c);
      resolved.d = Inst.u32SignExtend(args.d);
      return resolved;
    case Arguments.ThreeReg:
      resolved.a = registers[Inst.reg(u64(args.a))];
      resolved.b = registers[Inst.reg(u64(args.b))];
      resolved.c = registers[Inst.reg(u64(args.c))];
      return resolved;
    default:
      throw new Error(`Unhandled arguments kind: ${kind}`);
  }
}
```
