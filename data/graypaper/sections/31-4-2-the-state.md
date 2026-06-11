---
type: graypaper_section
title: 4.2 The State
index: 31
---
Our state may be logically partitioned into several largely independent segments which can both help avoid visual clutter within our protocol description and provide formality over elements of computation which may be simultaneously calculated (i.e. parallelized). We therefore pronounce an equivalence between $\thestate$ (some complete state) and a tuple of partitioned segments of that state: $$\begin{aligned}

  \thestate &\equiv \tup{\authpool, \recent, \lastaccout, \safrole, \accounts, \entropy, \stagingset, \activeset, \previousset, \availassignments, \thetime, \authqueue, \privileges, \disputes, \activity, \ready, \accumulated}\end{aligned}$$

In summary, $\accounts$ is the portion of state dealing with *services*, analogous in JAM to the Yellow Paper's (smart contract) *accounts*, the only state of the *YP*'s Ethereum. The identities of services which hold some privileged status are tracked in $\privileges$.

Validators, who are the set of economic actors uniquely privileged to help build and maintain the JAM chain, are identified within $\activeset$, archived in $\previousset$ and enqueued from $\stagingset$. All other state concerning the determination of these keys is held within $\safrole$. Note this is a departure from the *YP* proof-of-work definitions which were mostly stateless, and this set was not enumerated but rather limited to those with sufficient compute power to find a partial hash-collision in the SHA- cryptographic hash function. An on-chain entropy pool is retained in $\entropy$.

Our state also tracks two aspects of each core: $\authpool$, the authorization requirement which work done on that core must satisfy at the time of being reported on-chain, together with the queue which fills this, $\authqueue$; and $\availassignments$, each of the cores' currently assigned *work-report guarantees*, the availability of whose *work-package* must yet be assured by a super-majority of validators.

Finally, details of the most recent blocks and timeslot index are tracked in $\recenthistory$ and $\thetime$ respectively, work-reports which are ready to be accumulated and work-packages which were recently accumulated are tracked in $\ready$ and $\accumulated$ respectively and, judgments are tracked in $\disputes$ and validator statistics are tracked in $\activity$.
