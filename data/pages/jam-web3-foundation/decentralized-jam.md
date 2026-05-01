---
type: page
url: 'https://jam.web3.foundation'
title: Decentralized JAM
site: jam.web3.foundation
created_at: '2026-05-01T04:21:22.132Z'
last_modified: '2026-05-01T04:21:22.132Z'
---
[Read the Rules](/rules) [Milestone Delivery](https://github.com/w3f/jam-milestone-delivery)

# 10 Million DOT for a

Decentralized JAM

The [Web3 Foundation](https://web3.foundation) is supporting implementations of the future of Polkadot with a total prize pool of 10 million DOT and 100,000 KSM.

[Get in Touch\->](https://forms.gle/1Mgs7PX3yLM5x1d18)

## About

What is JAM?

JAM is the Join-Accumulate Machine, a new protocol designed to succeed the Polkadot relay chain. It provides significantly enhanced smart contract functionality. [Learn more →](https://graypaper.com/)

Competition Goals

The

Web3 Foundation

is supporting the development of JAM client implementations to improve the decentralization and resilience of the protocol.

Judging Process

Members of the

Polkadot Fellowship

will judge submissions. The Web3 Foundation will coordinate its actions based on the decision of the Fellowship.

## The Paths to Implementation

There are three paths to prizes. In all paths the first milestone (M1, MN1, ML1) is the same.

In all paths third-party libraries for low-level primitives not specific to the JAM protocol are acceptable, such as:

*   cryptographic primitives (erasure-coding, Bandersnatch, Ed25519)
*   binary codec
*   databases
*   low-level networking stack (e.g. QUIC).

Following the accepted completion of each milestone, one developer may be promoted to the rank commensurate with their code and protocol contributions regardless of regular time requirements. The promotion should be in line with regular interpretation of the Manifesto except for the time requirements (which are disregarded). The maximum rank to be attained in this way shall be III Dan (Fellow).

Following completion of M1/MN1/ML1, evidence for Polkadot Fellowship rank-retentions (and, where applicable, promotions) may include regular, meaningful contributions to the project.

Please carefully review the [full rules for submissions](/rules).

1

### Validating Node Path:

This path involves the creation of a full validating, block-authoring implementation of JAM including a working and performant PVM.

### Maximum prize

500,000 DOT + 5,000 KSM

PVM execution, trie/DB, signature-verification and availability (EC/DB) performance tests are requirements and will be run on a standard hardware.

Following completion of M2, teams receive a login to their own instance of the standard hardware on which to make unit benchmarks of their performance.

Following completion of M3, teams receive time/slots on the JAM TOASTER to trial and debug overall emergent activity.

Following completion of M4, implementations may apply for a professional external audit at no cost.

Five milestones (each implies the ones before):

1.  (M1) IMPORTER: State-transitioning conformance tests pass and can import blocks: **100,000 DOT + 1,000 KSM**
2.  (M2) AUTHORER: Fully conformant and can produce blocks (incl networking, off-chain): **100,000 DOT + 1,000 KSM**
3.  (M3) HALF-SPEED: Conformance and 50% of required performance (including PVM impl): **100,000 DOT + 1,000 KSM**
4.  (M4) FULL-SPEED: Conformance and 100% of required performance (including PVM impl): **100,000 DOT + 1,000 KSM**
5.  (M5) SECURE: Fully audited: **100,000 DOT + 1,000 KSM**

\> Expand

2

### Non-PVM Validating Node Path:

This path involves the creation of a full validating, block-authoring implementation of JAM including an original working PVM. For the purpose of performance testing, a third-party PVM implementation may be used to help achieve the required performance.

### Maximum prize

350,000 DOT and 3,500 KSM\*

**Only half of the regular milestone prizes are paid for this path's Milestones 3, 4 and 5.**

Trie/DB, signature-verification and availability (EC/DB) performance tests are still requirements and will be run on a standard hardware.

Following completion of MN2, teams receive a login to their own instance of the standard hardware on which to make unit benchmarks of their performance.

Following completion of MN3, teams receive time/slots on the JAM TOASTER to trial and debug overall emergent activity.

Following completion of MN4, implementations may apply for a professional external audit at no cost.

Five milestones (each implies the ones before):

1.  (MN1) IMPORTER: State-transitioning conformance tests pass and can import blocks: **100,000 DOT + 1,000 KSM**
2.  (MN2) AUTHORER: Fully conformant and can produce blocks (incl networking, off-chain): **100,000 DOT + 1,000 KSM**
3.  (MN3) HALF-SPEED: Conformance and 50% of required performance (not including PVM impl): **50,000 DOT + 500 KSM**
4.  (MN4) FULL-SPEED: Conformance and 100% of required performance (not including PVM impl): **50,000 DOT + 500 KSM**
5.  (MN5) SECURE: Fully audited: **50,000 DOT + 500 KSM**

Once completed, a full implementation including full-performance PVM may be submitted at a later date for performance testing and auditing in a nominal milestone 6 (MN6). In the event it fulfills both performance tests and passes a professional audit then a further **100,000 DOT + 1,000 KSM** may be paid.

\*With an option for conversion

\> Expand

3

### Light-node:

This path involves the creation of a low-resource JAM node not capable of block-authoring, but capable of servicing network requests, suitable for embedding in other program code (such as tooling and web pages) and an extremely low footprint and synchronisation time.

### Maximum prize

250,000 DOT and 2,500 KSM

Footprints and resource usage for a variety of standard tasks will be tested on standard hardware and must complete in sufficiently low time, CPU utilisation, memory utilisation, storage utilisation and network utilisation. Resource usage should be broadly in line with smoldot.

Following completion of ML1, teams receive a login to their own instance of the standard hardware on which to make unit benchmarks of their performance.

Following completion of ML2, implementations may apply for a professional external audit at no cost.

Five milestones (each implies the ones before):

1.  (ML1) IMPORTER: State-transitioning conformance tests pass and can import blocks: **100,000 DOT + 1,000 KSM**
2.  (ML2) FULL-SPEED: Conformance and 100% of required performance: **50,000 DOT + 500 KSM**
3.  (ML3) SECURE: Fully audited: **100,000 DOT + 1,000 KSM**

There are several additional rules for prizes given on this path:

1.  4 ML2 payments are reserved in each language group.
2.  Exactly 2 ML3 payments are available in each language group.
3.  ML3 payments must belong to separate languages.
4.  On reaching ML2, teams may reserve their ML3 place for a period of 6 months to complete the audit and bring their node up to date with the protocol if needed. If no successful ML3 candidate is submitted during that period then another ML2-passing team may reserve and submit. Reservations are processed on a first-come-first-serve basis.

\> Expand

## Language Sets

Unless otherwise stated, major language dialects are acceptable.

The language set of an implementation is determined as the language in which its business logic is written. Peripheral, performance-bottleneck components of an implementation may be written in a higher-performance language without any impact on the consideration of language set. A non-exhaustive list of such components include: PVM, Database, Erasure, (de-)coding

A: "Company code"

Maximum prize per milestone (dependent on path and judgment): 100,000 DOT + 1,000 KSM

Java, AspectJ, Kotlin, C#, Go

B: "Native code"

Maximum prize per milestone (dependent on path and judgment): 100,000 DOT + 1,000 KSM

C, C++, D, Rust, Swift, Zig, Carbon, Fortran

C: "Concise code"

Maximum prize per milestone (dependent on path and judgment): 100,000 DOT + 1,000 KSM

Scheme, Common Lisp, Prolog, Haskell, ML, Perl, Python, Ruby, Javascript, Groovy, Dart

D: "Correct code"

Maximum prize per milestone (dependent on path and judgment): 100,000 DOT + 1,000 KSM

Ada, Julia, Erlang/Elixir, Ocaml, Smalltalk, F#, Scala, APL

Z: "Mad"

Maximum prize per milestone (dependent on path and judgment): 5,000 KSM

Brainfuck, Whitespace, Minecraft Red-stone

## Our Advice For Teams

The more milestones your team completes, the more competitive your submission will be. If you are unsure where to start, we recommend that teams begin in order:

*   1\. Block/header data structures and serialization
*   2\. State data structures and serialization
*   3\. In-memory DB and Merklization
*   4\. Non-PVM block execution/state-transition
*   5\. PVM instancing, execution and host-functions
*   6\. Block-import tests

## FAQs

### Clean room?

Cooperation between teams is essential but anything which goes beyond trivial misunderstandings of the graypaper should be documented, either as issues in the GP repo or as side notes of the implementation to be submitted at the time of milestone review. To stay safe, teams should stay away from the implementation specifics of other implementations and definitely not be sharing code.

It's ok to ruminate on high level approaches to solve problems or optimize, it's not so ok to be looking at some other implementation's specific solution. What the Fellowship will be looking out for is for undeclared collusion between teams. Code which appears to be a little too similar for it to have been independently written. A big red flag would be the same bug popping up in two implementations.

But this is not to detract from the fun of getting two cleanroom impls talking to each other. Of course this is a big part of it and you mustn't feel like it's not allowed.

Just be sure to document anything which you discover when working alongside another team so everyone can benefit.

### This all sounds too risky for me. Can we not have something closer to a regular service agreement?

No.

### Roughly how long will it take my developer/team to implement Milestone X?

How long is a piece of string? Seriously, read the Graypaper and decide for yourself. Every developer is different.

### Does my implementation need to exploit JAM's asynchrony?

We don't explicitly state what code paths need to be asynchronous. It is up to implementations to decide this for themselves.

To clarify, for M2, nodes are expected to provide (and use) information in a timely fashion; this goes for all aspects of block authoring and production. Needless not providing an assurance or guarantee, or not using one which was provided is incorrect behaviour.

### Ready to join the JAM?

[Get in Touch \->](https://forms.gle/1Mgs7PX3yLM5x1d18)[Read the Rules](/rules) [Milestone Delivery](https://github.com/w3f/jam-milestone-delivery)
