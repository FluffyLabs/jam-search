---
type: graypaper_section
title: 11.1.1 Work Report
index: 69
---
A work-report, of the set $\workreport$, is defined as a tuple of the work-package specification, $\wrNavspec$; the refinement context, $\wrNcontext$; the core-index (i.e. on which the work is done), $\wrNcore$; as well as the authorizer hash $\wrNauthorizer$ and trace $\wrNauthtrace$; a segment-root lookup dictionary $\wrNsrlookup$; the gas consumed during the Is-Authorized invocation, $\wrNauthgasused$; and finally the work-digests $\wrNdigests$ which comprise the results of the evaluation of each of the items in the package together with some associated data. Formally: $$
  \workreport \equiv \tuple{
    \begin{aligned}
      &\isa{\wrNavspec}{\avspec},\
      \isa{\wrNcontext}{\workcontext},\
      \isa{\wrNcore}{\coreindex},\
      \isa{\wrNauthorizer}{\hash},\
      \isa{\wrNauthtrace}{\blob},\\
      &\isa{\wrNsrlookup}{\dictionary{\hash}{\hash}},\
      \isa{\wrNdigests}{\sequence[1:\Cmaxpackageitems]{\workdigest}},\
      \isa{\wrNauthgasused}{\gas}
    \end{aligned}
  }$$

We limit the sum of the number of items in the segment-root lookup dictionary and the number of prerequisites to $\Cmaxreportdeps = 8$: $$
  \forall \wrX \in \workreport : \len{\wrX_\wrNsrlookup} + \len{(\wrX_\wrNcontext)_\wcNprerequisites} \le \Cmaxreportdeps$$
