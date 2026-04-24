---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/43'
title: '1756548741'
site: github.com/davxy/jam-conformance
created_at: '2025-08-31T13:38:38.000Z'
last_modified: '2025-08-31T13:38:38.000Z'
content_kind: discussion
---

# 1756548741

## Discussion by @jaymansfield

There might be an issue with the expected result of 1756548741.

The test itself does an assign with a core # of 20346.

If I perform the action in the GP and set reg7=CORE and continue I fail the vector, but I just noticed if I panic instead it passes. 

<img width="373" height="24" alt="Screenshot 2025-08-31 at 9 34 54 AM" src="https://github.com/user-attachments/assets/bf01402b-f65f-4c7a-83e0-ed81f4e38c17" />

Is this an issue with the fuzzer or polkajam?



## Comment by @bloppan

Vinwolf causes a panic due to a page fault:

`Panic: The RAM cannot be read from the address: 114366376 num_bytes: 2560`


## Comment by @jaymansfield

> Vinwolf causes a panic due to a page fault:
> 
> `Panic: The RAM cannot be read from the address: 114366376 num_bytes: 2560`

Thanks. If I re-order by checks to check the memory first and then the core # I get the same result. Previously I was checking core first since its a lighter check.


## Comment by @jaymansfield

Resolved. Thanks @bloppan.
