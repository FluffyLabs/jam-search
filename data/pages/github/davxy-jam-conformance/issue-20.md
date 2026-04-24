---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/20'
title: PyJAMaz
site: github.com/davxy/jam-conformance
created_at: '2025-08-19T11:54:31.000Z'
last_modified: '2025-08-19T11:54:31.000Z'
content_kind: issue
---

# PyJAMaz

## Issue by @arjanz

Hi @davxy,

We made a conformance release repository to add PyJAMaz as fuzzer target, installation instructions are included: https://github.com/JAMdotTech/pyjamaz-conformance-releases

Thanks!


## Comment by @davxy

@arjanz Could you please provide a binary to run? I would prefer not to deal with installations. I noticed that other Python teams have managed to do this. Thanks!


## Comment by @arjanz

> Could you please provide a binary to run? I would prefer not to deal with installations. I noticed that other Python teams have managed to do this. Thanks!

Sure I will have to look into that. Also I noticed several existing disputed reports are failing, so I will get back to you when this is resolved as well. 


## Comment by @arjanz

Hi @davxy, we have resolved all disputed reports and added binaries: https://github.com/JAMdotTech/pyjamaz-conformance-releases


## Comment by @davxy

Hey @arjanz, I think there’s an issue with the fuzzer protocol.

If I start it and I feed it a trace `X`, then the target will only accept that specific trace.  Even if I disconnect and reconnect the fuzzer to start a new session.
To run a different trace `Y`, I need to stop and restart the target.  
If I don't restart the target then, after sending a `SetState` message, it returns the wrong state root.

Additionally, each time I start the target (even right after a fresh download), I get this prompt:

```
❯ ./pyjamaz fuzzer target --socket-path /tmp/jam_target.sock
Database already exists at '/tmp/_MEIv9RzTd/pyjamaz/data/db', delete? [y/N]:
```

Since I usually run this in scripts, is there a way to disable that prompt?



## Comment by @arjanz

> If I don't restart the target then, after sending a `SetState` message, it returns the wrong state root.

That is strange, it should be able to process additional `SetState` messages. I will look into that.


> Since I usually run this in scripts, is there a way to disable that prompt?

Yes with `--force-overwrite` flag : `./pyjamaz fuzzer target --socket-path /tmp/jam_target.sock --force-overwrite`


## Comment by @davxy

> That is strange, it should be able to process additional SetState messages. I will look into that.

ok ping me when is sorted


## Comment by @arjanz

> ok ping me when is sorted

@davxy Issue resolved, the state DB was not entirely wiped when calling `SetState`, please try again..


## Comment by @arjanz

PyJAMaz binaries for GP-0.7.0: https://github.com/JAMdotTech/pyjamaz-conformance-releases/tree/main/gp-0.7.0


## Comment by @arjanz

Opened https://github.com/davxy/jam-conformance/pull/53 to use Docker; the latest Docker image also contains fixes for all known disputed reports


## Comment by @davxy

```
❯ ./target.sh run pyjamaz
Action: run, Target: pyjamaz, OS: linux
Run pyjamaz via Docker
Traceback (most recent call last):
  File "./pyjamaz/cli.py", line 805, in <module>
  File "/usr/local/lib/python3.12/site-packages/asyncclick/core.py", line 1515, in __call__
    return anyio.run(self._main, main, args, kwargs, backend=_anyio_backend)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.12/site-packages/anyio/_core/_eventloop.py", line 74, in run
    return async_backend.run(func, args, {}, backend_options)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.12/site-packages/anyio/_backends/_asyncio.py", line 2316, in run
    return runner.run(wrapper())
           ^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.12/asyncio/runners.py", line 118, in run
    return self._loop.run_until_complete(task)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.12/asyncio/base_events.py", line 691, in run_until_complete
    return future.result()
           ^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.12/site-packages/anyio/_backends/_asyncio.py", line 2304, in wrapper
    return await func(*args)
           ^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.12/site-packages/asyncclick/core.py", line 1526, in _main
    return await main(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.12/site-packages/asyncclick/core.py", line 1425, in main
    rv = await self.invoke(ctx)
         ^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.12/site-packages/asyncclick/core.py", line 1890, in invoke
    return await _process_result(await sub_ctx.command.invoke(sub_ctx))
                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.12/site-packages/asyncclick/core.py", line 1890, in invoke
    return await _process_result(await sub_ctx.command.invoke(sub_ctx))
                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.12/site-packages/asyncclick/core.py", line 1288, in invoke
    return await ctx.invoke(self.callback, **ctx.params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.12/site-packages/asyncclick/core.py", line 855, in invoke
    rv = await rv
         ^^^^^^^^
  File "./pyjamaz/cli.py", line 730, in fuzzer_target
  File "<frozen os>", line 225, in makedirs
PermissionError: [Errno 13] Permission denied: '/app/pyjamaz/data/db'
```


## Comment by @arjanz

Hm I guess Docker is running as a different user..  This should fix it:

`TARGETS[pyjamaz.cmd]="fuzzer target --db-path=/tmp/pyjamaz_fuzzer_db  --socket-path $DEFAULT_SOCK"`


## Comment by @arjanz

@davxy Latest Docker image should resolve remaining disputed traces  in overview, could you please confirm? 


## Comment by @arjanz

Pushed new Docker image with some optimisations


## Comment by @arjanz

Hi @davxy we just pushed our latest Docker image where remaining disputed traces are resolved


## Comment by @arjanz

Hi @davxy just a ping to let you know we have pushed a new Docker image with our new optimised PVM code, really curious how it will perform :)


## Comment by @arjanz

Hi @davxy, latest Docker image resolves alle remaining disputed traces..


## Comment by @arjanz

Hi @davxy, our latest release implements Fuzzer V1


## Comment by @arjanz

The latest release passes all mini-fuzzer `no_forks` and `faulty` examples


## Comment by @arjanz

Latest release enables `forks`, mini-fuzzer tests are passing. We actually support forking of any imported block, not only from parent of last imported block, in case you have tests for that.


## Comment by @davxy

I see that your target works correctly with minifuzz.

However it fails with the actual traces. Looks like you always terminate like this upon receiving the `Initialize` message:


```log

❯ ./target.py run pyjamaz
Action: run, Target: pyjamaz, OS: linux
Running pyjamaz on docker image jamdottech/pyjamaz:latest (command fuzzer target --db-path=/tmp/pyjamaz_fuzzer_db --socket-path=/tmp/jam_target.sock)
Waiting for target termination (pid=144656)
2025-09-18 17:08:05.313  🥋 PyJAMaz JAM v0.1.14 [Fuzzer target v1]
2025-09-18 17:08:05.313  🌐 Listening on /tmp/jam_target.sock
2025-09-18 17:08:05.313  🧾 Graypaper version: 0.7.0
2025-09-18 17:08:09.209  [fuzzer] Accepted connection from
2025-09-18 17:08:09.210  [fuzzer] Handshake complete with fuzzer (v0.1.25)
2025-09-18 17:08:09.223 ⚠ [fuzzer] Handler error for FuzzerMessage(peer_info=None, initialize=InitializeMessage(header=Header(parent=b'\x15y\xd7gZ\x01\xa5-=\xa2\xd0\xba\x0b9j\x0f6<\xd3\xdb\xd0\x06\xff\x90\xf3\xb7k\x9d\xfc\x8eLr', parent_state_root=b':\xfa;\x90\xeb\xe8\x17\x9f\xde\x8c\xb8]\x0c\xb2q%R2\x94\xa3\xe1\x8e\x15+\x0f\xb0\xd1\xaa}g\xfc\xde', extrinsic_hash=b'\x1e\xd4\x06\x08\x9fV#\x98K\t\x83+\x08\x9f\x02\xf0Wzxq=\x9e\x8c-\xf3\x8a\x1e\xc8\xd8,I2', timeslot=41, epoch_marker=None, tickets_marker=None, author_index=0, entropy_source=bytearray(b'\xa0\xcc\xa4<\x8dxYc\xc6\xedG\xa9\xf4\x0cA\xb5\xd9\xd0j.\xcc\x1a\xbd\x85\xb1\xed\x19~*\xe0e\xc5\xf1\x10\x88\xed\xa6\x96\x0end\xbc
.... <A LOT OF DATA...>
\xae11\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x07\x00\x00\x00\x06\x00\x00\x00'\x00\x00\x00\x00\x00\x00\x00"), (bytearray(b'\xff\xfa\x00\xa6\x00\xdb\x00k\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'), b"\xc6n'E\x96kN\x128\t\xc8C\xf0F\x13\x94\xce\x8c\x00\xdf}\xb6\xe1gaFv\xa5i\xfa\xe4\xc6\xb0\xab\x01\x00\x00\x00\x00\x00\x10'\x00\x00\x00\x00\x00\x00\x10'\x00\x00\x00\x00\x00\x00h2\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x08\x00\x00\x00\x04\x00\x00\x00&\x00\x00\x00\x00\x00\x00\x00")], ancestry=[]), state_root=None, import_block=None, get_state=None, state=None, error=None): Invalid parent hash 0x1579d767...fc8e4c72
2025-09-18 17:08:09.232  [fuzzer] Session finished
```


## Comment by @arjanz

I assumed that the parent of the provided header during initialisation would either match an entry in the provided ancestry or equals `0x0000..0000` (`H_0`). So we should accept a header with an arbitrary parent not present in the ancestry list?


## Comment by @davxy

Yeah, in some sense this is similar to warp sync. I.e. init your node from some trusted point after genesis


## Comment by @arjanz

Ok the new release should accept an arbitrary parent during initialisation


## Comment by @arjanz

Hi @davxy, lastest release processed the first batch of disputed reports


## Comment by @arjanz

Another release to resolve pending disputed reports except `1758708840` which seem to have an empty post_state 


## Comment by @emielsebastiaan

Hi @davxy, we made a release for 0.7.1. 


## Comment by @emielsebastiaan

@davxy, we made a new release for 0.7.1 with several improvements.


## Comment by @emielsebastiaan

@davxy, we made a new release for 0.7.1 with several improvements (PyJAMaz v0.1.24).


## Comment by @emielsebastiaan

@davxy, new release for 0.7.1 with improvements (PyJAMaz v0.1.25).


## Comment by @davxy

@emielsebastiaan 

```
❯ ./target.py run pyjamaz
Action: run, Target: pyjamaz, OS: linux
Running pyjamaz on docker image jamdottech/pyjamaz:latest (command fuzzer target --db-path=/tmp/pyjamaz_fuzzer_db --socket-path=/tmp/jam_target.sock)
Waiting for target termination (pid=88524)
Traceback (most recent call last):
  File "./pyjamaz/cli.py", line 22, in <module>
  File "./pyjamaz/app.py", line 20, in <module>
  File "./pyjamaz/extrinsic.py", line 9, in <module>
  File "./pyjamaz/models/block.py", line 13, in <module>
  File "./pyjamaz/models/common.py", line 16, in <module>
  File "./pyjamaz/pvm/__init__.py", line 22, in <module>
  File "./pyjamaz/pvm/interpreters/numba/defs.py", line 36, in <module>
  File "/usr/local/lib/python3.13/site-packages/numba/core/decorators.py", line 225, in wrapper
    disp.enable_caching()
    ~~~~~~~~~~~~~~~~~~~^^
  File "/usr/local/lib/python3.13/site-packages/numba/core/dispatcher.py", line 807, in enable_caching
    self._cache = FunctionCache(self.py_func)
                  ~~~~~~~~~~~~~^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.13/site-packages/numba/core/caching.py", line 647, in __init__
    self._impl = self._impl_class(py_func)
                 ~~~~~~~~~~~~~~~~^^^^^^^^^
  File "/usr/local/lib/python3.13/site-packages/numba/core/caching.py", line 383, in __init__
    raise RuntimeError("cannot cache function %r: no locator available "
                       "for file %r" % (qualname, source_path))
RuntimeError: cannot cache function 'umul64wide_jit': no locator available for file './pyjamaz/pvm/interpreters/numba/defs.py'
```


## Comment by @emielsebastiaan

Found the issue, building a new release incoming in a few minutes.


## Comment by @emielsebastiaan

@davxy, new release for 0.7.1 fixing the issue you mentioned (PyJAMaz v0.1.26).
Some assumptions we had about your environment we false. This had impact on our AOT compiler.


## Comment by @davxy

I still getting the same error. I'm running this image id: `505a31c75714...`



## Comment by @emielsebastiaan

Yeah that looks like the same image-id: 505a31c75714.
We'll look into it.



## Comment by @emielsebastiaan

@davxy, new release for 0.7.1 PyJAMaz v0.1.27. (IMAGE ID: 952e9a93d621)
We switched back to our JIT Compiled version of the PVM Interpreter. 
Caveat: initiation of the fuzzer target takes a few seconds longer and then it should run fast.


## Comment by @davxy

At least the error is slightly different now :-D 

You can reproduce it yourself by running your target with our `target.py` script - it triggers immediately


```log
❯ ./target.py run pyjamaz
Action: run, Target: pyjamaz, OS: linux
Running pyjamaz on docker image
Command: fuzzer target --db-path=/tmp/pyjamaz_fuzzer_db --socket-path=/tmp/jam_target.sock
Image: jamdottech/pyjamaz:latest
Image ID: 952e9a93d621
Created: 2025-10-27T10:19:06.318510942Z
Waiting for target termination (pid=535451)
Traceback (most recent call last):
  File "./pyjamaz/cli.py", line 22, in <module>
  File "./pyjamaz/app.py", line 20, in <module>
  File "./pyjamaz/extrinsic.py", line 9, in <module>
  File "./pyjamaz/models/block.py", line 13, in <module>
  File "./pyjamaz/models/common.py", line 16, in <module>
  File "./pyjamaz/pvm/__init__.py", line 12, in <module>
  File "/app/pyjamaz/pvm/interpreters/numba/defs.py", line 36, in <module>
    @njit(types.UniTuple(uint64, 2)(uint64, uint64), cache=NUMBA_CACHE)
     ~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.13/site-packages/numba/core/decorators.py", line 225, in wrapper
    disp.enable_caching()
    ~~~~~~~~~~~~~~~~~~~^^
  File "/usr/local/lib/python3.13/site-packages/numba/core/dispatcher.py", line 807, in enable_caching
    self._cache = FunctionCache(self.py_func)
                  ~~~~~~~~~~~~~^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.13/site-packages/numba/core/caching.py", line 647, in __init__
    self._impl = self._impl_class(py_func)
                 ~~~~~~~~~~~~~~~~^^^^^^^^^
  File "/usr/local/lib/python3.13/site-packages/numba/core/caching.py", line 383, in __init__
    raise RuntimeError("cannot cache function %r: no locator available "
                       "for file %r" % (qualname, source_path))
RuntimeError: cannot cache function 'umul64wide_jit': no locator available for file '/app/pyjamaz/pvm/interpreters/numba/defs.py'
Target process exited with status: 1
Cleaning up Docker container pyjamaz...
```


## Comment by @emielsebastiaan

Thanks for your patience. We'll get back to you later. 


## Comment by @emielsebastiaan

@davxy, new release for 0.7.1 PyJAMaz v0.1.29.
We have identified the issue for things not running well on your benchmark/tracer setup.
It is a docker user rights issue for the cache directory.
Please give it one more go. Fingers crossed. thx


## Comment by @emielsebastiaan

@davxy, new release for 0.7.1 PyJAMaz v0.1.31.
This version passes all traces and has resolved all known reports/disputes.


## Comment by @arjanz

Hi @davxy, we just released PyJAMaz v0.1.34 which passes latest reports/disputes


## Comment by @arjanz

Hi @davxy, we just released PyJAMaz v0.1.36 which passes all 0.7.1 traces. (Still building Docker images, will be available in about 15 minutes) 


## Comment by @arjanz

Hi @davxy , our latest release v0.1.37 passes 0.7.2 test vectors and fuzzy traces. If needed, our GP-0.7.1 version is still available under tag [v0.1.36-gp0.7.1](https://hub.docker.com/layers/jamdottech/pyjamaz/v0.1.36-gp0.7.1/images/sha256-a2fea5165e6fa0483fb54164c7308407ab008cdc29323f282d06421709819dda)


## Comment by @arjanz

Hi @davxy, we processed the latest round of today. Happy holidays!


## Comment by @arjanz

Hi @davxy, our latest release contains fixes for the new year batch
