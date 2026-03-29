---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/51'
title: 1756548706/00000094
site: github.com/davxy/jam-conformance
created_at: '2025-09-02T00:14:18.000Z'
last_modified: '2025-09-02T00:14:18.000Z'
---

# 1756548706/00000094

## Discussion by @sierkov

This traces relies on the eject host call succeeding. However, based on my reading of GP 0.7.0, it seems that it should fail by triggering the following condition (https://graypaper.fluffylabs.dev/#/38c4e62/373302373302?v=0.7.0):

<img width="560" height="27" alt="image" src="https://github.com/user-attachments/assets/7f9ba097-9fbc-4d8d-96a3-ff45dd609545" />

My interpretation is that eject should fail with WHO if either:
- the ejected service is not known, or
- the code_hash of the ejected service does not match the code_hash of the ejecting service.

In this context, I read
<img width="67" height="28" alt="image" src="https://github.com/user-attachments/assets/86f84078-ba8c-4fed-9318-4a764e86a9d4" />
as “the first 32 bytes of the current service’s encoded data,” which represents its code hash.

At the moment of the host call, the code cash of the ejected service ```0x8e48e924``` is ```all zeros``` and does not match the code_hash of the ejecting service ```0```: ```0x2F46B4EE8C502D0B9E66C78823B4959E22C101D9A3D1B82554B1912CC11F6EB5```.

In addition, the following log lines add further confusion:
```
Decoded instruction: Eject { target: 2387142948, code_hash: 0xc66e2745966b4e12... }
Ejecting service #8e48e924 with code_hash 0xc66e2745966b4e12...
```

However, according to [the trace's pre-state ](https://raw.githubusercontent.com/davxy/jam-conformance/refs/heads/main/fuzz-reports/0.7.0/traces/1756548706/00000094.json) the ejected service ```0x8e48e924```  already has a code_hash of ```all zeros``` in its info structure:
```
{
     "key": "0xff2400e90048008e0000000000000000000000000000000000000000000000",
     "value": "0x00000000000000000000000000000000000000000000000000000000000000001d4202000000000000000000000000000000000000000000b330010000000000000000000000000002000000080000003800000000000000"
}
```







## Comment by @0xjunha

`E_32(x_s)` should be interpreted as "32-byte fixed-length encoding of the accumulating service id", rather than "the first 32 bytes of the current service’s encoded data". The definition of fixed codec allows encoding 4-byte service id into 32 bytes.

My understanding is that as a prerequisite of ejection, the ejecting service's code hash should be "upgraded" to 32-byte encoding of service id which can trigger its ejection (accumulate host), to deliver the intention that it is "ready for ejection triggered by service id xxx".

Therefore, for "accumulating service" `0`, having all zeros for the code hash of "ejecting service" should pass the `WHO` validation.
