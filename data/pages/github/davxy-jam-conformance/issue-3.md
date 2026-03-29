---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/3'
title: '[M1 FUZZ] Unclarity around the `type` of the Unix socket'
site: github.com/davxy/jam-conformance
created_at: '2025-07-05T19:26:14.000Z'
last_modified: '2025-07-05T19:26:14.000Z'
---

# [M1 FUZZ] Unclarity around the `type` of the Unix socket

## Issue by @ggwpez

The spec mentions the use of "named Unix socket". There seem to be multiple operation modes of such socket. Wikipedia mentions `SOCK_SEQPACKET`, `SOCK_DGRAM` and `SOCK_STREAM` [here](https://en.wikipedia.org/wiki/Unix_domain_socket).  

I only tried out `SOCK_DGRAM` (UDP analogous) and it seems to have strict packet size (2 KiB) and buffer limits. This necessitates some manual chunking and re-sending logic in case that the message is too large or buffer full.

What was the intention of the spec here? I did not try out the other variants how much easier to use they are.


## Comment by @davxy

Hey Oliver. We're using SOCK_STREAM


## Comment by @ggwpez

Good, I think that is the easiest choice. Thanks for the quick reply! 
