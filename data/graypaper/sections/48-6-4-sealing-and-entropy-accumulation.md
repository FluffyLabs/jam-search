---
type: graypaper_section
title: 6.4 Sealing and Entropy Accumulation
index: 48
---
The header must contain a valid seal and valid VRF output. These are two signatures both using the current slot's seal key; the message data of the former is the header's serialization omitting the seal component $\H_\Nsealsig$, whereas the latter is used as a bias-resistant entropy source and thus its message must already have been fixed: we use the entropy stemming from the VRF of the seal signature. Formally: $$\begin{aligned}
  \nonumber \using i = \cyclic{\sealtickets'[\H_\Ntimeslot]}\colon \\
  
  \sealtickets' \in \sequence{\safroleticket} &\implies \abracegroup[\,]{
      &i_\stNid = \banderout{\H_\Nsealsig}\,,\\
      &\H_\Nsealsig \in \bssignature{\H_\Nauthorbskey}{\Xticket \concat \entropy'_3 \append i_\stNentryindex}{\encodeunsignedheader{\H}}\,,\\
      &\isticketed = 1
  }\\
  
  \sealtickets' \in \sequence{\bskey} &\implies \abracegroup[\,]{
      &i = \H_\Nauthorbskey\,,\\
      &\H_\Nsealsig \in \bssignature{\H_\Nauthorbskey}{\Xfallback \concat \entropy'_3}{\encodeunsignedheader{\H}}\,,\\
      &\isticketed = 0
  }\\
  
  \H_\Nvrfsig &\in \bssignature{\H_\Nauthorbskey}{\Xentropy \concat \banderout{\H_\Nsealsig}}{\sq{}} \\
  \Xentropy &= \token{\$jam\_entropy}\\
  \Xfallback &= \token{\$jam\_fallback\_seal}\\
  \Xticket &= \token{\$jam\_ticket\_seal}
  \end{aligned}$$

Sealing using the ticket is of greater security, and we utilize this knowledge when determining a candidate block on which to extend the chain, detailed in section 19. We thus note that the block was sealed under the regular security with the boolean marker $\isticketed$. We define this only for the purpose of ease of later specification.

In addition to the entropy accumulator $\entropyaccumulator$, we retain three additional historical values of the accumulator at the point of each of the three most recently ended epochs, $\entropy_1$, $\entropy_2$ and $\entropy_3$. The second-oldest of these $\entropy_2$ is utilized to help ensure future entropy is unbiased (see equation [eq:ticketsextrinsic]) and seed the fallback seal-key generation function with randomness (see equation [eq:slotkeysequence]). The oldest is used to regenerate this randomness when verifying the seal above (see equations [eq:ticketconditionfalse] and [eq:ticketconditiontrue]). $$\begin{aligned}
  
  \entropy &\in \sequence[4]{\hash}\end{aligned}$$

$\entropyaccumulator$ defines the state of the randomness accumulator to which the provably random output of the VRF, the signature over some unbiasable input, is combined each block. $\entropy_1$, $\entropy_2$ and $\entropy_3$ meanwhile retain the state of this accumulator at the end of the three most recently ended epochs in order. $$\begin{aligned}
  \entropyaccumulator' &\equiv \blake{\entropyaccumulator \concat \banderout{\H_\Nvrfsig}}\end{aligned}$$

On an epoch transition (identified as the condition $e' > e$), we therefore rotate the accumulator value into the history $\entropy_1$, $\entropy_2$ and $\entropy_3$: $$\begin{aligned}
  \tup{\entropy'_1, \entropy'_2, \entropy'_3} &\equiv \begin{cases}
    \tup{\entropy_0, \entropy_1, \entropy_2} &\when e' > e \\
    \tup{\entropy_1, \entropy_2, \entropy_3} &\otherwise
  \end{cases}\end{aligned}$$
