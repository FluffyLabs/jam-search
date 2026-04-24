---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/68'
title: PVM - validate jump/branch destination
site: github.com/FluffyLabs/typeberry
created_at: '2024-08-05T17:37:23.000Z'
last_modified: '2024-08-05T17:37:23.000Z'
content_kind: issue
---

# PVM - validate jump/branch destination

## Issue by @mateuszsikora

GP defines the beginning of basic blocks set:

<img width="831" alt="Screenshot 2024-08-05 at 18 42 50" src="https://github.com/user-attachments/assets/0fbb7da4-18a8-442a-b85a-31a4c6efcfab">

If I understand it correctly, it is a set that contains `0` (the beginning of the program) and all instruction indices that occur as the next instruction after basic-block termination instruction (trap, fallthrough, all branches and jumps). This set is used to validate branch and branch/jump instructions:

<img width="834" alt="Screenshot 2024-08-05 at 19 31 29" src="https://github.com/user-attachments/assets/282c2bc7-1097-4807-80d8-b456b535f89e">

This validation is not implemented yet.


