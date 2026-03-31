---
type: graypaper_section
title: 9.3 Account Footprint and Threshold Balance
index: 61
---
We define the dependent values $\saNitems$ and $\saNoctets$ as the storage footprint of the service, specifically the number of items in storage and the total number of octets used in storage. They are defined purely in terms of the storage map of a service, and it must be assumed that whenever a service's storage is changed, these change also.

Furthermore, as we will see in the account serialization function in section 26, these are expected to be found explicitly within the Merklized state data. Because of this we make explicit their set.

We may then define a third dependent term $\saNminbalance$, the minimum, or *threshold*, balance needed for any given service account in terms of its storage footprint. $$\begin{aligned}
  \forall \mathbf{a} \in \values{\accounts}\colon \abracegroup{
    \mathbf{a}_\saNitems \in \Nbits{32} &\equiv
      2\cdot\len{\,\mathbf{a}_\saNrequests\,} + \len{\,\mathbf{a}_\saNstorage\,} \\
    \mathbf{a}_\saNoctets \in \Nbits{64} &\equiv
      \sum\limits_{\,\tup{h, z} \in \keys{\mathbf{a}_\saNrequests}\,} \!\!\!\!81 + z \\
    &\phantom{\equiv\ } + \sum\limits_{\tup{x, y} \in \mathbf{a}_\saNstorage} 34 + \len{y} + \len{x} \\
    
    \mathbf{a}_\saNminbalance \in \balance &\equiv
      \max(0,
        \Cbasedeposit
        + \Citemdeposit \cdot \mathbf{a}_\saNitems
        + \Cbytedeposit \cdot \mathbf{a}_\saNoctets
        - \mathbf{a}_\saNgratis
      )
  }\end{aligned}$$
