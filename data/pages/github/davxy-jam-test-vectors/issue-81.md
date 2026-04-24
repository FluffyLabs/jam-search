---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/81'
title: merkle "trie" tests not compatible with the state roots from "traces" tests
site: github.com/davxy/jam-test-vectors
created_at: '2025-06-18T17:42:26.000Z'
last_modified: '2025-06-18T17:42:26.000Z'
content_kind: issue
---

# merkle "trie" tests not compatible with the state roots from "traces" tests

## Issue by @sierkov

When reviewing the recently published ```traces``` test vecotrs, I discovered that the sample Merkle trie implementation provided with the ```trie``` test vectors cannot produce the correct state roots when given non-empty ```pre_state``` and ```post_state``` dictionaries taken from the ```traces``` test vectors.

GrayPaper (D.5) defines the state root as the root of the merkle trie constructed from the serialized state dictionary:
![Image](https://github.com/user-attachments/assets/01ecc0e7-e7f0-455f-aced-660456d33b40)
For this reason, my understanding is that the two should be compatible. However, that’s not what I am currently observing.

Below I provide a modified script from ```trie/merkle.py``` that can work with both the data in the ```trie.json``` format and ```pre_state``` and ```post_state``` from the ```traces``` test vectors.

Is there an intended difference in how the state root is computed between these test vectors?
If so, could you point me to the relevant section in the GrayPaper or documentation?

````sh
python merkle-compute.py trie trie/trie.json
````
produces for all cases matches=True:
````
trie 0: root=0000000000000000000000000000000000000000000000000000000000000000 match: True
trie 1: root=17d7a1c738dfa055bc810110004585ca79be323586764e14179ee20e54376592 match: True
trie 2: root=75978696ab7bd70492c2abbecf26fd03eb2c41e0d83daf968f45c20f566b9a9b match: True
trie 3: root=9ea1799e255f9b5edb960cf6640aa42ec2fac24a199be8155853ddcce9b896c4 match: True
trie 4: root=de6ffcbc0c3c6e3e5b6ef8f7ba875b77707f502228db0b6b9173b3f659b8edb6 match: True
trie 5: root=720f6a3acf7c3de97febd9508c7a9e4d0a12fb65283588f596aeb4e2423d3bda match: True
trie 6: root=b9c99f66e5784879a178795b63ae178f8a49ee113652a122cd4b3b2a321418c1 match: True
trie 7: root=846fd6a4c1913db012ee6bf3184b85db4b9d9c3f429305c9c60ae610f6bd2d0b match: True
trie 8: root=e79ee404bb7caf984f99f7a5d997200a306b0302fa08262b380662562d693313 match: True
trie 9: root=55634c70b9dca56f2f40b343f750a5c9744798370cbf3f669e29ebe0b8d64ceb match: True
trie 10: root=0120dd8239fdc65ef0485215493b6de1b4b31b96d9bae99617afb6178e4d43e3 match: True
````

Running the attached script on a trace data:
````sh
python merkle-compute.py trace traces/fallback/00000001.json
````
produces for all cases matches=False:
````
trace pre_state: root=27edc58acbbda82e9dd799d20dbafd8625dafe1dfac97f39ba7102d182775181 match: False
trace post_state: root=0d8f50e9537fd7a77981f435b610b966e6662a1309eb5e7586a24e35990cdfd1 match: False
````

The modified script:
```python
#!/usr/bin/env python3

import hashlib
import json
import sys

## Graypaper conforming implementation of the binary tree used for the state merklization (Appendix D)
## Based on GP 0.2.2

# Blake2b-256
def hash(data):
    return hashlib.blake2b(data, digest_size=32).digest()

# GP (286)
def branch(l, r):
    assert len(l) == 32
    assert len(r) == 32
    head = l[0] & 0xfe
    return bytes([head]) + l[1:] + r

# GP (287)
def leaf(k, v):
    if len(v) <= 32:
        head = 0b01 | (len(v) << 2)
        return bytes([head]) + k[:-1] + v + ((32 - len(v)) * b'\0')
    head = 0b11
    return bytes([head]) + k[:-1] + hash(v)

def bit(k, i):
    return (k[i >> 3] & (1 << (i & 7))) != 0

# GP (289)
def merkle(kvs, i=0):
    if not kvs:
        return 32 * b'\0'
    if len(kvs) == 1:
        encoded = leaf(*kvs[0])
    else:
        l = []
        r = []
        for k, v in kvs:
            if bit(k, i):
                r.append((k, v))
            else:
                l.append((k, v))
        encoded = branch(merkle(l, i + 1), merkle(r, i + 1))
    assert len(encoded) == 64
    return hash(encoded)

def hex(data):
    return ''.join(f'{x:02x}' for x in data)

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 merkle-compute.py <trace|trie> <input.json>")
        sys.exit(1)
    format = sys.argv[1]
    input_path = sys.argv[2]
    with open(input_path, 'r') as f:
        j_dict = json.load(f)
        if format == 'trace':
            for case_id in ('pre_state', 'post_state'):
                exp_root = bytes.fromhex(j_dict[case_id]['state_root'][2:])
                input = []
                for kv in j_dict[case_id]['keyvals']:
                    input.append((bytes.fromhex(kv['key'][2:] + "00"), bytes.fromhex(kv['value'][2:])))
                root = merkle(input)
                print(f'{format} {case_id}: root={hex(root)} match: {root == exp_root}')
        elif format == 'trie':
            for case_id, case in enumerate(j_dict):
                exp_root = bytes.fromhex(case['output'])
                input = []
                for k, v in case['input'].items():
                    input.append((bytes.fromhex(k), bytes.fromhex(v)))
                root = merkle(input)
                print(f'{format} {case_id}: root={hex(root)} match: {root == exp_root}')
        else:
            raise Exception(f'Unknown format: {format}')

main()
```


## Comment by @davxy

Thanks, I’ll take a look.
By the way, the master tip might be out of sync and not coherent - I still need to update the contents under `traces`.
We're planning to release a stable version of vectors for v0.6.6 soon, so I’ll try it out after that.
By soon I mean, really soon :-)


## Comment by @sierkov

Thank you.

P.S. I believe that this issue is related to this PR: https://github.com/w3f/jamtestvectors/pull/14


## Comment by @davxy

@arkpar Maybe the vectors in the `trie` folder are outdated, and their reference implementation no longer aligns with the current specification?



## Comment by @davxy

@sierkov I have't checked https://github.com/w3f/jamtestvectors/pull/14 . Is that aligned with the GP?


## Comment by @arkpar

https://github.com/w3f/jamtestvectors/pull/14 should be indeed aligned with the gp (and polkajam)
