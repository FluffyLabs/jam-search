---
type: graypaper_section
title: 17.3 Selection of Reports
index: 102
---
Each validator shall perform auditing duties on each valid block received. Since we are entering off-chain logic, and we cannot assume consensus, we henceforth consider ourselves a specific validator of index $v$ and assume ourselves focused on some recent block $\block$ with other terms corresponding to the state-transition implied by that block, so $\availassignments$ is said block's prior availability assignments, $\activeset$ is its prior validator set, $\header$ is its header &c. Practically, all considerations must be replicated for all blocks and multiple blocks' considerations may be underway simultaneously.

We define the sequence of work-reports which we may be required to audit as $\mathbf{q}$, a sequence of length equal to the number of *active* cores, which functions as a mapping of core index to a work-report which has just become available, or $\none$ if no report became available on the core. Formally: $$\begin{aligned}

  \mathbf{q}&\in \sequence[\nicefrac{\len{\activeset}}{3}]{\optional{\workreport}} \\
  \mathbf{q}&\equiv \sq{\build{
    \begin{rcases}
      (\availassignments\subb{\cX}_\aaNguarantee)_\gNworkreport &\when (\availassignments\subb{\cX}_\aaNguarantee)_\gNworkreport \in \justbecameavailable \\
      \none &\otherwise
    \end{rcases}
  }{
    \cX \orderedin \Nmax{\nicefrac{\len{\activeset}}{3}}
  }}\end{aligned}$$

We define our initial audit tranche in terms of a verifiable random quantity $s\sub{0}$ created specifically for it: $$\begin{aligned}
  
  s\sub{0} &\in \bssignature{
    \activeset\subb{v}_\vkNbs
  }{
    \Xaudit \concat \banderout{\H_\Nvrfsig}
  }{
    \sq{}
  } \\
  \Xaudit &= \token{\$jam\_audit}\end{aligned}$$

We may then define $\mathbf{a}\sub{0}$ as the non-empty items to audit through a verifiably random selection of ten cores: $$\mathbf{a}\sub{0} = \set{\build{\wrX}{\wrX \in \fyshuffle{\mathbf{q}, \banderout{s\sub{0}}}\subrange{}{10}, \wrX \ne \none}}$$

Every $\Ctrancheseconds = 8$ seconds following a new time slot, a new tranche begins, and we may determine that additional cores warrant an audit from us. Such items are defined as $\mathbf{a}\sub{n}$ where $n$ is the current tranche. Formally: $$\using n = \ffrac{\wallclock - \Cslotseconds\cdot\H_\Ntimeslot}{\Ctrancheseconds}$$

New tranches may contain items from $\mathbf{q}$ stemming from one of two reasons: either a negative judgment has been received; or the number of judgments from the previous tranche is less than the number of announcements from said tranche. In the first case, the validator is always required to issue a judgment on the work-report. In the second case, a new special-purpose VRF must be constructed to determine if an audit and judgment is warranted from us.

In all cases, we publish a signed statement of which of the cores we believe we are required to audit (an *announcement*) together with evidence of the VRF signature to select them and the other validators' announcements from the previous tranche unmatched with a judgment in order that all other validators are capable of verifying the announcement. *Publication of an announcement should be taken as a contract to complete the audit regardless of any future information.*

Formally, for each tranche $n$ we ensure the announcement statement is published and distributed to all other validators along with our validator index $v$, evidence $s\sub{n}$ and all signed data. Validator's announcement statements must be in the set $S$: $$\begin{aligned}
  
  S &\equiv \edsignature{\activeset\subb{v}_\vkNed}{\Xannounce \append n \concat \mathbf{x}\sub{n} \concat \blake{\H}} \\
  \where \mathbf{x}\sub{n} &= \encode{\set{\build{\encode[2]{\wrX_\wrNcore} \concat \blake{\wrX}}{\wrX \in \mathbf{a}\sub{n}}}}\\
  \Xannounce &= \token{\$jam\_announce}\end{aligned}$$

We define $A\sub{n}$ as our perception of which validators are required to audit each of the work-reports at tranche $n$. This comes from each other validators' announcements (defined above). It cannot be correctly evaluated until $n$ is current. We have absolute knowledge about our own audit requirements. $$\begin{aligned}
  A\sub{n}: \workreport &\to \protoset{\Nmax{\len{\activeset}}} \\
%  \forall \tup{\cX, \wrX} &\in \localNtranche\sub{0} : v \in q\sub{0}(\wrX)
  % TODO: #445 ^^^ Fix this.\end{aligned}$$

We further define $J_\top$ and $J_\bot$ to be the validator indices who we know to have made respectively, positive and negative, judgments mapped from each work-report. We don't care from which tranche a judgment is made. $$\begin{aligned}
  J_\bool: \workreport \to \protoset{\Nmax{\len{\activeset}}}\end{aligned}$$

We are able to define $\mathbf{a}\sub{n}$ for tranches beyond the first on the basis of the number of validators who we know are required to conduct an audit yet from whom we have not yet seen a judgment. It is possible that the late arrival of information alters $\mathbf{a}\sub{n}$ and nodes should reevaluate and act accordingly should this happen.

We can thus define $\mathbf{a}\sub{n}$ beyond the initial tranche through a new VRF which acts upon the set of *no-show* validators. $$\begin{aligned}
  \nonumber\forall n > 0:&\\
  
  \ s\sub{n}(\wrX) &\in \bssignature{\activeset\subb{v}_\vkNbs}{\Xaudit \concat \banderout{\H_\Nvrfsig}\concat\blake{\wrX}\append n}{\sq{}} \\
  \ a_n(\wrX) &\equiv \textstyle\frac{\len{\activeset}}{256\Cauditbiasfactor}\banderout{s\sub{n}(\wrX)}\sub{0} < \len{A_{n - 1}(\wrX) \setminus J_\top(\wrX)} \\
  \ \mathbf{a}\sub{n} &\equiv \set{\build{\wrX}{\wrX \in \mathbf{q}, \wrX \ne \none, a_n(\wrX)}}\end{aligned}$$

We define our bias factor $\Cauditbiasfactor = 2$, which is the expected number of validators which will be required to issue a judgment for a work-report given a single no-show in the tranche before. Modeling by [@cryptoeprint:2024/961] shows that this is optimal.

Later audits must be announced in a similar fashion to the first. If audit requirements lessen on the receipt of new information (i.e. a positive judgment being returned for a previous *no-show*), then any audits already announced are completed and judgments published. If audit requirements raise on the receipt of new information (i.e. an additional announcement being found without an accompanying judgment), then we announce the additional audit(s) we will undertake.

As $n$ increases with the passage of time $\mathbf{a}\sub{n}$ becomes known and defines our auditing responsibilities. We must attempt to reconstruct all work-package bundles corresponding to each work-report we must audit. This may be done through requesting erasure-coded chunks from one-third of the validators, verified through the erasure coding's Merkle root, and reconstructing the bundles as per the recovery function $\fnecrecover{\len{\activeset}}{}$ defined in section $\ref{sec:erasurecoding}$.

Thus, for any such work-report $\wrX$ we are assured we will be able to reconstruct some candidate work-package bundle $C(\wrX) \in \blob$. We decode this candidate bundle into a work-package and its associated extrinsic data, imported segments, and imported segment proofs. These are verified as described in section 17.2. We then attempt to reproduce the report on the core to give $e\sub{n}$, a mapping from reports to evaluations: $$\begin{aligned}
    &\forall \wrX \in \mathbf{a}\sub{n}: \\
    &e\sub{n}(\wrX) \Leftrightarrow \begin{cases}
      M(\wrX, \wpX) &\when \exists \wpX \in \workpackage: \makebundle(\wpX, \wrX_\wrNsrlookup) = C(\wrX) \\
      \bot &\otherwise
    \end{cases} \\
    &\where M(\wrX, \wpX) \equiv \wrX = \computereport(\wpX, \wrX_\wrNcore, \wrX_\wrNsrlookup, (\wrX_\wrNavspec)_\asNerasureshards)
  \end{aligned}$$

Here, $\makebundle$ is the bundle assembly function as defined in equation [eq:makebundle] and $\computereport$ is the work-report computation function as defined in equation [eq:computereport]. Note that a failure to decode or verify the bundle implies an invalid work-report.

It may be possible to bypass the fetching of erasure-coded chunks and reconstruction of the bundle from them by asking a cooperative third party (e.g. an original guarantor) directly for the full bundle data. If this data cannot be decoded or verified however, we must fall back to reconstruction from erasure-coded chunks.

From the mapping $e\sub{n}$ the validator issues a set of judgments $\mathbf{j}\sub{n}$: $$\begin{aligned}
  
  \mathbf{j}\sub{n} &= \set{\build{
    \edsigndata{
      \activeset\subb{v}\sub{\vkNed}
    }{
      \Xvalidif{e\sub{n}(\wrX)} \concat \blake{\wrX}
    }
  }{
    \wrX \in \mathbf{a}\sub{n}
  }}\end{aligned}$$

All judgments $\mathbf{j}_*$ should be published to other validators in order that they build their view of $J$ and in the case of a negative judgment arising, can form an extrinsic for $\xtdisputes$.

We consider a work-report as audited under two circumstances. Either, when it has no negative judgments and there exists some tranche in which we see a positive judgment from all validators who we believe are required to audit it; or when we see positive judgments for it from greater than two-thirds of the validator set. $$\begin{aligned}
  U(\wrX) &\Leftrightarrow \bigvee\,\abracegroup[\,]{
    &J_\bot(\wrX) = \emptyset \wedge \exists n : A\sub{n}(\wrX) \subseteq J_\top(\wrX) \\
    &\len{J_\top(\wrX)} > \twothirds\len{\activeset}
  }\end{aligned}$$

Our block $\block$ may be considered audited, a condition denoted $\isaudited$, when all the work-reports which were made available are considered audited. Formally: $$\begin{aligned}
  \isaudited &\Leftrightarrow \forall \wrX \in \justbecameavailable : U(\wrX)\end{aligned}$$

For any block we must judge it to be audited (i.e. $\isaudited = \top$) before we vote for the block to be finalized in GRANDPA. See section [sec:grandpa] for more information here.

Furthermore, we pointedly disregard chains which include the accumulation of a report which we know at least $\onethird$ of validators judge as being invalid. Any chains including such a block are not eligible for authoring on. The *best block*, i.e. that on which we build new blocks, is defined as the chain with the most regular Safrole blocks which does *not* contain any such disregarded block. Implementation-wise, this may require reversion to an earlier head or alternative fork.

As a block author, if we have observed a sufficient number of judgments for a work-report, and at least one negative judgment, we may construct a *verdict* for the work-report and include it in the disputes extrinsic. If the verdict establishes that the work-report is not valid (i.e. fewer than two-thirds-plus-one of judgments confirm validity) then, as per the preceding paragraph, it should be introduced on a chain where the report has not yet been accumulated. The verdict will cause the corresponding availability assignment to be cleared from $\availassignments$, preventing accumulation of the invalid work-report. Refer to section 10 for more details on this.
