---
type: graypaper_section
title: '14.2.1 Segments, Imports and Exports'
index: 91
---
The ability to communicate large amounts of data from one work-package to some subsequent work-package is a key feature of the JAM availability system. An export segment, defined as the set $\segment$, is an octet sequence of fixed length $\Csegmentsize = 4104$. It is the smallest datum which may individually be imported from---or exported to---the long-term D$^3$L during the Refine function of a work-package. Being an exact multiple of the erasure-coding piece size ensures that the data segments of work-package can be efficiently placed in the D$^3$L system. $$
  \segment \equiv \blob[\Csegmentsize]$$

Exported segments are data which are *generated* through the execution of the Refine logic and thus are a side effect of transforming the work-package into a work-report. Since their data is deterministic based on the execution of the Refine logic, we do not require any particular commitment to them in the work-package beyond knowing how many are associated with each Refine invocation in order that we can supply an exact index.

On the other hand, imported segments are segments which were exported by previous work-packages. In order for them to be easily fetched and verified they are referenced not by hash but rather the root of a Merkle tree which includes any other segments introduced at the time, together with an index into this sequence. This allows for justifications of correctness to be generated, stored, included alongside the fetched data and verified. This is described in depth in the next section.
