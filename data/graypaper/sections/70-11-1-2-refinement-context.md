---
type: graypaper_section
title: 11.1.2 Refinement Context
index: 70
---
A *refinement context*, denoted by the set $\workcontext$, describes the context of the chain at the point that the report's corresponding work-package was evaluated. It identifies two historical blocks, the *anchor*, header hash $\wcNanchorhash$, timeslot $\wcNanchortime$, posterior state-root $\wcNanchorpoststate$ and accumulation output log super-peak $\wcNanchoraccoutlog$; and the *lookup-anchor*, header hash $\wcNlookupanchorhash$, timeslot $\wcNlookupanchortime$ and posterior state-root $\wcNlookupanchorpoststate$. Finally, it identifies the hash of any prerequisite work-packages $\wcNprerequisites$. Formally: $$
  \workcontext \equiv \tuple{\,\begin{alignedat}{5}
    \isa{\wcNanchorhash&}{\hash}\,,\;
    \isa{&\wcNanchortime&}{\timeslot}\,,\;
    \isa{&\wcNanchorpoststate&}{\hash}\,,\;
    \isa{&\wcNanchoraccoutlog&}{\hash}\,,\;\\
    \isa{\wcNlookupanchorhash&}{\hash}\,,\;
    \isa{&\wcNlookupanchortime&}{\timeslot}\,,\;
    \isa{&\wcNlookupanchorpoststate&}{\hash}\,,\;
    \isa{&\wcNprerequisites&}{\protoset{\hash}}
  \end{alignedat}}$$
