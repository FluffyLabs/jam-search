---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/128'
title: Jam4s
site: github.com/davxy/jam-conformance
created_at: '2025-12-12T04:07:43.000Z'
last_modified: '2025-12-12T04:07:43.000Z'
---

# Jam4s

## Issue by @tommyldev

Hey @davxy 
I've created a pull request (https://github.com/davxy/jam-conformance/pull/127) for jam4s.

**Supported platforms:** Linux x86_64
**GP version:** v0.7.2
**Chain spec:** tiny

Latest release can be found on:  https://hub.docker.com/repository/docker/jamforscala/jam4s/tags/amd64/sha256-1172667e91376426bc959380e9e9ac3d4b1e9e6ec301f3df7a796adcca0dc67b

Usage: 
```
docker run -v /tmp/:/tmp/ -e CONFIG_FILE=app/config/node-dev.conf jamforscala/jam4s:amd64 --fuzz --seed 0 --socket /tmp/jam_target.sock 
```




## Comment by @davxy

@basedafdev I'm not able to pull the image

```
❯ ./fuzz-workflow.py -t jam4s --skip-run
Building polkajam-fuzz binary
    Finished `release` profile [optimized + debuginfo] target(s) in 0.19s
Getting GP version from polkajam-fuzz
Detected GP version from polkajam-fuzz: 0.7.2
Setting JAM spec: tiny
['jam4s']
* Downloading target: jam4s
Downloading jam4s for linux...
Pulling Docker image: jamforscala/jam4s:amd64
Error response from daemon: pull access denied for jamforscala/jam4s, repository does not exist or may require 'docker login': denied: requested access to the resource is denied
Error: Failed to pull Docker image jamforscala/jam4s:amd64
```


## Comment by @tommyldev

@davxy my apologies, should have access now 👍 


## Comment by @davxy

@basedafdev I am able to fuzz your target; however, block processing is extremely slow. I noticed that it produces a large number of DEBUG logs. Is there a way to disable unnecessary logging via an environment variable or a CLI argument?



## Comment by @tommyldev

@davxy acknowledged will include in next target build


## Comment by @tommyldev

Hey @davxy when can we expected an updated 0.7.2 mini-fuzz https://github.com/davxy/jam-conformance/issues/111 ?


## Comment by @davxy

> Hey [@davxy](https://github.com/davxy) when can we expected an updated 0.7.2 mini-fuzz [#111](https://github.com/davxy/jam-conformance/issues/111) ?

https://github.com/davxy/jam-conformance/pull/149 WiP


## Comment by @davxy

Minifuzz for 0.7.2 is now available. I suggest you to run it first against your target:

```
./minifuzz.py --trace-dir ../examples/0.7.2/no_forks
```
and then
```
./minifuzz.py --trace-dir ../examples/0.7.2/forks
```


## Comment by @davxy

@basedafdev I am currently unable to run the perf benchmarks against your target because the inputs are not being processed correctly. I expect that running the minifuzz should resolve most of these issues.



## Comment by @tommyldev

@davxy, thank you! Will address today 👍 


## Comment by @tommyldev

Should be resolved https://github.com/davxy/jam-conformance/pull/155


## Comment by @davxy

@basedafdev I get this on startup:

```
org.rocksdb.RocksDBException: While open a file for appending: /app/jam/rocksdb-data/LOG: Permission denied
        at org.rocksdb.RocksDB.open(Native Method)
        at org.rocksdb.RocksDB.open(RocksDB.java:263)
        at org.jam4s.storage.rocksdb$.resource(rocksdb.scala:13)
        at org.jam4s.node.resources.MkRocksdb$.apply$$anonfun$2(MkRocksdb.scala:13)
        at delay @ org.jam4s.node.resources.MkRocksdb$.apply(MkRocksdb.scala:14)
        at main$ @ org.jam4s.node.Main$.main(Main.scala:3)
        at main$ @ org.jam4s.node.Main$.main(Main.scala:3)
        at uncancelable @ fs2.Pull$.acquireCancelable(Pull.scala:423)
        at flatMap @ fs2.Compiler$Target.flatMap(Compiler.scala:163)
        at handleErrorWith @ fs2.Compiler$Target.handleErrorWith(Compiler.scala:161)
        at flatMap @ fs2.Compiler$Target.flatMap(Compiler.scala:163)
        at uncancelable @ fs2.Compiler$Target.uncancelable(Compiler.scala:165)
        at unique @ fs2.Compiler$Target$ConcurrentTarget.unique(Compiler.scala:194)
        at flatMap @ fs2.Compiler$Target.flatMap(Compiler.scala:163)
        at ref @ fs2.Compiler$Target$ConcurrentTarget.ref(Compiler.scala:195)
        at flatMap @ fs2.Compiler$Target.flatMap(Compiler.scala:163)
        at flatMap @ fs2.Compiler$Target.flatMap(Compiler.scala:163)
        at flatMap @ fs2.Compiler$Target.flatMap(Compiler.scala:163)
        at handleErrorWith @ fs2.Compiler$Target.handleErrorWith(Compiler.scala:161)
        at flatMap @ fs2.Compiler$Target.flatMap(Compiler.scala:163)
Target process exited with status: 1
Cleaning up Docker container jam4s-cd0and...
```

Please try to run your target first via our tooling:

In the scripts folder try:

```
./target.py get jam4s
./target.py run jam4s 
```


## Comment by @tommyldev

@davxy I was able to test our image using the script your provided and successfully run through fuzz-proto in https://github.com/davxy/jam-conformance/pull/156/


## Comment by @tommyldev

Hey @davxy thanks for updating our summaries, happy to be passing all the test cases :). Could you also re-run the performance benchmarks as well? Would be super helpful


## Comment by @tommyldev

Hi @davxy, for the last round of reports, are you only testing teams with failing test cases, or are you also testing for regression?


## Comment by @davxy

> Hi @davxy, for the last round of reports, are you only testing teams with failing test cases, or are you also testing for regression?

I usually re-run everything for everyone


## Comment by @tommyldev

@davxy perfect, thank you!
