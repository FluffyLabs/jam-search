---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/72'
title: '1757422771'
site: github.com/davxy/jam-conformance
created_at: '2025-09-09T20:53:07.000Z'
last_modified: '2025-09-09T20:53:07.000Z'
content_kind: discussion
---

# 1757422771

## Discussion by @vekexasia

Hello i was looking at 1757422771 and it seems that there are 3 blocks
000..31
  - preStateRoot: `0xff9b56412d2f628aba6b32caf2dfd9d420a307aaa2122f5cfd4142ef1d59e341` 
  - slot: 26
  - postSR: `0x2907d19ced4d7cbc5e3d883304353cf3644b5bc19a71dc9bc18cab6989770450`
  
 000..32
  - preSR: `0x2907d19ced4d7cbc5e3d883304353cf3644b5bc19a71dc9bc18cab6989770450`
  - slot: 27
  - postSR: `0x7595a52949138187cd51bd96ef77a568b7e763906edb08bbd4ede6e53c5f3017`
  
000..33
  - preSR: `0x2907d19ced4d7cbc5e3d883304353cf3644b5bc19a71dc9bc18cab6989770450` 
  - slot: 27
  - postSR: `0x4207f9e183a2dc18e8c788d097037708033840642adc0a7fd3209bea71157f8d`

My report says that the fuzzer expected postSR from 000..33 but got the postSR from 000.32 (which it seems the case considering 33 has same slot of 32.

https://github.com/davxy/jam-conformance/blob/861057e3fb6250bd7a18119351af04da099d66bd/fuzz-reports/0.7.0/reports/tsjam/1757422771/report.json#L57-L58

What is mind bugging is the preSR from 000.33 which seems to reference the postSR from the first block like if the 2nd was never applied.

Can you clarify a little bit how the fuzzer works? cause it looks to me that 31 is being used as genesis, then 32 is applied and 33 is also being sent in sequence.

If this is the case why does 33 reference 31s postSR? 
https://github.com/davxy/jam-conformance/blob/861057e3fb6250bd7a18119351af04da099d66bd/fuzz-reports/0.7.0/traces/1757422771/00000033.json#L3


## Comment by @vekexasia

This is duplicate of https://github.com/davxy/jam-conformance/discussions/71


## Comment by @davxy

I need to check why your report references 32.
For the other answers, pls refer to #71 


## Comment by @davxy

I re-opened to remember to check why you get report for 32


## Comment by @davxy

I checked your report.  

The failure happens right at the first step (your target fails to import 00..31).  
In other words, the root returned by your target after `SetState` does not match the expected value.  

The trace files contains `32` and `33` because some targets fail at step 32 and others at step 33.  

You can identify the exact step where your target fails by checking the `target.steps` field in the report.  
This key indicates how many steps were successfully executed by the target.  

For example, [Boka](https://github.com/davxy/jam-conformance/blob/861057e3fb6250bd7a18119351af04da099d66bd/fuzz-reports/0.7.0/reports/boka/1757422771/report.json#L42) fails on step 1.



## Comment by @davxy

Edit: the steps recording was a bit flawed. I improved it, I'll regen the records.

Still, your target fails to process `SetState` and the wrong root is returned


## Comment by @vekexasia

interesting. this is not the case in my current codebase.  will investigate



## Comment by @vekexasia

hey davxy. just to make sure something is not off can you rerun with the new target i just published?

As i said my current codebase didnt show that behavior after setstate and i also took sometime testing the target but maybe i am missing something. also the new target should have sensible perf improvement and pass ALL traces.


## Comment by @davxy

I'll check that out
