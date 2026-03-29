---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/64'
title: '1757092821'
site: github.com/davxy/jam-conformance
created_at: '2025-09-05T20:22:24.000Z'
last_modified: '2025-09-05T20:22:24.000Z'
---

# 1757092821

## Discussion by @jaymansfield

My implementation rejects this block due to its slot being in the future.

It uses slot # 20973629, and with the jam common era as of right now brings us to approx slot #3561787.


<img width="441" height="149" alt="Screenshot 2025-09-05 at 4 19 58 PM" src="https://github.com/user-attachments/assets/0408b4fb-a3e5-415f-be79-d950347437c9" />



Is this a defect for others that imported, or should this check be disabled while fuzzing @davxy ?



## Comment by @davxy

Comparison against wall clock time should be disabled during fuzzing as it doesn't make much sense.
 *P* is both extremely close to 0 and non-constant.  

Another deviation: we start from an arbitrary slot X (typically 0),  we do not use the slots since Jam epoch according to wall clock.

In practice, it is enough to check whether the current slot is greater than the parent.  

Thanks for pointing this out - these notes should be added to the fuzz protocol spec.


## Comment by @jaymansfield

Thanks @davxy 
