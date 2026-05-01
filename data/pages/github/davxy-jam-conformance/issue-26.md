---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/26'
title: TurboJam
site: github.com/davxy/jam-conformance
created_at: '2025-08-20T23:05:42.000Z'
last_modified: '2025-08-20T23:05:42.000Z'
content_kind: issue
---

# TurboJam

## Issue by @sierkov

Hi @davxy,

I've prepared a Docker image with the fuzzing target of [TurboJam](https://github.com/r2rationality/turbojam), an open-source C++ implementation of JAM. The image is publicly available on DockerHub as ```r2rationality/turbojam-fuzz:20250821-000```. It targets GP version ```0.6.7```.

Below is a quick usage guide along with a few open questions. Please let me know if this packaging approach works for you.

## Usage

The image expects an externally mounted volume at ```/fuzzer```, where it will create:
- ```fuzzer.sock``` - the UNIX socket for listening for incoming connections
- ```fuzzer.log``` - a diagnostic log file

Example command (creates both in ```./jam-fuzz``` on the host):
```
docker run --rm -it -v ./jam-fuzz:/fuzzer r2rationality/turbojam-fuzz:20250821-000
```

## Open Questions
1. ***Behavior of GetState with an unknown header hash*** Can you confirm that closing the connection is the expected behavior in the following scenario?
   - The client submits a block that is rejected.
   - The client then requests the posterior state of that block by header hash.
   - The target immediately closes the connection, per: “Receiving an unexpected or malformed message results in immediate session termination.”
2. ***PVM traces for three failing tests*** The current implementation passes all conformance tests except three, which show minor divergences in gas consumption. Could you provide PVM traces for the following cases?
   - ```preimages/00000070```
   - ```preimages/00000091```
   - ```preimages/00000092```.
3. ***Including PVM traces in fuzz reports*** Would it be feasible to automatically include PVM traces in fuzzing reports? This would speed up debugging of subtle issues (e.g., identifying misbehaving host calls).




## Comment by @davxy

Hi @sierkov .

First, some issues to be fixed

- I can't run the container as the current machine user (see logs below). It only works with superuser.  
  - For reference, *boka* provides a Docker image that runs as a normal user. Please verify this (you can test with `./get_target boka` and `./run_target boka`). I’ve already added your target to the scripts so you can check yours as well.  

- Please add an argument to specify the socket name. I use the same socket name for all targets. You can refer to [`boka`](https://github.com/davxy/jam-conformance/blob/7c3b404b111b7b7d1844965de08d2c8f69ec6167/scripts/run_target.sh#L114-L120) for an example.  

- Please include a `latest` tag in your Docker image, so I don’t need to update the download script with every release. Again, see [`boka`](https://github.com/davxy/jam-conformance/blob/7c3b404b111b7b7d1844965de08d2c8f69ec6167/scripts/get_target.sh#L31-L34) as reference.  

```run
❯ ./run_target.sh turbojam --help
Run turbojam via Docker
/bin/bash: /home/dev/turbojam/start-fuzzer.sh: Permission denied
```


## Comment by @davxy

Also, @sierkov, are you on any of the JAM Matrix channels?  
I recommend joining the new **"JAM Conformance"** room: [#jam-conformance:matrix.org](https://matrix.to/#/#jam-conformance:matrix.org).  
People have been asking questions about your implementation there.


## Comment by @sierkov

@davxy thank you. I've published an updated image: ```r2rationality/turbojam-fuzz:latest```.
This version supports alternative user ids and custom socket paths. Also, the image size has been reduced.

You can find suggested adjustments to ```get_target.sh``` and ```run_target.sh``` in https://github.com/davxy/jam-conformance/pull/27

Let me know if you have any further feedback.

P.S. I'll check messages in the "JAM Conformance" channel later today.


## Comment by @davxy

Now your target starts and waits for connection.
Unfortunately it disconnects as soon as I send the `PeerInfo` message :-/ (I don't receive anything back)


## Comment by @sierkov

@davxy Thanks! I've published an updated image. It fixes an issue where the API was incorrectly expecting a ```peer_info``` message with jam_version ```0.6.6```. I had forgotten to bump the version number, and since my test client had the same mismatch, the problem went unnoticed during testing.

BTW, I’d like to expose the API’s log file to make it easier to analyze communication-level issues. Do you have any suggestions on the best way to approach this?


## Comment by @davxy

Answers to the questions above

> Behavior of GetState with an unknown header hash

If you fail to import, you should return the last correctly imported state root.
If the fuzzer expects this failure then the next block is sent, otherwise it will ask for the state at the block just imported. 
- if you want a report with a diff then you return the state at the best block you have.
- if you don't care of the diff you can close the connection

> PVM traces for three failing tests 

you talk aboutnthe test vectors right? I will provide you the traces ( do you still need these?)

> Including PVM traces in fuzz reports 

Not currently, perhaps you can also try ask for traces to other teams as well in the jam conformance chan :-). For us generating these traces is not sonething that we have scripted/automated and currently involves some  manual intervention 


## Comment by @davxy

Your reports are published in your dedicated folder. Table upsated as well: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports


## Comment by @sierkov

@davxy Thank you! Yes, three PVM traces for ```traces``` test-vectors are still needed:
- ```preimages/00000070```
- ```preimages/00000091```
- ```preimages/00000092```

On the idea of requesting traces from other teams: to be honest, I’m a bit reluctant. My main concern is keeping the implementation as clean as possible and avoiding any potential claims of collusion.

I was thinking there might be a very simple way to generate traces instead, for example:
- Forking a new process with an adjusted environment that forces the PVM to produce its trace in the location of a new report.
- Executing the PVM program inside that process.

I would have gladly contributed an initial implementation if the relevant parts of the Fuzzer’s source code were public. In my view, automatic availability of PVM traces could noticeably accelerate progress for many teams.



## Comment by @davxy

> main concern is keeping the implementation as clean as possible and avoiding any potential claims of collusion

I don't understand how asking for traces can lead to this?

You should also consider that PolkaJam team is not different from any other team and we should not be treated as some kind of reference

BTW I'll try to provide the traces you need ~tomorrow~ (afk for the next 3 days)




## Comment by @sierkov

@davxy Thanks again. I’ve prepared an updated 0.6.7 image that resolves most reported issues, with the exception of two:
1. Occasional mismatch in accumulate_gas_used. I’ve added some notes on this below.
2. Code hash mismatch for services “upgraded” via the ```upgrade``` host calls This occurs because the argument memory buffer has four non-zero leading bytes. My hunch is that this may be a side effect of execution taking a non-standard path, which also seems consistent with the observed differences in accumulate_gas_used.

Before diving deeper into the gas issue, I’d like your input on one question: 👉 Would you prefer that turbojam first cleans up all 0.6.7 reports before moving to 0.7.0, or should it switch sooner to reduce the overhead of testing multiple JAM versions in parallel?

Another idea I’d like to float (before we talk about PVM traces): would it be feasible to modify the bootstrap service to log gas usage after each host call? My suspicion is that divergences in gas usage primarily come from host-call results. If I could pinpoint which host call misbehaves, it might already provide substantial debugging value.

Regarding PVM traces, it’s not my intention to overcomplicate matters by asking only for Parity’s PVM traces. That said, with a paranoid hat on, I worry that analyzing artifacts (such as logs) from other implementations outside well-defined protocols (traces, fuzzer, jamsnp) could inadvertently reveal their approaches and be perceived as collusion. My reluctance is based on two main reasons:
1) Parity’s implementation is the only one where the team is not competing for the JAM prize, and thus benefits from other implementations being developed “clean room.” In contrast, prize-eligible implementations are incentivized to move fast, and may unintentionally expose details in development artifacts such as logs.
2) Since what counts as collusion is subjective and will be decided later by Parity and the Polkadot Fellows, I’d personally prefer to stay on the safe side and avoid using artifacts from other implementations until explicit guidance says it’s acceptable. Creating a JAM implementation is a significant investment, so I’d like to minimize potential risks.


## Comment by @davxy

For the 0.6.7 we're not going to test new traces.
All the traces are the ones contained [here](https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/0.6.7/traces). New stuff will be proposed for 0.7.0


## Comment by @davxy

Curious. Why TurboJam is not in [clients](https://graypaper.com/clients) list yet? Is it under a different name?


## Comment by @sierkov

@davxy A new Docker image supporting ```GP 0.7.0``` has been published. For transparency, here are a few notes:
- The uploaded version includes the latest fix with reordered statistics (https://github.com/davxy/jam-test-vectors/issues/93)
- The (11.35) check had to be disabled, as discussed: https://github.com/davxy/jam-conformance/issues/8#issuecomment-3201769214
- The code passes all ```0.7.0``` conformance test vectors, except for very minor discrepancies in ```accumulate_gas_used``` (exactly 3 and 6 gas units in all cases). These occur in the following ```traces``` test vectors:
  - ```preimages\00000046``` - 6 units
  - ```preimages\00000057``` - 3 units
  - ```preimages\00000091``` - 3 units
  - ```preimages\00000097``` - 6 units
  - ```preimages\00000098``` - 3 units
  - ```preimages_light\00000046``` - 6 units
  - ```preimages_light\00000055``` - 3 units
  - ```preimages_light\00000059``` - 3 units

To track down the cause of the discrepancy, I reviewed the implementation of host calls executed by ```preimages_light``` vectors: ```info```, ```fetch```, ```solicit```, and ```write```. I discovered one issue—the code was sometimes ignoring the requested return buffer offset. While I’ve fixed that bug, the gas usage mismatch persists, so the root cause must lie elsewhere.

P.S. The project is not registered in the clients list. As far as I understand, registration is optional, and given the choice to go open source, the project will maintain a low profile until the M1 review is complete.


## Comment by @sierkov

@davxy A new Docker image has been published. It should resolve all open reports except for the following two, where the only difference is the minor variation in ```accumulate_gas_used```:
- ```1756548583``` - 10 gas units
- ```1756572122``` - 5 gas units.

Could you share PVM traces for these two fuzz reports, or alternatively for some of the failing ```traces test vectors``` mentioned in the previous comment? It seems I’ve investigated everything except the actual source, so I could use some help here.

P.S. If you believe it’s important for teams to exchange development artifacts such as PVM logs, would you be open to me proposing a common ASN.1 syntax for PVM traces? I believe this could:
- Reduce the risk of unintentionally sharing sensitive implementation details in logs
- Enable automated processing and comparison of PVM traces


## Comment by @sierkov

A new Docker image has been published with the following updates:
- Improved compliance with GP 0.7.0 for Safrole implementation in several edge cases
- improved block import performance in some cases

P.S. The PVM traces mentioned in the previous comment are still needed.


## Comment by @sierkov

I’ve shared my proposal for the PVM trace format here:: https://github.com/davxy/jam-conformance/pull/65#issuecomment-3266952906


## Comment by @sierkov

A new Docker image has been published with the following updates:
- Support for Fuzzer protocol v1.
- Fixes for open fuzz reports.


## Comment by @sierkov

A new TurboJam Docker image has been published with the following updates:
- Support for 0.7.2
- Support for forks

I am still catching up with the published traces and discussions since September. The current status is as follows:
- All test vectors pass.
- All minifuzz examples pass (both forks and no_forks).
- 733 out of 760 previously published 0.7.2 fuzzer traces pass.

At the moment, this is a request for a quick check—when you have time—to confirm that the image works with the current tooling.
I will add a separate note once TurboJam has no known issues and is fully ready for fuzzing.


## Comment by @sierkov

A new TurboJam Docker image has been published with the following updates:
- Various fixes to improve GP 0.7.2 alignment.

This version successfully passes all test vectors, minifuzz examples, and all 760 published 0.7.2 fuzzer traces.


## Comment by @davxy

I'll produce your reports summary in the next couple of days


## Comment by @davxy

Report published. I'll bench you impl in the next days


## Comment by @sierkov

A new TurboJam Docker image has been published with the following updates:
- Fixes the single failing trace identified in the previous report.
- Transitions to a new database engine primarily to refine the development cycle, with potential performance improvements for storage-heavy service code as a byproduct.


## Comment by @davxy

I'm not able to run your target anymore 

`./target.py run turbojam`

[here](https://github.com/davxy/jam-conformance/blob/c2e505988fbe23ee3a3c8ee3cd741ee764aaae23/scripts/targets.json#L112) is your target entry.

Which means that the command `fuzzer-api {TARGET_SOCK}` is run


## Comment by @sierkov

@davxy My current best guess is that the fuzzer uses an explicit --user argument when running docker run, and that user changed from 1001:1001 (which the container expects, and which is also used when --user is not specified) to something else. As a result, some permissions no longer worked.

As a countermeasure, I made the tjam binary setuid, so the container should now work even when invoked with different user IDs.

I’ve published the updated container. Its hash is sha256:98a17f56fc28b74186a57ae0be8026d97e85535572ecba1444b98d3cca6850ab.

Let me know whether that solves the problem.


## Comment by @sierkov

Another TurboJam Docker image has been published that fixes the recently discovered trace 1775225235_3525.
It's hash: sha256:ec1da5b57eabae469b42971e721f0092fd116db8c96ccdea94de499ffabe67b9.


## Comment by @davxy

Results updated


## Comment by @sierkov

A new TurboJam Docker image has been published that implements the [Standard Target Packaging](https://github.com/davxy/jam-conformance/tree/main/fuzz-proto#standard-target-packaging).
It's hash: sha256:67b76bac7494de36a345d136c0bc5cefbda32011040da12b24c8302c3a7ebd2f
