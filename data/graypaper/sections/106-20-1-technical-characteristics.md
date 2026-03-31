---
type: graypaper_section
title: 20.1 Technical Characteristics
index: 106
---
In total, with our stated target of 1,023 validators and three validators per core, along with requiring a mean of ten audits per validator per timeslot, and thus 30 audits per work-report, JAM is capable of trustlessly processing and integrating 341 work-packages per timeslot.

We assume node hardware is a modern 16 core CPU with 64GB RAM, 8TB secondary storage and 0.5Gbe networking.

Our performance models assume a rough split of CPU time as follows:

                                                  *Proportion*          
  ----------------------------------------------- --------------------- --
  Audits                                          $\nicefrac{10}{16}$   
  Merklization                                    $\nicefrac{1}{16}$    
  Block execution                                 $\nicefrac{2}{16}$    
  GRANDPA and BEEFY   $\nicefrac{1}{16}$    
  Erasure coding                                  $\nicefrac{1}{16}$    
  Networking & misc                               $\nicefrac{1}{16}$    

Estimates for network bandwidth requirements are as follows:

  Throughput, MB/slot               *Tx*      *Rx*
  ----------------------------------------------- --------- ---------
  Guaranteeing                                    106       48
  Assuring                                        144       13
  Auditing                                        0         133
  Authoring                                       53        87
  GRANDPA and BEEFY   4         4
  **Total**                                       **304**   **281**
  **Implied bandwidth**, Mb/s       **387**   **357**

Thus, a connection able to sustain 500Mb/s should leave a sufficient margin of error and headroom to serve other validators as well as some public connections, though the burstiness of block publication would imply validators are best to ensure that peak bandwidth is higher.

Under these conditions, we would expect an overall network-provided data availability capacity of 2PB, with each node dedicating at most $6$TB to availability storage.

Estimates for memory usage are as follows:

                    GB   
  ----------------- ------------------ -------------------------------------------
  Auditing          20                 2 $\times$ 10 PVM instances
  Block execution   2                  1 PVM instance
  State cache       40                 
  Misc              2                  
  **Total**         **64**             

As a rough guide, each parachain has an average footprint of around 2MB in the Polkadot Relay chain; a 40GB state would allow 20,000 parachains' information to be retained in state.

What might be called the "virtual hardware" of a JAM core is essentially a regular CPU core executing at somewhere between 25% and 50% of regular speed for the whole six-second portion and which may draw and provide 2MB/s average in general-purpose I/O and utilize up to 2GB in RAM. The I/O includes any trustless reads from the JAM chain state, albeit in the recent past. This virtual hardware also provides unlimited reads from a semi-static preimage-lookup database.

Each work-package may occupy this hardware and execute arbitrary code on it in six-second segments to create some result of at most 48KB. This work-result is then entitled to 10ms on the same machine, this time with no "external" I/O, but instead with full and immediate access to the JAM chain state and may alter the service(s) to which the results belong.
