---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/46'
title: Request for PVM trace of work done in tiny/process_one_immediate_report-1
site: github.com/davxy/jam-test-vectors
created_at: '2025-05-01T18:26:44.000Z'
last_modified: '2025-05-01T18:26:44.000Z'
---

# Request for PVM trace of work done in tiny/process_one_immediate_report-1

## Issue by @charliewinston14

Hello @davxy 

My gas value for this test does not match the value in the expected new service statistics. I realized my PVM for this vector is ending in panic which I'm assuming is incorrect but I'm not sure how to know where my PVM acted differently. I've gone through it and there is no way for me to know which PC, instruction type, etc didn't match since we have no visibility into the generation of the result.

Are you able to provide a trace of what your PVM is doing while executing the standard program?


## Comment by @davxy

@charliewinston14 here is the trace https://github.com/davxy/stuff/blob/main/pvm-traces/process_one_immediate_report-1.log

Please retry with the latest vectors as some things were changed in the meantime


## Comment by @davxy

@sourabhniyogi @jaymansfield are you able to process this and the other accumulate test vectors?
In particular I'm interested if you can pass the last revision.





## Comment by @jaymansfield

@davxy I had an issue with this previously as well. 

I went through the trace you sent @charliewinston14 and in my implementation I see a difference near the very end when it does a write host call.

Specifically here:

![Image](https://github.com/user-attachments/assets/b82fd38b-7736-48c0-ac11-bb8c0a8b33a7)

There is no previous value for the storage key so I was setting l=NONE, but I think you may be using l=0 in this case. The very next instruction is a branch if r7=0 and the trace seems to perform it. Can you confirm how you handle this?

EDIT: Actually I also don't see the storage item in the post state, but I see the host call in the trace.


## Comment by @davxy

Hi @jaymansfield thank you for reporting. Indeed your suggestion disclosed a bug in our implementation. On success we were just returning `0`. Can you please try the vectors in this PR: https://github.com/davxy/jam-test-vectors/pull/52 ?

Thank you


## Comment by @jaymansfield

The only post-state difference I see is the storage item created in the write host call still doesn't seem to end up in your post-state.

I end up with this storage item (which also changes # of items/bytes of the service):
0xc1ff06ff00ff00ff7fefd83798e56a4ba4322480645a7cbe26557030f6f97b = 0x64756d6d79


## Comment by @davxy

> The only post-state difference I see is the storage item created in the write host call still doesn't seem to end up in your post-state.
> 
> I end up with this storage item (which also changes # of items/bytes of the service): 0xc1ff06ff00ff00ff7fefd83798e56a4ba4322480645a7cbe26557030f6f97b = 0x64756d6d79

Right! this is just a bug in the post state dump procedure. I'll update soon


## Comment by @jaymansfield

Is it possible to also have a preimage historical meta value added to the service as well since the GP defines the item/bytes calculation based off it and not the actual preimage?


## Comment by @jimjbrettj

> Is it possible to also have a preimage historical meta value added to the service as well since the GP defines the item/bytes calculation based off it and not the actual preimage?

@davxy Wouldn't the current values be incorrect since they should be using lookup metadata info rather than preimage info?  Even if they are the correct values, the calculations (GP 9.8) would give a different result than this no?


## Comment by @davxy

> Is it possible to also have a preimage historical meta value added to the service as well since the GP defines the item/bytes calculation based off it and not the actual preimage?

@jaymansfield @jimjbrettj footprint (as per 9.8) is computed in the host call with the data passed by the service code. In your host call you should receive the complete key value which is sufficient to compute the next footprint value. Previous footprint is in the state.



## Comment by @jimjbrettj

> > Is it possible to also have a preimage historical meta value added to the service as well since the GP defines the item/bytes calculation based off it and not the actual preimage?
> 
> [@jaymansfield](https://github.com/jaymansfield) [@jimjbrettj](https://github.com/jimjbrettj) footprint (as per 9.8) is computed in the host call with the data passed by the service code. In your host call you should receive the complete key value which is sufficient to compute the next footprint value. Previous footprint is in the state.

@jaymansfield @davxy Yeah I'm with you, if I am understanding what you are saying I do this currently. The part I'm confused on is isn't the presence of lookup metadata needed for this calculation? I understand I can manually calculate it without, but that will differ from 9.8. 

As a slight aside, is it valid to have a preimage present in the state without a correlated lookup-metadata? I know that there can be a lookup-metadata without a preimage if it's been requested but not provided, but how can there be a preimage without associated metadata? Maybe since this is just a test it is not relevant here, but I think it relates to my overall question of why the lookup metadata is omitted (especially since it is used for the bytes/items calculations).

So I can do a custom calculation here since now metadata is provided, but I'm confused why we wouldn't just want to include the lookup metadata in the tests so we can do normal calculations using 9.8?

And ofc if I am misunderstanding something here, let me know!
