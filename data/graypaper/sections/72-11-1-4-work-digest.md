---
type: graypaper_section
title: 11.1.4 Work Digest
index: 72
---
We finally come to define a *work-digest*, $\workdigest$, which is the data conduit by which services' states may be altered through the computation done within a work-package. $$
  \workdigest \equiv \tuple{
    \begin{alignedat}{9}
      \isa{\wdNserviceindex&}{\serviceid}\,,\;
      \isa{&\wdNcodehash&}{\hash}\,,\;
      \isa{&\wdNpayloadhash&}{\hash}\,,\;
      \isa{&\wdNgaslimit&}{\gas}\,,\;
      \isa{&\wdNresult&}{\blob \cup \workerror}\,,\;\\
      \isa{\wdNgasused&}{\gas}\,,\;
      \isa{&\wdNimportcount&}{\N}\,,\;
      \isa{&\wdNxtcount&}{\N}\,,\;
      \isa{&\wdNxtsize&}{\N}\,,\;
      \isa{&\wdNexportcount&}{\N}
    \end{alignedat}
  }$$

Work-digests are a tuple comprising several items. Firstly $\wdNserviceindex$, the index of the service whose state is to be altered and thus whose refine code was already executed. We include the hash of the code of the service at the time of being reported $\wdNcodehash$, which must be accurately predicted within the work-report according to equation [eq:reportcodesarecorrect].

Next, the hash of the payload ($\wdNpayloadhash$) within the work item which was executed in the refine stage to give this result. This has no immediate relevance, but is something provided to the accumulation logic of the service. We follow with the gas limit $\wdNgaslimit$ for executing this item's accumulate.

There is the work *result*, the output blob or error of the execution of the code, $\wdNresult$, which may be either an octet sequence in case it was successful, or a member of the set $\workerror$, if not. This latter set is defined as the set of possible errors, formally: $$
  \workerror \in \set{ \oog, \panic, \badexports, \oversize, \token{BAD}, \token{BIG} }$$

The first two are special values concerning execution of the virtual machine, $\oog$ denoting an out-of-gas error and $\panic$ denoting an unexpected program termination. Of the remaining four, the first indicates that the number of exports made was invalidly reported, the second that the size of the digest (refinement output) would cross the acceptable limit, the third indicates that the service's code was not available for lookup in state at the posterior state of the lookup-anchor block. The fourth indicates that the code was available but was beyond the maximum size allowed $\Cmaxservicecodesize$.

Finally, we have five fields describing the level of activity which this workload imposed on the core in bringing the result to bear. We include $\wdNgasused$ the actual amount of gas used during refinement; $\wdNimportcount$ and $\wdNexportcount$ the number of segments imported from, and exported into, the D$^3$L respectively; and $\wdNxtcount$ and $\wdNxtsize$ the number of, and total size in octets of, the extrinsics used in computing the workload. See section 14 for more information on the meaning of these values.

In order to ensure fair use of a block's extrinsic space, work-reports are limited in the maximum total size of the successful refinement output blobs together with the authorizer trace, effectively limiting their overall size: $$\begin{aligned}
  
  \forall \wrX \in \workreport &:
    \len{\wrX_\wrNauthtrace} + \sum\limits_{i=0}^{i<\len{\wrX_\wrNdigests}} L(\wrX_\wrNdigests\subb{i}_\wdNresult) \le \Cmaxreportvarsize \\
  L(\wdNresult \in \blob \cup \workerror) &\equiv \begin{cases}
    \len{\wdNresult} &\when \wdNresult \in \blob \\
    0 &\otherwise
  \end{cases} \\
  \Cmaxreportvarsize &\equiv 48\cdot2^{10}\end{aligned}$$
