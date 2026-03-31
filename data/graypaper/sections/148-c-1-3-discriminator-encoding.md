---
type: graypaper_section
title: C.1.3 Discriminator Encoding
index: 148
---
When we have sets of heterogeneous items such as a union of different kinds of tuples or sequences of different length, we require a discriminator to determine the nature of the encoded item for successful deserialization. Discriminators are encoded as a natural and are encoded immediately prior to the item.

We generally use a *length discriminator* when serializing sequence terms which have variable length (e.g. general blobs $\blob$ or unbound numeric sequences $\sequence{\N}$) (though this is omitted in the case of fixed-length terms such as hashes $\hash$).[^19] In this case, we simply prefix the term its length prior to encoding. Thus, for some term $y \in \tup{x \in \blob, \dots}$, we would generally define its serialized form to be $\encode{\len{x}}\concat\encode{x}\concat\dots$. To avoid repetition of the term in such cases, we define the notation $\var{x}$ to mean that the term of value $x$ is variable in size and requires a length discriminator. Formally: $$\var{x} \equiv \tup{\len{x}, x}\text{ thus }\encode{\var{x}} \equiv \encode{\len{x}}\concat\encode{x}$$

We also define a convenient discriminator operator $\maybe{x}$ specifically for terms defined by some serializable set in union with $\none$ (generally denoted for some set $S$ as $\optional{S}$): $$\begin{aligned}
  \maybe{x} \equiv \begin{cases}
    0 &\when x = \none \\
    \tup{1, x} &\otherwise
  \end{cases}\end{aligned}$$
