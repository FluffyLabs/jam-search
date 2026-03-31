---
type: graypaper_section
title: C.1.2 Sequence Encoding
index: 147
---
We define the sequence serialization function $\encode{\sequence{T}}$ for any $T$ which is itself a subset of the domain of $\fnencode$. We simply concatenate the serializations of each element in the sequence in turn: $$\encode{[\mathbf{i}_0, \mathbf{i}_1, ...]} \equiv \encode{\mathbf{i}_0} \concat \encode{\mathbf{i}_1} \concat \dots$$

Thus, conveniently, fixed length octet sequences (e.g. hashes $\hash$ and its variants) have an identity serialization.
