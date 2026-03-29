---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/21'
title: M1 STF Conformance Vectors
site: github.com/w3f/jamtestvectors
created_at: '2024-11-19T17:15:33.000Z'
last_modified: '2024-11-19T17:15:33.000Z'
---

# M1 STF Conformance Vectors

## Issue by @davxy

 > IMPORTER: State-transitioning conformance tests pass and can import blocks.

- Test Vectors: Data designed to rigorously exercise specific subsystems during the development phase.
- Conformance Tool: A tool used to verify an implementation's capability to meet M1 requirements.

## Test Vectors

### Codec

- [X] Vectors for block related structures https://github.com/w3f/jamtestvectors/pull/19

### STF

Super PR https://github.com/w3f/jamtestvectors/pull/28

- [X] Section 6 - Block Production and Chain Growth
- [X] Section 7 - Recent History
- [x] Section 8 - Authorization
- [X] Section 10 - Disputes, Verdicts and Judgements
- [X] Section 11 - Reporting and Assurance
- [x] Section 12 
    - [x] Accumulation
    - [X] Preimages
- [x] Section 13 - Activity Statistics

### Other

- [X] Polka-VM: https://github.com/w3f/jamtestvectors/pull/3
- [X] Fisher-Yates shuffle: https://github.com/w3f/jamtestvectors/pull/17
- [X] Erasure coding: https://github.com/w3f/jamtestvectors/pull/4


## Conformance Tool

Upon completion of the M1 Test Vectors, the plan is to provide a **procedural** conformance testing tool.

This tool is intended to determine whether an implementation adheres to the specified expectations concerning M1.

It will engage with a JAM process, which embodies a JAM implementation capable of fulfilling M1 requirements. This interaction will occur through a minimal protocol, utilizing simple I/O mechanisms, such as pipes or networking.

Starting from a well-defined genesis state, the tool will deliver a procedurally generated stream of blocks to the implementation and then read back the expected state root hash.

The test will be reproducible using a seed provided to the conformance testing tool at startup.

In the event of a failure, the tool will output:
- The prior state (i.e., the most recent state read from the implementation under test)
- The input block that caused the issue

When relevant, the vector responsible for triggering the failure will be added to the STF vector set to target the specific subsystem associated with the fault.

See also: https://github.com/w3f/jamtestvectors/issues/7

---

🎁 While the vector PRs are under review, you may use the following repository for a single branch containing all the provided test vectors: https://github.com/davxy/jam-test-vectors.



## Comment by @sourabhniyogi

I'm putting together a "importblocks" fuzz tester and would like to know which state elements would be changed by blocks in "M1 Import blocks" milestone from
https://graypaper.fluffylabs.dev/#/293bf5a/348e00348e00
in different testing modes to match the goals of M1 vs M2 vs M3 as well as which extrinsics. I think we should have a super precise answer for M1 Import Blocks now?

My guess is:

"M1 Import blocks" will have blocks that change the state of:

* C(4), C(6), C(7), C(8), C(9), C(10), C(11), C(13), C(15)
* all service storage (δ, a_s, a_p, a_l)
* extrinsics E_{T,G,A,P}

... implying these will happen later:

* M2/M3: C(1), C(2), C(3), C(5), C(12), C(14), E_D

So ... what state changes will **M1 Import Blocks** cover exactly?

This has implications as to what teams should focus on finishing in what order. 

I remember earlier comments that M1 doesn't even need PVM implementation, which is at odds with the above guess.

This is important for the design+implementation of a fuzz tester that only generates blocks suitable for each milestone / mode, with a parameter like "mode" that is like
* M1: "fallback" (no extrinsics), "safrole" (only ticket extrinsics), "assurances" (all but dispute extrinsics and no prereqs)
* M2: "orderedaccumulation" (adjusting C(14), including prereqs), "authorization" (adjusting C(1)+C(2)), "recenthistory" (C(3)), "blessed" (adjusting C(5), C(12)), "basichostfunctions" (most common host functions)
* M3: "finalization" (everything in C(1)-C(15) except disputes), "disputes" (everything, including dispute extrinsics), "conformance" (every single host function)


See [Import Blocks CLI](https://docs.jamcha.in/testing/import-blocks)



## Comment by @sourabhniyogi

<img width="811" alt="image" src="https://github.com/user-attachments/assets/59b89e33-3b76-4f3a-b59b-15682c1e2480">

Also, do you have suggestions on how to have larger configurations than "tiny"?  

Above is my starting point for some chain specs, in expectation that the JAM Toaster will support teams having { small => 2x large } configs 100% on their own and then { 2, 3, 4 } teams can assemble into a { xlarge, 2xlarge, 3xlarge } config in 2025 as they pass M1 Conformance tests.

Added [chainspecs.json](https://github.com/jam-duna/jamtestnet/blob/main/chainspecs.json) and initial [genesis states](https://github.com/jam-duna/jamtestnet/tree/main/chainspecs)
