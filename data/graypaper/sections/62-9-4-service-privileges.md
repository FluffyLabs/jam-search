---
type: graypaper_section
title: 9.4 Service Privileges
index: 62
---
JAM includes the ability to bestow privileges on a number of services. The portion of state in which this is held is denoted $\privileges$ and includes five kinds of privilege. The first, $\manager$, is the index of the *manager* service which is the service able to effect an alteration of $\privileges$ from block to block as well as bestow services with storage deposit credits. The next, $\delegator$, is able to set $\stagingset$. Then $\registrar$ alone is able to create new service accounts with indices in the protected range. The following, $\assigners$, are the service indices capable of altering the authorizer queue $\authqueue$, one for each core. The delegator, registrar and assigner privileges are *owned*: the holder of each may pass it on to another service through the `bless` host-call, though an alteration made by the manager within the same block takes precedence (see equation [eq:accpar]).

Finally, $\alwaysaccers$ is a small dictionary containing the indices of services which automatically accumulate in each block together with a basic amount of gas with which each accumulates. Formally: $$\begin{aligned}
  
  \privilegestype &\equiv \tuple{\begin{aligned}
    \isa{\prNmanager&}{\serviceid}\,,\;
    \isa{\prNdelegator}{\serviceid}\,,\;
    \isa{\prNregistrar}{\serviceid}\,,\\
    \isa{\prNassigners&}{\sequence[\Ccorecount]{\serviceid}}\,,\;
    \isa{\prNalwaysaccers}{\dictionary{\serviceid}{\gas}}
  \end{aligned}} \\
  
  \privileges &\in \privilegestype\end{aligned}$$
