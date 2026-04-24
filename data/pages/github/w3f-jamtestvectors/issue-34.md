---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/34'
title: Maybe header encoding data is wrong
site: github.com/w3f/jamtestvectors
created_at: '2025-01-27T04:43:38.000Z'
last_modified: '2025-01-27T04:43:38.000Z'
content_kind: issue
---

# Maybe header encoding data is wrong

## Issue by @JonghoKim-jj

I think data in `header_0.bin` maybe wrong now.

`header_0.bin` now:

``` text
parent                 5c743dbc514284b2ea57798787c5a155ef9d7ac1e9499ec65910a7a3d65897b7
parent_state_root      2591ebd047489f1006361a4254731466a946174af02fe1d86681d254cfd4a00b
extrinsic_hash         74a9e79d2618e0ce8720ff61811b10e045c02224a09299f04e404a9656e85c81
slot                   2a000000
epoch_mark                     01
  entropy                        ae85d6635e9ae539d0846b911ec86a27fe000f619b78bcac8a74b7
                       7e36f6dbcf
  tickets_entropy                333a7e328f0c4183f4b947e1d8f68aa4034f762e5ecdb5a7f6fbf0
                       afea2fd8cd
  validators                     5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601
                       025a8d161d
                                 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a5
                       9233fb66d0
                                 aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51
                       c68938f8bc
                                 7f6190116d118d643a98878e294ccf62b509e214299931aad8ff97
                       64181a4e33
                                 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6
                       fee86ab3e3
                                 f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9
                       520a72591d
tickets_mark                     00
offenders_mark                     01
                                     3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63a
                       c048a18b59da29
author_index                         0300
entropy_source                           ae85d6635e9ae539d0846b911ec86a27fe000f619b78bc
                       ac8a74b77e36f6dbcf49a52360f74a0233cea0775356ab0512fafff0683df08f
                       ae3cb848122e296cbc50fed22418ea55f19e55b3c75eb8b0ec71dcae0d79823d
                       39920bf8d6a2256c5f
seal                                     31dc5b1e9423eccff9bccd6549eae8034162158000d5be
                       9339919cc03d14046e6431c14cbb172b3aed702b9e9869904b1f39a6fe1f3e90
                       4b0fd536f13e8cac496682e1c81898e88e604904fa7c3e496f9a8771ef1102cc
                       29d567c4aad283f7b0
```

According to gray paper 0.5.4 equation (6.27),
if `epoch_marker` is non-empty, `epoch_marker.validators` is a variable-length sequence,
so its encoding should start with `0x06`, which is length of the sequence.

Maybe correct `header_0.bin` to be:

``` text
parent                 5c743dbc514284b2ea57798787c5a155ef9d7ac1e9499ec65910a7a3d65897b7
parent_state_root      2591ebd047489f1006361a4254731466a946174af02fe1d86681d254cfd4a00b
extrinsic_hash         74a9e79d2618e0ce8720ff61811b10e045c02224a09299f04e404a9656e85c81
slot                   2a000000
epoch_mark                     01
  entropy                        ae85d6635e9ae539d0846b911ec86a27fe000f619b78bcac8a74b7
                       7e36f6dbcf
  tickets_entropy                333a7e328f0c4183f4b947e1d8f68aa4034f762e5ecdb5a7f6fbf0
                       afea2fd8cd
  validators                     06
                                   5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea6
                       01025a8d161d
                                   3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2
                       a59233fb66d0
                                   aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe
                       51c68938f8bc
                                   7f6190116d118d643a98878e294ccf62b509e214299931aad8ff
                       9764181a4e33
                                   48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776f
                       f6fee86ab3e3
                                   f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1ac
                       c9520a72591d
tickets_mark                       00
offenders_mark                       01
                                       3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a6
                       3ac048a18b59da29
author_index                           0300
entropy_source                             ae85d6635e9ae539d0846b911ec86a27fe000f619b78
                       bcac8a74b77e36f6dbcf49a52360f74a0233cea0775356ab0512fafff0683df0
                       8fae3cb848122e296cbc50fed22418ea55f19e55b3c75eb8b0ec71dcae0d7982
                       3d39920bf8d6a2256c5f
seal                                       31dc5b1e9423eccff9bccd6549eae8034162158000d5
                       be9339919cc03d14046e6431c14cbb172b3aed702b9e9869904b1f39a6fe1f3e
                       904b0fd536f13e8cac496682e1c81898e88e604904fa7c3e496f9a8771ef1102
                       cc29d567c4aad283f7b0
```


## Comment by @tomusdrw

@JonghoKim-Harry since number of validators is a known value (depends on the configuration aka "chain spec", but still constant) the sequence is fixed-length, hence no prefix.


## Comment by @JonghoKim-jj

@tomusdrw  Thank for reply.
I have another question.
Is the number of winning tickets also a known value by chain spec?


## Comment by @tomusdrw

@JonghoKim-Harry take a look at the schema given with the tests: https://github.com/w3f/jamtestvectors/blob/master/jam-types-asn/jam-types.asn#L246 since that describes what the format of test vectors is, but remember that the source of truth for JAM contest is always the Gray Paper.


## Comment by @JonghoKim-jj

@tomusdrw Thanks!
