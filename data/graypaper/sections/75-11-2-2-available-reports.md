---
type: graypaper_section
title: 11.2.2 Available Reports
index: 75
---
A work-report is said to become *available* if and only if there are a clear super-majority of validators who have marked its core as set within the block's assurance extrinsic. Formally, we define the sequence of newly available work-reports $\justbecameavailable$ as: $$\begin{aligned}
  
  \justbecameavailable &\equiv \sq{\build{
      \reportspostjudgement\subb{\cX}_\rsNworkreport
    }{
      \cX \orderedin \coreindex,\;
      \sum_{a \in \xtassurances}\!a_\xaNavailabilities\subb{\cX}\,>\,\twothirds\,\Cvalcount
    }}\end{aligned}$$

This value is utilized in the definition of both $\accountspost$ and $\reportspostguarantees$ which we will define presently as equivalent to $\reportspostjudgement$ except for the removal of items which are either now available or have timed out: $$\begin{aligned}
  
  \forall \cX \in \coreindex: \reportspostguarantees\subb{\cX} \equiv \begin{cases}
    \none &\when\reports\subb{\cX}_\rsNworkreport \in \justbecameavailable \vee \H_\Ntimeslot \ge \reportspostjudgement\subb{\cX}_\rsNtimestamp + \Cassurancetimeoutperiod\\
    \reportspostjudgement\subb{\cX} &\otherwise
  \end{cases}\end{aligned}$$
