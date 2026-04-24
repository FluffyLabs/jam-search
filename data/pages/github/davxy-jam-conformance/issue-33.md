---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/33'
title: GrayMatter
site: github.com/davxy/jam-conformance
created_at: '2025-08-24T11:17:45.000Z'
last_modified: '2025-08-24T11:17:45.000Z'
content_kind: issue
---

# GrayMatter

## Issue by @ggwpez

Tracking issue for GrayMatter client by JamBrains. Integrated here https://github.com/davxy/jam-conformance/pull/32  
We are currently aiming at 0.6.7. cc @franciscoaguirre


## Comment by @davxy

Hey Oliver. Right now, the target shuts down after each session (when the fuzzer closes the socket).
Can we make it go back to accepting a new connection instead? 
This behavior is currently implemented by all the targets and out scripts assume this.
Thanks


## Comment by @davxy

Hi Oliver,  I get this error during startup

```
❯ ./target.py run  graymatter
Action: run, Target: graymatter, OS: linux
Running graymatter on docker image ghcr.io/jambrains/graymatter/gm:conformance-fuzzer-latest (command fuzz-m1-target--stay-open --listen /tmp/jam_target.sock)
Waiting for target termination (pid=392598)
[FATAL tini (7)] exec /app/gm failed: Permission denied
```


## Comment by @ggwpez

<img width="807" height="96" alt="Image" src="https://github.com/user-attachments/assets/bcedd1cf-3f96-4d09-a348-f117bbf69007" />

Hm, I can check it, thanks. But we actually did not update our fuzzer image since the submission. Maybe something in the script changed? I remember it used to work in the past...

At least I can reproduce the issue on my Linux machine.

PS: It is the `--init` flag; need to check how to fix that on our side.


## Comment by @davxy

I ran the 0.6.7 fuzzer once on your implementation -- not sure if you've already reviewed the report.  
I added a summary in your folder detailing what passes and what doesn't.  
At this point, I'd recommend just adding the necessary changes to move to 0.7.0 -- it shouldn't require much effort.



## Comment by @ggwpez

Yes we checked the reports folder and fixed them but did not publish a new image version yet, since we also want to be on fuzzer V1.  
Will try to push a new image EOD :)


## Comment by @ggwpez

@davxy Hey Davide,

update from us: We are on 0.7.0 now and nearly pass the minifuzz. The `forks` and `no_forks` works for us, but the `faulty` block 30 results in a root mismatch.  

Does this block do anything special? We do pass the other conformance tests, hence this is a bit difficult to debug.  
Any pointers would be appreciated 🙏  Either way, we pushed the new image.


## Comment by @davxy

Hi Oliver, yeah a mismatch is expected.
See https://github.com/davxy/jam-conformance/tree/main/fuzz-proto/examples/v1#warning-faulty-session


## Comment by @davxy

I'm observing this kind of crashes for your target (e.g. this is for 1758621412)

```
[2025-10-27 07:44:40.136] [BAD] Application gm_node exited: exited in: Gm.Node.Application.start(:normal, [])
    ** (EXIT) an exception was raised:
        ** (CaseClauseError) no case clause matching: :log
            (gm_core 0.1.0) lib/pvm/invocations/on_transfer.ex:146: PVM.Invocations.OnTransfer.host_function/9
            (gm_pvm 0.1.0) lib/pvm.ex:247: PVM.process_with_host_calls/7
            (gm_pvm 0.1.0) lib/pvm.ex:151: PVM.process_with_arguments/6
            (gm_core 0.1.0) lib/pvm/invocations/on_transfer.ex:65: PVM.Invocations.OnTransfer.on_transfer/5
            (gm_core 0.1.0) lib/jam/state/services.ex:904: anonymous fn/7 in Jam.State.Services.accumulate/10
            (elixir 1.18.4) lib/enum.ex:2546: Enum."-reduce/3-lists^foldl/2-0-"/3
            (gm_core 0.1.0) lib/jam/state/services.ex:886: Jam.State.Services.accumulate/10
            (gm_core 0.1.0) lib/jam/state/services.ex:621: Jam.State.Services.block_stf/3
Kernel pid terminated (application_controller) ("{application_start_failure,gm_node,{bad_return,{{'Elixir.Gm.Node.Application',start,[normal,[]]},{'EXIT',{{case_clause,log},[{'Elixir.PVM.Invocations.OnTransfer',host_function,9,[{file,\"lib/pvm/invocations/on_transfer.ex\"},{line,146}]},{'Elixir.PVM',process_with_host_calls,7,[{file,\"lib/pvm.ex\"},{line,247}]},{'Elixir.PVM',process_with_arguments,6,[{file,\"lib/pvm.ex\"},{line,151}]},{'Elixir.PVM.Invocations.OnTransfer',on_transfer,5,[{file,\"lib/pvm/invocations/on_transfer.ex\"},{line,65}]},{'Elixir.Jam.State.Services','-accumulate/10-fun-14-',7,[{file,\"lib/jam/state/services.ex\"},{line,904}]},{'Elixir.Enum','-reduce/3-lists^foldl/2-0-',3,[{file,\"lib/enum.ex\"},{line,2546}]},{'Elixir.Jam.State.Services',accumulate,10,[{file,\"lib/jam/state/services.ex\"},{line,886}]},{'Elixir.Jam.State.Services',block_stf,3,[{file,\"lib/jam/state/services.ex\"},{line,621}]}]}}}}}")

Crash dump is being written to: erl_crash.dump...Target process exited with status: 1
```

All traces that trigger a crash are listed in the report's README


## Comment by @ggwpez

Hey @davxy, we are on 0.7.1 now but the minifuzz is on 0.7.0 so we cant check that it works with this. So we are flying a bit blind now, could you please still include us into the next 0.7.1 run?

The issue with the `:log` should be resolved by the merging of on-transfer and accumulate.


## Comment by @ggwpez

Hey @davxy, we are on 0.7.2 now, should I open a MR to update the targets json file?


## Comment by @davxy

Yes pls


## Comment by @ggwpez

@davxy We fixed some vectors in our latest Docker image update.


## Comment by @davxy

```
❯ docker pull ghcr.io/jambrains/graymatter/gm:conformance-fuzzer-latest
conformance-fuzzer-latest: Pulling from jambrains/graymatter/gm
Digest: sha256:e8845d5e1063ec3e2672fc7ffa25add2ff5cc388eac706f9f8f1a8e7abe056a3
Status: Image is up to date for ghcr.io/jambrains/graymatter/gm:conformance-fuzzer-latest
ghcr.io/jambrains/graymatter/gm:conformance-fuzzer-latest
```

@ggwpez Is this your latest image? I ran the vectors battery this morning, but there were no changes in your target results.  
See [here](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.7.2/summaries/summary_graymatter.txt).



## Comment by @ggwpez

Ah damn, sorry @davxy. I forgot to update the tag. Should be done now. The hash is `d16af09274d7b9e423a9cae212ade21a30ffd708efdf4b9bc4903c8051fb6bfc`.


## Comment by @ggwpez

There was some issue in our test runner such that we did not see some failing Safrole tests locally. Should be fixed now.  
I will stop pinging you here since you will probably run the fuzzing more often and we also update more often.
