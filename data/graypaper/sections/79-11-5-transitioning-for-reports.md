---
type: graypaper_section
title: 11.5 Transitioning for Reports
index: 79
---
We define $\availassignmentspostguarantees$ as being equivalent to $\availassignmentspostassurances$, except where the extrinsic replaced an entry. In the case an entry is replaced, the new value includes the present time $\thetime'$ so that it can be cleared if it is not made available quickly enough (see equation [eq:availassignmentspostassurancesdef]). $$\forall \cX \in \coreindex : \availassignmentspostguarantees\subb{\cX} \equiv \begin{cases}
      \tup{\aaNguarantee,\,\is{\aaNtimestamp}{\thetime'}} &\when \exists \aaNguarantee \in \xtguarantees, (\aaNguarantee_\gNworkreport)_\wrNcore = \cX \\
      \availassignmentspostassurances\subb{\cX} &\otherwise
    \end{cases}$$

It is worth noting that $\availassignmentspostguarantees\subb{\cX}$ is always $\none$ for $\cX \ge \nicefrac{\len{\activeset'}}{3}$; this in particular ensures that we will never have more reports to audit than can safely be managed with the number of active validators.

This concludes the section on reporting and assurance. We now have a complete definition of $\availassignmentspostguarantees$ together with $\justbecameavailable$ to be utilized in section 12, describing the portion of the state transition happening once a work-report is guaranteed and made available.
