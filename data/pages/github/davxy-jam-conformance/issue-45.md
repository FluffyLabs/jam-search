---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/45'
title: FastRoll
site: github.com/davxy/jam-conformance
created_at: '2025-08-31T14:02:19.000Z'
last_modified: '2025-08-31T14:02:19.000Z'
---

# FastRoll

## Issue by @0xjunha

Hi @davxy ,
the initial release of FastRoll is now ready for fuzzing.

The fuzz target can be spun up with the command:

```bash
fastroll-linux-x86_64-tiny fuzz --socket "/tmp/jam_target.sock"
```

I've added the Github release repo, binaries info & commands to the script in this PR: https://github.com/davxy/jam-conformance/pull/44

I hope this works well with the fuzzer. Thank you!

---
EDIT: Graypaper version: 0.7.0


## Comment by @0xjunha

FastRoll v0.1.2 released: https://github.com/fastroll-jam/fastroll-releases/releases/tag/v0.1.2

Trace `1756548706` was clearly a bug on my end, fixed in the latest release.


## Comment by @0xjunha

FastRoll v0.1.3 released: https://github.com/fastroll-jam/fastroll-releases/releases/tag/v0.1.3

Should pass `1756790723` & `1756791458`


## Comment by @davxy

Missing binary here: https://github.com/fastroll-jam/fastroll-releases/releases/tag/v0.1.4


## Comment by @0xjunha

> Missing binary here: https://github.com/fastroll-jam/fastroll-releases/releases/tag/v0.1.4

My bad, just uploaded. Thanks!


## Comment by @0xjunha

Hi @davxy, I made a new release -  [Fastroll v0.1.9](https://github.com/fastroll-jam/fastroll-releases/releases/tag/v0.1.9) supports Fuzzer v1 with ancestor set feature.
Tested agains minifuzz `no_forks` traces.

Forking will be supported in the following releases. Thanks.


## Comment by @0xjunha

[Fastroll v0.1.14](https://github.com/fastroll-jam/fastroll-releases/releases/tag/v0.1.14) released - aligned with GP v0.7.1 (still no forks)


## Comment by @0xjunha

[Fastroll v0.1.15](https://github.com/fastroll-jam/fastroll-releases/releases/tag/v0.1.15) released - simple forking is supported, tested against 0.7.0 mini fuzz examples. Thanks!


## Comment by @alxmirap

I seem to have an issue with Fastroll v0.1.18. I consistently get a RocksDb error after a variable number of steps. The error looks like this:
`Reported: BlockHeaderDBError: CachedDBError: CoreDBError: RocksDB error: IO error: No such file or directory: While open a file for appending: /var/folders/mz/rp8k2sw55g7_nkr6n3g17cnm0000gn/T/.tmpBq5ltZ/fuzz_target_db /000008.log: No such file or directory`

and I've had it on importing block 8413 or 8416.

Here is an example trace:

```
{
    "config": {
        "seed": "42",
        "profile": {
            "empty": null
        },
        "safrole": false,
        "max_work_items": 5,
        "max_service_keys": 10,
        "mutation_ratio": 0.1,
        "max_mutations": 0,
        "max_steps": 10000
    },
    "stats": {
        "steps": 8413,
        "imported": 8413,
        "import_max_step": 3355,
        "import_min": 0.81675,
        "import_max": 7.009375,
        "import_mean": 0.8898193718055373,
        "import_p50": 0.874,
        "import_p75": 0.894,
        "import_p90": 0.917,
        "import_p99": 1.104,
        "import_std_dev": 0.14104517611617645
    },
    "target": {
        "info": {
            "fuzz_version": 1,
            "fuzz_features": 2,
            "jam_version": {
                "major": 0,
                "minor": 7,
                "patch": 1
            },
            "app_version": {
                "major": 0,
                "minor": 1,
                "patch": 18
            },
            "app_name": "FastRoll"
        },
        "stats": {
            "steps": 8413,
            "imported": 8412,
            "import_max_step": 12,
            "import_min": 0.5685,
            "import_max": 35.961625,
            "import_mean": 0.7101552961245816,
            "import_p50": 0.643,
            "import_p75": 0.673,
            "import_p90": 0.722,
            "import_p99": 2.357,
            "import_std_dev": 0.6581163563230517
        }
    },
    "state_diff": null,
    "import_diff": {
        "exp": "ok",
        "got": "BlockHeaderDBError: CachedDBError: CoreDBError: RocksDB error: IO error: No such file or directory: While open a file for appending: /var/folders/mz/rp8k2sw55g7_nkr6n3g17cnm0000gn/T/.tmpBq5ltZ/fuzz_target_db /000008.log: No such file or directory"
    }
}
```


## Comment by @0xjunha

Thanks for sharing that @alxmirap, there was an issue with handling temporary DB path lifetime. It is fixed in the new release :
[FastRoll v0.1.19](https://github.com/fastroll-jam/fastroll-releases/releases/tag/v0.1.19)

Now the error should not appear no matter how many times fuzz session is connected, but if it happens again please share it as well. Thank you!


## Comment by @0xjunha

Hi @davxy , [fastroll v0.1.25](https://github.com/fastroll-jam/fastroll-releases/releases/tag/v0.1.25) is released, now aligned with GP v0.7.2. Thank you.
