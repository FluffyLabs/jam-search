---
type: graypaper_section
title: 9.4 Service Privileges
index: 62
---
JAM includes the ability to bestow privileges on a number of services. The portion of state in which this is held is denoted $\privileges$ and includes five kinds of privilege. The first, $\manager$, is the index of the *manager* service which is the service able to effect an alteration of $\privileges$ from block to block as well as bestow services with storage deposit credits. The next, $\delegator$, is able to set $\stagingset$. Then $\registrar$ alone is able to create new service accounts with indices in the protected range. The following, $\assigners$, are the service indices capable of altering the authorizer queue $\authqueue$, one for each core.

Finally, $\alwaysaccers$ is a small dictionary containing the indices of services which automatically accumulate in each block together with a basic amount of gas with which each accumulates. Formally: $$\begin{aligned}
  
  \privileges &\equiv \tuple{
    \manager,
    \delegator,
    \registrar,
    \assigners,
    \alwaysaccers
  }\\
  \manager &\in \serviceid \ ,\qquad
  \delegator \in \serviceid \ ,\qquad
  \registrar \in \serviceid \\
  \assigners &\in \sequence[\Ccorecount]{\serviceid} \ ,\qquad
  \alwaysaccers \in \dictionary{\serviceid}{\gas}\end{aligned}$$
