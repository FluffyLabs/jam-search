---
type: graypaper_section
title: 6.5 The Slot-Sealer Sequence
index: 49
---
The posterior slot-sealer sequence $\sealtickets'$ is one of three expressions depending on the circumstance of the block. If the block is not the first in an epoch, then it remains unchanged from the prior $\sealtickets$. If the block signals the next epoch (by epoch index) and the previous block's slot was within the closing period of the previous epoch, then it takes the value of the prior ticket accumulator $\ticketaccumulator$. Otherwise, it takes the value of the fallback key sequence. Formally: $$\begin{aligned}
  
  \sealtickets' &\equiv \begin{cases}
    Z(\ticketaccumulator) &\when e' = e + 1 \wedge m \geq \Cepochtailstart \wedge \len{\ticketaccumulator} = \Cepochlen\!\!\\
    \sealtickets &\when e' = e \\
    F(\entropy'_2, \activeset') \!\!\!&\otherwise
  \end{cases}\end{aligned}$$

Here, we use $Z$ as the outside-in sequencer function, defined as follows: $$Z\colon\abracegroup[\,]{
    \sequence[\Cepochlen]{\safroleticket} &\to \sequence[\Cepochlen]{\safroleticket}\\
    \mathbf{s} &\mapsto \sq{\mathbf{s}_0, \mathbf{s}_{\len{\mathbf{s}} - 1}, \mathbf{s}_1, \mathbf{s}_{\len{\mathbf{s}} - 2}, \dots}\\
  }$$

Finally, $F$ is the fallback key sequence function which selects an epoch's worth of validator Bandersnatch keys ($\sequence[\Cepochlen]{\bskey}$) from the validator key sequence $\mathbf{k}$ using the entropy collected on-chain $r$: $$
  F\colon \abracegroup[\ ]{
    \tuple{\hash,\,\sequence{\valkey}} &\to \sequence[\Cepochlen]{\bskey}\\
    \tup{r,\, \mathbf{k}} &\mapsto \sq{\build{
      \cyclic{\mathbf{k}\sub{\decode[4]{\blake{r \concat \encode[4]{i}}_{\dots 4}}}}_\vkNbs
    }{
      i \in \epochindex
    }}
  }\!\!\!$$
