---
type: page
url: 'https://jam.web3.foundation/rules'
title: Decentralized JAM
site: jam.web3.foundation
created_at: '2026-05-15T04:21:21.806Z'
last_modified: '2026-05-15T04:21:21.806Z'
---
# The Rules of the JAM Prize

1.

Third-party libraries for cryptographic primitives (erasure-coding, Bandersnatch, Ed25519), codecs (e.g. SCALE), and networking (e.g. QUIC) are acceptable.

2.

Only languages defined in one of the [language sets](../#languages) are eligible for the prize.

3.

For languages not in the set, an application may be made, including the set you propose and arguments why that set is sensible and why the language is sufficiently different from the others to be valuable.

4.

Code must be idiomatic for languages which define idiom.

5.

Gas, trie/DB, signature-verification, and availability (EC/DB) performance tests are requirements and will be run on standard hardware (only applicable for paths 1 and 2).

6.

Clean-room implementation using the [Graypaper](https://graypaper.com/) and [public implementers' channel](https://matrix.to/#/%23jam:polkadot.io) as the only resources. (Additional materials may be added here at a later stage.)

7.

Any JAM-implementation code which is viewed before or during implementation must be declared.

8.

Relevant private (not in the [public implementers' channel](https://matrix.to/#/%23jam:polkadot.io)) conversations with other implementers must be declared and summarised in reports to the Fellowship.

9.

Generative AI must not be used in any substantive way.

10.

The prize may be reduced in case collusion may be sufficient to reduce network security.

11.

If concerned, then declarations may be stated up-front and the maximum reduction set; as long as declarations are accurate and no further collusion happens, then the reduction proportion will be the maximum.

12.

An interview may be requested after submission to ensure team members are the legitimate authors of the code. This precludes the use of generative AI. The interview will seek to ensure the individual has definitive expertise on both the Graypaper and their own codebase. INABILITY TO PROVE THIS EXPERTISE MAY RESULT IN A REDUCED PRIZE OR FULL DISQUALIFICATION.

13.

Following the accepted completion of each milestone, teams may nominate one [Fellowship candidate/member to be promoted directly to rank III](https://polkadot-fellows.xyz/) and (optionally) a second candidate/member to rank II (more information about the ranks can be found on the [Polkadot Fellowship Manifesto](https://github.com/polkadot-fellows/manifesto/blob/main/manifesto.pdf)).

14.

A clear Git history and public, credibly timestamped commits are necessary in order to help evidence organic code development by the team/s.

15.

Timestamps may be by virtue of pushing code to GitHub on a timely basis.

16.

For code developed in private, commit hashes should be placed, in a timely fashion, on a major public blockchain and readily visible on a block explorer.

17.

Any individual may only be part of one team's prize-claim per milestone only. E.g., an individual may not be a part of two claims to two implementations' milestone 1. Only the first is claimable.

18.

Apparent lack of originality, undeclared collusion, and suspected plagiarism may result in disqualification entirely at the discretion of the judges.

19.

Appeals may be made through a governance referendum on the [Polkadot Wish For Change](https://wiki.polkadot.network/docs/learn-polkadot-opengov-origins#wish-for-change) track, and the result will be respected by Polkadot Fellowship.

20.

Implementations must pass all relevant public and private conformance/performance tests. These will be shared in the near future.

21.

Prizes are paid no earlier than the ratification by the Polkadot Fellowship of version 1.0 of the JAM protocol. Payment of the prize by the Web3.0 Foundation is conditional upon the successful completion of all KYC/AML processes.

22.

Prizes are paid to the earliest Polkadot/Kusama account IDs stated in the repository's README. In the case of a tie, payment is split equally. Local (Swiss) law requires that Web3.0 Foundation take KYC/AML information on the recipient together with proof of account control.

23.

The prize pool is limited. Prizes will be awarded on a first-come, first-served basis, based on the order of valid submissions received. Once the prize pool is exhausted, no further prizes will be awarded, regardless of the number of participants or the quality of submissions. Prize pools may be redistributed and reallocated if a pot is nearing depletion, subject to the following conditions: (i) a 3-month notice period must be provided and (ii) no more than 25% of the prize pool may be scheduled for redistribution at any one time.

24.

Each team is only allowed to work on one implementation.

25.

Participants warrant that their submissions do not violate the intellectual property rights of any third party. Participants who are in an employment relationship are advised to ensure that their submissions do not infringe upon their employer's intellectual property rights. Depending on the terms of their contract, their work typically must be developed on their own time, using their own equipment, and be unrelated to the company’s business. It is advisable for employed participants to seek independent legal advice and/or consult with their employer regarding their submissions. The organizers shall be held harmless in the event of any disputes arising from an employed participant’s submission.

26.

The repository must include a clear and permissive open-source license. Members of W3F and the Technical Fellowship must be invited to the repository upon request.

27.

The prize will be paid out in the form of 25% unlocked and 75% locked DOTs with a two-year linear vesting via the on-chain vesting module.

28.

One full milestone prize (100,000 DOT + 1,000 KSM) will be reserved for Milestone 5 (M5) in each language set; two full milestone prizes for M4 in each language set, three full milestone prizes for M3, four full milestone prizes for M2.

29.

The language set of an implementation is determined as the language in which its business logic is written. Peripheral, performance-bottleneck components of an implementation may be written in a higher-performance language without any impact on the consideration of the language set. A non-exhaustive list of such components includes: PVM, Database, Erasure (de-)coding.

30.

Additional or modified rules may apply as specified in the documentation relevant for specific paths.
