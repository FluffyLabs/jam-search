---
type: graypaper_section
title: 3.7.4 Octets and Blobs
index: 24
---
$\blob$ denotes the set of octet strings ("blobs") of arbitrary length. As might be expected, $\blob[x]$ denotes the set of such sequences of length $x$. $\blob[\$]$ denotes the subset of $\blob$ which are ASCII-encoded strings. Note that while an octet has an implicit and obvious bijective relationship with natural numbers less than 256, and we may implicitly coerce between octet form and natural number form, we do not treat them as exactly equivalent entities. In particular for the purpose of serialization, an octet is always serialized to itself, whereas a natural number may be serialized as a sequence of potentially several octets, depending on its magnitude and the encoding variant.
