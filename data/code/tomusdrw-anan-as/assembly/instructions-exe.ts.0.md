---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions-exe.ts#L1-L182
title: assembly/instructions-exe.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 0
chunk_total: 2
content_sha: b69b894243dfbc098754e0c592c5b6c179f022cd34c21447848624b92d5845fd
language: typescript
---
`assembly/instructions-exe.ts` (lines 1–182)

```typescript
import * as bit from "./instructions/bit";
import * as branch from "./instructions/branch";
import * as jump from "./instructions/jump";
import * as load from "./instructions/load";
import * as logic from "./instructions/logic";
import * as math from "./instructions/math";
import { ecalli, fallthrough, INVALID, sbrk, trap } from "./instructions/misc";
import * as mov from "./instructions/mov";
import { InstructionRun } from "./instructions/outcome";
import * as rot from "./instructions/rot";
import * as set from "./instructions/set";
import * as shift from "./instructions/shift";
import * as store from "./instructions/store";

export const RUN: InstructionRun[] = [
  /* 000 */ trap,
  /* 001 */ fallthrough,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 010 */ ecalli,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 020 */ load.load_imm_64,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 030 */ store.store_imm_u8,
  /* 031 */ store.store_imm_u16,
  /* 032 */ store.store_imm_u32,
  /* 033 */ store.store_imm_u64,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 040 */ jump.jump,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 050 */ jump.jump_ind,
  /* 051 */ load.load_imm,
  /* 052 */ load.load_u8,
  /* 053 */ load.load_i8,
  /* 054 */ load.load_u16,
  /* 055 */ load.load_i16,
  /* 056 */ load.load_u32,
  /* 057 */ load.load_i32,
  /* 058 */ load.load_u64,
  /* 059 */ store.store_u8,

  /* 060 */ store.store_u16,
  /* 061 */ store.store_u32,
  /* 062 */ store.store_u64,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 070 */ store.store_imm_ind_u8,
  /* 071 */ store.store_imm_ind_u16,
  /* 072 */ store.store_imm_ind_u32,
  /* 073 */ store.store_imm_ind_u64,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 080 */ jump.load_imm_jump,
  /* 081 */ branch.branch_eq_imm,
  /* 082 */ branch.branch_ne_imm,
  /* 083 */ branch.branch_lt_u_imm,
  /* 084 */ branch.branch_le_u_imm,
  /* 085 */ branch.branch_ge_u_imm,
  /* 086 */ branch.branch_gt_u_imm,
  /* 087 */ branch.branch_lt_s_imm,
  /* 088 */ branch.branch_le_s_imm,
  /* 089 */ branch.branch_ge_s_imm,

  /* 090 */ branch.branch_gt_s_imm,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 100 */ mov.move_reg,
  /* 101 */ sbrk,
  /* 102 */ bit.count_set_bits_64,
  /* 103 */ bit.count_set_bits_32,
  /* 104 */ bit.leading_zero_bits_64,
  /* 105 */ bit.leading_zero_bits_32,
  /* 106 */ bit.trailing_zero_bits_64,
  /* 107 */ bit.trailing_zero_bits_32,
  /* 108 */ bit.sign_extend_8,
  /* 109 */ bit.sign_extend_16,

  /* 110 */ bit.zero_extend_16,
  /* 111 */ bit.reverse_bytes,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 120 */ store.store_ind_u8,
  /* 121 */ store.store_ind_u16,
  /* 122 */ store.store_ind_u32,
  /* 123 */ store.store_ind_u64,
  /* 124 */ load.load_ind_u8,
  /* 125 */ load.load_ind_i8,
  /* 126 */ load.load_ind_u16,
  /* 127 */ load.load_ind_i16,
  /* 128 */ load.load_ind_u32,
  /* 129 */ load.load_ind_i32,

  /* 130 */ load.load_ind_u64,
  /* 131 */ math.add_imm_32,
  /* 132 */ logic.and_imm,
  /* 133 */ logic.xor_imm,
  /* 134 */ logic.or_imm,
  /* 135 */ math.mul_imm_32,
  /* 136 */ set.set_lt_u_imm,
  /* 137 */ set.set_lt_s_imm,
  /* 138 */ shift.shlo_l_imm_32,
  /* 139 */ shift.shlo_r_imm_32,

  /* 140 */ shift.shar_r_imm_32,
  /* 141 */ math.neg_add_imm_32,
  /* 142 */ set.set_gt_u_imm,
  /* 143 */ set.set_gt_s_imm,
  /* 144 */ shift.shlo_l_imm_alt_32,
  /* 145 */ shift.shlo_r_imm_alt_32,
  /* 146 */ shift.shar_r_imm_alt_32,
  /* 147 */ mov.cmov_iz_imm,
  /* 148 */ mov.cmov_nz_imm,
  /* 149 */ math.add_imm,

  /* 150 */ math.mul_imm,
  /* 151 */ shift.shlo_l_imm,
```
