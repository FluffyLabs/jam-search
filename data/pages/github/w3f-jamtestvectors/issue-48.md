---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/48'
title: Possible issue in preimage integration and statistics
site: github.com/w3f/jamtestvectors
created_at: '2025-05-25T16:43:15.000Z'
last_modified: '2025-05-25T16:43:15.000Z'
content_kind: issue
---

# Possible issue in preimage integration and statistics

## Issue by @kianenigma

The preimage integration chapter states a few rules around which of the preimage extrinsics are integrated into the service's state, such as it being requested and it not being already provided and so on. 

https://graypaper.fluffylabs.dev/#/cc517d7/181e02187802?v=0.6.5

The service preimage statistics section, however, seems to indicate that for any preimage extrinsic, designated for a service, we note the statistics for that. 

https://graypaper.fluffylabs.dev/#/cc517d7/19be0319e303?v=0.6.5

The test vectors recently merged in #28 seem to follow the rule that a preimage's statistics are only noted if it is integrated. For example, the `preimage-not-needed` files.

My guess is that I am misinterpreting the statistics, and the test vectors are doing the right thing: A preimage should only be noted in the statistics if it is integrated.


## Comment by @kianenigma

Comments from dave: <img width="553" alt="Image" src="https://github.com/user-attachments/assets/7e537738-55ba-4af6-9389-3d8c69e48489" />
