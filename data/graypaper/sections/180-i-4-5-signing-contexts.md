---
type: graypaper_section
title: I.4.5 Signing Contexts
index: 180
---
$\Xavailable = \token{\$jam\_available}$

:   *Ed25519* Availability assurances. See equation [eq:assurancesig].

$\Xbeefy = \token{\$jam\_beefy}$

:   *BLS* Accumulate-result-root-MMR commitment. See equation [eq:accoutsignedcommitment].

$\Xentropy = \token{\$jam\_entropy}$

:   On-chain entropy generation. See equation [eq:vrfsigcheck].

$\Xfallback = \token{\$jam\_fallback\_seal}$

:   *Bandersnatch* Fallback block seal. See equation [eq:ticketconditionfalse].

$\Xguarantee = \token{\$jam\_guarantee}$

:   *Ed25519* Guarantee statements. See equation [eq:guarantorsig].

$\Xannounce = \token{\$jam\_announce}$

:   *Ed25519* Audit announcement statements. See equation [eq:announcement].

$\Xticket = \token{\$jam\_ticket\_seal}$

:   *Bandersnatch RingVRF* Ticket generation and regular block seal. See equation [eq:ticketconditiontrue].

$\Xaudit = \token{\$jam\_audit}$

:   *Bandersnatch* Audit selection entropy. See equations [eq:initialaudit] and [eq:latertranches].

$\Xvalid = \token{\$jam\_valid}$

:   *Ed25519* Judgments for valid work-reports. See equation [eq:judgments].

$\Xinvalid = \token{\$jam\_invalid}$

:   *Ed25519* Judgments for invalid work-reports. See equation [eq:judgments].

[^1]: The gas mechanism did restrict what programs can execute on it by placing an upper bound on the number of steps which may be executed, but some restriction to avoid infinite-computation must surely be introduced in a permissionless setting.

[^2]: Practical matters do limit the level of real decentralization. Validator software expressly provides functionality to allow a single instance to be configured with multiple key sets, systematically facilitating a much lower level of actual decentralization than the apparent number of actors, both in terms of individual operators and hardware. Using data collated by [@hildobby2024eth2] on Ethereum 2, one can see one major node operator, Lido, has steadily accounted for almost one-third of the almost one million crypto-economic participants.

[^3]: Ethereum's developers hope to change this to something more secure, but no timeline is fixed.

[^4]: Some initial thoughts on the matter resulted in a proposal by [@sadana2024bringing] to utilize Polkadot technology as a means of helping create a modicum of compatibility between roll-up ecosystems!

[^5]: In all likelihood actually substantially more as this was using low-tier "spare" hardware in consumer units, and our recompiler was unoptimized.

[^6]: Earlier node versions utilized Arweave network, a decentralized data store, but this was found to be unreliable for the data throughput which Solana required.

[^7]: Practically speaking, blockchains sometimes make assumptions of some fraction of participants whose behavior is simply *honest*, and not provably incorrect nor otherwise economically disincentivized. While the assumption may be reasonable, it must nevertheless be stated apart from the rules of state-transition.

[^8]: 1,735,732,800 seconds after the Unix Epoch.

[^9]: This is three fewer than RISC-V's 16, however the amount that program code output by compilers uses is 13 since two are reserved for operating system use and the third is fixed as zero

[^10]: Technically there is some small assumption of state, namely that some modestly recent instance of each service's preimages. The specifics of this are discussed in section 14.3.

[^11]: This requirement may seem somewhat arbitrary, but these happen to be the decision thresholds for our three possible actions and are acceptable since the security assumptions include the requirement that at least two-thirds-plus-one validators are live ([@cryptoeprint:2024/961] discusses the security implications in depth).

[^12]: This is a "soft" implication since there is no consequence on-chain if dishonestly reported. For more information on this implication see section 16.

[^13]: The latest "proto-danksharding" changes allow it to accept 87.3KB/s in committed-to data though this is not directly available within state, so we exclude it from this illustration, though including it with the input data would change the results little.

[^14]: This is detailed at [{https://hackmd.io/@XXX9CM1uSSCWVNFRYaSB5g/HJarTUhJA}]({https://hackmd.io/@XXX9CM1uSSCWVNFRYaSB5g/HJarTUhJA}) and intended to be updated as we get more information.

[^15]: It is conservative since we don't take into account that the source code was originally compiled into EVM code and thus the PVM machine code will replicate architectural artifacts and thus is very likely to be pessimistic. As an example, all arithmetic operations in EVM are 256-bit and 64-bit native PVM is being forced to honor this even if the source code only actually required 64-bit values.

[^16]: We speculate that the substantial range could possibly be caused in part by the major architectural differences between the EVM ISA and typical modern hardware.

[^17]: As an example, our odd-product benchmark, a very much pure-compute arithmetic task, execution takes 58s on EVM, and 1.04s within our PVM prototype, including all preprocessing.

[^18]: The popular code generation backend LLVM requires and assumes in its code generation that dynamically computed jump destinations always have a certain memory alignment. Since at present we depend on this for our tooling, we must acquiesce to its assumptions.

[^19]: Note that since specific values may belong to both sets which would need a discriminator and those that would not then we are sadly unable to introduce a function capable of serializing corresponding to the *term*'s limitation. A more sophisticated formalism than basic set-theory would be needed, capable of taking into account not simply the value but the term from which or to which it belongs in order to do this succinctly.
