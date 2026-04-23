---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/16'
title: Boka
site: github.com/davxy/jam-conformance
created_at: '2025-08-15T07:21:26.000Z'
last_modified: '2025-08-15T07:21:26.000Z'
content_kind: issue
---

# Boka

## Issue by @qiweiii

Hi @davxy, I made a pr (#15) to add boka target, and note we use docker. 

I tried to pass some archive tests, but still got a few need to investigate, I will notify here when we are ready to test by fuzzer


## Comment by @qiweiii

and one issue I want to mention is the fuzzer seems not using compact encoding to get `i` in (B.10)


## Comment by @davxy

> I tried to pass some archive tests, but still got a few need to investigate, I will notify here when we are ready to test by fuzzer

Removed some problematic one. See [NEWS](https://github.com/davxy/jam-conformance/blob/main/NEWS.md)

> and one issue I want to mention is the fuzzer seems not using compact encoding to get i in (B.10)

Good catch. Thank you


## Comment by @sourabhniyogi

Great find!  The [1754982087](https://github.com/davxy/jam-conformance/blob/e3650d462a45249f94bedea2d6a73cb894e0142a/fuzz-reports/archive/0.6.7/1754982087/report.json#L4) also has a "new" service invocation and needs to be removed.


## Comment by @davxy

Is possible to have a target that doesn't terminate after the socket is closed? I.e. Instead waits for the next connection like the others do.  

At the moment, I am using this workaround:  

https://github.com/davxy/jam-conformance/blob/6f42dedac4543faeb30ba2fbcc8ec346852592f5/scripts/run_target.sh#L114-L118  

However, this is slow since the container is restarted for each run.



## Comment by @qiweiii

Sure, will fix this in the next release


## Comment by @qiweiii

update: latest boka target should be able to pass most tests except new ones


## Comment by @qiweiii

Hi @davxy 

For reports under boka, I am not sure if they are based on the latest target, could you please help check? coz we have a latest image today and the reports are from yesterday.


Another issue is some reports may end in a slot that has no traces available, so i cannot debug those cases

https://github.com/davxy/jam-conformance/blob/857279f1c850aa68970700808de854cc9f6dabc8/fuzz-reports/0.6.7/reports/boka/1755186567/report.json#L29C9-L29C20





## Comment by @davxy

The trace for your report is available here:  
[Trace link](https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/0.6.7/traces/1755186567)

To map a report to its trace:
- Check the trace folder's unixtime.
- Trace files are named after the fuzzer step (iteration), which may skip slots.
- Therefore, the filename does not always match the block slot.

For example, in block of trace file 130 you will see slot 211, which is the trace you need.


## Comment by @qiweiii

@davxy, boka can now pass all traces (locally), pls get target and re-run when you are free


## Comment by @davxy

I updated the reports table. Some traces are resolved, but from what I can tell these ones are still failing:

1754983524
1754990132
1755081941
1755082451
1755183715
1755185281
1755186567
1755248769
1755250287



## Comment by @qiweiii

Thanks! I guess there could be some issues with our docker build, I am investigating 🫠


## Comment by @qiweiii

the latest image should work now, pls try again @davxy


## Comment by @qiweiii

update: latest boka image should be able to pass the last 2 traces in 0.6.7


## Comment by @qiweiii

update: boka latest image disabled pvm logging which should improve perf significantly @davxy 


## Comment by @davxy

Nice. updated


## Comment by @qiweiii

boka got some perf improve (~2x faster) as well


## Comment by @qiweiii

@davxy could we have pvm traces for 1756548583/00000009? I spend some time on this and not able to find the root cause of the mismatch


## Comment by @davxy

Hey @qiweiii have you managed to switch to fuzzer protocol v1? I'd like to run the new traces against your target.
Ty


## Comment by @qiweiii

> Hey @qiweiii have you managed to switch to fuzzer protocol v1? I'd like to run the new traces against your target.

Yes, I just start to impl fuzz-v1, probably ready tomorrow 


## Comment by @qiweiii

@davxy, boka updated to fuzz v1, and able to pass minifuzz


## Comment by @davxy

@qiweiii Have you published your new target image? Because the one that I've just downloaded doesn't pass the `fuzzy` traces in jam-test-vectors repo (docker image id=d48f18e8312e)


## Comment by @qiweiii

@davxy Boka target just released, the latest one should be able to pass fuzzy and the current 0.7.1 traces in this repo


## Comment by @qiweiii

@davxy boka latest release should be able to pass all existing traces. btw can we have another perf round
