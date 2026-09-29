---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/213'
title: Lasair
site: github.com/davxy/jam-conformance
created_at: '2026-09-28T11:46:38.000Z'
last_modified: '2026-09-28T11:46:38.000Z'
content_kind: issue
---

# Lasair

## Issue by @abutlabs

@davxy, can you add Lasair to the GP 0.8.0 fuzzer runs?

- Image: `ghcr.io/abutlabs/lasair-fuzz-target:2.0.0` (linux/amd64, digest `sha256:de307e8f07695c2bf2086d169080dddc6491e86823e733978fa40a1459e01f14`).
- Suggested `scripts/targets.json` entry: `"lasair": { "image": "ghcr.io/abutlabs/lasair-fuzz-target:latest", "gp_version": "0.8.0" }`. Happy to open the PR.
- The image follows fuzz-proto's Standard Target Packaging (configured only by the `JAM_FUZZ_*` environment variables) and supports the two M1 features, `ancestry` and `forks`. Its `PeerInfo` reports `jam_version` 0.8.0 and `app_version` 2.0.0.
- It passes the v0.8.0 test vectors (davxy/jam-test-vectors#112): the STF vectors at tiny and full (all 9 families), codec, erasure, shuffle and trie, and all 8 trace families, the traces both in-process and as fuzz-proto sessions against this image.
- On the three deviations listed in the vectors' CHANGELOG, Lasair follows the vectors: `grow_heap` out-of-gas handling (gavofyork/graypaper#533), the `grow_heap` stack reservation rounded to 64 KiB (gavofyork/graypaper#538), and `bless` from a non-manager (gavofyork/graypaper#519, with gavofyork/graypaper#558 pending).
- For `query` with z ≥ 2^32, Lasair returns HUH and leaves r8 unchanged, as in GP Ω_Q. That is the PolkaJam bug you confirmed in #212.

 With the entry above, `python3 scripts/target.py run lasair` runs it like any other target. By hand, with the values `target.py` uses:

```
docker run --rm --init --platform linux/amd64 --user "$(id -u):$(id -g)" \
   -e JAM_FUZZ=1 -e JAM_FUZZ_SPEC=tiny \
   -e JAM_FUZZ_DATA_PATH=/tmp/jam_fuzz -e JAM_FUZZ_SOCK_PATH=/tmp/jam_fuzz/fuzz.sock \
   -v /tmp/jam_fuzz:/tmp/jam_fuzz \
   ghcr.io/abutlabs/lasair-fuzz-target:2.0.0
 ```

Thank you!
