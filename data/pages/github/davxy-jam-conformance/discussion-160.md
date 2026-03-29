---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/160'
title: 1768864701 - Step 00014908
site: github.com/davxy/jam-conformance
created_at: '2026-01-24T13:47:00.000Z'
last_modified: '2026-01-24T13:47:00.000Z'
---

# 1768864701 - Step 00014908

## Discussion by @boymaas

This trace suggest the following:

Pre-state: Service 2947170938 exists with balance 304062
Post-state: Service 2947170938 exists with balance 355082 (+51020 from transfer)

The service should survive and receive the transfer

We had an earlier discussion where I believe we agreed upon deleting the service and essentially burning the funds: https://github.com/davxy/jam-conformance/discussions/148. This is what I see happening in the trace:

Batch 1: Starting parallelized accumulation for 2 work reports, 0 pending transfers
  - Service 997631873 runs and calls transfer → generates 1 transfer for next batch
  - Log: Service 997631873 generated 1 transfers for next batch

Batch 2: Starting parallelized accumulation for 1 work reports, 1 pending transfers
  - Service 0 runs and ejects 2947170938
  - Service 2947170938 runs with 0 operands, 1 transfers (it receives the transfer in this same batch)

So the transfer is NOT deferred to a future block - it's processed in batch 2 of the same block. Service 2947170938 accumulates in batch 2 with the incoming transfer.

  The sequence in batch 2:
  1. Service 0 ejects 2947170938
  2. Service 2947170938 accumulates with the incoming transfer

Both happen in parallel in the same batch. The merge then decides the outcome, which I believe should be Service 2947170938 deleted and effectively the transfer amount would be burned.  I cannot find anywhere in the graypaper defined that the service needs to be restored.

See: https://github.com/w3f/jam-conformance/tree/javajam_m1/fuzz-reports/0.7.2/traces/1768864701


## Comment by @jaymansfield

I was planning on posting the same thing today you beat me to it. 

In the trace a ejected service is brought back after receiving a transfer which I don't think is correct. 1768945074 might have the same issue as well. 


## Comment by @ascrivener

Also observed this issue on polkajam for both 1768945074 and 1768864701

relevant GP bit: the services in m (which are services ejected by any other service) are removed from d'

<img width="452" height="532" alt="Screenshot 2026-01-24 at 10 49 47 AM" src="https://github.com/user-attachments/assets/ea6e42b8-e807-41f2-a766-b8d8149229f0" />



## Comment by @davxy

There was a known bug in Polkajam that was discussed elsewhere some time ago. These traces are therefore likely obsolete and may need to be retired. I will try re-executing them to confirm.


## Comment by @davxy

@boymaas sorry but I can't find this trace in my repo. Where you found it?


## Comment by @boymaas

No problem @davxy, I put it at the bottom of the message. Here it is  https://github.com/w3f/jam-conformance/tree/javajam_m1/fuzz-reports/0.7.2/traces/1768864701. Part of the W3F traces conducted on the JavaJAM M1 implementation.


## Comment by @davxy

I see. @piewol @CrackTheCode016, it appears that 1768864701 trace in `javajam` is invalid.
This is related to a bug we recently fixed in the fuzzer repository (https://github.com/paritytech/polkajam/pull/907). I therefore suspect that your polkajam fuzzer repository is outdated. Please pull the latest changes and retire this specific trace.
Thank you



## Comment by @jaymansfield

I think 1768945074 has the same issue as 1768864701.


## Comment by @PieWol

Thank you for the ping @davxy , we will update our binaries for future evaluations.


## Comment by @davxy

Yes 1768945074 to be retired as well
