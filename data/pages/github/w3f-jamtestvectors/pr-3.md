---
type: page
url: 'https://github.com/w3f/jamtestvectors/pull/3'
title: Add initial PVM test vectors
site: github.com/w3f/jamtestvectors
created_at: '2024-06-24T14:24:56.000Z'
last_modified: '2024-06-24T14:24:56.000Z'
content_kind: pr
---

# Add initial PVM test vectors

## Pull Request by @koute

Initial PVM test vectors/test suite.

This is still incomplete; not every instruction is covered yet and only very simple test cases were added. I will be expanding this aggressively.

* [README](https://github.com/koute/jamtestvectors/blob/master_pvm_initial/pvm/README.md)
* [List of testcases](https://github.com/koute/jamtestvectors/blob/master_pvm_initial/pvm/TESTCASES.md)

Since we will still be making some changes (e.g. 64-bit support) I'll be explicitly versioning this, with a detailed changelog so that anyone who uses these tests can easily keep up.


## Comment by @sourabhniyogi

@koute Can you kindly add test cases for the host functions of Appendix B.6/B.7/B.8? 

Here are 4 groups, in priority order:
1. LOOKUP, READ, WRITE, SOLICIT, HISTORICAL_LOOKUP, IMPORT, EXPORT [7]
2. NEW, MACHINE,  PEEK, POKE, INVOKE, TRANSFER [6]
3. QUIT,  INFO, GAS, CHECKPOINT, FORGET [5]
4. EMPOWER, DESIGNATE, ASSIGN, UPGRADE, EXPUNGE [5]

The first group is DA-centric, the second group is service+VM setup/invocations -- the first 2 groups are valuable to connect to code up connections to state merklization + erasure coding, whereas the latter 2 groups can be done later as they are bookkeeping oriented and are easy to get right once we solve the first 2 groups.

Thank you!  


## Comment by @ec2

How are these programs supposed to be consumed? The program blob parse expects things like the program to start with BLOB_MAGIC.


## Comment by @koute

> Can you kindly add test cases for the host functions of Appendix B.6/B.7/B.8?

For these initial test vectors the priority is to get basic tests for the instruction set ready. I will also add some host call tests later, but comprehensive test suite for all host calls is probably out-of-scope, at least for pure PVM tests.

> How are these programs supposed to be consumed?

Take a look at the schema to see to which parameters of the Ψ equation from the Gray Paper they correspond to, and use them accordingly to test your own PVM implementation.

> The program blob parse expects things like the program to start with BLOB_MAGIC.

Yes, my PolkaVM uses its own container format for the program blobs which the GP doesn't use. PolkaVM is not the source of truth for how a PVM should work, the GP is.


## Comment by @ec2

@koute Good point on the GP being the source of truth.

> Take a look at the schema to see to which parameters of the Ψ equation from the Gray Paper they correspond to, and use them accordingly to test your own PVM implementation.

For context I'm building FFI bindings to PolkaVM. So would you say that these tests in particular are for folks who are implementing the PVM from scratch? 


## Comment by @sourabhniyogi

> Since we will still be making some changes (e.g. 64-bit support) I'll be explicitly versioning this, with a detailed changelog so that anyone who uses these tests can easily keep up.

We passed all the test vectors you provided so far.  What is the reason for the GP needing to support 32-bit registers while the contracts pallet should definitely aim for 64-bit?   After you have 64-bit PVM engineered for contracts pallet shouldn't the GP be adjusted to be 64-bit?   




## Comment by @koute

> So would you say that these tests in particular are for folks who are implementing the PVM from scratch?

Yes.

> What is the reason for the GP needing to support 32-bit registers while the contracts pallet should definitely aim for 64-bit?

This is only temporary. We will be migrating GP to 64-bit too; we just need to first prototype the design in PolkaVM to make sure it's solid. (Otherwise we might end up with a design that looks good on paper but is bad in practice.) We're working on it right now.

(That said, the changes when migrating to 64-bit won't be huge - the registers will be extended and there will be a couple of new instructions, but that's about it as far as major changes go.)

As far as the instruction set and the core semantics are concerned, we aim to have both PolkaJAM and pallet-contracts in alignment and we're making effort to make sure they don't diverge. (With PolkaJAM having the priority here, but I believe we can support both with the same VM.)


## Comment by @ec2

In GP(A.1), the program is defined as follows:
<img width="393" alt="image" src="https://github.com/user-attachments/assets/4115a70f-2a04-479b-91f9-ab8c579d83ad">

`E(|c|)` is the SCALE compact integer encoding on the length of `c`. So in this [test case](https://github.com/koute/jamtestvectors/blob/master_pvm_initial/pvm/programs/inst_add.json#L25), `|c|` should be 3 (`8, 135, 9`), so shouldn't `E(|c|)` be [12] instead of 3? 

Edit: Looks like I misunderstood `|k| = |c|`. It seems like this is talking about the bit length of the mask being equal to the the byte length of the instructions rounded to 8. Encoding question still stands though. 


## Comment by @koute

@ec2 Where did you read that these are SCALE compact integers? These are not SCALE compact integers. From the GP:

![e](https://github.com/user-attachments/assets/b199b1db-2833-4e46-8a95-51ecee75802f)

If you look at this equation and crosscheck it with [how `parity-scale-codec` encodes compact integers](https://docs.rs/parity-scale-codec/latest/src/parity_scale_codec/compact.rs.html#336-353) you can see that they're not the same.

This is a slightly different varint serialization format which:
- only supports up to 64-bits,
- is more efficient to decode,
- encodes numbers which fit within 7-bits as if raw-encoded,
- is uniform and more compact when dealing with small numbers (SCALE compact encoding uses one more byte to encode integers between 64..128 and 16384..2097152, but needs one less byte to encode integers between 268435456..1073741824).


## Comment by @ec2

@koute GP(Appendix I.3) says that `E()` is the SCALE encode function. I also did see the screenshot you posted from the GP. 

I'm not super familiar with SCALE so I assumed that the screenshot just formally describes how SCALE does variable int encoding. 


## Comment by @ec2

@koute Sorry to keep hounding you here! I think I found a discrepancy between the testcases and the GP.
The test case [inst_move_reg.json](https://github.com/koute/jamtestvectors/blob/master_pvm_initial/pvm/programs/inst_move_reg.json#L27) tests `move_reg` (opcode 82). 

According to the GP, 
<img width="809" alt="image" src="https://github.com/user-attachments/assets/6cb5e08e-0cb7-4234-aa2f-f966bc88c774">

In the test, the supplied arg to `move_reg` is `[121]`. And so, `r_A = min(12, 121%16) = 9` and `r_D = min(12, 121/16) = 7`. So the mutation will end up being `reg[7] = reg[9]`.  

The test case has only `initial-regs[7]` set to 1 and 0 elsewhere. And so the expected mutation is `reg[7] = reg[9] = 0`. 

TLDR: I think the impl of PVM that made these test cases have the arguments for `move_reg` flipped. 


## Comment by @sourabhniyogi

> I will also add some host call tests later, but comprehensive test suite for all host calls is probably out-of-scope, at least for pure PVM tests.

Alright, we don't want to interrupt your deep work but legend has it you implemented PVM in a day =) so if its not too much to ask ... could you give us the simplest "Jam Service" byte code (for a refine+accumulate) for us to implement many of the basic host functions?  Given one good example we can probably fill in the rest and provide a few more back.  

My idea of the simplest "Jam Service" byte code is to compute the sum of squares for a set of integer work items, like
  Work Items in a Work Package: 5, 7, 9
  Refine: squares the work items, exports 25, 49, 81 
  Accumulate: reads the result of refine ( 25, 49, 81 ) and writes to a service's storage
We can attempt to build the byte code by hand like it is 1964 but maybe you already have something "simple" like this that you can share?  

If not, do you have a better recommendation for simplest "Jam Service"? Or, a strategy that is better than hand building byte code?

This sort of baby JAM test case will help teams get baby JAM implementations blood flowing, and set up a low V (like V=6) cluster complete with QUIC, erasure coding, Patricia Merkle Trie, BMT proofs, and so on.  

 


## Comment by @xlc

I am confused about trap vs halt vs panic in PVM. In GP, the trap instruction will exit with the black square, so does the jump to `2^32-2^16` address. To my understanding, that is `exit 0`. But in the pvm testvector, trap is panic and the test of the trap instruction will result trap exit status but the inst_ret_halt test results halt. There is some inconsistency.
https://github.com/w3f/jamtestvectors/blob/a2b18702aac7d15b9f51cd1ffcf0be95f987b2f7/pvm/schema.asn#L53-L55

Another question. `jump_ind` is using `djump` which can be used to exit the program. But how about the one using `branch`? e.g. `jump`. What happen to `jump` into the exit address? panic or halt?


## Comment by @koute

> Sorry to keep hounding you here! I think I found a discrepancy between the testcases and the GP.

@ec2 Yes, indeed, there is. We will fix it soon. Thanks! We highly appreciate anyone who helps crosscheck these.

> Alright, we don't want to interrupt your deep work but legend has it you implemented PVM in a day =) so if its not too much to ask ... could you give us the simplest "Jam Service" byte code (for a refine+accumulate) for us to implement many of the basic host functions?

@sourabhniyogi The rumors of my exploits seem to be grossly exaggerated; it was actually two days, not one. :P

Anyway, we will most likely put up some more tests out in the future, but for now if you quickly want something to test with then your best bet would be to build one yourself.

You don't have to build a blob by hand; you could use my work-in-progress PVM assembler. For example:

```
$ git clone https://github.com/koute/polkavm.git
$ cd polkavm
$ cargo run -p polkatool -- assemble tools/spectool/spec/src/inst_branch_greater_or_equal_signed_ok.txt -o output.polkavm
$ cargo run -p polkatool disassemble --show-raw-bytes output.polkavm
```

This will output the program in a PolkaVM-specific container (which is not part of the GP), but you can extract the code blob with a simple Rust program - use `polkavm_common::program::ProgramParts::from_bytes` to load the blob and then the `code_and_jump_table` field will have the raw program bytes.

> I am confused about trap vs halt vs panic in PVM. In GP, the trap instruction will exit with the black square, so does the jump to 2^32-2^16 address.

@xlc

- "halt" is meant to be a normal termination (dynamic jump to 0xffff0000)
- "panic" (called a "trap" here) is meant to be an abnormal termination

Hm, you're right that the trap instruction in the GP is specified to halt instead of panicking; this should have been a panic instead. I'll see about correcting this; thanks.


## Comment by @clw8998

Hello @koute , I recently encountered some issues while using your PVM.

Here’s my code:
```
pub @main:
    a1 = 0
```

When I use the following command to compile:
```
cargo run -p polkatool -- assemble ./test_txt_code/test.txt -o test.pvm
```

The bytecode content of `test.pvm` is as follows:
```
[80, 86, 77, 0, 1, 5, 7, 1, 0, 4, 109, 97, 105, 110, 6, 6, 0, 0, 2, 4, 8, 253, 0]
```

My question is, how do I **extract the pure program portion as defined in GP_0.36(213)**, because it seems the first part contains some **ASCII-encoded section names.**

ASCII encoded section name:
```
[80, 86, 77, 0, 1, 5, 7, 1, 0, 4, 109, 97, 105, 110, 6, 6]
// [80, 86, 77] "PVM" in ASCII
// [109, 97, 105, 110] "main" in ASCII
```

GP_0.36(213) should be:
```
[0, 0, 2, 4, 8, 253, 0]
```


## Comment by @clw8998

Also found some weird encoding results.

## Missing operend:
txt code:
```=
pub @main:
    a1 = 0
```
after assembly:
It should put **0** into **reg 8**, but **program counter at  0** missing **0**
```=
    Finished dev [unoptimized + debuginfo] target(s) in 0.86s
     Running `target/debug/polkatool disassemble --show-raw-bytes test.pvm`
// RO data = 0/0 bytes
// RW data = 0/0 bytes
// Stack size = 0 bytes

// Instructions = 1
// Code size = 2 bytes

      :                          @0 [export #0: 'main']
     0: 04 08                    a1 = 0x0
```

## Jump to a weird position:

txt code:
```
pub @main:
    @sub_1:
    a0 = 1
    a1 = 0xFEFE0000
    a2 = 12
    ecalli 16
    a1 = 2
    jump @init if a0 != a1

    @sub_2:
    a1 = u32[0xFEFE0004]
    a2 = u32[0xFEFE0008]
    u32[0xFEFE0004] = a1
    a1 = a1 + a2
    u32[0xFEFE0008] = a1

    a3 = 1
    a0 = u32[0xFEFE0000]
    a0 = a0 + a3

    @sub_3:
    a0 = 0xFEFE0000
    a1 = 12
    ecalli 17
    trap

    @init:
    u32 [0xFEFE0000] = 0x00000001
    jump @sub_2
```

after assembly:
**Program counter at  17** jump into 55(0x37), which is part of an operend.
**Program counter at  79** jump into 197(0xc5), which is OOB.

```
    Finished dev [unoptimized + debuginfo] target(s) in 1.19s
     Running `target/debug/polkatool disassemble --show-raw-bytes test.pvm`
// RO data = 0/0 bytes
// RW data = 0/0 bytes
// Stack size = 0 bytes

// Instructions = 21
// Code size = 81 bytes

      :                          @0 [export #1: 'main'] [export #2: 'sub_1']
     0: 04 07 01                 a0 = 0x1
     3: 04 08 00 00 fe fe        a1 = 0xfefe0000
     9: 04 09 0c                 a2 = 0xc
    12: 4e 10                    ecalli 16 // INVALID
    14: 04 08 02                 a1 = 0x2
    17: 1e 87 37                 jump 72 if a0 != a1
      :                          @1 [export #3: 'sub_2']
    20: 0a 08 04 00 fe fe        a1 = u32 [0xfefe0004]
    26: 0a 09 08 00 fe fe        a2 = u32 [0xfefe0008]
    32: 16 08 04 00 fe fe        u32 [0xfefe0004] = a1
    38: 08 98 08                 a1 = a1 + a2
    41: 16 08 08 00 fe fe        u32 [0xfefe0008] = a1
    47: 04 0a 01                 a3 = 0x1
    50: 0a 07 00 00 fe fe        a0 = u32 [0xfefe0000]
    56: 08 a7 07                 a0 = a0 + a3
    59: 11                       fallthrough
      :                          @2 [export #4: 'sub_3']
    60: 04 07 00 00 fe fe        a0 = 0xfefe0000
    66: 04 08 0c                 a1 = 0xc
    69: 4e 11                    ecalli 17 // INVALID
    71: 00                       trap
      :                          @3 [export #0: 'init']
    72: 26 04 00 00 fe fe 01     u32 [0xfefe0000] = 1
    79: 05 c5                    jump 20
```



## Comment by @koute

> My question is, how do I **extract the pure program portion as defined in GP_0.36(213)**, because it seems the first part contains some **ASCII-encoded section names.**

That's a `.polkavm` container. It's not and won't be part of the GP (see [this comment of mine](https://github.com/FluffyLabs/typeberry-toolkit/issues/81#issuecomment-2303906136) where I explain different types of program blobs). If you want to extract a pure code blob you either need to parse it (the format is trivial; [see my parsing code for more details](https://github.com/koute/polkavm/blob/1c17a0d1cca65ee5bd01d3ef679e6a66bb43c542/crates/polkavm-common/src/program.rs#L3194)) or use my `polkavm` crate and call [`ProgramParts::from_bytes`](https://docs.rs/polkavm/0.11.0/polkavm/struct.ProgramParts.html#method.from_bytes) and access it in `code_and_jump_table` field of that struct.

> It should put 0 into reg 8, but program counter at 0 missing 0

No, it's not missing. It's just a zero length varint, and that is expected behavior. To save space a trailing varint in an instruction doesn't have to be encoded if it's zero.

Side note: this instruction can be encoded in multiple ways, for example:

```
04 08
04 08 00
04 08 00 00
04 08 00 00 00
04 08 00 00 00 00
```

*All* of these encodings are valid and encode to the same instruction `a1 = 0`.

> Program counter at 17 jump into 55(0x37), which is part of an operend.
> Program counter at 79 jump into 197(0xc5), which is OOB.

You're incorrectly parsing the jump destinations as absolute, but they are encoded *relative*. (Notice: 17 + 55 = 72)


## Comment by @EclesioMeloJunior

hey @koute, I've noticed the `inst_branch_greater_or_equal_signed_imm_nok` test is not passing, then after debugging it looks like the program is correct but the test expects a trap at PC 7 which is not happening bc the `branch_ge_s_imm` is true, lemme describe here:

Here is the `inst_branch_greater_or_equal_signed_imm_nok` program:
```
"program": [0,0,14,4,7,246,45,23,10,5,0,4,7,239,190,173,222,137,193],
```

where the actual code is:
```
[4,7,246,45,23,10,5,0,4,7,239,190,173,222]
```

breaking down the code we have:
```
// load_imm: reg (7), imm (246)
[4, 7, 246] 

// branch_ge_s_imm: reg (7), imm (10), offset (5)
[45,23,10,5]

// when we compare the value at reg 7 is 246 which is greater than the imm value 10
// then it skips the trap and proceed to
// load_imm: reg (7), imm (3735928559)
[4,7,239,190,173,222]
```

So, the expected value: `4294967286` is different from the actual 7th register (3735928559) and also the expected pc is 7 (which is the offset where the trap is placed) but the actual PC is 14 (end of the code). So I would like to double check with you'll, thanks!




## Comment by @tomusdrw

@EclesioMeloJunior You can check out the disassembler/debugger we've put together here https://pvm.fluffylabs.dev/

Recently polkavm support was merged, so it might help you debug the exact problem you're having - obviously don't take it as a source of truth - that should only be the Gray Paper.

I think the issue is with how you interpret the bytes `246 (0xf6)`, it's a compact signed encoding, and you should end up with `4294967286 (0xfffffff6)` in the register.


## Comment by @koute

@EclesioMeloJunior: @tomusdrw is correct; you're not properly sign extending the value from `load_imm`, and I've deliberately engineered this test case to catch this.

Remember that the varints are always sign extended to full 32-bits, that is: if the most significant bit of the value (as it is encoded) is `1` then all of the bits "to the left" in the decoded value are also filled with `1`s.

Here are some examples:

- `7a` encoded (122 in decimal, `01111010` in binary) would get decoded as `7a` (`00000000_00000000_00000000_01111010` in binary)
- `fa` encoded (250 in decimal, `11111010` in binary) would get decoded as `ffffff7a` (4294967226 in decimal, `11111111_11111111_11111111_11111010` in binary)
- `fa 00` (`00000000_11111010` in binary, remember these are serialized as little endian hence the least significant bytes are encoded first) would get decoded as `fa` (no sign extension because the most significant bit is `0`)


## Comment by @emielsebastiaan

Most testvectors should be fixed (are currently invalid) due to a strict decoding issue of `k` (fixed length bitsequence).
https://github.com/w3f/jamtestvectors/issues/13


## Comment by @Polkadot-Forum

This pull request has been mentioned on **Polkadot Forum**. There might be relevant details there:

https://forum.polkadot.network/t/contracts-on-assethub-roadmap/9513/25



## Comment by @charliewinston14

Hi. How do the signed values work?

For example in "inst_div_signed"?

rA=8      (value: 2147483664)
rB=7      (value: 7)
rD=9

How is register 9 expected to be 3988183920?



## Comment by @koute

> How do the signed values work?

I recommend reading [this article on Wikipedia](https://en.wikipedia.org/wiki/Two's_complement).

> How is register 9 expected to be 3988183920?

It's not. It's expected to be `-2147483632 / 7 = -306783376`.


## Comment by @sourabhniyogi

Now that 0.5 is 64-bit (only), we really need this to be updated to support 64-bit test vectors (only)

We were able to use polkatool (64-bit) and do our services, which touched 23 opcodes and 5 host functions and would like to cover all the opcodes robustly.

Can we wrap up 2024 with 64-bit test vectors?


## Comment by @koute

New PVM test vectors are here; see the changelog for details.


## Comment by @boymaas

Thank you @koute for the vectors. I have a question: `inst_store_imm_u8_trap_read_only.json` and `inst_store_u8_trap_read_only.json` expect a panic. The graypaper describes a page fault. 

"Similarly, where ram must be mutated and yet mutable access is not possible, then machine state is unchanged, and the exit reason is a fault with the lowest address to be read which is inaccessible." [link](https://graypaper.fluffylabs.dev/#/579bd12/243c00245500) 




## Comment by @koute

> I have a question: `inst_store_imm_u8_trap_read_only.json` and `inst_store_u8_trap_read_only.json` expect a panic. The graypaper describes a page fault.

The are two types of PVMs - outer PVMs and inner PVMs. The outer PVMs run the toplevel JAM services (`on_transfer`, `accumulate`, `refine`, etc.) while inner PVMs can be spawned by `refine` using the `invoke` hostcall. These two types of PVMs work in a slightly different way, and in this case the relevant differences are:

   - inner PVMs (currently) don't support read-only memory, and they generate page faults
   - outer PVMs support read-only memory, and don't *really* generate page faults (you could technically say that they do, but for outer PVMs a panic and a page fault would be indistinguishable - both are unrecoverable and equivalent to a panic, so there isn't really much point in even having the concept of "page faults" in outer PVMs nor supporting them in implementations for anything other than debugging)
 
So in this case those tests were meant to test the outer PVM behavior where you have read only memory and the program tries to write there. But okay, you're right this might be confusing wrt to the GP; I'll just delete those tests.


## Comment by @boymaas

Thanks for the explanation! I wasn’t aware of these distinctions between outer and inner PVMs, but it makes sense now. 


## Comment by @boymaas

I'm running into another discrepancy with my implementation. The test  `pvm/programs/inst_store_indirect_u16_with_offset_nok.json`, expects a page fault address of `0x00021000`. Based on my current understanding, the [formula](https://graypaper.fluffylabs.dev/#/579bd12/243e00245500) indicates the PVM should report the first violating address, which would be `0x00021001`. However, the test seems to expect the start of the page where the violation occurred instead. 


## Comment by @dakk

What is the memory size expected by those tests?


## Comment by @koute

> Based on my current understanding, the [formula](https://graypaper.fluffylabs.dev/#/579bd12/243e00245500) indicates the PVM should report the first violating address, which would be `0x00021001`. However, the test seems to expect the start of the page where the violation occurred instead.

You're correct. The intended behavior is that the address of the page is returned; we will update the GP.

> What is the memory size expected by those tests?

Each test defines the expected memory layout; see `initial-page-map` and `initial-memory` fields.


## Comment by @boymaas

> You're correct. The intended behavior is that the address of the page is returned; we will update the GP.

Thanks, since the graypaper will be updated, I’ll adjust my implementation to return the address of the page. 






## Comment by @bloppan

Hello @koute I have a question about the tests that use the `branch` function. 

For example, the test `inst_branch_eq_ok.json` executes the instruction `170 -> branch_eq`, which calls [branch(12, true)](https://graypaper.fluffylabs.dev/#/579bd12/245a02245a02). The position `n=12 `of the program corresponds to the instruction `20 -> load_imm_64`. Before executing the branch instruction, we have to check if `c[n]` belongs to the [basic block set](https://graypaper.fluffylabs.dev/#/579bd12/237b01238901) but the instruction `20 -> load_imm_64` doesn't belongs to the basic block set opcodes. What I missing here?


## Comment by @koute

@bloppan Whether a basic block starts at a given position or not is not determined by the first instruction of the basic block but by the *previous* instruction, which is a `trap`, which is a basic block terminator (hence it also starts a new basic block).


## Comment by @bloppan

Hi @koute , in the test riscv_rv64um_divu.json, when `pc = 110`, the instruction `193 -> div_u_32` is executed and takes as arguments: `ω9, ω8, ω11`

`ω9 = 0x1`
`ω8 = 0xffffffff80000000`
`ω11 = ω8 / ω9 = 0xffffffff80000000 / 0x1`

The result is `ω11 = 0xffffffff80000000`

The instruction [div_u_32](https://graypaper.fluffylabs.dev/#/579bd12/297b02297b02) is 32 bits unsigned and it doesn't have sign extension, so I think the result should be `ω11 = 0x80000000`. In my implementation, the test passes if I add the sign extension to the division result, but it's not specified in the GP.


## Comment by @koute

> The instruction [div_u_32](https://graypaper.fluffylabs.dev/#/579bd12/297b02297b02) is 32 bits unsigned and it doesn't have sign extension, so I think the result should be `ω11 = 0x80000000`. In my implementation, the test passes if I add the sign extension to the division result, but it's not specified in the GP.

It's an error in the GP, and the test vector is correct. The 32-bit instruction variants always sign extend.


## Comment by @emielsebastiaan

With the current Graypaprer spec (0.6.1) the following test vector is incorrect.
https://graypaper.fluffylabs.dev/#/4bb8fd2/2a48012a7d01

# Test vector
`rem_s_64` (206)
Current Current incorrect calculation: -9223372036854775791 mod 7 = 2
Current incorrect output ω_9: 18446744073709551611
Correct output ω_9: 2
https://github.com/w3f/jamtestvectors/blob/cd85648f2f3c67025f4f5001657a0ce7cf4c5377/pvm/programs/inst_rem_signed_64.json#L42

```
Z_8(ω_A) mod Z_8(ω_B)
Current incorrect calculation: -9223372036854775791 mod 7 = -5
Correct calculation: -9223372036854775791 mod 7 = 2
```

# Analysis
The incorrect current output is explained because some programming languages (such as: RUST en C) provide a negative output for a modulo operation on a negative number.
Python on the other hand outputs a positive number for a modulo operation on a negative number.
In 'Maths', "the usual representative is the least positive residue, the smallest non-negative integer"

```
In mathematics, the result of the modulo operation is an equivalence class, and any member of the class may 
be chosen as representative; however, the usual representative is the least positive residue, the smallest 
non-negative integer that belongs to that class (i.e., the remainder of the Euclidean division).[2] 

However, other conventions are possible. Computers and calculators have various ways of storing and 
representing numbers; thus their definition of the modulo operation depends on the programming language 
or the underlying hardware. 
```
Source: https://en.wikipedia.org/wiki/Modulo

# Possible solutions
1. Test vector is incorrect with current GP-0.6.1 specification and should be corrected.
2. Graypaper should explicitly state that modulo operations of negative numbers should be allowed to be negative.

In summary 'maths' shoud have priority over any implementation ambiguity, therefore as is solution 1 should be the way to go.


## Comment by @koute

> The incorrect current output is explained because some programming languages (such as: RUST en C) provide a negative output for a modulo operation on a negative number. [...] In summary 'maths' shoud have priority over any implementation ambiguity, therefore as is solution 1 should be the way to go.

No, it's explained because PVM is based on RISC-V, and that's how the RISC-V's (and also coincidentally how AMD64's) modulo instruction works. It has absolutely nothing to do with how the modulo operator works in any programming language.

Two of the main design principles of PVM are:

1) we can use upstream RISC-V compilers without any modifications, so while we have some leeway because we postprocess the RISC-V code into PVM, ultimately we must keep the original RISC-V instruction semantics intact,
2) so that it's easy to recompile PVM into native machine code, so the semantics of instructions should, in general, match how real hardware tends implements those instructions.

So the test vector here is correct and is what we want, and changing the semantics here as you suggest is not a good idea as it will provide no practical benefit while having *significant* practical downsides.

Anyway, thank you for bringing this ambiguity to our attention.


## Comment by @emielsebastiaan

Sure thanks, this is fine of course. But then GP should be adjusted to explicitly state that the modulo operator on a negative number yields a negative number, and not a positive number as expected by 'Maths'. 


## Comment by @clw8998

### **Test Case: `inst_div_signed_64`**  
When `pc = 0`, calling `div_s_64 (204)`, we have:  
(All numbers here are in decimal.)

- $ω7 = 9223372036854775824$
- $ω8 = 7$
- $Z_8(ω7) = -9223372036854775792$
- $Z_8(ω8) = 7$

Performing the division and applying the floor function:

$⌊ -9223372036854775792 / 7 ⌋$ = $⌊ -1317624576693539398.8571428571429 ⌋$ = -1317624576693539398

(However, it should be **-1317624576693539399** after applying the [floor function](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions).)

- $Z_8^{-1}(-1317624576693539398) = 17129119497016012218$
- $Z_8^{-1}(-1317624576693539399) = 17129119497016012217$

### **Question:**  
* The expected result after applying the floor function should be **-1317624576693539399**, but the test vector shows **-1317624576693539398**.  
* Since GP does not explicitly define the floor function? (not sure). I checked [the floor function definition](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions), but I am unsure whether this applies to GP.  
* A similar issue also occurs in `riscv_rv64um_div`.  

Did I make a mistake somewhere?


## Comment by @koute

@clw8998 I can confirm the test vector is correct here and the expected value is `-1317624576693539398` (`0xedb6db6db6db6dba`). In this case the fractional part of the result should *always* be truncated because these are *integer* (non-floating point) division instructions.

To illustrate why let's pick some smaller numbers to make this more obvious. Let's try to divide a positive number first:

```
7 / 3 = 2.333 ~= 2
2 * 3 = 6
```

Now let's try flipping the sign:

```
-7 / 3 = -2.333 ~= -3
-3 * 3 = -9

vs

-7 / 3 = -2.333 ~= -2
-2 * 3 = -6
```

Notice that flipping the sign of one of the inputs doesn't change the numerical value of `a / b * b` (just its sign) if we use truncation.

You're right that mathematically floor does the (in this case) incorrect thing; we will fix the GP.


## Comment by @daiagi

These are in sync with which gp version? 


## Comment by @koute

> These are in sync with which gp version?

Unless I missed something, should be in sync with the most recent GP 0.6.2.


## Comment by @sourabhniyogi

@koute Several implementers consider looking at [this](https://github.com/paritytech/polkavm/blob/b0bdfe95692ad2472d297f2471e3d13a7d87550a/crates/polkavm-common/src/program.rs#L114~L131) to interpret polkavm disassembly  as form of _collusion_:

<img width="732" alt="image" src="https://github.com/user-attachments/assets/e59831dd-c976-45a0-85f5-c86d968dc1ca" />


<img width="790" alt="image" src="https://github.com/user-attachments/assets/d88f4a42-4638-4780-86d0-c2e08990037e" />

<img width="747" alt="image" src="https://github.com/user-attachments/assets/922be2bf-b6b3-458d-b6ea-519df1a98005" />

Understanding the registry map was one of the first things we did to learn how [building JAM Services in Rust](https://forum.polkadot.network/t/building-jam-services-in-rust/10161) with polkatool since [this](https://github.com/w3f/jamtestvectors/pull/3#issuecomment-2257688558) -- Its pretty important to have a mental model of the registry map and I believe a recent comment of yours caused people to believe they should never even think about looking a single line of polkavm code.

What do you think of their "collusion" claim?  


## Comment by @koute

@sourabhniyogi 

No. The claim that this is collusion is nonsense; those are just standard RISC-V register names. But you do need to be careful if you're reading PolkaVM source code as reading some parts (but not all of it, as I already tried to explain in the JAM chat) *can* be considered against the rules of the JAM prize.


## Comment by @dakk

@koute is it possible that riscv tests expect that the code is filled with ones instead of zeros? (A.4 from GP)

If I fill with ones I pass all the tests, while if I put zeros I fail riscvs. But if I put ones, I fail davxy traces tests. (https://github.com/davxy/jam-test-vectors/pull/45)


## Comment by @koute

> is it possible that riscv tests expect that the code is filled with ones instead of zeros? (A.4 from GP)

I'm afraid I don't know what you mean by "the code is filled with ones instead of zeros". By "code" do you mean the blob where the instructions opcodes + arguments are encoded? Or the bitmask? And by "filled with" do you mean what happens when you read out of bounds of the physical dimensions of either of these blobs? Can you explain in more detail or give me an exact equation number?


## Comment by @dakk

I'm referring to A.4 as I said;

![image](https://github.com/user-attachments/assets/9205ef59-2c7c-44e0-83c3-b6bcbaaf4924)

Are tests following this rule in the graypaper? Your tests on jampy fails if ζ is extended with zeros, while are passes if ζ is extended with ones.


## Comment by @koute

> Are tests following this rule in the graypaper? Your tests on jampy fails if ζ is extended with zeros, while are passes if ζ is extended with ones.

Yes. For example, [here](https://github.com/koute/jamtestvectors/blob/master_pvm_initial/pvm/TESTCASES.md#inst_add_32) you have a test which depends on this behavior (panics since the execution goes out of bounds). If you'd fill it with ones instead then that test would run forever (assuming unlimited gas) because `1` is the opcode for the `fallthrough` instruction which wouldn't stop the execution.


## Comment by @dakk

> > Are tests following this rule in the graypaper? Your tests on jampy fails if ζ is extended with zeros, while are passes if ζ is extended with ones.
> 
> Yes. For example, [here](https://github.com/koute/jamtestvectors/blob/master_pvm_initial/pvm/TESTCASES.md#inst_add_32) you have a test which depends on this behavior (panics since the execution goes out of bounds). If you'd fill it with ones instead then that test would run forever (assuming unlimited gas) because `1` is the opcode for the `fallthrough` instruction which wouldn't stop the execution.

Ok, thank you for the clarification and for pointing out a proper example. 


## Comment by @AKJUS

aki


## Comment by @0xjunha

@koute Recently I've revisited PVM test vectors and got several questions:

[PageFault cases]
In 9 test cases with PageFault exit reason,
1. In GP, `Ψ` has expected_pc=ɩ' for PageFault (`otherwise` case), whereas test vectors have expected_pc=0 (eq `A.1`)
2. Test vectors assume PageFault cases consume 2 gas units, but shouldn't it be 1 gas unit, since it exits after only executing 1 instruction?

[Post pc value on Panic or Halt]

3. In GP, `Ψ` has expected_pc=0 for Panic or Halt, (eq `A.1`) whereas many test vectors which end with TRAP have non-zero expected_pc values

[TRAP instruction]

4. It seems `TRAP` instruction doesn't alter pc value in test vectors, but in GP it seems it should be updated to `ɩ' = ɩ + 1 + skip(ɩ)` after executing `Ψ1` and then in `Ψ` expected_pc should be set 0.

Am I missing something?


## Comment by @koute

> 3\. In GP, `Ψ` has expected_pc=0 for Panic or Halt, (eq `A.1`) whereas many test vectors which end with TRAP have non-zero expected_pc values

> 4\. It seems `TRAP` instruction doesn't alter pc value in test vectors, but in GP it seems it should be updated to `ɩ' = ɩ + 1 + skip(ɩ)` after executing `Ψ1` and then in `Ψ` expected_pc should be set 0.

This is done to lessen the requirements (it can be tricky to implement grabbing the guest-side program counter in a recompiler) and/or reduce the surface area for consensus bugs - since the program counter value shouldn't really be needed on-chain we've decided to just forcefully set it to zero in the protocol in cases where the execution should not be continue. (Although, to be fair, it might actually be a better idea to set it to `0xffffffff` or something like that, since '0' can still be a valid program counter but `0xffffffff` will practically never be)

But, for the purpose of *testing* your PVM it's still useful to know *where* exactly it's trapping, hence the test vectors don't have those set to zero.

> 1\. In GP, `Ψ` has expected_pc=ɩ' for PageFault (`otherwise` case), whereas test vectors have expected_pc=0 (eq `A.1`)

Not changing the program counter is correct, otherwise it would skip the instruction after servicing the page fault, which doesn't make any sense. But yes, unless I'm missing something it seems like the A.1 equation should be corrected to not change the instruction pointer when page faulting or running out of gas.

> 2\. Test vectors assume PageFault cases consume 2 gas units, but shouldn't it be 1 gas unit, since it exits after only executing 1 instruction?

Yes. This behavior is not yet specced in the GP, but for the final gas cost model we will be charging gas not per instruction but per each basic block (otherwise the overhead of the gas metering will be too high); I'm planning to add this to the GP soon-ish.


## Comment by @0xjunha

Thank you for the clarification, that's really helpful!


## Comment by @dakk

@koute after updating my implementation to 0.6.7 and above, I'm unable to pass your tests. The issue arises after implementing A.5 and A.19; are your tests aligned with this?


## Comment by @koute

> @koute after updating my implementation to 0.6.7 and above, I'm unable to pass your tests. The issue arises after implementing A.5 and A.19; are your tests aligned with this?

Can you be more specific about what's actually failing? These shouldn't fail after implementing the updated eq. A.5 and A.19, so either I made a whoopsie when updating those equations in the GP, or you implemented them incorrectly.


## Comment by @dakk

> > @koute after updating my implementation to 0.6.7 and above, I'm unable to pass your tests. The issue arises after implementing A.5 and A.19; are your tests aligned with this?
> 
> Can you be more specific about what's actually failing? These shouldn't fail after implementing the updated eq. A.5 and A.19, so either I made a whoopsie when updating those equations in the GP, or you implemented them incorrectly.

I indeed implemented them incorrectly but I was asking if your tests were aligned with the latest version of the GP. I think A.19 is missing a boundary check, I should investigate more anyway and in that case I'll open an issue there. Thank you



## Comment by @koute

> I indeed implemented them incorrectly but I was asking if your tests were aligned with the latest version of the GP.

There should be nothing to align because these test programs shouldn't trigger the corner cases which those new equations are designed to handle.


## Comment by @davxy

@koute can we merge this?


## Comment by @koute

> @koute can we merge this?

Yes, I don't see why not; I can always made a new PR for any further modifications.


## Comment by @vekexasia

Hello, i successfully pass trace 1757406516 now but I noticed i had to change how I account pageFaults in instructions.

I have no idea why it was like this but apparently my codebase before the fix accounted for the IX gasCost + Trap GasCost when the IX caused a pagefault.

By doing so i am able to pass the pvm instructions checks from @koute here in this pr.

for example inst_store_imm_indirect_u16_with_offset_nok >= https://github.com/w3f/jamtestvectors/pull/3/files#diff-ca69518f98802d38482848f24f5d3431f0fe2fa744712da6a49e76a9253e4269R57

expects 2 gas to be consumed. only one IX is executed (the one which triggers pagefault). 

I inspected the graypaper and apparently there is no special handling for when pagefault happens so i guess the current fuzzer implementation is ok... tossing it here so that it happens before the merge


## Comment by @mikirov

@vekexasia second to this. I could not find the justification in GP why we should take 2 gas here. could you find the reason for taking 2 gas?


## Comment by @vekexasia

Nope I still think it's an error in those tests


## Comment by @mikirov

@koute running `riscv_rv64ui_sh` I am getting a specific error on the `STORE_IND_U16` instruction. According to GP it should sign extend the imediate, however `riscv_rv64ui_sh` seems to not use sign extension. from pvm.tex:
`\immed_X &\equiv \sext{l_X}{\decode[l_X]{\instructions\subrange{\imath+2}{l_X}}}`


## Comment by @tomusdrw

AFAIR @koute mentioned these test vectors should be considered deprecated. Some of them calculate gas incorrectly - here is the list:
```
// https://paritytech.github.io/matrix-archiver/archive/_21ddsEwXlCWnreEGuqXZ_3Apolkadot.io/index.html#$qvS25IbmiyGNWR0kuxhZpukDWP5H7d_5rmUiEJ7KTUI
    "pvm/programs/inst_load_u8_nok.json",
    "pvm/programs/inst_store_imm_indirect_u16_with_offset_nok.json",
    "pvm/programs/inst_store_imm_indirect_u32_with_offset_nok.json",
    "pvm/programs/inst_store_imm_indirect_u64_with_offset_nok.json",
    "pvm/programs/inst_store_imm_indirect_u8_with_offset_nok.json",
    "pvm/programs/inst_store_imm_u8_trap_inaccessible.json",
    "pvm/programs/inst_store_imm_u8_trap_read_only.json",
    "pvm/programs/inst_store_indirect_u16_with_offset_nok.json",
    "pvm/programs/inst_store_indirect_u32_with_offset_nok.json",
    "pvm/programs/inst_store_indirect_u64_with_offset_nok.json",
    "pvm/programs/inst_store_indirect_u8_with_offset_nok.json",
    "pvm/programs/inst_store_u8_trap_inaccessible.json",
    "pvm/programs/inst_store_u8_trap_read_only.json",
```

On top of that the vectors will need to change according to the new gas cost model, see: https://github.com/koute/new-gas-cost-model


## Comment by @koute

I've updated the test vectors for GP 0.8; please do let me know if you find any issues.


## Comment by @gavofyork

Would be nice if these could be done to the level of the Safrole test vectors - i.e. referencing the relevant symbols and equations in the GP and providing a good ASN definition.

Specifically, it looks like these test vectors are for (207) **Psi**, but omit the arguments and results for gas, memory and initial instruction counter.


## Comment by @koute

> Would be nice if these could be done to the level of the Safrole test vectors - i.e. referencing the relevant symbols and equations in the GP and providing a good ASN definition.

Sure, I can do that.

> Specifically, it looks like these test vectors are for (207) Psi, but omit the arguments and results for gas, memory and initial instruction counter.

Yes. The omissions were intentional, since no tests use them right now. This is only temporary of course.
