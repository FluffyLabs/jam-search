---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/math.ts#L111-L237
title: assembly/instructions/math.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 9592a9f1fe928a5a8bd3c7c34d46d401e3c74b0339725f9a3eadbe0cef6f1d79
language: typescript
---
`assembly/instructions/math.ts` (lines 111–237)

```typescript
  const a = i32(registers[Inst.reg(args.a)]);
  if (a === 0) {
    registers[Inst.reg(args.c)] = u64(i64(b));
  } else if (a === -1 && b === i32.MIN_VALUE) {
    registers[Inst.reg(args.c)] = u64(0);
  } else {
    registers[Inst.reg(args.c)] = u64(i64(b) % i64(a));
  }
  return OutcomeData.ok(r);
};

// ADD_64
export const add_64: InstructionRun = (r, args, registers) => {
  const a = registers[Inst.reg(args.a)];
  const b = registers[Inst.reg(args.b)];
  registers[Inst.reg(args.c)] = portable.u64_add(a, b);
  return OutcomeData.ok(r);
};

// SUB
export const sub: InstructionRun = (r, args, registers) => {
  const a = registers[Inst.reg(args.a)];
  const b = registers[Inst.reg(args.b)];
  registers[Inst.reg(args.c)] = portable.u64_sub(b, a);
  return OutcomeData.ok(r);
};

// MUL
export const mul: InstructionRun = (r, args, registers) => {
  const a = registers[Inst.reg(args.a)];
  const b = registers[Inst.reg(args.b)];
  registers[Inst.reg(args.c)] = portable.u64_mul(a, b);
  return OutcomeData.ok(r);
};

// DIV_U
export const div_u: InstructionRun = (r, args, registers) => {
  if (registers[Inst.reg(args.a)] === u64(0)) {
    registers[Inst.reg(args.c)] = u64.MAX_VALUE;
  } else {
    registers[Inst.reg(args.c)] = registers[Inst.reg(args.b)] / registers[Inst.reg(args.a)];
  }
  return OutcomeData.ok(r);
};

// DIV_S
export const div_s: InstructionRun = (r, args, registers) => {
  const b = i64(registers[Inst.reg(args.b)]);
  const a = i64(registers[Inst.reg(args.a)]);
  if (a === i64(0)) {
    registers[Inst.reg(args.c)] = u64.MAX_VALUE;
  } else if (a === i64(-1) && b === i64.MIN_VALUE) {
    registers[Inst.reg(args.c)] = u64(b);
  } else {
    registers[Inst.reg(args.c)] = u64(b / a);
  }
  return OutcomeData.ok(r);
};

// REM_U
export const rem_u: InstructionRun = (r, args, registers) => {
  if (registers[Inst.reg(args.a)] === u64(0)) {
    registers[Inst.reg(args.c)] = registers[Inst.reg(args.b)];
  } else {
    registers[Inst.reg(args.c)] = registers[Inst.reg(args.b)] % registers[Inst.reg(args.a)];
  }
  return OutcomeData.ok(r);
};

// REM_S
export const rem_s: InstructionRun = (r, args, registers) => {
  const b = i64(registers[Inst.reg(args.b)]);
  const a = i64(registers[Inst.reg(args.a)]);
  if (a === i64(0)) {
    registers[Inst.reg(args.c)] = u64(b);
  } else if (a === i64(-1) && b === i64.MIN_VALUE) {
    registers[Inst.reg(args.c)] = u64(0);
  } else {
    registers[Inst.reg(args.c)] = u64(b % a);
  }
  return OutcomeData.ok(r);
};

// MUL_UPPER_S_S
export const mul_upper_s_s: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = mulUpperSigned(i64(registers[Inst.reg(args.b)]), i64(registers[Inst.reg(args.a)]));
  return OutcomeData.ok(r);
};

// MUL_UPPER_U_U
export const mul_upper_u_u: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = mulUpperUnsigned(registers[Inst.reg(args.b)], registers[Inst.reg(args.a)]);
  return OutcomeData.ok(r);
};

// MUL_UPPER_S_U
export const mul_upper_s_u: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = mulUpperSignedUnsigned(i64(registers[Inst.reg(args.b)]), registers[Inst.reg(args.a)]);
  return OutcomeData.ok(r);
};

// MAX
export const max: InstructionRun = (r, args, registers) => {
  const a = i64(registers[Inst.reg(args.a)]);
  const b = i64(registers[Inst.reg(args.b)]);
  registers[Inst.reg(args.c)] = u64(a < b ? b : a);
  return OutcomeData.ok(r);
};

// MAX_U
export const max_u: InstructionRun = (r, args, registers) => {
  const a = registers[Inst.reg(args.a)];
  const b = registers[Inst.reg(args.b)];
  registers[Inst.reg(args.c)] = a < b ? b : a;
  return OutcomeData.ok(r);
};

// MIN
export const min: InstructionRun = (r, args, registers) => {
  const a = i64(registers[Inst.reg(args.a)]);
  const b = i64(registers[Inst.reg(args.b)]);
  registers[Inst.reg(args.c)] = u64(a > b ? b : a);
  return OutcomeData.ok(r);
};

// MIN_U
export const min_u: InstructionRun = (r, args, registers) => {
```
