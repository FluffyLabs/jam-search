---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/31'
title: WorkResult Codec Problem
site: github.com/davxy/jam-test-vectors
created_at: '2025-03-23T05:19:27.000Z'
last_modified: '2025-03-23T05:19:27.000Z'
content_kind: issue
---

# WorkResult Codec Problem

## Issue by @yoyo2325

Hi @davxy 
the codec of the work result I think that the gas used is uint64
but you use N to Encode
is there any reason to use N instead of N64 here?

output: expected is from your side, actual is from our side
```
hit service_id
appending 08070605
hit code_hash
appending fcfc857dab216daf41f409c2012685846e4d34aedfeacaf84d9adfebda73fae6
hit payload_hash
appending d55e07438aeeeb0d6509ab28af8a758d1fb70424db6b27c7e1ef6473e721c328
hit accumulate_gas
appending 2100000000000000
hit result
appending 02
hit gas_used
appending 0000000000000000  <-this is uint64
hit imports
appending 00
hit extrinsic_count
appending 00
hit extrinsic_size
appending 00
hit exports
appending 00
--- FAIL: TestCodec (0.00s)
    --- FAIL: TestCodec/work_result_1.json (0.00s)
        codec_test.go:55: Case work_result_1.json: failed to decode codec data: [Error From Codec Decode]data length insufficient for uint64 , type: uint64, name: GasUsed, tag: gas_used (encode, decode)
        codec_test.go:84: 
                Error Trace:    /home/ntust/jam/types/codec_test.go:84
                Error:          Not equal: 
                                expected: []byte{0x8, 0x7, 0x6, 0x5, 0xfc, 0xfc, 0x85, 0x7d, 0xab, 0x21, 0x6d, 0xaf, 0x41, 0xf4, 0x9, 0xc2, 0x1, 0x26, 0x85, 0x84, 0x6e, 0x4d, 0x34, 0xae, 0xdf, 0xea, 0xca, 0xf8, 0x4d, 0x9a, 0xdf, 0xeb, 0xda, 0x73, 0xfa, 0xe6, 0xd5, 0x5e, 0x7, 0x43, 0x8a, 0xee, 0xeb, 0xd, 0x65, 0x9, 0xab, 0x28, 0xaf, 0x8a, 0x75, 0x8d, 0x1f, 0xb7, 0x4, 0x24, 0xdb, 0x6b, 0x27, 0xc7, 0xe1, 0xef, 0x64, 0x73, 0xe7, 0x21, 0xc3, 0x28, 0x21, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x2, 0x0, 0x0, 0x0, 0x0, 0x0}
                                actual  : []byte{0x8, 0x7, 0x6, 0x5, 0xfc, 0xfc, 0x85, 0x7d, 0xab, 0x21, 0x6d, 0xaf, 0x41, 0xf4, 0x9, 0xc2, 0x1, 0x26, 0x85, 0x84, 0x6e, 0x4d, 0x34, 0xae, 0xdf, 0xea, 0xca, 0xf8, 0x4d, 0x9a, 0xdf, 0xeb, 0xda, 0x73, 0xfa, 0xe6, 0xd5, 0x5e, 0x7, 0x43, 0x8a, 0xee, 0xeb, 0xd, 0x65, 0x9, 0xab, 0x28, 0xaf, 0x8a, 0x75, 0x8d, 0x1f, 0xb7, 0x4, 0x24, 0xdb, 0x6b, 0x27, 0xc7, 0xe1, 0xef, 0x64, 0x73, 0xe7, 0x21, 0xc3, 0x28, 0x21, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x2, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0}
                            
                                Diff:
                                --- Expected
                                +++ Actual
                                @@ -1,2 +1,2 @@
                                -([]uint8) (len=82) {
                                +([]uint8) (len=89) {
                                  00000000  08 07 06 05 fc fc 85 7d  ab 21 6d af 41 f4 09 c2  |.......}.!m.A...|
                                @@ -6,3 +6,3 @@
                                  00000040  e7 21 c3 28 21 00 00 00  00 00 00 00 02 00 00 00  |.!.(!...........|
                                - 00000050  00 00                                             |..|
                                + 00000050  00 00 00 00 00 00 00 00  00                       |.........|
                                 }
                Test:           TestCodec/work_result_1.json
        codec_test.go:85: Case work_result_1.json: Codec data not equal :
             Encoded=
            08070605fcfc857dab216daf41f409c2012685846e4d34aedfeacaf84d9adfebda73fae6d55e07438aeeeb0d6509ab28af8a758d1fb70424db6b27c7e1ef6473e721c328210000000000000002000000000000000000000000
```


## Comment by @yoyo2325

I get the reason
Sorry for bothering!


## Comment by @davxy

![Image](https://github.com/user-attachments/assets/156bb3a6-4682-43ce-919c-90e2093d7ea0)

$x_u$ is encoded using compact


## Comment by @yoyo2325

Thank you I just noticed that!


## Comment by @yoyo2325

@davxy one more question
for c13 Statistic vectors' `ValidatorStatistic` you are not using the The state serialization,right?
I think it should be E4() not E()
https://graypaper.fluffylabs.dev/#/68eaa1f/38e30238ed02?v=0.6.4



## Comment by @davxy

@yoyo2325 yeah I noticed. Indeed that needs to be fixed. I'll fix that probably tomorrow.
Thank you for reporting
