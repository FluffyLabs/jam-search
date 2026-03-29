---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/57'
title: '1756792661'
site: github.com/davxy/jam-conformance
created_at: '2025-09-03T10:49:33.000Z'
last_modified: '2025-09-03T10:49:33.000Z'
---

# 1756792661

## Discussion by @dakk

In 1756792661: locally jampy doesn't import 1756792661/00000027.bin (resulting in state root 0x1cdc271aaafb5fd01e97df0048a7b8b15a9b890c5be6208a391ae6df10af7b22) because of wrong_extrinsic_hash, while it imports 1756792661/00000028.bin (resulting in state root 0x3881bb5fd34454aefe9ec0cc4ec931aac1471d8e6f84e79ff5cee4ba464f0c27). Both executions matches the post_state in our local runner.

In the report (https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.7.0/reports/jampy/1756792661/report.json) I see that the fuzzer expect 0x1cdc271aaafb5fd01e97df0048a7b8b15a9b890c5be6208a391ae6df10af7b22 while I gave 0x3881bb5fd34454aefe9ec0cc4ec931aac1471d8e6f84e79ff5cee4ba464f0c27.

What trace is the fuzzer running on jampy target? 27.bin or 28.bin?


## Comment by @boymaas

Hai @davxy I have the same output as @dakk. First one is:

#27: Extrinsic hash mismatch: header=d97b984d237af71a9fad17953fd6265f7aa6930
f2a948810c06f47c1861ded0f, computed=91ecdc8b5ad9946b853a8548be9dc553dcfa377
efa64fcc40360ba2a2f2498ae

#28: Post-state root matches: 3881bb5fd34454aefe9ec0cc4ec931aac1471d8e6f84e79ff5cee4ba464f0c27


## Comment by @davxy

I'll check this out. Perhaps tomorrow.



## Comment by @sourabhniyogi

Yes, same with jamduna target.


## Comment by @mkchungs

Hi @davxy, 

```
0.7.0/traces/1756792661/00000027.bin   ---->  ExtrinsicHash Mismatch Error 
0.7.0/traces/1756790723/00000011.bin   ---->  H_s Verification Error
0.7.0/traces/1756791458/00000041.bin   ---->  H_s Verification Error
0.7.0/traces/1756814312/00000025.bin   ---->  H_s Verification Error
```

The traces above are the _first instances_ where we observed “invalid” transitions produced by your fuzzer. 
Notably, 1756792661/27.bin is special because it explores the pattern of 26.bin [valid] -> 27.bin [invalid] -> 28.bin [valid], whereas other invalid transitions stop at the initial [valid] -> [invalid] step.

While our local unit test correctly rejects 27.bin, we’re unable to replay/reproduce it in our fuzzer+target setup because the parent header (26’s blockHeader) is missing and required for the setState call. 

Could you also publish 26.bin so we can debug whether our target handles the [valid] -> [invalid] -> [valid] scenario properly?







## Comment by @davxy

Yeah. I need to check or retire the trace. Is on my agenda 😅


## Comment by @davxy

When the mutator is enabled, we may have a report whose parent is not in the immediately preceding fuzzer step. We need to fix this on our side to ensure the actual parent step is provided instead.

edit: I'll retrire this trace
