---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/65'
title: issue with account storage key
site: github.com/davxy/jam-test-vectors
created_at: '2025-05-29T13:58:16.000Z'
last_modified: '2025-05-29T13:58:16.000Z'
content_kind: issue
---

# issue with account storage key

## Issue by @daiagi

Hey @davxy 

We at Jamixir have a question / issue regarding the key of storage item in post state

for example in `accumulate_ready_queued_reports-1` post state:

```json
                    "storage": [
                        {
                            "key": "0x6c61761374",
                            "value": "0x4e7d087383aadf7301a9a6ebff2d02"
                        }
                    ]
```


the key does not make sense to us, since in **write host call** [link](https://graypaper.fluffylabs.dev/#/cc517d7/306902306902?v=0.6.5)

the storage key is a hash which means it is 32 bytes long

Could you clarify please? how come in the post state it is only 5 bytes

Thank you










## Comment by @clearloop

The storage keys [are not hashed](https://github.com/davxy/jam-test-vectors/blob/f5bbbe34b715bddc57493664514976ffdd51ea37/accumulate/accumulate.asn#L11), don't ask me how did I find it 😉


## Comment by @davxy

Right - as @clearloop already pointed out - for the accumulate STF vectors the storage keys are provided unhashed (i.e. directly as used by the service)




