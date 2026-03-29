---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/63'
title: Tessera
site: github.com/davxy/jam-conformance
created_at: '2025-09-05T16:00:31.000Z'
last_modified: '2025-09-05T16:00:31.000Z'
---

# Tessera

## Issue by @prasad-kumkar

Hello,

I am sharing Tessera’s latest release of node binary here:

https://github.com/Chainscore/tessera-releases

It is synced to Graypaper version 0.7.0.

To run as a fuzzer target, please use the following command:

```bash
./tessera-node —fuzzer —socket /tmp/jam_conformance.sock
```


## Comment by @davxy

Hi, I get this error at startup:

```
❯ ./target.sh run tessera
Effective OS: linux
Action: run, Target: tessera, OS: linux
Running tessera on docker image debian:stable-slim (command ./tessera-node )
Waiting for target termination (pid=544711)
[sudo] password for davxy:
WARNING: Your kernel does not support OomKillDisable. OomKillDisable discarded.
[alice_____] 2025-09-05|17:11:07 [WARNING] ⚠ Make sure to check which log modules you want to see!





                                 .......
                                ...:::.....
                               ..:......::...                      :-.
                       .......   ..::......:.  ..    :.           -#-
                     ........:::-=-.......... ....   :*.        .==+.
                    ...::--====-::.  .-.....   ...:. :*+.      :+::+
                 ..:-===#*-::...     -%=       .-==. :=:+.   .-=. =-
          ..::-===---::.++....:.    :+-+     .-==:.:.-= :*. .+-  .+.
        .=+==-:..  .....-#:.::..   .+. +:  .-=-. .::.=-  -*:+:   .+
         ..        ...::.*-...     =-  :+:==:.   ....+:   -*:    :=
                     ....=+.      :+. .:**.        ..*.    .     =-
                         .*.     .+..-=-.+:        .:+           +:
                    ......*-     ==-=-.  :*.      ..+=          .+.
                   ..::::.-*... :%+-.     :+.   ..:.*:          .=
                   .:......*=...-*.        :.   .::.-.          :=
                   .:....:-+#:.. .             .::..            :=
                    .:-=+==::.:...            ..:..             :-
                 .:-===-:....:..   .......... ....              ::
             .:-===:.   ....... ....::::::::.                   ::
          .-===-..              .::::::::....                   ::
      .:-==-:.                  ..........                      ..
  ..-==-:.                        ...                           ..
.-==-.                                                           .
...



❌ Fatal error: Couldn't load RocksDB library. Tried:
Failed to load /tmp/_MEImxTTDi/lib/librocksdb.so: cannot load library '/tmp/_MEImxTTDi/lib/librocksdb.so': /tmp/_MEImxTTDi/lib/librocksdb.so: cannot open shared object file: No such file or directory.  Additionally, ctypes.util.find_library() did not manage to locate a library called '/tmp/_MEImxTTDi/lib/librocksdb.so'
Failed to load librocksdb.so: cannot load library 'librocksdb.so': librocksdb.so: cannot open shared object file: No such file or directory.  Additionally, ctypes.util.find_library() did not manage to locate a library called 'librocksdb.so'
Failed to load /usr/lib/librocksdb.so: cannot load library '/usr/lib/librocksdb.so': /usr/lib/librocksdb.so: cannot open shared object file: No such file ordirectory.  Additionally, ctypes.util.find_library() did not manage to locate a library called '/usr/lib/librocksdb.so'
Failed to load /usr/lib64/librocksdb.so: cannot load library '/usr/lib64/librocksdb.so': /usr/lib64/librocksdb.so: cannot open shared object file: No such file or directory.  Additionally, ctypes.util.find_library() did not manage to locate a library called '/usr/lib64/librocksdb.so'
Failed to load /usr/lib/x86_64-linux-gnu/librocksdb.so: cannot load library '/usr/lib/x86_64-linux-gnu/librocksdb.so': /usr/lib/x86_64-linux-gnu/librocksdb.so: cannot open shared object file: No such file or directory.  Additionally, ctypes.util.find_library() did not manage to locate a library called '/usr/lib/x86_64-linux-gnu/librocksdb.so'
Failed to load /usr/local/lib/librocksdb.so: cannot load library '/usr/local/lib/librocksdb.so': /usr/local/lib/librocksdb.so: cannot open shared object file: No such file or directory.  Additionally, ctypes.util.find_library() did not manage to locate a library called '/usr/local/lib/librocksdb.so'
Failed to load /usr/local/lib64/librocksdb.so: cannot load library '/usr/local/lib64/librocksdb.so': /usr/local/lib64/librocksdb.so: cannot open shared object file: No such file or directory.  Additionally, ctypes.util.find_library() did not manage to locate a library called '/usr/local/lib64/librocksdb.so'
Install RocksDB on Debian/Ubuntu with: sudo apt-get install librocksdb-dev
```

I understand that this is about installing librocksdb-dev. But I'm running the targets in a plain debian container.
Is possible to statically link?


## Comment by @prasad-kumkar

Thanks for reporting this @davxy! We’ve now bundled RocksDB directly into the binary in our latest release.

Please try using this version:
👉 https://github.com/Chainscore/tessera-releases/releases/tag/v0.7.0.2

Let us know if you still face any issues.


## Comment by @davxy

Is there a way to reduce logging? 1756548459 produces a times out


## Comment by @davxy

Also, I'm not able to produce the performance report as `jam-test-vectors` safrole trace are not successfully imported.
Is this a known issue?


## Comment by @prasad-kumkar

Ah I see the safrole trace was failing block validation. Here's our latest release with relevent fix and have tested all other traces - https://github.com/Chainscore/tessera-releases/releases 

For logging, please set JAM_LOG_LEVEL=critical to reduce logs

I have also tested minifuzz to be working on the latest release

Thank you


## Comment by @davxy

My scripts are creating sessions consecutively - for example, session `1756548459` followed immediately by `1756548583`, without stopping or restarting your target in between.

I’ve noticed that your target works if I restart it between each session, but fails when the fuzzer simply close the socket and reopen it to start a new session.

> **Note:** By "SESSION" I mean: open the socket, exchange `PeerInfo`, send `SetState`, etc.





## Comment by @prasad-kumkar

Got it, just pushed another release handling continuous sessions [0.7.0.5](https://github.com/Chainscore/tessera-releases/releases/tag/v0.7.0.5)


## Comment by @davxy

I had to insert a `sleep 1` between each session. 
Otherwise your target terminates with the following error after a 5 or 4 sessions

```
❌ Fuzzer target error: RocksDB error: IO error: lock hold by current process, acquire time 1758213965 acquiring thread 140094275186816:data/tmp/8/175821396540001/main/LOCK: No locks available
Traceback (most recent call last):
  File "cli.py", line 154, in <module>
  File "cli.py", line 103, in main
  File "asyncio/runners.py", line 195, in run
  File "asyncio/runners.py", line 118, in run
  File "asyncio/base_events.py", line 691, in run_until_complete
  File "jam/fuzzer/target.py", line 182, in run_fuzzer_target
  File "jam/fuzzer/target.py", line 62, in run_fuzzer_target_loop
  File "jam/settings.py", line 203, in setup_setting
  File "jam/settings.py", line 78, in __init__
  File "rockstore/store.py", line 73, in __init__
  File "rockstore/store.py", line 276, in _check_error
RuntimeError: RocksDB error: IO error: lock hold by current process, acquire time 1758213965 acquiring thread 140094275186816: data/tmp/8/175821396540001/main/LOCK: No locks available
[PYI-8:ERROR] Failed to execute script 'cli' due to unhandled exception!
```





## Comment by @prasad-kumkar

@davxy we have added a fix for it and traces in the latest release


## Comment by @davxy

@prasad-kumkar Hi. I see your target failing for almost all the 0.7.0 traces with this error :

```
❌ Initialize failed: b'\x08\x91\x15\x1b1c\x14\xc9Z]\x13\xe2\x1di]H\x1aO\xcdQ\xeaL\x94 _\xfa\xd0W\x9c\xb1\xa1K'
```

This is for trace **1756548459**. Similar errors occur with other traces as well (only the printed string differs).  
I don't have any additional information to report - this is the only error visible on your side.



## Comment by @harsh-csl

Hey @davxy 

Can you please retest our latest release for GP v0.7.2.
[Release: V0.7.2](https://github.com/Chainscore/tessera-releases/releases/tag/v0.7.2.0)



## Comment by @davxy

@harsh-csl I get a lot of failures similar to this one

Fuzzer log for trace 1766241814

```
...
2026-01-13 11:41:36 [T] [s=0] fuzz::remote  TX (len = 1528306): Initialize { header_hash: 0xd178386694fd3c7f..., key_count: 99, ancestry_len: 0 }
2026-01-13 11:41:37 [T] [s=0] fuzz::remote  RX (len=81): Error: { msg: Initialize failed: pre-final must be direct parent of the block being finalized }
Error: Remote communication error: Unexpected response
```

Tessera log for the same trace:

```
...
❌ Initialize failed: pre-final must be direct parent of the block being finalized
```

---

Please try your implementation with minifuzz first:

```
./minifuzz.py --trace-dir ../examples/0.7.2/no_forks
```

This is minifuzz output when run for your target:

```
...
Processing pair 12: 00000011_fuzzer_import_block.bin <-> 00000011_target_state_root.bin
TX: import_block
RX: state_root
Unexpected target response
--------------------------
Expected:
{
    "state_root": "0xe91fa057a3949d634fec600b308fa862eb1430767073035c99dcbbc5c028c319"
}
---
Returned:
{
    "state_root": "0x94db3cbb4ff0fe7824d3fa2ee83fd9283068bed2ab96576b76a07cf6b76f9f80"
}
```


## Comment by @harsh-csl

Hi @davxy ,

are there traces available for minifuzz ?


## Comment by @davxy

you can easily see the traces by running:
```
./minifuzz.py --trace-dir ../examples/0.7.2/no_forks
```


## Comment by @harsh-csl

That just shows root diff, no specific reason. Can't we see post_state? Fuzzer doesn't explicitly share required post_state for the same. 



## Comment by @harsh-csl

Got it. Worked with other targets to resolve the issue. 


## Comment by @harsh-csl

Hi @davxy ,

We pushed some fixes, we now locally pass new year batch as well. Please give it a try. Also we fixed minifuzz failures. And now we have tested both forks and no_forks examples. 

Do let us know if any issue still persists.

Latest release: https://github.com/Chainscore/tessera-releases/releases


## Comment by @harsh-csl

Hi @davxy , 

Please try our v0.7.2.2 release.  

Latest release: [https://github.com/Chainscore/tessera-releases/releases](https://github.com/Chainscore/tessera-releases/releases)


## Comment by @harsh-csl

Hi @davxy,

Any updates??


## Comment by @harsh-csl

Hi @davxy ,

Can you share updates on our latest release?


## Comment by @davxy

I re-run your target for the traces we have in this repo
https://github.com/davxy/jam-conformance/commit/f39c1ac85b50e36b7eae47ab82ac181a11b189bb
