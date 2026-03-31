---
type: graypaper_section
title: 6.1 Timekeeping
index: 45
---
Here, $\thetime$ defines the most recent block's slot index, which we transition to the slot index as defined in the block's header: $$
  \thetime \in \timeslot \ ,\quad
  \thetime' \equiv \H_\Ntimeslot$$

We track the slot index in state as $\thetime$ in order that we are able to easily both identify a new epoch and determine the slot at which the prior block was authored. We denote $e$ as the prior's epoch index and $m$ as the prior's slot phase index within that epoch and $e'$ and $m'$ are the corresponding values for the present block: $$\begin{aligned}
  \mathrm{let}\quad e \remainder m = \frac{\thetime}{\Cepochlen} \,,\quad
  e' \remainder m' = \frac{\thetime'}{\Cepochlen}\end{aligned}$$
