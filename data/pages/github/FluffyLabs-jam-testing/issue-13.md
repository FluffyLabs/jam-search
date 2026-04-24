---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/issues/13'
title: PBNJAM container needs 4GB RAM for long term block imports
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-17T08:58:38.000Z'
last_modified: '2026-03-17T08:58:38.000Z'
content_kind: issue
---

# PBNJAM container needs 4GB RAM for long term block imports

## Issue by @mikirov

In order to run using the native bindings backend for ietf/ring proof verification for many consecutive blocks, the container needs at least ~3.5 GB RAM as it preloads and caches a lot of ahead of time and stores it in-memory.
```
docker run --rm --network none \
  --cpu-shares 2048 --cpu-quota -1 \
  --memory 4096m --memory-swap 5120m \
  --shm-size 256m \
  --ulimit nofile=1024:1024 \
  --ulimit nproc=1024:1024 \
  --stop-signal=SIGKILL --stop-timeout=5 \
  -v jam-ipc-volume-pbnjam-fuzz-fuzz:/shared \
  shimonchick/pbnjam-fuzzer-target:latest \
  --socket /shared/jam_target.sock

```



## Comment by @tomusdrw

please take a look at: https://github.com/FluffyLabs/jam-testing/pull/14 I've increased the mem available to docker, but from the logs it seems that your issue is correctness (invalid state roots) and not really memory


## Comment by @mikirov

I've re-published the docker container and now locally running the 2 containers and wiring up the napi bindings works correctly on my side (minifuzz and docker command from your cicd)



## Comment by @tomusdrw

Jobs restarted:
https://github.com/FluffyLabs/jam-testing/actions/runs/23190525175
https://github.com/FluffyLabs/jam-testing/actions/runs/23190514541


## Comment by @mikirov

@tomusdrw cheers!



## Comment by @tomusdrw

@mikirov seems to work now, but you need to work on the performance of storage and storage ligth to fit into the 10mins timeout.


## Comment by @mikirov

@tomusdrw would it be possible to run picofuzz storage and storage_light in isolation? https://github.com/FluffyLabs/jam-testing/actions/runs/23397142431/job/68062798233

I want to see if the job is being picked up late for the 10 min cut off, or if my target is stalling for some reason


## Comment by @tomusdrw

Each job runs completely in isolation. Notice that minifuzz storage/storage_light tests are taking 5minutes for your target. These test are very PVM/host-call heavy. Picofuzz tests need to execute the same tests 10 times to average import times.

By looking for "<-- Initialize" patter in picofuzz in the job logs, you can see that we have enough time to fully execute only 2 out of 10, so you need to work on improving the PVM performance.

Looking at the "Fuzzer connected" timing message from your target you can see:
1. First run:  1774162473551
2. Second run: 1774162740829

So one run takes around 267 seconds and that's exactly the reason why these cannot complete (afair it's 100 blocks to import, so average block import time is over 2.5s on your target).
