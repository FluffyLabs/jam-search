---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/10'
title: PVM traces log register state
site: github.com/davxy/jam-conformance
created_at: '2025-08-06T19:21:12.000Z'
last_modified: '2025-08-06T19:21:12.000Z'
---

# PVM traces log register state

## Issue by @danicuki

We are trying to debug the [PVM trace](https://github.com/davxy/jam-stuff/blob/main/pvm-traces/0.6.7/storage_light_000000003/pvm-trace.log), but it is a bit hard to find where our run differs from yours. Would it be possible to have a trace formatted similarly to what other JAM implemetors teams shared in the past? Something like this: 
```
    1: PC     5 JUMP                 g=9999999 reg=[4294901760 4278059008 0 0 0 0 0 4278124544 3 0 0 0 0]
    2: PC 57368 ADD_IMM_64           g=9999998 reg=[4294901760 4278058944 0 0 0 0 0 4278124544 3 0 0 0 0]
    3: PC 57371 STORE_IND_U64        g=9999997 reg=[4294901760 4278058944 0 0 0 0 0 4278124544 3 0 0 0 0]
    4: PC 57374 STORE_IND_U64        g=9999996 reg=[4294901760 4278058944 0 0 0 0 0 4278124544 3 0 0 0 0]
    5: PC 57377 STORE_IND_U64        g=9999995 reg=[4294901760 4278058944 0 0 0 0 0 4278124544 3 0 0 0 0]
    6: PC 57380 MOVE_REG             g=9999994 reg=[4294901760 4278058944 0 0 0 3 0 4278124544 3 0 0 0 0]
    7: PC 57382 MOVE_REG             g=9999993 reg=[4294901760 4278058944 0 0 0 3 4278124544 4278124544 3 0 0 0 0]
    8: PC 57384 LOAD_IMM_JUMP        g=9999992 reg=[1564 4278058944 0 0 0 3 4278124544 4278124544 3 0 0 0 0]
    9: PC 73524 ADD_IMM_64           g=9999991 reg=[1564 4278058664 0 0 0 3 4278124544 4278124544 3 0 0 0 0]
   10: PC 73528 STORE_IND_U64        g=9999990 reg=[1564 4278058664 0 0 0 3 4278124544 4278124544 3 0 0 0 0]
```
each executed instruction in one line with PC, program line, instruction code, gas and register values. 
It will help a lot a format like this.


## Comment by @davxy

I support your proposal. But for this you need to open an issue in the polkavm  repo, I'm not maintaining it.
