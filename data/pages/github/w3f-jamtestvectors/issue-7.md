---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/7'
title: Buildin test runner
site: github.com/w3f/jamtestvectors
created_at: '2024-07-15T23:07:55.000Z'
last_modified: '2024-07-15T23:07:55.000Z'
content_kind: issue
---

# Buildin test runner

## Issue by @xlc

I think we need a universal test runner to run the test vectors. 

In order for a team to receive the JAM prize, the Core Fellowship will need to evaluate if it passes the test vectors. However, without a universal test runner, each team will need to supply their custom test runner to run the tests. And then who test the test runner? It becomes non-trivial work to validate the test runner to ensure it correctly parse, execute, and compare the outputs.

The test vectors also include some implementation specific values such as Safrole error code, which should be ignored by test runners as the values are implementation specific and not defined in GP. This increases the complexity of test runner. i.e. more work to everyone.

I will suggest we define a simple stdio/out based test running protocol and implement a universal test runner that is able to run test vectors against with all implementations that also implements such protocol.

We could test input piped via stdin and expect test output from stdout and then compare the outputs and do extra handling such as ignore error code. The data could be just binary or hex encoded (controlled by a flag). It should be easy for any team to build a binary / script that support such protocol and supply it to the test runner to run all the tests.


## Comment by @xlc

This protocol can also be useful for other purpose. Here are some that I can think of:
Test case reducer that can try to generate a minimal test input that have different result between two implementations.
Standard bencher.
Network emulator tool (something like Chopsticks) that can be backed by one of the implementations.



## Comment by @Blockcowboy2

Agree. Other purposes. This can be useful for security where security = quality, but quality is not ceteris paribus so having a way for anyone to assess, attest quality helps support a model I have used in numerous industries Protection (t) > Detection (t) + Reaction (t). Time based security ... 


## Comment by @koute

In the context of PVM implementations here are my two cents:

We will most definitely need a universal harness for testing PVMs, and I was planning on proposing/creating one eventually. Otherwise I don't see a practical way of evaluating the performance milestones (just running a node on a test net and eyeballing it is not going to be enough), and as @xlc you've noted it's going to be tricky to evaluate correctness too.

But there's one more benefit to having such a harness - we can fuzz all of the implementations against each other!

What this essentially means - have a fuzzer generate random programs, and then run that program on two PVM implementations in parallel, and compare the outputs. If the two PVMs disagree then we're dealing with either a) the first PVM implementation is wrong and needs to be corrected, b) the second PVM implementation is wrong and needs to be corrected, c) the behavior is under-specced or nonsensical and should be clarified in the GP.

So the beauty of this approach is that you don't need to explicitly create test vectors, the fuzzers are pretty good at finding weird corner cases that would be hard to test for otherwise, and they often already include an automatic "test case reducer" that will spit out the shortest input that triggers a given failure.

> I will suggest we define a simple stdio/out based test running protocol and implement a universal test runner that is able to run test vectors against with all implementations that also implements such protocol.

I think this should be up to the given implementation how they want to do it. Assuming the test runner is written in Rust (which is a reasonable choice assuming we want to fuzz) we could define a trait that each implementation would have to implement, and have one generic stdin/stdout based implementation for those implementations that don't want to write any extra code. (For example, for my PolkaVM I'd like to link to the test harness natively to make fuzzying faster.)

Also, for PVM performance tests specifically we will probably want a slightly more richer interface than just a single `fn(input: Input) -> Output`. We don't want to measure one-time initialization overheads and IPC overhead, and it'd be nice to measure compilation performance overhead separately, as I don't expect any implementation that is not a recompiler to be able to pass the performance tests anyway.

So in PolkaVM I already have [a interface for benchmarking in my benchmarking harness](https://github.com/koute/polkavm/blob/v0.11.0/tools/benchtool/src/backend.rs#L14) and the PVM debugger [also defined an interface](https://github.com/FluffyLabs/pvm-debugger/issues/81) for running programs. So ideally we'd merge the two together and define a single interface to both run performance tests and correctness/fuzz tests.

So a few points that a good PVM interface needs:
- An `initialize` function to let the implementation do costly one-time initialization (we don't want to include this cost in the measurements),
- A `nop` function to measure IPC overhead of whatever "protocol" the harness implements to communicate with the implementation (to substract it from the measurements; otherwise we'll unfairly penalize implementations which use a generic/heavier IPC mechanism like stdin/stdout)
- A `compile` function to measure module compilation overhead (mainly relevant for recompilers; not *strictly* necessary but it's very useful to be able to measure/compare the compilation performance separately; for implementations that are not a recompiler they would just opt-out of this/have a dummy implementation that does nothing)
- A `run` function to measure execution performance.
- A bunch of auxiliary functions to set/get registers, set/get gas, modify memory. (For the registers and the gas we could technically just have them passed in/out  of the `run` function, but for memory that's somewhat impractical and would add unnecessary noise to the measurements.)


## Comment by @xlc

There are many ways to define such interface. stdin/out is one of the easiest way that works universally but we definitely could define a Rust trait, implement a pipe adapter, a C FFI adapter, a HTTP adapter etc to confirm such Rust trait.


## Comment by @koute

So to get the ball rolling, we should maybe try to prototype a test harness unofficially (with test running, performance benchmarks and differential fuzzying) and see how it goes.

For PVM specifically I can whip up such a harness relatively easily, but there's not much point if PolkaVM is going to be the only one hooking into it. Is there anyone who would like to volunteer their PVM implementation? It can be written in any language (for fuzzying it should be enough that only one VM is natively fuzzable; the other can just piggyback on it), but it should be reasonably complete (all instructions implemented and working) and it (obviously) must be open source. Would anyone be interested?

As far as I can see (unless I missed one) all of the PVM implementations except PolkaVM are currently closed source, because all of the nodes are closed source? If so you'd have to open up at least your PVM implementation, but considering PolkaVM is already open source keeping your PVM implementation closed source doesn't really give you any competitive advantage, and you'll have to open it up anyway when delivering the first prize milestone.


## Comment by @xlc

we are happy to collaborate. I can spend some time next week to refactor our code to decouple our PVM implementation and move it to a open repo


## Comment by @koute

@xlc Sounds good to me; please ping me with a link when you're done.

If anybody else's interested you're also welcome - ideally the more implementations we add, we more we can cross-fuzz against each other and find discrepancies.


## Comment by @tomusdrw

Our TypeScript implementation of PVM is already published on NPM (obfuscated though). I think the reason people keep it private is not to have a competitive advantage, but rather mitigating the risk of having someone plain copy your work.
We are happy to participate to and fully open source the implementation if needed. Just curious why is being open-source a strict requirement for fuzzing though? 


## Comment by @subotic

We (jam4s) are also in and happy to participate :)
It should't be a problem to open-source our PVM implementation.


## Comment by @koute

> Just curious why is being open-source a strict requirement for fuzzing though?

If you want to do it privately then it isn't. (: But then you're on your own with integrating it with the test harness (at least until there would be a generic interface), and it also can create problems when existing interfaces need to be refactored/changed/etc., since there would be no way for whoever's doing the refactoring to run your PVM and make sure it still works with the harness.

Also having your PVM open source benefits everyone, because the more PVMs we have the more cross-fuzzying combinations we have. If I only have PolkaVM in the test harness and everyone else's PVM is private then the only thing you can check is whether your PVM matches PolkaVM's behavior, which is pointless (remember that the target here is to implement the GP, *not* to mimic whatever PolkaVM is doing, which sometimes even actively goes *against* the GP because it's used as a research vehicle to improve the GP). On the other hand, if everyone contributes their PVM and we have 31 PVMs in the test harness - now you can fuzz your PVM against 30 other PVMs, and if all 30 PVMs behave like X and you behave like Y then statistically it's almost certain that it's your PVM that's wrong (unless all 30 independent implementations implemented this particular part wrong, which in theory could happen).


## Comment by @tomusdrw

To move this discussion one step forward, I've started wondering more about the possible API for PVMs that would work with the test harness.

I imagine the options we have (that were already discussed) are:
1. stdin/stdout based protocol
2. C-compatibile binary wrappers 
3. Some RPC (potentially JSON-RPC) over HTTP/TCP/IPC, etc.

### Benefits & Drawbacks:
Ad 1.
1. Easy to implement in all languages
2. Overhead of string manipulation on the input and output side
3. Either single-run=single-process (slow) or requires developing some string-based protocol
3.1. perhaps new-line delimited commands, i.e. `(command)\n(arg1)\n(arg2)\n`, could work?
3.2. or something JSON-based?

Ad. 2.
1. Requires additional binary wrappers for non-native languages (TypeScript, Elixir, etc).
2. The fastest option that would most likely be suitable for fuzzing.
3. Existing PolkaVM API can be used as a starting point for the PVM initialization API.

Ad. 3.
1. Some form of JSON-RPC will be implemented by JAM teams anyway, so adding additional APIs would not be an issue.
2. Possibly slow - might even be slower than stdout-based for JSON-RPC over http, however some binary RPC (JAM codec?) over IPC could work well.
3. but flexible - The PVM can be running in a docker container if we use some network transports


### Possible first step

I would be willing to start off with JSON-based stdin/stdout interface, in fact we already have a shared test definition (JSON spec files) so it's just a matter of:
1. Writing a CLI app to scan for JSON test cases and use some sort of config file with a list of PVM-wrapper binaries.
2. To minimize the overhead, we could group JSON test cases and pass `X` of them together as a JSON array.
3. Each PVM-wrapper would wait for the JSON-test case array on input, run them and produce an array of outputs (can be either `expected-regs/expected-pc,etc` that would be compared by the test harness or rather `null` in case of success and some stringified error if the expectations from input JSON were not met).

I'm open to all other suggestions too.


## Comment by @koute

@tomusdrw Yeah, sounds good to me.

From the test runner's perspective I'd essentially see a `PVMInterface` trait that the test runner would use, and then for the generic stdin/stdout interface you'd have an `impl PVMInterface for StdoutInterface` or something like that, and for PolkaVM I'd want to maintain a native interface. Then if someone would want to use a generic one they could do that, or they could add a specialized one for fast differential fuzzying.

> I would be willing to start off with JSON-based stdin/stdout interface

For the generic interface over stdout using JSON sounds good to me; we don't want people to have to implement custom parsing.

> Writing a CLI app to scan for JSON test cases and use some sort of config file with a list of PVM-wrapper binaries.

Maybe it could just take a path to the binary on the command line? Having a preset built-in list makes sense to me, but only for the implementations which are publicly accessible (so then you could out-of-box type e.g. `./test-harness test polkavm` specifying the name of a given PVM, or `./test-harness test-all` to run all of them, etc., without having to manually set them up)

> I'm open to all other suggestions too.

I'd suggest we create a new repo and add everyone interested as contributors for quick prototyping/experimentation and just get something going; at a later date we can move it somewhere more appropriate (the fellowship org?)/make it "official".


## Comment by @tomusdrw

I've put together something like this:
https://github.com/FluffyLabs/pvm-test-harness

That's what the API looks like currently. I've added `step` function to the interface, while it's not strictly necessary if it was in the API we could possibly attempt to support all such PVMs in our [PVM Debugger](https://pvm.fluffylabs.dev/).

The memory stuff is not implemented yet for PolkaVM, since it diverges from it's API, however IMHO it's quite in-line with GP and JSON test vectors.

<details>
<summary>View API</summary>

```rs
pub trait PvmApi {
    fn run(&mut self) -> Result<Status>;

    // TODO [ToDr] Just to show what the API could look like for the PVM Debugger.
    fn step(&mut self) -> Result<Status>;

    fn gas(&self) -> i64;
    fn set_gas(&mut self, gas: i64);

    fn registers(&self) -> [u64; NUMBER_OF_REGISTERS];
    fn set_registers(&mut self, registers: &[u64; NUMBER_OF_REGISTERS]);

    fn program_counter(&self) -> Option<u32>;
    fn set_next_program_counter(&mut self, pc: u32);

    fn set_program(&mut self, code: &[u8], container: ProgramContainer) -> Result<()>;

    fn set_page(&mut self, page: u32, access: MemoryAccess);
    fn read_memory(&self, address: u32, out: &mut [u8]) -> Result<()>;
    fn write_memory(&mut self, address: u32, data: &[u8]) -> Result<()>;
}
```
</details>

I've tested running some test vectors on `polkavm` and `ananas` ([AssemblyScript PVM](https://github.com/tomusdrw/anan-as/pull/22)) and it works just fine.

```
$ RUST_LOG=debug \
  cargo run -- \
  json ../jamtestvectors/pvm/programs/inst_add.json polkavm stdin=../anan-as/bin/stdin.sh

[2025-01-06T19:24:16Z DEBUG pvm_test_harness::api::polkavm] [polkavm] executing: PolkaVm { initial: InitialState { registers: [0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0], gas: 10000, pc: 0, program: [0, 0, 3, 170, 135, 9, 1], container: Some(Generic) }, output: OutputState { registers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], gas: 0, pc: None } }
[2025-01-06T19:24:16Z DEBUG polkavm::api] Selected backend: 'interpreter'
[2025-01-06T19:24:16Z DEBUG polkavm::api] Backend used: 'interpreted'
[2025-01-06T19:24:16Z DEBUG polkavm::api]   Memory map: RO data: 0x00010000..0x00010000 (0/0 bytes, non-zero until 0x00010000)
[2025-01-06T19:24:16Z DEBUG polkavm::api]   Memory map: RW data: 0x00020000..0x00020000 (0/0 bytes, non-zero until 0x00020000)
[2025-01-06T19:24:16Z DEBUG polkavm::api]   Memory map:   Stack: 0xfffe0000..0xfffe0000 (0/0 bytes)
[2025-01-06T19:24:16Z DEBUG polkavm::api]   Memory map:     Aux: 0xffff0000..0xffff0000 (0/0 bytes requested)
[2025-01-06T19:24:16Z DEBUG polkavm::interpreter] Compiling block:
[2025-01-06T19:24:16Z DEBUG polkavm::interpreter]   [2]: 0: charge_gas
[2025-01-06T19:24:16Z DEBUG polkavm::interpreter]   [3]: 0: i32 a2 = a0 + a1
[2025-01-06T19:24:16Z DEBUG polkavm::interpreter]   [4]: 3: invalid
[2025-01-06T19:24:16Z DEBUG polkavm::interpreter] Starting execution at: 0 [2]
[2025-01-06T19:24:16Z DEBUG polkavm::interpreter::raw_handlers] Trap at 3: explicit trap
[2025-01-06T19:24:16Z DEBUG polkavm::api]   At #3:
[2025-01-06T19:24:16Z DEBUG polkavm::api]     (no location available)
[2025-01-06T19:24:16Z DEBUG pvm_test_harness::api::polkavm] [polkavm] Complete with status trap: OutputState { registers: [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0], gas: 9998, pc: Some(3) }
[2025-01-06T19:24:16Z DEBUG pvm_test_harness::api::stdin] [stdin] Executing: TestcaseJson { name: "", initial_regs: [0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0], initial_pc: 0, initial_page_map: [], initial_memory: [], initial_gas: 10000, program: [0, 0, 3, 170, 135, 9, 1], expected_status: "", expected_regs: [], expected_pc: 0, expected_memory: [], expected_gas: 0 }
awaiting input
[2025-01-06T19:24:16Z DEBUG pvm_test_harness::api::stdin] [stdin] Complete with status trap: OutputState { registers: [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0], gas: 9998, pc: Some(3) }
inst_add executed
```



## Comment by @clearloop

Hi there, we just introduced a simple general test runner [spacejam-network/specjam](https://github.com/spacejam-network/specjam), which accepts binary interface like below:

```
USAGE:
  <binary> [OPTIONS]

OPTIONS:
  --section <section> the name of the section
  --name <name> the name of the test
  --input <input> The file path of the input JSON
```
