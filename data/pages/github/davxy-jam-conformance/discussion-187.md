---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/187'
title: Standardizing Target Packaging and Entry Points (Docker-based Submission)
site: github.com/davxy/jam-conformance
created_at: '2026-04-27T14:52:31.000Z'
last_modified: '2026-04-27T14:52:31.000Z'
content_kind: discussion
---

# Standardizing Target Packaging and Entry Points (Docker-based Submission)

## Discussion by @davxy

As a follow-up to the recent announcement, this discussion is intended to align on upcoming changes to how targets are submitted and executed in the upcoming self-service web-app.

### Docker-based packaging

All targets are expected to be distributed as Docker images. This formalizes what is already happening implicitly: 
- For teams already using Docker, no huge changes are required. 
- For those providing plain binaries, the migration should be minimal. Your binaries are currently executed inside a minimal Debian [stable-slim](https://hub.docker.com/_/debian?xk=ShowRecommendedBadge&xt=Enabled) container.  I imagine you mostly need to extend the base image to include your binary.

### Standardized entry point

In addition to packaging, we want to introduce a consistent interface for invoking targets. 

The proposal is to define a small set of standardized options that each target must support. 
An already identified one is:
* `spec=full` or `spec=tiny`: run the target with full or reduced parameters. How this is implemented internally is up to you. You may use separate binaries or a single binary with CLI flags; the only requirement is that the container's entry point exposes a consistent interface.
* `sock=/tmp/foo` unix sock path (to be mapped in the host for communication)
* Anything else?



## Comment by @davxy

I added a couple of tags here https://github.com/davxy/jam-conformance/issues
- `docker`: docker-based packaging
- `std-entry`: supports standard args (not yet defined)


## Comment by @vekexasia

Hello @davxy I imagine `spec` and `sock` both are defined as env vars right? or you talking about ARGS to pass to our `target`?


## Comment by @davxy

I don't know. Perhaps we can use env variables to overwrite the defaults.
Defaults set to `JAM_FUZZ_SPEC="tiny"` and `JAM_FUZZ_SOCK="/tmp/jam_fuzz.sock"`?


## Comment by @dakk

I personally think command line arguments is the correct way for this case, and adding also support for env vers doesn't introduce any benefit


## Comment by @ggwpez

Arguments can be converted in the docker image if the node requires env vars instead of std args.


## Comment by @ascrivener

+1 for command line arguments as primary interface. something like:

--spec=tiny|full
--sock=/tmp/jam_fuzz.sock

optionally can include:

--log-level=info|debug|trace


## Comment by @mikirov

As most of us already support some tracing, env vars like `JAM_ENABLE_PVM_TRACES` would be helpful 


## Comment by @bloppan

+1 for command arguments interface. And I also think that --spec and --sock are enough.


## Comment by @clearloop

Edited: vote for https://github.com/davxy/jam-conformance/discussions/187#discussioncomment-16733857

---

vote for using ENV_VARS as the single source of truth, no command args

```
JAM_CONFORMANCE_SOCK="/tmp/foo"
JAM_CONFORMANCE_SPEC='tiny'
JAM_CONFORMANCE_LOG=0
JAM_CONFORMANCE_DATA="/tmp/data"
```

1. some binaries (for example us) are not just for the fuzz tests, following the same args breaks the design of our commands
2. and I believe containers with env vars are more idiomatic, args are for arbitrary usages for users, ENVs are shared standards


## Comment by @tomusdrw

I'd strongly suggest going for a proper config file (e.g. JSON + schema). I'm 100% sure that we will end up with a total mess over time:
- the standard will keep adding more things
- versioning will be done adhoc (most likely via `-v2` or `_V2` prefixes)
- more complex data structures (like chainspec for instance) will be passed as separate files anyway

Doing a single schema has a bigger initial cost, but I suspect it will pay off pretty quickly and will provide much reliable errors in case of misconfiguration or unsupported features.

Just to point out inconsistencies or potential problems with trying to go for simplicity and providing "spec" (wasn't that supposed to be called `flavor`?) flag/env, JIP-4 chainspec file defines [`protocol_parameters`](https://github.com/polkadot-fellows/JIPs/blob/main/JIP-4.md?plain=1#L13) that might be conflicting with the pre-defined "spec". Given that spec is an alias for merely [13 parameters](https://docs.jamcha.in/basics/chain-spec/tiny) and AFAIR there was a plan to support other parametrizations, the config file could just list all of them explicitly.


## Comment by @jaymansfield

For chain spec isn’t it already defined in JIP-4? 

That was the approach I took in JavaJAM (argument to specify chain spec / parameters file).


## Comment by @davxy

Proposal https://github.com/davxy/jam-conformance/pull/188

The scripts in this repository will continue to support both binaries and Docker images for a while.

However, the official self-service web app used for the assessment supports only Docker images and the environment variables defined in the PR. Internally, you may map environment variables to CLI arguments or implement additional customizations as needed.
