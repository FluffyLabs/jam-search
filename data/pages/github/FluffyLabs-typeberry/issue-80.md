---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/80'
title: PVM - load_imm_jump refactor
site: github.com/FluffyLabs/typeberry
created_at: '2024-08-07T18:19:19.000Z'
last_modified: '2024-08-07T18:19:19.000Z'
content_kind: issue
---

# PVM - load_imm_jump refactor

## Issue by @mateuszsikora

Currently in `BranchOps` class we have method `loadImmediateJump` that does not fit to this class:

<img width="658" alt="Screenshot 2024-08-07 at 20 07 34" src="https://github.com/user-attachments/assets/05c547bf-d0aa-4247-b810-8aa0b2bac0ab">

It should be split into `load_imm` (from `LoadOps`) and `jump` from `BranchOps`. Those two methods should be called from `OneRegisterOneImmediateOneOffsetDispatcher`. We have similar solution in case of `load_imm_jump_ind' instruction:

<img width="848" alt="Screenshot 2024-08-07 at 20 09 44" src="https://github.com/user-attachments/assets/bf7a58d1-1e97-481b-a232-37de726f6115">

Unfortunately it is not just a simple change because of  `OneRegisterOneImmediateOneOffsetDispatcher` tests that check if any method from "ops" class was called exactly one time (in this case it will be exactly 2 times). Things that need to be done to resolve this issue:
- improve `OneRegisterOneImmediateOneOffsetDispatcher` tests to check if a correct method was called (currently it checks if any method was called).  An example how to do it can be found in `TwoRegsTwoImmsDispatcher` tests,
- replace `loadImmediateJump` with  `loadImmediate` and `jump`. An example how to do it can be found in `TwoRegsTwoImmsDispatcher`
