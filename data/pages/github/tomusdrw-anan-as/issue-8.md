---
type: page
url: 'https://github.com/tomusdrw/anan-as/issues/8'
title: 64-bit update
site: github.com/tomusdrw/anan-as
created_at: '2024-12-01T12:04:18.000Z'
last_modified: '2024-12-01T12:04:18.000Z'
content_kind: issue
---

# 64-bit update

## Issue by @tomusdrw

> So we've recently switched to a 64-bit PVM in the GP. I haven't got the updated the test vectors ready yet (I will have them ready soon-ish), but in case some of you are already looking to update your PVM implementations to 64-bit here are some tips to make this process easier:

> The major change introduced with the 64-bit PVM is that the registers are now 64-bit, and in case of the most of the instructions their behavior stays essentially exactly the same, except they operate on 64-bit values instead of on 32-bit values now.
The instruction encoding is unchanged. Those instructions which previously took at most a 32-bit immediate value (like e.g. and_imm) now still can have at most a 32-bit physical immediate, however the immediate value is now sign extended to full 64-bit before being used.
There's only a single instruction which takes a 64-bit immediate that is actually physically encoded in the code stream as 64-bit (load_imm_64)
There are a couple of instructions where there exists both a 64-bit variant and a 32-bit variant. (e.g. add_32 and add_64) The _32 variants work like the old 32-bit instruction from 0.4 - they ignore the upper 32-bits of the registers and use only the lower bits, but their result is always sign extended to full 64-bits when written to the destination register.
The address space is still 32-bit and memory accesses ignore the upper 32-bits of registers.
If any of you have trouble updating your PVMs or have any questions regarding PVM then, as always, feel free to ping me and I'll be happy to help.
