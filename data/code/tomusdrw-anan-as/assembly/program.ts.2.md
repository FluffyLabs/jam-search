---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/program.ts#L243-L372'
title: assembly/program.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-08T13:25:50+02:00'
last_modified: '2026-05-08T13:25:50+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 6d12f4ebddadd73f14a23ef96b64bea24ac7f86b400b877546439252f0489236
language: typescript
---
`assembly/program.ts` (lines 243–372)

```typescript
    let v = "BasicBlocks[";
    for (let i = 0; i < this.isStartOrEnd.length; i += 1) {
      let t = "";
      const isStart = (this.isStartOrEnd[i] & BasicBlock.START) > 0;
      t += isStart ? "start" : "";
      const isEnd = (this.isStartOrEnd[i] & BasicBlock.END) > 0;
      t += isEnd ? "end" : "";
      if (t.length > 0) {
        v += `${i} -> ${t}, `;
      }
    }
    return `${v}]`;
  }
}

export class JumpTable {
  readonly jumps: StaticArray<u64>;

  constructor(itemBytes: u8, data: Uint8Array) {
    const jumps = new StaticArray<u64>(itemBytes > 0 ? i32(data.length / itemBytes) : 0);

    for (let i = 0; i < data.length; i += itemBytes) {
      let num: u64 = u64(0);
      for (let j: i32 = itemBytes - 1; j >= 0; j--) {
        let nextNum: u64 = num << u64(8);
        let isOverflow = nextNum < num;
        nextNum = portable.u64_add(nextNum, u64(data[i + j]));
        isOverflow = isOverflow || nextNum < num;
        // handle overflow
        num = isOverflow ? u64.MAX_VALUE : nextNum;
      }
      jumps[i32(i / itemBytes)] = num;
    }

    this.jumps = jumps;
  }

  toString(): string {
    let v = "JumpTable[";
    for (let i = 0; i < this.jumps.length; i += 1) {
      v += `${i} -> ${this.jumps[i]}, `;
    }
    return `${v}]`;
  }
}

export class Program {
  constructor(
    public readonly code: Code,
    public readonly mask: Mask,
    public readonly jumpTable: JumpTable,
    public readonly basicBlocks: BasicBlocks,
    public readonly gasCosts: GasCosts,
  ) {}

  toString(): string {
    return `Program { code: ${this.code}, mask: ${this.mask}, jumpTable: ${this.jumpTable}, basicBlocks: ${this.basicBlocks}, gasCosts: ${this.gasCosts} }`;
  }
}

// Pre-allocated buffer for the rare case when code is shorter than needed.
// Max REQUIRED_BYTES is 9 (OneRegOneExtImm). We allocate 16 for safety.
const EXTENDED_BUF: Code = new StaticArray<u8>(16);

export function decodeArguments(args: Args, kind: Arguments, code: Code, offset: i32, lim: u32): Args {
  if (code.length < offset + REQUIRED_BYTES[kind]) {
    // in case we have less data than needed we extend the data with zeros.
    const reqBytes = unchecked(REQUIRED_BYTES[kind]);
    for (let i = 0; i < reqBytes; i++) {
      EXTENDED_BUF[i] = 0;
    }
    for (let i = offset; i < code.length; i++) {
      EXTENDED_BUF[i - offset] = unchecked(code[i]);
    }
    return unchecked(DECODERS[kind])(args, EXTENDED_BUF, 0, lim);
  }
  return unchecked(DECODERS[kind])(args, code, offset, offset + lim);
}

class ResolvedArguments {
  a: i64 = i64(0);
  b: i64 = i64(0);
  c: i64 = i64(0);
  d: i64 = i64(0);
  decoded: Args = new Args();
}

export function resolveArguments(
  argsRes: Args,
  kind: Arguments,
  code: Code,
  offset: u32,
  lim: u32,
  registers: Registers,
): ResolvedArguments | null {
  const args = decodeArguments(argsRes, kind, code, offset, lim);
  if (args === null) {
    return null;
  }

  const resolved = new ResolvedArguments();
  resolved.decoded = args;

  switch (kind) {
    case Arguments.Zero:
      return resolved;
    case Arguments.OneImm:
      resolved.a = Inst.u32SignExtend(args.a);
      return resolved;
    case Arguments.TwoImm:
      resolved.a = Inst.u32SignExtend(args.a);
      resolved.b = Inst.u32SignExtend(args.b);
      return resolved;
    case Arguments.OneOff:
      resolved.a = Inst.u32SignExtend(args.a);
      return resolved;
    case Arguments.OneRegOneImm:
      resolved.a = registers[Inst.reg(u64(args.a))];
      resolved.b = Inst.u32SignExtend(args.b);
      return resolved;
    case Arguments.OneRegOneExtImm:
      resolved.a = registers[Inst.reg(u64(args.a))];
      resolved.b = portable.u64_add(u64(args.a) << u64(32), u64(args.b));
      return resolved;
    case Arguments.OneRegTwoImm:
      resolved.a = registers[Inst.reg(u64(args.a))];
      resolved.b = Inst.u32SignExtend(args.b);
      resolved.c = Inst.u32SignExtend(args.c);
      return resolved;
    case Arguments.OneRegOneImmOneOff:
```
