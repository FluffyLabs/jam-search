---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/79'
title: 1757861618 | heap or region check?
site: github.com/davxy/jam-conformance
created_at: '2025-09-14T20:11:00.000Z'
last_modified: '2025-09-14T20:11:00.000Z'
content_kind: discussion
---

# 1757861618 | heap or region check?

## Discussion by @vekexasia

Hello I was inspecting this trace and I think i know what's going on (it was also kind of my question in matrix gp channel). It's eithe about paged pvm memory vs regions or how heap is allocated.

Anyways the `standard program initialization` allocates the following regions:

```
ACL from 10000|65536 to 14000|81920 as read  /// ro 
ACL from 30000|196608 to 33000|208896 as write /// rw
ACL from fefde000|4278050816 to fefe0000|4278059008 as write
ACL from feff0000|4278124544 to feff1000|4278128640 as read
```
in my implementation i allocate the heap just after rw

```
ACL from 33000|208896 to 34000|212992 as write // heap
```

I've identified by inspecting the expected statistics that the fuzzer expects the Bless to fail 

In my implementation these are the registers just before calling the bless: 
```
[626 4278056632 1073948832 196616 3 207104 0 4294967296 207104 0 207264 140 207104]
```

To ease readers eye: 
```
[
0: 626
1: 4278056632 
2: 1073948832 
3: 196616 
4:3
5: 207104 
6: 0
7:4294967296 
8:207104 
9: 0 
10: 207264 
11: 140 
12: 207104
]
```

now without going into too much details I think the fuzzer target  panics when checking this
<img width="920" height="105" alt="image" src="https://github.com/user-attachments/assets/e76e7e0a-f3b0-47ee-bf82-962d4b5e24a6" />

This is because `o=207264`, `n=140` so the Readability check is performed on `[207264:208944]`

in my implementation, which I believe is correct, this is a valid readable region even if it is spanning between what I believe others are calling rw and heap. 

There is another possibility. The heap "location" is wrong. The GP states this just after sbrk:

```
Note, the term h above refers to the beginning of the heap, the second major section of memory as defined in equation
A.42 as 2ZZ + Z(∣o∣). If sbrk instruction is invoked on a pvm instance which does not have such a memory layout, then
```

I always interpreted this as "After the rw region" So I made it contiguous. 





## Comment by @dakk

I'm also 'not passing' this trace, and if I try to force the memory check to fail I'm able to pass the test. 

I also checked my registers and they are equal to yours; maybe a trace or at least the registers of some passing the trace could help use to check if we have wrong registers, or if it is a wrong memory access control.


## Comment by @vekexasia

I found my problem. not sure if it's the same for you dakk but I was already allocating a Page for the heap at program init time.

Closing this


## Comment by @dakk

If I didn't allocate that page it works, but A.42 says:

<img width="656" height="30" alt="image" src="https://github.com/user-attachments/assets/0182e8f2-df4e-44a8-8152-11cecdd21efb" />

So my understanding is that we need to allocate some memory
