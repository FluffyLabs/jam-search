---
type: graypaper_section
title: D.2 Merklization
index: 156
---
With $T$ defined, we now define the rest of $\fnmerklizestate$ which primarily involves transforming the serialized mapping into a cryptographic commitment. We define this commitment as the root of the binary Patricia Merkle Trie with a format optimized for modern compute hardware, primarily by optimizing sizes to fit succinctly into typical memory layouts and reducing the need for unpredictable branching.
