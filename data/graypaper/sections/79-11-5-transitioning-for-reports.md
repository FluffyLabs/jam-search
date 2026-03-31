---
type: graypaper_section
title: 11.5 Transitioning for Reports
index: 79
---
We define $\reportspostassurances$ as being equivalent to $\reportspostguarantees$, except where the extrinsic replaced an entry. In the case an entry is replaced, the new value includes the present time $\thetime'$ allowing for the value to be replaced without respect to its availability once sufficient time has elapsed (see equation [eq:reportcoresareunusedortimedout]). $$\forall \cX \in \coreindex : \reportspostassurances\subb{\cX} \equiv \begin{cases}
      \tup{\Nworkreport,\,\is{\rsNtimestamp}{\thetime'}} &\when \exists \tup{\Nworkreport,\,\xgNtimeslot,\,\xgNcredential} \in \xtguarantees, \Nworkreport_\wrNcore = \cX \\
      \reportspostguarantees\subb{\cX} &\otherwise
    \end{cases}$$

This concludes the section on reporting and assurance. We now have a complete definition of $\reportspostassurances$ together with $\justbecameavailable$ to be utilized in section 12, describing the portion of the state transition happening once a work-report is guaranteed and made available.
