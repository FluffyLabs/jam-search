---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/67'
title: 'PVM: GP doubts - skip function'
site: github.com/FluffyLabs/typeberry
created_at: '2024-08-05T15:15:31.000Z'
last_modified: '2024-08-05T15:15:31.000Z'
content_kind: issue
---

# PVM: GP doubts - skip function

## Issue by @mateuszsikora

GP defines skip function:

<img width="654" alt="Screenshot 2024-08-05 at 16 56 01" src="https://github.com/user-attachments/assets/304dbfe6-1f28-45b2-b14a-9a815759fd1e">

I have no idea why there is `min(24, ...)` - I mean the magic number`24` here. In the text we have:

> However, each instruction’s “length” (defined as the number of contiguous octets starting with the opcode which are needed to fully define the instruction’s semantics) is left implicit though limited to being at most 16.

`16` is a stronger bound but still seems to be incorrect. The "longest" instruction is `load_imm_jump_indd`:

<img width="649" alt="Screenshot 2024-08-05 at 17 07 49" src="https://github.com/user-attachments/assets/d32b2338-65d7-4da5-89c6-9244f39460e3">

Here we have opcode (1 byte), two registers (1 byte), length of the first immediate (1 byte), the fist immediate (at most 4 bytes) and the second immediate (at most 4 bytes). So the longest instruction can have 11 bytes and it seems to be the correct value in both cases. I'd like to make sure that there isn't any corner case that I don't understand.




## Comment by @tomusdrw

We can try to look for it together when we meet, but I think it's fair to also ask in the GP channel.


## Comment by @tomusdrw

So we can basically embedded some data in the program that is not really opcodes nor arguments to that opcodes.
In such case the mask will be defined as `0` for these bytes (since they are not instructions).
So now it seems that we should skip at most `24` bytes when reading such programs - i.e. if the program is still supposed to work correctly, it can't have "too much" of that hidden data, otherwise the `skip` will simply stop at `24`.
