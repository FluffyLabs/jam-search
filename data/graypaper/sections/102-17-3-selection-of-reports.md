---
type: graypaper_section
title: 17.3 Selection of Reports
index: 102
---
Each validator shall perform auditing duties on each valid block received. Since we are entering off-chain logic, and we cannot assume consensus, we henceforth consider ourselves a specific validator of index $v$ and assume ourselves focused on some recent block $\block$ with other terms corresponding to the state-transition implied by that block, so $\reports$ is said block's prior core-allocation, $\activeset$ is its prior validator set, $\header$ is its header &c. Practically, all considerations must be replicated for all blocks and multiple blocks' considerations may be underway simultaneously.

We define the sequence of work-reports which we may be required to audit as $\mathbf{q}$, a sequence of length equal to the number of cores, which functions as a mapping of core index to a work-report pending which has just become available, or $\none$ if no report became available on the core. Formally: $$\begin{aligned}

  \mathbf{q}&\in \sequence[\Ccorecount]{\optional{\workreport}} \\
  \mathbf{q}&\equiv \sq{\build{
    \begin{rcases}
      \reports\subb{\cX}_\rsNworkreport &\when \reports\subb{\cX}_\rsNworkreport \in \justbecameavailable \\
      \none &\otherwise
    \end{rcases}
  }{
    \cX \orderedin \coreindex
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

We may then define $\mathbf{a}\sub{0}$ as the non-empty items to audit through a verifiably random selection of ten cores: $$\begin{aligned}
  \mathbf{a}\sub{0} &= \set{\build{\wrcX}{\wrcX \in \mathbf{p}\subrange{}{10}, \wrX \ne \none}} \\
  \where \mathbf{p} &= \fyshuffle{\sq{\build{\tup{\cX, \mathbf{q}\sub{\cX}}}{\cX \orderedin \coreindex}}, \banderout{s\sub{0}}}\end{aligned}$$

Every $\Ctrancheseconds = 8$ seconds following a new time slot, a new tranche begins, and we may determine that additional cores warrant an audit from us. Such items are defined as $\mathbf{a}\sub{n}$ where $n$ is the current tranche. Formally: $$\using n = \ffrac{\wallclock - \Cslotseconds\cdot\H_\Ntimeslot}{\Ctrancheseconds}$$

New tranches may contain items from $\mathbf{q}$ stemming from one of two reasons: either a negative judgment has been received; or the number of judgments from the previous tranche is less than the number of announcements from said tranche. In the first case, the validator is always required to issue a judgment on the work-report. In the second case, a new special-purpose VRF must be constructed to determine if an audit and judgment is warranted from us.

In all cases, we publish a signed statement of which of the cores we believe we are required to audit (an *announcement*) together with evidence of the VRF signature to select them and the other validators' announcements from the previous tranche unmatched with a judgment in order that all other validators are capable of verifying the announcement. *Publication of an announcement should be taken as a contract to complete the audit regardless of any future information.*

Formally, for each tranche $n$ we ensure the announcement statement is published and distributed to all other validators along with our validator index $v$, evidence $s\sub{n}$ and all signed data. Validator's announcement statements must be in the set $S$: $$\begin{aligned}
  
  S &\equiv \edsignature{\activeset\subb{v}_\vkNed}{\Xannounce \append n \concat \mathbf{x}\sub{n} \concat \blake{\H}} \\
  \where \mathbf{x}\sub{n} &= \encode{\set{\build{\encode[2]{\cX} \concat \blake{\wrX}}{\wrcX \in \mathbf{a}\sub{n}}}}\\
  \Xannounce &= \token{\$jam\_announce}\end{aligned}$$

We define $A\sub{n}$ as our perception of which validator is required to audit each of the work-reports (identified by their associated core) at tranche $n$. This comes from each other validators' announcements (defined above). It cannot be correctly evaluated until $n$ is current. We have absolute knowledge about our own audit requirements. $$\begin{aligned}
  A\sub{n}: \workreport &\to \protoset{\valindex} \\
%  \forall \tup{\cX, \wrX} &\in \localNtranche\sub{0} : v \in q\sub{0}(\wrX)
  % TODO: #445 ^^^ Fix this.\end{aligned}$$

We further define $J_\top$ and $J_\bot$ to be the validator indices who we know to have made respectively, positive and negative, judgments mapped from each work-report's core. We don't care from which tranche a judgment is made. $$\begin{aligned}
  J_\bool: \workreport \to \protoset{\valindex}\end{aligned}$$

We are able to define $\mathbf{a}\sub{n}$ for tranches beyond the first on the basis of the number of validators who we know are required to conduct an audit yet from whom we have not yet seen a judgment. It is possible that the late arrival of information alters $\mathbf{a}\sub{n}$ and nodes should reevaluate and act accordingly should this happen.

We can thus define $\mathbf{a}\sub{n}$ beyond the initial tranche through a new VRF which acts upon the set of *no-show* validators. $$\begin{aligned}
  \nonumber\forall n > 0:&\\
  
  \ s\sub{n}(\wrX) &\in \bssignature{\activeset\subb{v}_\vkNbs}{\Xaudit \concat \banderout{\H_\Nvrfsig}\concat\blake{\wrX}\append n}{\sq{}} \\
  \ \mathbf{a}\sub{n} &\equiv \set{ \build{ \wrX }{\textstyle\frac{\Cvalcount}{256\Cauditbiasfactor}\banderout{s\sub{n}(\wrX)}\sub{0} < m\sub{n}, \wrX \in \mathbf{q}, \wrX \ne \none }}\!\!\!\!\\
  \nonumber \where m\sub{n} &= \len{A_{n - 1}(\wrX) \setminus J_\top(\wrX)}\end{aligned}$$

We define our bias factor $\Cauditbiasfactor = 2$, which is the expected number of validators which will be required to issue a judgment for a work-report given a single no-show in the tranche before. Modeling by [@cryptoeprint:2024/961] shows that this is optimal.

Later audits must be announced in a similar fashion to the first. If audit requirements lessen on the receipt of new information (i.e. a positive judgment being returned for a previous *no-show*), then any audits already announced are completed and judgments published. If audit requirements raise on the receipt of new information (i.e. an additional announcement being found without an accompanying judgment), then we announce the additional audit(s) we will undertake.

As $n$ increases with the passage of time $\mathbf{a}\sub{n}$ becomes known and defines our auditing responsibilities. We must attempt to reconstruct all work-packages and their requisite data corresponding to each work-report we must audit. This may be done through requesting erasure-coded chunks from one-third of the validators. It may also be short-cutted by asking a cooperative third party (e.g. an original guarantor) for the preimages.

Thus, for any such work-report $\wrX$ we are assured we will be able to fetch some candidate work-package encoding $F(\wrX)$ which comes either from reconstructing erasure-coded chunks verified through the erasure coding's Merkle root, or alternatively from the preimage of the work-package hash. We decode this candidate blob into a work-package.

In addition to the work-package, we also assume we are able to fetch all manifest data associated with it through requesting and reconstructing erasure-coded chunks from one-third of validators in the same way as above.

We then attempt to reproduce the report on the core to give $e\sub{n}$, a mapping from cores to evaluations: $$\begin{aligned}
  %  \forall \tup{\cX, \wrX} \in \localNtranche\sub{n} \!: e\sub{n}(\wrX) \!\Leftrightarrow\! \begin{cases}
  %    \wrX = \computereport(p, \cX)\!\!\!\!\! &\when \exists p \in \workpackage: \encode{p} = F(\wrX) \\
  %    \bot &\otherwise
  %  \end{cases}
    \forall \tup{\cX, \wrX} \in \mathbf{a}\sub{n} :\ \ &\[-10pt]
    e\sub{n}(\cX) \Leftrightarrow &\begin{cases}
      \wrX = \computereport(p, \cX)\!\!\! &\when \exists p \in \workpackage: \encode{p} = F(\wrX) \\
      \bot &\otherwise
    \end{cases}
  \end{aligned}\!\!$$

Note that a failure to decode implies an invalid work-report.

From this mapping the validator issues a set of judgments $\mathbf{j}\sub{n}$: $$\begin{aligned}
  
  \mathbf{j}\sub{n} &= \set{\build{
    \edsigndata{
      \activeset\subb{v}_\vkNed
    }{
      \Xvalidif{e\sub{n}(\cX)} \concat \blake{\wrX}
    }
  }{
    \tup{\cX, \wrX} \in \mathbf{a}\sub{n}
  }}\end{aligned}$$

All judgments $\mathbf{j}_*$ should be published to other validators in order that they build their view of $J$ and in the case of a negative judgment arising, can form an extrinsic for $\xtdisputes$.

We consider a work-report as audited under two circumstances. Either, when it has no negative judgments and there exists some tranche in which we see a positive judgment from all validators who we believe are required to audit it; or when we see positive judgments for it from greater than two-thirds of the validator set. $$\begin{aligned}
  U(\wrX) &\Leftrightarrow \bigvee\,\abracegroup[\,]{
    &J_\bot(\wrX) = \emptyset \wedge \exists n : A\sub{n}(\wrX) \subset J_\top(\wrX) \\
    &\len{J_\top(\wrX)} > \twothirds\Cvalcount
  }\end{aligned}$$

Our block $\block$ may be considered audited, a condition denoted $\isaudited$, when all the work-reports which were made available are considered audited. Formally: $$\begin{aligned}
  \isaudited &\Leftrightarrow \forall \wrX \in \justbecameavailable : U(\wrX)\end{aligned}$$

For any block we must judge it to be audited (i.e. $\isaudited = \top$) before we vote for the block to be finalized in GRANDPA. See section [sec:grandpa] for more information here.

Furthermore, we pointedly disregard chains which include the accumulation of a report which we know at least $\onethird$ of validators judge as being invalid. Any chains including such a block are not eligible for authoring on. The *best block*, i.e. that on which we build new blocks, is defined as the chain with the most regular Safrole blocks which does *not* contain any such disregarded block. Implementation-wise, this may require reversion to an earlier head or alternative fork.

As a block author, we include a judgment extrinsic which collects judgment signatures together and reports them on-chain. In the case of a non-valid judgment (i.e. one which is not two-thirds-plus-one of judgments confirming validity) then this extrinsic will be introduced in a block in which accumulation of the non-valid work-report is about to take place. The non-valid judgment extrinsic removes it from the pending work-reports, $\reports$. Refer to section 10 for more details on this.
