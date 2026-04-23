---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/522'
title: Add `NetworkingOptions` to config file.
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-31T19:23:26.000Z'
last_modified: '2025-07-31T19:23:26.000Z'
content_kind: issue
---

# Add `NetworkingOptions` to config file.

## Issue by @tomusdrw

Related: #452 

Currently networking options are hardcoded, and partially dependent on the `dev`-validator mode (key, ports, etc).

While the defaults are sensible we should also have an option to provide them in a config file.

Options to support:
1. Networking key - by default should be loaded from the database location (base dir based on the node name) and randomly generated if not present. However it should also be possible to pass alternative key location in the config file.
2. Host - the interface we are going to bind the networking socket to (default in the future: `0.0.0.0` (or ipv6 equivalent), for now `localhost`).
3. Port - by default we should use the `12345 + shift`, port present in the config file should take precedence though.

In the future we will most likely have more options to fine-tune networking behavior (number of peers, etc).
