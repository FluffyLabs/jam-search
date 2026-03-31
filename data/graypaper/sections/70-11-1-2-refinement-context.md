---
type: graypaper_section
title: 11.1.2 Refinement Context
index: 70
---
A *refinement context*, denoted by the set $\workcontext$, describes the context of the chain at the point that the report's corresponding work-package was evaluated. It identifies two historical blocks, the *anchor*, header hash $\wcNanchorhash$ along with its associated posterior state-root $\wcNanchorpoststate$ and accumulation output log super-peak $\wcNanchoraccoutlog$; and the *lookup-anchor*, header hash $\wcNlookupanchorhash$ and of timeslot $\wcNlookupanchortime$. Finally, it identifies the hash of any prerequisite work-packages $\wcNprerequisites$. Formally: $$
  \workcontext \equiv \tuple{\,\begin{alignedat}{5}
    \isa{\wcNanchorhash&}{\hash}\,,\;
    \isa{&\wcNanchorpoststate&}{\hash}\,,\;
    \isa{&\wcNanchoraccoutlog&}{\hash}\,,\;\\
    \isa{\wcNlookupanchorhash&}{\hash}\,,\;
    \isa{&\wcNlookupanchortime&}{\timeslot}\,,\;
    \isa{&\wcNprerequisites&}{\protoset{\hash}}
  \end{alignedat}}$$
