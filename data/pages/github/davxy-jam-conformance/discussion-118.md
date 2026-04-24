---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/118'
title: min items for `extrinsic.guarantees.report.results`
site: github.com/davxy/jam-conformance
created_at: '2025-11-18T01:21:13.000Z'
last_modified: '2025-11-18T01:21:13.000Z'
content_kind: discussion
---

# min items for `extrinsic.guarantees.report.results`

## Discussion by @qiweiii


<img width="411" height="61" alt="image" src="https://github.com/user-attachments/assets/6224fd17-2954-471e-9f6a-8a489d915ecb" />

there is a minimum of 1 item for **d** (work digest), but there is 0 in traces:

1763371098/00000006
1763371531/00000006
1763371531/00000008
1763371531/00000011
1763371531/00000014
1763371531/00000023
1763371531/00000028
1763371531/00000030
1763371531/00000032
1763371531/00000038
1763372314/00000094

since boka validates this, we fail to decode these blocks



## Comment by @davxy

Indeed we fail to import the traces you mentioned

For your target, the issue is that when you receive the following steps you unexpectedly close the connection:
- 1763371098/00000006
- 1763371531/00000006
- 1763372314/00000094

If you can't decode the block, you need to return an `Error` message


## Comment by @qiweiii

oh I see, I will change to return an error message
