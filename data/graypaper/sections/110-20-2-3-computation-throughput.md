---
type: graypaper_section
title: 20.2.3 Computation Throughput
index: 110
---
The TPS metric does not lend itself well to measuring distributed systems' computational performance, so we now turn to another slightly more compute-focussed benchmark: the EVM. The basic *YP* Ethereum network, now approaching a decade old, is probably the best known example of general purpose decentralized computation and makes for a reasonable yardstick. It is able to sustain a computation and I/O rate of 1.25M gas/sec, with a peak throughput of twice that. The EVM gas metric was designed to be a time-proportional metric for predicting and constraining program execution. Attempting to determine a concrete comparison to PVM throughput is non-trivial and necessarily opinionated owing to the disparity between the two platforms, including word size, endianness, stack/register architecture and memory model. However, we will attempt to determine a reasonable range of values.

EVM gas does not directly translate into native execution as it also combines state reads and writes as well as transaction input data, implying it is able to process some combination of up to 595 storage reads, 57 storage writes and 1.25M computation-gas as well as 78KB input data in each second, trading one against the other.[^13] We cannot find any analysis of the typical breakdown between storage I/O and pure computation, so to make a very conservative estimate, we assume it does all four. In reality, we would expect it to be able to do on average of each.

Our experiments[^14] show that on modern, high-end consumer hardware with a high-quality EVM implementation, we can expect somewhere between 100 and 500 gas/µs in throughput on pure-compute workloads (we specifically utilized Odd-Product, Triangle-Number and several implementations of the Fibonacci calculation). To make a conservative comparison to PVM, we propose transpilation of the EVM code into PVM code and then re-execution of it under the PolkaVM prototype.[^15]

To help estimate a reasonable lower-bound of EVM gas/µs, e.g. for workloads which are more memory and I/O intensive, we look toward real-world permissionless deployments of the EVM and see that the Moonbeam network, after correcting for the slowdown of executing within the recompiled WebAssembly platform on the somewhat conservative Polkadot hardware platform, implies a throughput of around 100 gas/µs. We therefore assert that in terms of computation, 1µs approximates to around 100-500 EVM gas on modern high-end consumer hardware.[^16]

Benchmarking and regression tests show that the prototype PVM engine has a fixed preprocessing overhead of around 5ns/byte of program code and, for arithmetic-heavy tasks at least, a marginal factor of 1.6-2% compared to EVM execution, implying an asymptotic speedup of around 50-60x. For machine code 1MB in size expected to take of the order of a second to compute, the compilation cost becomes only 0.5% of the overall time. [^17] For code not inherently suited to the 256-bit EVM ISA, we would expect substantially improved relative execution times on PVM, though more work must be done in order to gain confidence that these speed-ups are broadly applicable.

If we allow for preprocessing to take up to the same component within execution as the marginal cost (owing to, for example, an extremely large but short-running program) and for the PVM metering to imply a safety overhead of 2x to execution speeds, then we can expect a JAM core to be able to process the equivalent of around 1,500 EVM gas/µs. Owing to the crudeness of our analysis we might reasonably predict it to be somewhere within a factor of three either way---i.e. 500-5,000 EVM gas/µs.

JAM cores are each capable of 2MB/s bandwidth, which must include any state I/O and data which must be newly introduced (e.g. transactions). While writes come at comparatively little cost to the core, only requiring hashing to determine an eventual updated Merkle root, reads must be witnessed, with each one costing around 640 bytes of witness conservatively assuming a one-million entry binary Merkle trie. This would result in a maximum of a little over 3k reads/second/core, with the exact amount dependent upon how much of the bandwidth is used for newly introduced input data.

Aggregating everything across JAM, excepting accumulation which could add further throughput, numbers can be multiplied by 341 (with the caveat that each one's computation cannot interfere with any of the others' except through state oraclization and accumulation). Unlike for *roll-up chain* designs such as Polkadot and Ethereum, there is no need to have persistently fragmented state. Smart-contract state may be held in a coherent format on the JAM chain so long as any updates are made through the 8KB/core/sec work-results, which would need to contain only the hashes of the altered contracts' state roots.

Under our modelling assumptions, we can therefore summarize:

                                       Eth. L1                          JAM Core                         JAM
  ------------------------------------ -------------------------------- -------------------------------- ----------------------------------
  Compute (EVM gas/µs)   $1.25^\dagger$                   500-5,000                        0.15-1.5M
  State writes (s$^{-1}$)              $57^\dagger$                     n/a                              n/a
  State reads (s$^{-1}$)               $595^\dagger$                    4K${}^\ddagger$    1.4M${}^\ddagger$
  Input data (s$^{-1}$)                78KB${}^\dagger$   2MB${}^\ddagger$   682MB${}^\ddagger$

What we can see is that JAM's overall predicted performance profile implies it could be comparable to many thousands of that of the basic Ethereum L1 chain. The large factor here is essentially due to three things: spacial parallelism, as JAM can host several hundred cores under its security apparatus; temporal parallelism, as JAM targets continuous execution for its cores and pipelines much of the computation between blocks to ensure a constant, optimal workload; and platform optimization by using a VM and gas model which closely fits modern hardware architectures.

It must however be understood that this is a provisional and crude estimation only. It is included only for the purpose of expressing JAM's performance in tangible terms. Specifically, it does not take into account:

-   that these numbers are based on real performance of Ethereum and performance modelling of JAM (though our models are based on real-world performance of the components);

-   any L2 scaling which may be possible with either JAM or Ethereum;

-   the state partitioning which uses of JAM would imply;

-   the as-yet unfixed gas model for the PVM;

-   that PVM/EVM comparisons are necessarily imprecise;

-   (${}^\dagger$) all figures for Ethereum L1 are drawn from the same resource: on average each figure will be only $\nicefrac{1}{4}$ of this maximum.

-   (${}^\ddagger$) the state reads and input data figures for JAM are drawn from the same resource: on average each figure will be only $\nicefrac{1}{2}$ of this maximum.

We leave it as further work for an empirical analysis of performance and an analysis and comparison between JAM and the aggregate of a hypothetical Ethereum ecosystem which included some maximal amount of L2 deployments together with full Dank-sharding and any other additional consensus elements which they would require. This, however, is out of scope for the present work.
