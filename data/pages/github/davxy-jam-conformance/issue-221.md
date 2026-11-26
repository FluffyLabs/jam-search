---
type: page
url: 'https://github.com/jam-conformance/jam-fuzzing/issues/221'
title: JamLean ∎
site: github.com/davxy/jam-conformance
created_at: '2026-11-25T12:10:44.000Z'
last_modified: '2026-11-25T12:10:44.000Z'
content_kind: issue
---

# JamLean ∎

## Issue by @ascrivener

Following @davxy's suggestion on my Fellowship evaluation, this issue tracks integrating jam-lean into the conformance fuzzing process.

### What it is
[jam-lean](https://github.com/ascrivener/jam-lean) is a Lean 4 model of JAM written only from Gray Paper v0.8.0. It is an executable specification, not a node. [jam-lean-target](https://github.com/ascrivener/jam-lean-target) wraps it as a fuzzer target (protocol v1), with all cryptography in plain Lean (Ed25519 ZIP-215, Bandersnatch IETF VRF, ring root, Ring VRF).

### Image
- `ghcr.io/ascrivener/jam-lean-target:latest` (public; every build is also tagged by commit, e.g. `:1badd90`)
- Standard target packaging, no extra command or env: `JAM_FUZZ`, `JAM_FUZZ_SPEC`, `JAM_FUZZ_DATA_PATH`, `JAM_FUZZ_SOCK_PATH`. It runs as any uid, listens on the socket and starts one fresh session per connection. A `targets.json` entry would be just `{"image": "ghcr.io/ascrivener/jam-lean-target:latest", "gp_version": "0.8.0"}`.
- Features: ancestry, fork, and the proposed refine extension (RefineBundle → WorkReport).

```
docker run --rm --init --user "$(id -u):$(id -g)" -v /tmp/jam_fuzz:/tmp/jam_fuzz \
  -e JAM_FUZZ=1 -e JAM_FUZZ_SPEC=tiny -e JAM_FUZZ_DATA_PATH=/tmp/jam_fuzz \
  -e JAM_FUZZ_SOCK_PATH=/tmp/jam_fuzz/fuzz.sock ghcr.io/ascrivener/jam-lean-target:latest
```

### Version
The model follows GP **v0.8.0 as released** (tag v0.8.0) and does not track later GP changes. Where the fuzzer follows post-0.8.0 changes (e.g. GP #533, #563; see #220), the target answers with the v0.8.0 behaviour, which shows up as a divergence. The same applies to refine: the erasure root uses v0.8.0's App. H (not GP #580), and a package that exports nothing gets an Error, since v0.8.0 leaves that case undefined (see GP #583). I'd like to agree how to version this. For example, the target could be tagged by GP release, or compared against fuzzer releases pinned to a GP commit.

### Known limitations
- `Initialize` states whose key-values hold service storage can't be loaded yet (the model keys storage by the unhashed key). A fix is in progress in jam-lean.
- `Initialize` ancestry items carry (slot, hash) only, so ancestry checks cover only headers imported during the session.
- The model favours faithfulness over speed: about 0.2–0.3 s per block on the tiny spec, and `Initialize` can take a few seconds (the ring root is computed in plain Lean).


Happy to discuss versioning and anything else needed for the integration here.



## Comment by @ascrivener

Update: the target now models GP 0.8.1.

- `ghcr.io/ascrivener/jam-lean-target:v0.8.1` (also `:latest`): GP 0.8.1, PeerInfo jam_version 0.8.1, fuzzer protocol v1, same JAM_FUZZ / socket conventions as before.
- `ghcr.io/ascrivener/jam-lean-target:v0.8.0`: the previous GP 0.8.0 target.

For Bandersnatch (Draft 35, as GP 0.8.1 cites), the target follows the spec's published vectors where they differ from its prose: Z_pad of 48 octets, and the suite id as the ring transcript label. The Thin signature layout is O ‖ R ‖ s (graypaper#593).



## Comment by @davxy

Can you please open a PR to add the target to https://github.com/jam-conformance/jam-fuzzing/blob/main/scripts/targets.json


## Comment by @ascrivener

Done: #222

