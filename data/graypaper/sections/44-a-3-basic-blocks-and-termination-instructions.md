---
type: graypaper_section
title: A.3. Basic Blocks and Termination Instructions
index: 44
---
Instructions of the following opcodes are considered basic-block termination instructions; other than trap & fallthrough, they correspond to instructions which may define the instructioncounter to be something other than its prior value plus the instruction’s skip amount: ● Trap and fallthrough: trap, fallthrough ● Jumps: jump, jump_ind ● Load-and-Jumps: load_imm_jump, load_imm_jump_ind ● Branches: branch_eq, branch_ne, branch_ge_u, branch_ge_s, branch_lt_u, branch_lt_s, branch_eq_imm, branch_ne_imm ● Immediate branches: branch_lt_u_imm, branch_lt_s_imm, branch_le_u_imm, branch_le_s_imm, branch_ge_u_imm, branch_ge_s_imm, branch_gt_u_imm, branch_gt_s_imm We denote this set, as opcode indices rather than names, as T. We define the instruction opcode indices denoting the beginning of basic-blocks as ϖ : (A.5) ϖ ≡ [ 0 ] ⌢ [ n + 1 + skip (n) S n < − N S c S ∧ k n = 1 ∧ c n ∈ T ] JAM: JOIN-ACCUMULATE MACHINE DRAFT 0.6.6 - May 5, 2025 37
