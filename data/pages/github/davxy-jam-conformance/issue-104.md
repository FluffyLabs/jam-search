---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/104'
title: '"jam_types" module not found'
site: github.com/davxy/jam-conformance
created_at: '2025-10-13T07:05:00.000Z'
last_modified: '2025-10-13T07:05:00.000Z'
---

# "jam_types" module not found

## Issue by @indihacker2502

I am encountering an issue while running the repo of jam_types module not found when running fuzz-proto/minifuzz/minifuzz.py. Since it is not a dependency i am not considering to make or write in requirements.txt. Kindly resolve it.


## Comment by @davxy

So in practice you're asking for a `requirements.txt` file for minifuzz?


## Comment by @indihacker2502

Hi @davxy,

I’m not specifically asking for a requirements.txt for minifuzz, but I am encountering a ModuleNotFoundError: No module named 'jam_types' when running fuzz-proto/minifuzz/minifuzz.py. The jam_types module is not available as a standard Python package or dependency, so I can’t install it via pip or add it to requirements.txt.

Could you please clarify:

Where is the jam_types module supposed to come from?
Is it included as a submodule, or do I need to clone it separately?
What is the recommended way to make it importable for the scripts in this repo?


## Comment by @dakk

> Hi [@davxy](https://github.com/davxy),
> 
> I’m not specifically asking for a requirements.txt for minifuzz, but I am encountering a ModuleNotFoundError: No module named 'jam_types' when running fuzz-proto/minifuzz/minifuzz.py. The jam_types module is not available as a standard Python package or dependency, so I can’t install it via pip or add it to requirements.txt.
> 
> Could you please clarify:
> 
> Where is the jam_types module supposed to come from? Is it included as a submodule, or do I need to clone it separately? What is the recommended way to make it importable for the scripts in this repo?

```          pip install https://github.com/davxy/jam-types-py/archive/refs/tags/v0.7.0.tar.gz```


## Comment by @davxy

Now 0.7.1 is released.

```
pip install https://github.com/davxy/jam-types-py/archive/refs/tags/v0.7.1.tar.gz
```
