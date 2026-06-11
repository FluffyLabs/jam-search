---
type: graypaper_section
title: G Bandersnatch VRF
index: 166
---
The Bandersnatch curve is defined by [@cryptoeprint:2021/1152].

The singly-contextualized Bandersnatch Schnorr-like signatures $\bssignature{k}{c}{m}$ are defined as a formulation under the *IETF* VRF template specified by [@hosseini2024bandersnatch] (as IETF VRF) and further detailed by [@rfc9381].

$$\begin{aligned}
  \bssignature{k \in \bskey}{c \in \blob}{m \in \blob} \subset \blob[96] &\equiv \set{\build{x}{x \in \blob[96], \text{verify}(k, c, m, x) = \top }}  \\
  \banderout{s \in \bssignature{k}{c}{m}} \in \hash &\equiv \text{output}(x \mid x \in \bssignature{k}{c}{m})\interval{}{32}\end{aligned}$$

The singly-contextualized Bandersnatch RingVRF proofs $\bsringproof{r}{c}{m}$ are a zk-SNARK-enabled analogue utilizing the Pedersen VRF, also defined by [@hosseini2024bandersnatch] and further detailed by [@cryptoeprint:2023/002].

$$\begin{aligned}
  \getringroot{\sequence{\bskey}} \in \ringroot &\equiv \text{commit}(\sequence{\bskey})  \\
  \bsringproof{r \in \ringroot}{c \in \blob}{m \in \blob} \subset \blob[784] &\equiv \set{\build{x}{x \in \blob[784], \text{verify}(r, c, m, x) = \top }}  \\
  \banderout{p \in \bsringproof{r}{c}{m}} \in \hash &\equiv \text{output}(x \mid x \in \bsringproof{r}{c}{m})\interval{}{32}\end{aligned}$$

Note that in the case a key $\bskey$ has no corresponding Bandersnatch point when constructing the ring, then the Bandersnatch *padding point* as stated by [@hosseini2024bandersnatch] should be substituted.
