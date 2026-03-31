---
type: graypaper_section
title: 15 Guaranteeing
index: 97
---
Guaranteeing work-packages involves the creation and distribution of a corresponding *work-report* which requires certain conditions to be met. Along with the report, a signature demonstrating the validator's commitment to its correctness is needed. With two guarantor signatures, the work-report may be distributed to the forthcoming JAM chain block author in order to be used in the $\xtguarantees$, which leads to a reward for the guarantors.

We presume that in a public system, validators will be punished severely if they malfunction and commit to a report which does not faithfully represent the result of $\computereport$ applied on a work-package. Overall, the process is:

1.  Evaluation of the work-package's authorization, and cross-referencing against the authorization pool in the most recent JAM chain state.

2.  Creation and publication of a work-package report.

3.  Chunking of the work-package and each of its extrinsic and exported data, according to the erasure codec.

4.  Distributing the aforementioned chunks across the validator set.

5.  Providing the work-package, extrinsic and exported data to other validators on request is also helpful for optimal network performance.

For any work-package $p$ we are in receipt of, we may determine the work-report, if any, it corresponds to for the core $c$ that we are assigned to. When JAM chain state is needed, we always utilize the chain state of the most recent block.

For any guarantor of index $v$ assigned to core $c$ and a work-package $p$, we define the work-report $r$ simply as: $$r = \computereport(p, c)$$

Such guarantors may safely create and distribute the payload $\tup{s, v}$. The component $s$ may be created according to equation [eq:guarantorsig]; specifically it is a signature using the validator's registered Ed25519 key on a payload $l$: $$l = \blake{\encode{r}}$$

To maximize profit, the guarantor should require the work-digest meets all expectations which are in place during the guarantee extrinsic described in section 11.4. This includes contextual validity and inclusion of the authorization in the authorization pool. No doing so does not result in punishment, but will prevent the block author from including the package and so reduces rewards.

Advanced nodes may maximize the likelihood that their reports will be includable on-chain by attempting to predict the state of the chain at the time that the report will get to the block author. Naive nodes may simply use the current chain head when verifying the work-report. To minimize work done, nodes should make all such evaluations *prior* to evaluating the $\Psi_R$ function to calculate the report's work-results.

Once evaluated as a reasonable work-package to guarantee, guarantors should maximize the chance that their work is not wasted by attempting to form consensus over the core. To achieve this they should send the work-package to any other guarantors on the same core which they do not believe already know of it.

In order to minimize the work for block authors and thus maximize expected profits, guarantors should attempt to construct their core's next guarantee extrinsic from the work-report, core index and set of attestations including their own and as many others as possible.

In order to minimize the chance of any block authors disregarding the guarantor for anti-spam measures, guarantors should sign an average of no more than two work-reports per timeslot.
