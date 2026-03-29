---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/83'
title: PVM logs for "traces" v0.6.6 tests
site: github.com/davxy/jam-test-vectors
created_at: '2025-06-26T00:23:13.000Z'
last_modified: '2025-06-26T00:23:13.000Z'
---

# PVM logs for "traces" v0.6.6 tests

## Issue by @sierkov

I'm observing a discrepancy in the accumulate_gas_used service statistic for ```traces``` test cases that involve accumulation (e.g., reports-l0/00000005 or reports-l1/00000099). All other state components match perfectly, and all accumulate tests pass without issues.

Obvious potential sources of such discrepancies, such as host call gas settings and basic block/instruction gas values, have been reviewed but have not revealed the cause.

Would it be reasonable to publish sample PVM logs for ```traces``` test cases that invoke the PVM?
I believe having access to these logs could help teams diagnose PVM execution or gas usage inconsistencies, especially with upcoming GP and test-vector updates.



## Comment by @jimjbrettj

For what it's worth, I am also observing a discrepancy with `accumulate_gas_used` and am investigating it currently


## Comment by @jimjbrettj

@sierkov @davxy I did some math on expected gas for WP Trace L0 00000005.json maybe I am missing something but it seems to be different than expected.

From what I see there are 72,942 instructions executed, so 1 gas for each of those. 

From there, there are I believe 16 host calls, 2 of which are log (aka 0 gas), meaning the remaining host calls use 14*10=140 gas.

This would bring total gas used to 73,082, which is different than the expected value of 73,054.

Is there a chance the expected value is incorrect? Else am I missing something in how I calculated the expected value?


## Comment by @sierkov

@jimjbrettj, several teams have successfully passed all traces tests—see more details in this PR: https://github.com/davxy/jam-test-vectors/pull/82. Given this, I believe the discrepancy is on our side.

The number of executed instructions can vary depending on the program’s input parameters and the results returned from host calls. That's the reason why I believe that having access to PVM logs could help to noticeably simplify debugging.

The issue remains present on my side.


## Comment by @sierkov

@davxy Could you please provide some PVM execution traces, such as for `reports-l0/00000005` and `reports-l1/00000099`? 

My project already supports the [fuzzing protocol](https://github.com/davxy/jam-stuff/blob/main/fuzz-proto/README.md) and passes all other tests except for this issue with gas consumption. Having these traces would help diagnose the discrepancy.



## Comment by @davxy

@sierkov Here are our PVM traces for reports-l0 5 and 99: https://github.com/davxy/jam-stuff/tree/main/pvm-traces/0.6.6
They aren't easily machine-parseable, but I hope you still find them useful.


## Comment by @jimjbrettj

I'm in the exact same boat as @sierkov, passing everything except for this gas calc issue. @sierkov if you end up finding something I  would appreciate an update on the problem (as long as it's fine with the rules ofc) and I will do the same if I find anything that might be helpful. Was working on other things but will start to investigate this now


## Comment by @sierkov

@davxy, thank you very much for sharing the traces!

I am currently analyzing the ```reports-l0/00000005``` trace, and the first divergence in instruction execution occurs during the processing the ```info``` host call result. Particularly, a ```branch_lt_s_imm``` instruction relying on the byte at address 0x327c9 (the 41-st byte in the ```info``` result data) is not triggered in my case whereas it is in yours.

Could you please confirm the following:
1) Is the expected encoding consistent with the one described in GP 0.6.6?
    <img width="814" height="120" alt="Image" src="https://github.com/user-attachments/assets/62f7be69-017c-42ef-af0e-5f1e1450b814" />
2) Are all integer arguments encoded using variable-length integer encoding rather than fixed-length one?


## Comment by @davxy


>     1. Is the expected encoding consistent with the one described in GP 0.6.6?

yes

>     3. Are all integer arguments encoded using variable-length integer encoding rather than fixed-length one?

yes. All int args are compact encoded (note the first is a hash, just in case...)




## Comment by @davxy

If you like I can share the vals returned from the info host call so that you can double check on your side?

Edit: tomorrow :-D


## Comment by @sierkov

Yes, that'd be great!


## Comment by @jimjbrettj

@davxy is there any chance you could also share the encoded config that is returned in Fetch 0? If it is not too much work, I would appreciate it! But if it is no worries I will keep on debugging


## Comment by @qiweiii

I just uploaded our trace to: https://github.com/qiweiii/boka-logs/blob/main/traces/0.6.6/reportsl0-00000005-debug.txt
hope it's helpful




## Comment by @sierkov

@qiweiii, thank you for sharing your log.

At the current level of granularity, everything appears to match: host calls, their arguments, and observable side effects. I’m currently considering two potential causes for the discrepancy:
1) A difference in the result returned by the ```info``` host call.
2) A subtle issue in the PVM instruction implementation (e.g., a missing sign extension or similar detail).

To investigate further, we really need instruction-level PVM traces, similar to the ones shared by @davxy.
Ideally, these traces should include information about values loaded from and stored to PVM memory.
However, details about what host calls, such as ```info```, write into the PVM memory could also help.

Thanks again!


## Comment by @jimjbrettj

Hey @qiweiii thanks a lot for sharing your trace! I have a question, in the first fetch call I see that the write address is 1, which should be out of bounds, I believe, but your execution continues. I don't believe this memory region is writeable so I would have expected the panic case to be triggered here. 

If I'm not mistaken the length of the data being written here is 0, and what I have been doing is skipping writes for 0-length data. However, this leaves me wondering what is actually being returned in this case? I am finding myself in a situation where I write nothing (due to 0 len data)  but return `|v|` aka 134, but that sends me down a different execution path than what I observe in @davxy's trace, and besides that it just does not feel correct since nothing is being written.

Am I missing something in my understanding of this situation? If not, would you be able to clarify how you are handling this? Of course I am open to feedback from @davxy here as well


## Comment by @qiweiii

@jimjbrettj  I had the same question and asked in this [comment](https://github.com/davxy/jam-test-vectors/pull/82#issuecomment-2999117250), I still have doubt about it, but what I did is skip when write length is 0, and return 134 in this case, but seems I have the same execution path after that


## Comment by @jimjbrettj

@qiweiii I am with you, I feel this behavior is odd. But okay, this is what I have been doing as well, so my issue seems to lie elsewhere. Thank you, this was helpful! 


## Comment by @davxy

> If you like I can share the vals returned from the info host call so that you can double check on your side?

I think I have an idea of what’s going on, but I need to run a couple of checks. Please hold on - sorry if I’m a bit slow, it’s on my list


## Comment by @davxy

Most of the time, in our program,  the `fetch` host call is invoked twice:

- **First**, with the `length` parameter set to `0`. According to the GP, this indicates a request to return the encoded value’s length. At this point, the actual value of the target buffer is irrelevant - even though, as you noted, it's oddly set to `0x000000001`. The buffer only needs to be writable for a number of bytes equal to the `length` parameter (which is `0` in this case), so no trap is triggered.

- **Why is the buffer set to `0x000000001`?** This was a minor oversight in our code. In Rust, taking the address of an empty slice yields `0x000000001`. This has been fixed in [PR #87](https://github.com/davxy/jam-test-vectors/pull/87), which changes the behavior to return `0x00000000` instead.



## Comment by @sierkov

@davxy, could you please provide the reference output of the ```info``` host call before and after encoding? Below I provide some additional context from my project.

- The current difference in the number of executed instructions is: -16 (our code executes 16 fewer instructions).
- This difference is constant across all traces tests that invoke accumulation.
- The difference in gas usage begins between 3rd (```info```) and 4th (```log```) host calls.
- The results returned from the ```info``` call on my side are:
  - Unencoded: 
    - code_hash: 0242A295A93AC7F3BA564F0BE83089A647A9BD3861798CF9FBFFAE0DAA2CE1FF
    - balance: 18446744073709551615
    - slot: 5
    - min_item_gas: 10
    - min_memo_gas: 10
    - bytes: 158832
    - items: 4
  - Encoded: 0x0242A295A93AC7F3BA564F0BE83089A647A9BD3861798CF9FBFFAE0DAA2CE1FFFFFFFFFFFFFFFFFFFF050A0AC2706C04

Also, two questions regarding the reference PolkaVM implementation:
1) Would it be feasible to log memory access (read/write values) to PVM RAM during execution? This might help diagnose more complex divergences more effectively.
2) What is the best way to report possible mismatches between GP and PolkaVM? This issue has been raised in the GP channel earlier but hasn’t received a response. I provide a copy of the issue's description below.

### Potential discrepancy between GP and the reference PolkaVM implementation
1) According to (A.16) of the Gray Paper, any signed extension must produce a 64-bit value:
https://graypaper.fluffylabs.dev/#/9a08063/25e30225e302?v=0.6.6
2) In (A.26), the immediate (nu_x) for the branch_ge_u_imm instruction must be sign-extended from 32 bits or less (as the immediate size is up to 4 bytes) to 64 bits, using the signed extension defined in (A.16).
https://graypaper.fluffylabs.dev/#/9a08063/27e70227e702?v=0.6.6
3) When decoding the following argument octets for a branch_ge_u_imm (opcode 85):
0x17 0xf7 0xf4 0x1,
the official PolkaVM implementation logs this as:
"jump 70519 if a0 >=u 4294967287" (the instruction starts at offset 70019).
This suggests that the signed extension applied to an 8-bit value (0xf7) resulted in a 32-bit value 0xfffffff7 = 4294967287, rather than a 64-bit value as implied by (A.26).


## Comment by @jimjbrettj

Hey @sierkov, maybe I missed something here but shouldn't you have account threshold (t sub t) instead of the slot as part of the info?


## Comment by @jimjbrettj

And update @sierkov, the issue has been fixed on my side. The execution problems were related to two things:
1) Heap management and the sbrk instruction
2) A side effect in our `write` host call that mutated an original slice after a copy was mutated (a fun feature of go) that caused us to return the wrong value 

Wanted to give update on what fixed it for me in the hopes that the information might be helpful to you


## Comment by @sierkov

@jimjbrettj Good catch! After providing the right threshold value, the issue is resolved on my side as well.
Gas usage now matches perfectly in all traces tests.

Here are the values returned from the ```info``` call that solved the issue:
- Unencoded:
  - code_hash:  0x0242A295A93AC7F3BA564F0BE83089A647A9BD3861798CF9FBFFAE0DAA2CE1FF
  - balance: 18446744073709551615
  - threshold: 158972
  - min_item_gas: 10
  - min_memo_gas: 10
  - bytes: 158832
  - items: 4
- Encoded: 0x0242A295A93AC7F3BA564F0BE83089A647A9BD3861798CF9FBFFAE0DAA2CE1FFFFFFFFFFFFFFFFFFFFC2FC6C0A0AC2706C04

@davxy The two questions regarding PolkaVM from the comment above still apply, but they are not urgent any more. In my view, they can simplify debugging of future divergencies between PolkaVM implementations and are worth looking into when time permits.


## Comment by @davxy

@jimjbrettj For PolkaVM internals, the right person to ask is @koute (Jan in the Matrix channel).


## Comment by @koute

> Potential discrepancy between GP and the reference PolkaVM implementation

It's just a bug when printing the disassembly, because it was originally written for 32-bit PVM, and I forgot to add an `if` there to sign extend the value to 64-bit when it's disassembling 64-bit bytecode. Thanks for the report; I'll fix it.

> Would it be feasible to log memory access (read/write values) to PVM RAM during execution? This might help diagnose more complex divergences more effectively.

That's already done by PolkaVM when trace logs are enabled.

> What is the best way to report possible mismatches between GP and PolkaVM? This issue has been raised in the GP channel earlier but hasn’t received a response. I provide a copy of the issue's description below.

Create an issue in the PolkaVM repository and tag me.

