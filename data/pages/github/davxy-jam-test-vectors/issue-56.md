---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/56'
title: Dictionaries key encoding
site: github.com/davxy/jam-test-vectors
created_at: '2025-05-19T08:22:49.000Z'
last_modified: '2025-05-19T08:22:49.000Z'
content_kind: issue
---

# Dictionaries key encoding

## Issue by @davxy

When dictionary key/val is an integer we should use compact encoding?

![Image](https://github.com/user-attachments/assets/9ea3de9b-28ab-4d7b-addd-be9a2515e9f4)

This affects how we encode structures such as $\pi_S$ (the service-statistics dictionary), where the key (the `ServiceId`) is currently encoded using 4-byte (fixed length).



## Comment by @danicuki

Are you using E4 for service_id encoding on πS? What about other values on the service statistics (e.g NG)? Are you using compact on these also? 


## Comment by @davxy

This affects only the dictionary key (i.e. service_id). The fields of service statistics record are encoded as compact
