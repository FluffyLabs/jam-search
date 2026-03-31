---
type: graypaper_section
title: 4.2.1 State Transition Dependency Graph
index: 32
---
Much as in the *YP*, we specify $\transitionstate$ as the implication of formulating all items of posterior state in terms of the prior state and block. To aid the architecting of implementations which parallelize this computation, we minimize the depth of the dependency graph where possible. The overall dependency graph is specified here: $$\begin{aligned}

  \thetime' &\prec \theheader \\
  \recenthistorypostparentstaterootupdate &\prec \tup{\theheader, \recenthistory}  \\
  \safrole' &\prec \tup{\theheader, \thetime, \xttickets, \safrole, \stagingset, \entropy', \activeset', \disputes'} \\
  \entropy' &\prec \tup{\theheader, \thetime, \entropy} \\
  \activeset' &\prec \tup{\theheader, \thetime, \activeset, \safrole} \\
  \previousset' &\prec \tup{\theheader, \thetime, \previousset, \activeset} \\
  \disputes' &\prec \tup{\xtdisputes, \disputes} \\
  \reportspostjudgement &\prec \tup{\xtdisputes, \reports}  \\
  \reportspostguarantees &\prec \tup{\xtassurances, \reportspostjudgement}  \\
  \reports' &\prec \tup{\xtguarantees, \reportspostguarantees, \activeset, \thetime'}  \\
  \justbecameavailable^* &\prec \tup{\xtassurances, \reportspostjudgement} \\
  \tup{\ready', \accumulated', \accountspostxfer, \privileges', \stagingset', \authqueue', \lastaccout', \accumulationstatistics} &\prec \tup{\justbecameavailable^*, \ready, \accumulated, \accountspre, \privileges, \stagingset, \authqueue, \thetime, \thetime'}  \\
  \recenthistory' &\prec \tup{\theheader, \xtguarantees, \recenthistorypostparentstaterootupdate, \lastaccout'}  \\
  \accountspostpreimage &\prec \tup{\xtpreimages, \accountspostxfer, \thetime'}  \\
  \authpool' &\prec \tup{\theheader, \xtguarantees, \authqueue', \authpool} \\
  \activity' &\prec \tup{\xtguarantees, \xtpreimages, \xtassurances, \xttickets, \thetime, \activeset', \activity, \theheader, \accumulationstatistics}\!\!\!\!\!\!\!\!\end{aligned}$$

The only synchronous entanglements are visible through the intermediate components superscripted with a dagger and defined in equations [eq:betadagger], [eq:rhodagger], [eq:rhoddagger], [eq:rhoprime], [eq:accountspostxfer], [eq:betaprime] and [eq:accountspostpreimage]. The latter two mark a merge and join in the dependency graph and, concretely, imply that the availability extrinsic may be fully processed and accumulation of work happen before the preimage lookup extrinsic is folded into state.
