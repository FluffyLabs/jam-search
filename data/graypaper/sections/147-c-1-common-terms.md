---
type: graypaper_section
title: C.1 Common Terms
index: 147
---
Our codec function $\mathcal{E}$ is used to serialize some term into a sequence of octets. We define the deserialization function $\fndecode$ as the inverse of $\mathcal{E}$ and able to decode some sequence into the original value. The codec is designed such that exactly one value is encoded into any given sequence of octets, and in cases where this is not desirable then we use special codec functions.
