---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/37'
title: 1756393301 (0.7.0)
site: github.com/davxy/jam-conformance
created_at: '2025-08-28T15:50:21.000Z'
last_modified: '2025-08-28T15:50:21.000Z'
content_kind: discussion
---

# 1756393301 (0.7.0)

## Discussion by @davxy

I'd like to draw your attention to the trace for version 0.7.0 published in this PR:  
https://github.com/davxy/jam-conformance/pull/36  

It looks like almost all implementations (except those not yet working with the fuzzer) reach the same state root. However, I can only match my post-root with TurboJam.  

There are several items in the state that do not match, but my attention goes first in some evident and strange diff.
All the aforementioned targets keep some keys in the service storage  
(`0x007600000014004dbf99722c645a8d721815ae4fbe6b108d51b71ea717f666` and `0x007c004d009b0018685645d52c326005ea488c8456e725ff64e6a1759964d8`) which as far as I can tell, should be **removed**.  

I haven’t gone too deep into the analysis yet, but perhaps someone has an easy explanation or can demonstrate that the Polkajam fuzzer is at fault.



## Comment by @jaymansfield

I haven't looked at any state keys themselves, but the first big difference I see is the number of reports accumulated. JavaJAM is accumulating 3 and Polkajam does 2.

First accumulation:
0xff866d8ea766edfadf375863007da902abd84c6383ed1a2fb706653b3850688a
0xd2f8186a97b18d01949034b0b3ca5e1471bee546e183af91ad53af66dc8c7954

which uses 155895 gas.

Theres still enough remaning gas (19844105) so another accumulation is done on the second outer accumulation call:

<img width="518" height="83" alt="Screenshot 2025-08-28 at 12 10 10 PM" src="https://github.com/user-attachments/assets/a57c43aa-9051-4e9a-8c7c-f1342f0e180c" />

for hash  0x3ae8059fae62452e7bc49e3ffb6857e9a458ed447ea6f96c76accb6448854ff9

~~Any chance that you may be checking < g instead of <= g?~~ 
EDIT: Doesn't look like it actually
<img width="217" height="67" alt="Screenshot 2025-08-28 at 12 25 35 PM" src="https://github.com/user-attachments/assets/c74faf6c-45d2-4baf-b525-e98329d785fc" />




## Comment by @vekexasia

I agree with your analysis second accumulation seems to be not performed on the others but i cant see why it shouldnt.


## Comment by @davxy

Thanks! I can't get to my analysis until tomorrow, but for now I’ve tossed it into the arena 😁


## Comment by @danicuki

I tried to run it here and we also got `0x2da350697dd37f08ba5b62924bfa9230179cd4e39741eadf7d260a2cadd204ac` root.

In our debug log, we have something like:
```
20:08:04.858 [debug] [PVM] #0 [boot] Decoded instruction: DeleteItems { storage_items: [[149, 41, 73, 208, 88, 126, 127, 38, 63, 90, 251, 142, 170, 75, 221, 104, 158, 121, 163, 127, 255, 92, 80, 91, 105, 173, 15, 193, 43, 132, 255, 139], [82, 81, 252, 99, 214, 173, 26, 12, 213, 213, 39, 52, 192, 43, 167, 15, 49, 125, 252, 178, 214, 54, 20, 193, 40, 53, 208, 122, 168, 241, 95, 64], [101, 186, 163, 4, 25, 181, 111, 199, 58, 230, 69, 69, 41, 223, 235, 48, 56, 175, 138, 197, 206, 42, 87, 48, 93, 133, 219, 77, 191, 4, 155, 148], [11, 83, 238, 201, 0, 57, 41, 0, 150, 250, 8, 242, 178, 159, 121, 232, 122, 37, 100, 42, 241, 229, 117, 74, 123, 68, 241, 153, 252, 113, 178, 199]] }
20:08:04.878 [debug] [PVM] #0 [boot] Deleting item: [95, 29, 49, d0, 58, 7e, 7f, 26, 3f, 5a, fb, 8e, aa, 4b, dd, 68, 9e, 79, a3, 7f, ff, 5c, 50, 5b, 69, ad, 0f, c1, 2b, 84, ff, 8b]
20:08:04.878 [debug] [PVM] Removed from storage key 0x952949d0587e7f263f5afb8eaa4bdd689e79a37fff5c505b69ad0fc12b84ff8b => 0x
20:08:04.897 [debug] [PVM] #0 Failed to remove item: [149, 41, 73, 208, 88, 126, 127, 38, 63, 90, 251, 142, 170, 75, 221, 104, 158, 121, 163, 127, 255, 92, 80, 91, 105, 173, 15, 193, 43, 132, 255, 139]
20:08:04.922 [debug] [PVM] #0 [boot] Deleting item: [52, 51, fc, 63, d6, ad, 1a, 0c, d5, d5, 27, 34, c0, 2b, a7, 0f, 31, 7d, fc, b2, d6, 36, 14, c1, 28, 35, d0, 7a, a8, f1, 5f, 40]
20:08:04.923 [debug] [PVM] Removed from storage key 0x5251fc63d6ad1a0cd5d52734c02ba70f317dfcb2d63614c12835d07aa8f15f40 => 0x
20:08:04.946 [debug] [PVM] #0 Failed to remove item: [82, 81, 252, 99, 214, 173, 26, 12, 213, 213, 39, 52, 192, 43, 167, 15, 49, 125, 252, 178, 214, 54, 20, 193, 40, 53, 208, 122, 168, 241, 95, 64]
20:08:04.966 [debug] [PVM] #0 [boot] Deleting item: [65, ba, a3, 04, 19, b5, 6f, c7, 3a, e6, 45, 45, 29, df, eb, 30, 38, af, 8a, c5, ce, 2a, 57, 30, 5d, 85, db, 4d, bf, 04, 9b, 94]
```

The `[PVM] #0 [boot]` tags are log messages from the service.

Interesting that it logs to remove the items (`Deleting item:...`), the call is actually executed by our host (`Removed from storage key`), and then right after it returns `Failed to remove item` (watch that some keys are in deciamal and some are in hex)










## Comment by @vekexasia

TSJam as well (which is one of the few that have not the fuzzer target not currently working..

my post root is `0x2da350697dd37f08ba5b62924bfa9230179cd4e39741eadf7d260a2cadd204ac`

and debug from my code with logs:

```
2025-08-28T19:34:19.228Z INFO@1#0 boot Bootstrap Service Accumulate, 0h @324 $18446744073709551615
2025-08-28T19:34:19.280Z DEBUG@1#0 boot Decoded instruction: RandomStorageAccumulate(Ok(Output { items: [Item { key: [140, 67, 17, 110, 91, 126, 84, 219, 48, 53, 122, 121, 80, 155, 147, 62, 112, 221, 54, 69, 60, 35, 146, 27, 46, 82, 232, 28, 59, 223, 90, 139] }, Item { key: [124, 236, 82, 70, 7, 22, 173, 19, 197, 98, 224, 23, 33, 249, 11, 29, 253, 146, 67, 103, 178, 104, 220, 230, 42, 9, 60, 100, 14, 202, 28, 83] }, Item { key: [11, 83, 238, 201, 0, 57, 41, 0, 150, 250, 8, 242, 178, 159, 121, 232, 122, 37, 100, 42, 241, 229, 117, 74, 123, 68, 241, 153, 252, 113, 178, 199] }, Item { key: [101, 186, 163, 4, 25, 181, 111, 199, 58, 230, 69, 69, 41, 223, 235, 48, 56, 175, 138, 197, 206, 42, 87, 48, 93, 133, 219, 77, 191, 4, 155, 148] }, Item { key: [213, 165, 94, 56, 134, 171, 213, 68, 185, 194, 11, 37, 156, 16, 57, 72, 33, 181, 119, 236, 209, 201, 23, 179, 35, 245, 145, 110, 27,
4, 179, 56] }, Item { key: [19, 113, 125, 88, 124, 58, 21, 110, 251, 104, 146, 178, 44, 50, 239, 230, 86, 144,
50, 20, 59, 248, 69, 103, 68, 115, 70, 114, 216, 77, 241, 95] }, Item { key: [51, 58, 220, 97, 145, 41, 189, 140, 218, 224, 59, 4, 231, 7, 44, 85, 96, 171, 81, 155, 235, 160, 99, 151, 232, 246, 40, 144, 250, 226, 8, 61] }] }))
HostFunction::write set key 0x8c43116e5b7e54db30357a79509b933e70dd36453c23921b2e52e81c3bdf5a8b for service 0 to 0x8c43116e5b7e54db30357a79509b933e70dd36453c23921b2e52e81c3bdf5a8b
HostFunction::write set key 0x7cec52460716ad13c562e01721f90b1dfd924367b268dce62a093c640eca1c53 for service 0 to 0x7cec52460716ad13c562e01721f90b1dfd924367b268dce62a093c640eca1c53
HostFunction::write set key 0x0b53eec90039290096fa08f2b29f79e87a25642af1e5754a7b44f199fc71b2c7 for service 0 to 0x0b53eec90039290096fa08f2b29f79e87a25642af1e5754a7b44f199fc71b2c7
HostFunction::write set key 0x65baa30419b56fc73ae6454529dfeb3038af8ac5ce2a57305d85db4dbf049b94 for service 0 to 0x65baa30419b56fc73ae6454529dfeb3038af8ac5ce2a57305d85db4dbf049b94
HostFunction::write set key 0xd5a55e3886abd544b9c20b259c10394821b577ecd1c917b323f5916e1b04b338 for service 0 to 0xd5a55e3886abd544b9c20b259c10394821b577ecd1c917b323f5916e1b04b338
HostFunction::write set key 0x13717d587c3a156efb6892b22c32efe6569032143bf8456744734672d84df15f for service 0 to 0x13717d587c3a156efb6892b22c32efe6569032143bf8456744734672d84df15f
HostFunction::write set key 0x333adc619129bd8cdae03b04e7072c5560ab519beba06397e8f62890fae2083d for service 0 to 0x333adc619129bd8cdae03b04e7072c5560ab519beba06397e8f62890fae2083d
HostFunction::write set key 0x636f756e745f72616e646f6d5f73746f72616765 for service 0 to 0xf802000000000000
2025-08-28T19:34:19.307Z DEBUG@1#0 boot Decoded instruction: DeleteItems { storage_items: [[149, 41, 73, 208, 88, 126, 127, 38, 63, 90, 251, 142, 170, 75, 221, 104, 158, 121, 163, 127, 255, 92, 80, 91, 105, 173, 15, 193, 43, 132, 255, 139], [82, 81, 252, 99, 214, 173, 26, 12, 213, 213, 39, 52, 192, 43, 167, 15, 49, 125, 252, 178, 214, 54, 20, 193, 40, 53, 208, 122, 168, 241, 95, 64], [101, 186, 163, 4, 25, 181, 111, 199, 58, 230, 69, 69, 41, 223, 235, 48, 56, 175, 138, 197, 206, 42, 87, 48, 93, 133, 219, 77, 191, 4, 155, 148], [11, 83, 238, 201, 0,
57, 41, 0, 150, 250, 8, 242, 178, 159, 121, 232, 122, 37, 100, 42, 241, 229, 117, 74, 123, 68, 241, 153, 252, 113, 178, 199]] }
2025-08-28T19:34:19.313Z INFO@1#0 boot Deleting item: [95, 29, 49, d0, 58, 7e, 7f, 26, 3f, 5a, fb, 8e, aa, 4b,
dd, 68, 9e, 79, a3, 7f, ff, 5c, 50, 5b, 69, ad, 0f, c1, 2b, 84, ff, 8b]
HostFunction::write delete key 0x952949d0587e7f263f5afb8eaa4bdd689e79a37fff5c505b69ad0fc12b84ff8b for service 0
2025-08-28T19:34:19.320Z INFO@1#0 boot Deleting item: [52, 51, fc, 63, d6, ad, 1a, 0c, d5, d5, 27, 34, c0, 2b,
a7, 0f, 31, 7d, fc, b2, d6, 36, 14, c1, 28, 35, d0, 7a, a8, f1, 5f, 40]
HostFunction::write delete key 0x5251fc63d6ad1a0cd5d52734c02ba70f317dfcb2d63614c12835d07aa8f15f40 for service 0
2025-08-28T19:34:19.326Z INFO@1#0 boot Deleting item: [65, ba, a3, 04, 19, b5, 6f, c7, 3a, e6, 45, 45, 29, df,
eb, 30, 38, af, 8a, c5, ce, 2a, 57, 30, 5d, 85, db, 4d, bf, 04, 9b, 94]
HostFunction::write delete key 0x65baa30419b56fc73ae6454529dfeb3038af8ac5ce2a57305d85db4dbf049b94 for service 0
2025-08-28T19:34:19.331Z INFO@1#0 boot Deleting item: [0b, 53, ee, c9, 00, 39, 29, 00, 96, fa, 08, f2, b2, 9f,
79, e8, 7a, 25, 64, 2a, f1, e5, 75, 4a, 7b, 44, f1, 99, fc, 71, b2, c7]
HostFunction::write delete key 0x0b53eec90039290096fa08f2b29f79e87a25642af1e5754a7b44f199fc71b2c7 for service 0
2025-08-28T19:34:19.333Z INFO@1#0 4 items deleted successfully, 0 keys not found
2025-08-28T19:34:19.345Z INFO@1#0 boot Bootstrap Service Accumulate, 0h @324 $18446744073709551615
2025-08-28T19:34:19.370Z DEBUG@1#0 boot Decoded instruction: RandomStorageAccumulate(Ok(Output { items: [Item { key: [140, 67, 17, 110, 91, 126, 84, 219, 48, 53, 122, 121, 80, 155, 147, 62, 112, 221, 54, 69, 60, 35, 146, 27, 46, 82, 232, 28, 59, 223, 90, 139] }, Item { key: [11, 83, 238, 201, 0, 57, 41, 0, 150, 250, 8, 242, 178, 159, 121, 232, 122, 37, 100, 42, 241, 229, 117, 74, 123, 68, 241, 153, 252, 113, 178, 199] }, Item { key: [124, 236, 82, 70, 7, 22, 173, 19, 197, 98, 224, 23, 33, 249, 11, 29, 253, 146, 67, 103, 178, 104, 220, 230, 42, 9, 60, 100, 14, 202, 28, 83] }, Item { key: [101, 186, 163, 4, 25, 181, 111, 199, 58, 230, 69, 69, 41, 223, 235, 48, 56, 175, 138, 197, 206, 42, 87, 48, 93, 133, 219, 77, 191, 4, 155, 148] }] }))
HostFunction::write set key 0x8c43116e5b7e54db30357a79509b933e70dd36453c23921b2e52e81c3bdf5a8b for service 0 to 0x8c43116e5b7e54db30357a79509b933e70dd36453c23921b2e52e81c3bdf5a8b
HostFunction::write set key 0x0b53eec90039290096fa08f2b29f79e87a25642af1e5754a7b44f199fc71b2c7 for service 0 to 0x0b53eec90039290096fa08f2b29f79e87a25642af1e5754a7b44f199fc71b2c7
HostFunction::write set key 0x7cec52460716ad13c562e01721f90b1dfd924367b268dce62a093c640eca1c53 for service 0 to 0x7cec52460716ad13c562e01721f90b1dfd924367b268dce62a093c640eca1c53
HostFunction::write set key 0x65baa30419b56fc73ae6454529dfeb3038af8ac5ce2a57305d85db4dbf049b94 for service 0 to 0x65baa30419b56fc73ae6454529dfeb3038af8ac5ce2a57305d85db4dbf049b94
HostFunction::write set key 0x636f756e745f72616e646f6d5f73746f72616765 for service 0 to 0xfc02000000000000
```


## Comment by @vekexasia

```
{
  original: '0x0b53eec90039290096fa08f2b29f79e87a25642af1e5754a7b44f199fc71b2c7',
  state: '0x007c004d009b0018685645d52c326005ea488c8456e725ff64e6a1759964d8'
}
```
this is set & deleted in my first acc. 
then its set again on 2nd accumulation

--
```
{
  original: '0x65baa30419b56fc73ae6454529dfeb3038af8ac5ce2a57305d85db4dbf049b94',
  state: '0x007600000014004dbf99722c645a8d721815ae4fbe6b108d51b71ea717f666'
}
```
same thing. set+deleted in first accumulation, then set again on 2nd



## Comment by @jaymansfield

Spent a bit more time on this. The two keys that were expected to be removed (0x007600000014004dbf99722c645a8d721815ae4fbe6b108d51b71ea717f666 and 0x007c004d009b0018685645d52c326005ea488c8456e725ff64e6a1759964d8), were actually removed in the first accumulation, but get added back in the second. 

The main question is should the second accumulation have occurred or not.


## Comment by @sourabhniyogi

Wow, very interesting fuzz -- There there are 3 work reports **all from service 0**, the first 2 of which hit the G_T threshold exactly. 
BUT its not about a <= vs < edge case.  Instead, we believe the dispute concerns the fact that we cannot have any service accumulated twice from this constraint:

 <img width="432" height="121" alt="image" src="https://github.com/user-attachments/assets/1ae5cae6-f240-4f26-bd88-1bb6d5a155af" />

We must win parallel service accumulation here -- we cannot accumulate 0 twice!  

As far as I can tell, there is no aspect of [12.17](https://graypaper.fluffylabs.dev/#/38c4e62/17b60117b601?v=0.7.0) or [12.18](https://graypaper.fluffylabs.dev/#/38c4e62/178403178403?v=0.7.0) that models the above constraint  -- so everyone failed to incorporate it except for Turbojam -- so ... great fuzz!  

So, our new understanding after seeing we did not incorporate the above constraint is:
1. the first outer accumulate should happily accumulate the first two work reports (both of service 0).  
2. but the second outer accumulate cannot accumulate the third work report because service 0 is already accumulated.  

We are able to match state roots of Polkajam + Turbojam by accommodating the constraint.

However, this constraint leaves the third work report (of service 0) hanging -- so sad!   

Could there be a way to put it back in the accumulation queue?  





 



## Comment by @qiweiii

I think the paragraph refers parallel accumulate, not outer.

And at the end of the paragraph it says:

"In the unlikely event it does happen, the block must be considered invalid." 

so the block should be invalid if it refers to outer


## Comment by @davxy

There was a bug on our side. Fixed. Thank you
