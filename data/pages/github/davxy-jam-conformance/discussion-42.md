---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/42'
title: '1756548916'
site: github.com/davxy/jam-conformance
created_at: '2025-08-30T17:01:15.000Z'
last_modified: '2025-08-30T17:01:15.000Z'
content_kind: discussion
---

# 1756548916

## Discussion by @bloppan

Hi @davxy , vinwolf passes this trace if I set **WE** (The basic size of erasure-coded pieces in octets) to 4 instead of 684 as is specified in the [GP](https://graypaper.fluffylabs.dev/#/38c4e62/449700449800?v=0.7.0)

The [chainspec parameters](https://github.com/davxy/jam-test-vectors?tab=readme-ov-file#chainspec-parameters)  don't show any difference between tiny and full mode of **WE** or maybe I'm overlooking something.

Is the fuzzer setting **WE** to 4 in tiny mode? 




## Comment by @davxy

**W_E** is derived from W_G and W_P.  

From the tiny specification, we defined:

- W_P = num_ec_pieces_per_segment  
  - Tiny: W_P = 1026  
  - Full: W_P = 6  

Given that **W_G** is a constant set to 4104, and using the relation:

W_G = W_P * W_E   

we derive W_E = W_G / W_P

- Tiny: W_E = 4  
- Full: W_E = 684  

