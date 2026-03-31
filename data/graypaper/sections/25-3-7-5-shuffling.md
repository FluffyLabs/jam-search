---
type: graypaper_section
title: 3.7.5 Shuffling
index: 25
---
We define the sequence-shuffle function $\fnfyshuffle$, originally introduced by [@fisheryates1938statistical], with an efficient in-place algorithm described by [@wikipedia2024fisheryates]. This accepts a sequence and some entropy and returns a sequence of the same length with the same elements but in an order determined by the entropy. The entropy may be provided as either an indefinite sequence of naturals or a hash. For a full definition see appendix 29.
