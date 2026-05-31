---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions-exe.ts#L175-L269
title: assembly/instructions-exe.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-29T16:20:56+02:00'
last_modified: '2026-05-29T16:20:56+02:00'
chunk_index: 1
chunk_total: 2
content_sha: adaf1c75bfb99439a66b79ab7f53df940eb1ccd4cc8e6730045f764f891690dc
language: typescript
---
`assembly/instructions-exe.ts` (lines 175–269)

```typescript
  /* 145 */ shift.shlo_r_imm_alt_32,
  /* 146 */ shift.shar_r_imm_alt_32,
  /* 147 */ mov.cmov_iz_imm,
  /* 148 */ mov.cmov_nz_imm,
  /* 149 */ math.add_imm,

  /* 150 */ math.mul_imm,
  /* 151 */ shift.shlo_l_imm,
  /* 152 */ shift.shlo_r_imm,
  /* 153 */ shift.shar_r_imm,
  /* 154 */ math.neg_add_imm,
  /* 155 */ shift.shlo_l_imm_alt,
  /* 156 */ shift.shlo_r_imm_alt,
  /* 157 */ shift.shar_r_imm_alt,
  /* 158 */ rot.rot_r_64_imm,
  /* 159 */ rot.rot_r_64_imm_alt,

  /* 160 */ rot.rot_r_32_imm,
  /* 161 */ rot.rot_r_32_imm_alt,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 170 */ branch.branch_eq,
  /* 171 */ branch.branch_ne,
  /* 172 */ branch.branch_lt_u,
  /* 173 */ branch.branch_lt_s,
  /* 174 */ branch.branch_ge_u,
  /* 175 */ branch.branch_ge_s,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 180 */ jump.load_imm_jump_ind,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,
  INVALID,

  /* 190 */ math.add_32,
  /* 191 */ math.sub_32,
  /* 192 */ math.mul_32,
  /* 193 */ math.div_u_32,
  /* 194 */ math.div_s_32,
  /* 195 */ math.rem_u_32,
  /* 196 */ math.rem_s_32,
  /* 197 */ shift.shlo_l_32,
  /* 198 */ shift.shlo_r_32,
  /* 199 */ shift.shar_r_32,

  /* 200 */ math.add_64,
  /* 201 */ math.sub,
  /* 202 */ math.mul,
  /* 203 */ math.div_u,
  /* 204 */ math.div_s,
  /* 205 */ math.rem_u,
  /* 206 */ math.rem_s,
  /* 207 */ shift.shlo_l,
  /* 208 */ shift.shlo_r,
  /* 209 */ shift.shar_r,

  /* 210 */ logic.and,
  /* 211 */ logic.xor,
  /* 212 */ logic.or,
  /* 213 */ math.mul_upper_s_s,
  /* 214 */ math.mul_upper_u_u,
  /* 215 */ math.mul_upper_s_u,
  /* 216 */ set.set_lt_u,
  /* 217 */ set.set_lt_s,
  /* 218 */ mov.cmov_iz,
  /* 219 */ mov.cmov_nz,

  /* 220 */ rot.rot_l_64,
  /* 221 */ rot.rot_l_32,
  /* 222 */ rot.rot_r_64,
  /* 223 */ rot.rot_r_32,
  /* 224 */ logic.and_inv,
  /* 225 */ logic.or_inv,
  /* 226 */ logic.xnor,
  /* 227 */ math.max,
  /* 228 */ math.max_u,
  /* 229 */ math.min,
  /* 230 */ math.min_u,
];
```
