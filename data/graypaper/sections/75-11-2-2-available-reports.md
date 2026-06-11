---
type: graypaper_section
title: 11.2.2 Available Reports
index: 75
---
A work-report is said to become *available* if and only if there are a clear  super-majority of validators who have marked its core as set within the block's assurance extrinsic. Formally, we define the sequence of newly available work-reports $\justbecameavailable$ as: $$\begin{aligned}
  
  \justbecameavailable &\equiv \sq{\build{
      (\availassignmentspostjudgment\subb{\cX}_\aaNguarantee)_\gNworkreport
    }{
      \cX \orderedin \coreindex,\;
      \sum_{a \in \xtassurances}\!a_\xaNavailabilities\subb{\cX}\,>\,\twothirds\,\len{\activeset}
    }}\end{aligned}$$

This value is utilized in the definition of both $\accountspost$ and $\availassignmentspostassurances$ which we will define presently as equivalent to $\availassignmentspostjudgment$ except for the removal of items which are either now available or have timed out: $$
  \begin{aligned}
    \forall \cX \in \coreindex: \availassignmentspostassurances\subb{\cX} \equiv {} &\begin{cases}
      \none &\when p = \none \vee (p_\aaNguarantee)_\gNworkreport \in \justbecameavailable \vee {} \\
      &\phantom{\when} \H_\Ntimeslot \ge p_\aaNtimestamp + \Cassurancetimeoutperiod \vee \len{\activeset} \ne \len{\activeset'} \\
      p &\otherwise
    \end{cases} \\
    &\where p = \availassignmentspostjudgment\subb{\cX}
  \end{aligned}$$

Note that all items are cleared when the size of the active validator key set $\activeset$ changes. Items cleared in this way can be viewed as having timed out early.
