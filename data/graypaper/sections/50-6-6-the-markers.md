---
type: graypaper_section
title: 6.6 The Markers
index: 50
---
The epoch and winning-tickets markers are information placed in the header in order to minimize data transfer necessary to determine the validator keys associated with any given epoch. They are particularly useful to nodes which do not synchronize the entire state for any given block since they facilitate the secure tracking of changes to the validator key sets using only the chain of headers.

As mentioned earlier, the header's epoch marker $\H_\Nepochmark$ is either empty or, if the block is the first in a new epoch, then a tuple of the next and current epoch randomness, along with a sequence of tuples containing both Bandersnatch keys and Ed25519 keys for each validator defining the validator keys beginning in the next epoch. Formally: $$\begin{aligned}
  
  \H_\Nepochmark &\equiv \begin{cases}
    \tup{ \entropyaccumulator, \entropy_1, \sq{\build{
      \tup{k_\vkNbs, k_\vkNed}
    }{
      k \orderedin \pendingset'
    }} } \qquad\qquad &\when e' > e \\
    \none & \otherwise
  \end{cases}\end{aligned}$$

The winning-tickets marker $\H_\Nwinnersmark$ is either empty or, if the block is the first after the end of the submission period for tickets and if the ticket accumulator is saturated, then the final sequence of ticket identifiers. Formally: $$\begin{aligned}
  
  \H_\Nwinnersmark &\equiv \begin{cases}
    Z(\ticketaccumulator) &\when e' = e \wedge m < \Cepochtailstart \le m' \wedge \len{\ticketaccumulator} = \Cepochlen \\
    \none & \otherwise
  \end{cases}\end{aligned}$$
