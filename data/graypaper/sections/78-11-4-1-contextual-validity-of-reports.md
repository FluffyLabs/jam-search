---
type: graypaper_section
title: 11.4.1 Contextual Validity of Reports
index: 78
---
For convenience, we define two equivalences $\mathbf{x}$ and $\mathbf{p}$ to be, respectively, the set of all contexts and work-package hashes within the extrinsic: $$\using \mathbf{x}\equiv \set{ \build { \wrX_\wrNcontext }{ \wrX \in \incomingreports } }\ ,\quad
    \mathbf{p}\equiv \set{ \build { (\wrX_\wrNavspec)_\asNpackagehash }{ \wrX \in \incomingreports } }$$

There must be no duplicate work-package hashes (i.e. two work-reports of the same package). Therefore, we require the cardinality of $\mathbf{p}$ to be the length of the work-report sequence $\incomingreports$: $$\len{\mathbf{p}} = \len{\incomingreports}$$

We require that the anchor block be within the last $\Crecenthistorylen$ blocks and that its details be correct by ensuring that it appears within our most recent blocks $\recenthistorypostparentstaterootupdate$: $$\begin{aligned}
  \forall x \in \mathbf{x}: \exists y \in \recenthistorypostparentstaterootupdate : x_\wcNanchorhash = y_\rhNheaderhash \wedge x_\wcNanchorpoststate = y_\rhNstateroot \wedge x_\wcNanchoraccoutlog = y_\rhNaccoutlogsuperpeak \!\!\!\!\!\!\end{aligned}$$

We require that each lookup-anchor block be within the last $\Cmaxlookupanchorage$ timeslots: $$\begin{aligned}
  
  \forall x \in \mathbf{x}:\ x_\wcNlookupanchortime \ge \H_\Ntimeslot - \Cmaxlookupanchorage\end{aligned}$$

We also require that we have a record of it; this is one of the few conditions which cannot be checked purely with on-chain state and must be checked by virtue of retaining the series of the last $\Cmaxlookupanchorage$ headers as the ancestor set $\ancestors$. Since it is determined through the header chain, it is still deterministic and calculable. Formally: $$\begin{aligned}
  \forall x \in \mathbf{x}:\ \exists h \in \ancestors: h_\Ntimeslot = x_\wcNlookupanchortime \wedge \blake{h} = x_\wcNlookupanchorhash\end{aligned}$$

We require that the work-package of the report not be the work-package of some other report made in the past. We ensure that the work-package not appear anywhere within our pipeline. Formally: $$\begin{aligned}
  &\using \mathbf{q} = \set{\build{
      (\wrX_\wrNavspec)_\asNpackagehash
    }{
      \tup{\wrX, \mathbf{d}} \in \concatall{\ready}
    }} \\
  &\using \mathbf{a} = \set{\build{
      ((\wrX_\rsNworkreport)_\wrNavspec)_\asNpackagehash
    }{
      \wrX \in \reports, \wrX \ne \none
    }} \\
  &\forall p \in \mathbf{p},
    p \not\in \bigcup_{x \in \recenthistory}\keys{x_\rhNreportedpackagehashes}
      \cup
      \bigcup_{x \in \accumulated}x
      \cup \mathbf{q}
      \cup \mathbf{a}\end{aligned}$$

We require that the prerequisite work-packages, if present, and any work-packages mentioned in the segment-root lookup, be either in the extrinsic or in our recent history. $$\begin{aligned}
  &\begin{aligned}
    &\forall \wrX \in \incomingreports,
    \forall p \in (\wrX_\wrNcontext)_\wcNprerequisites \cup
      \keys{\wrX_\wrNsrlookup} :\\
    &\quad p \in \mathbf{p}\cup \set{
      \build{x}{x \in \keys{b_\rhNreportedpackagehashes},\, b \in \recenthistory}}
  \end{aligned}\end{aligned}$$

We require that any segment roots mentioned in the segment-root lookup be verified as correct based on our recent work-package history and the present block: $$\begin{aligned}
  &\using \mathbf{p}= \set{ \build {
    \kv{
      ((g_\xgNworkreport)_\wrNavspec)_\asNpackagehash
    }{
      ((g_\xgNworkreport)_\wrNavspec)_\asNsegroot
    }
  }{
    g \in \xtguarantees
  } } \\
  &\forall \wrX \in \incomingreports: \wrX_\wrNsrlookup \subseteq \mathbf{p}\cup \bigcup_{b \in \recenthistory} b_\rhNreportedpackagehashes\end{aligned}$$

(Note that these checks leave open the possibility of accepting work-reports in apparent dependency loops. We do not consider this a problem: the pre-accumulation stage effectively guarantees that accumulation never happens in these cases and the reports are simply ignored.)

Finally, we require that all work-digests within the extrinsic predicted the correct code hash for their corresponding service: $$\begin{aligned}

  \forall \wrX \in \incomingreports, \forall \wdX \in \wrX_\wrNdigests : \wdX_\wdNcodehash = \accounts\subb{\wdX_\wdNserviceindex}_\saNcodehash\end{aligned}$$
