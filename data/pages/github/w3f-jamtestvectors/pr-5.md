---
type: page
url: 'https://github.com/w3f/jamtestvectors/pull/5'
title: Safrole tiny/full vectors
site: github.com/w3f/jamtestvectors
created_at: '2024-06-28T13:22:22.000Z'
last_modified: '2024-06-28T13:22:22.000Z'
---

# Safrole tiny/full vectors

## Pull Request by @davxy

[README](https://github.com/davxy/jam-test-vectors/blob/safrole-vectors-full/safrole/README.md)

-  Two vectors flavors:
    - tiny: validators count = 6; epoch length = 12
    - full: validators count = 1023; epoch length = 600

- zkSNARK makes use of Zcash SRS https://zfnd.org/conclusion-of-the-powers-of-tau-ceremony (not anymore zero seeded). Check the README

- Fixed validator data order (Bandersnatch key before ed25519 key)

- Added SCALE encoded blobs together with json files (same ASN.1 schema)

- Use blake2b-256 and not truncated blake2-512

- Fix gamma_k to contain only the public keys commitment (remove constant SRS data)
   
- Rename some fields in asn1 and json with same identifiers used in the GP

- `validate.sh` script: checks validity of json vectors wrt ASN.1 schema (needs https://github.com/eerimoq/asn1tools/pull/182)

---

Closes https://github.com/w3f/jamtestvectors/issues/6


## Comment by @xlc

any descriptions about the scale file? are they only the output? or final state? or both? but in what exact schema?


## Comment by @davxy

> any descriptions about the scale file? are they only the output? or final state? or both? but in what exact schema?

The schema mirrors JSON and is defined by ASN.1.
I'll clearly outline this in the README.


## Comment by @xlc

I see there is a defination of `Testcase`. Maybe also metion it in README


## Comment by @sourabhniyogi

We got our FFI to work based on your example (thank you!), but in trying to verify a "tiny" extrinsic ticket signature of 
https://github.com/w3f/jamtestvectors/blob/826e64f74a352a059f8b172447af7927f02e0fae/safrole/tiny/publish-tickets-no-mark-2.json#L8
we have not been able to verify.   Here is our attempt:
https://gist.github.com/sourabhniyogi/4adca06a3a7ccf8a88839fa6c4a49826
Our expectation is that we build:
* the ring_set from the Bandersnatch pub keys of `gamma_k`
* build the vrf_input from 
 CONCAT( BYTES("jam_ticket_seal"), entropy[2] = "bb30a42c1e62f0afda5f0a4e8a562f7a13a24cea00ee81917b86b89e801314aa" , attempt = 1)
* have an empty aux 
and that we get a verification.  However we get this:

```
# cargo test
    Finished test [unoptimized + debuginfo] target(s) in 0.04s
     Running unittests src/lib.rs (/root/go/src/github.com/colorfulnotion/jam/bandersnatch/target/debug/deps/bandersnatch-9fa1960326cf4d46)

running 1 test
test tests::test_tiny_extrinsic ... FAILED

failures:

---- tests::test_tiny_extrinsic stdout ----
Verifier key: ae280c3b76fc731584540393a46a6b053b63a2f6f915c379e6a7813e14ff97d6f8ca26cbd65ae152f47f38a9415c860da00afa462227bf583e7016c295bb740324ae418936c1d217283b698f15f4c28b1f8d1151cae32f67a7fb4b8b558a76d413d733b534d86582edfc2b1aeb1b80e2e3e9229fc97c165a6987ca2a215c56aa33903702144be692c9a2ee2d0f5f82ae9951db4ac17c939c797fb4c754ca66ce8232a9c9acef5ce00d9942b745be318026992d6c2e10d6a80cbf510ae569019d0abad725f0cbbdbedcc414f05bb339106f65b73ade5039210d9ac3c8f35da09cd8803db067c2e0c23421d02fc6a01889a99db26eb19f668769a8b3f5c41420b6c336900aea2c04b0115befe6bb9136f8ff1fb24e61e9461c724e4f4ee6beb540b22b559d55a7532587166df1eda036043acdbfbebdd662317c46d987f831c6d443b4eb60fe439d0a204aae27d268b5249319559e826ecd057f57d56a87f94c1c6a56495d26b01c8168ba3a6de276165f43e2a2f5d8fb3a24571b00a5f7c41848
Commitment: a99db26eb19f668769a8b3f5c41420b6c336900aea2c04b0115befe6bb9136f8ff1fb24e61e9461c724e4f4ee6beb540b22b559d55a7532587166df1eda036043acdbfbebdd662317c46d987f831c6d443b4eb60fe439d0a204aae27d268b5249319559e826ecd057f57d56a87f94c1c6a56495d26b01c8168ba3a6de276165f43e2a2f5d8fb3a24571b00a5f7c41848
vrf_input_data: 6a616d5f7469636b65745f7365616cbb30a42c1e62f0afda5f0a4e8a562f7a13a24cea00ee81917b86b89e801314aa01
aux_data: 
signature: b342bf8f6fa69c745daad2e99c92929b1da2b840f67e5e8015ac22dd1076343ea95c5bb4b69c197bfdc1b7d2f484fe455fb19bba7e8d17fcaf309ba5814bf54f3a74d75b408da8d3b99bf07f7cde373e4fd757061b1c99e0aac4847f1e393e892b566c14a7f8643a5d976ced0a18d12e32c660d59c66c271332138269cb0fe9c2462d5b3c1a6e9f5ed330ff0d70f64218010ff337b0b69b531f916c67ec564097cd842306df1b4b44534c95ff4efb73b17a14476057fdf8678683b251dc78b0ba9517cca7f2d5c49396b5781a32d91c2b63a821394dd08cd086bf54360fb83bb4144c34d982b77058d32cdaafbd53e2b81d4c6439a61a2c9506d4f719f8d36c6aadfe615ee1c34d3eb378bbe5b9abc73717f0aaa138ae27b8c555a4360e3d9c592d011330b24d701fb70275912bd9373c286fbdda6680c0c9a7e1bfabaf41fb1a727424dd6f694c6d138b07ab9a952b4973a50e7f831e122a9a89d9d04a035481e834a91e175b076ea4b5f08077701c935380eafbbdee000c77855b584ca3527dd3479b5a1209c9be8b3c37100c45c364be6ce83de78d3b4d9f6bfff0fc90135f3aa81c9fac3c7b3c5d229144c9c77ec8c8f8f5de40bc219b447eeb607642733392f3e46d2478e184d1b7dd9e2dcd3090649ed4aef395ee0702736b2795a0e3ac44fb91e9d6f6ce158e7efda882ff7beab99e485c66d3527c4c7c72265e3a150f1329f2f24492d88458b76d329e232cfc5664677d748e62980e7873a2ea4464ccb4568d3dfe342876ada13a930f79bc4751ab108b53432176344f418b0c7e24504dd7e358f42eead9094157cc5f86870009c889f9aab8cf4cc27c5c865a5bb36827b2ceee575fdff5391a9e5a62f6cf8014098499feae2d55867e6b2e36e5499ff93085021c77c9deb170503903525de562206ee9e1b648b27220e2f8147233c914e027057478848501a82836982b932a01668959eab6f7c9aa09c02116bb4b42cc1061cf91fd73b7288c19c6b03a45e2b7bd90cc97b207b8084ce980250ce0fa48ce5d9eb53beabed87e939b24e9e00f016b6af49623616d36003b24b84c3ca776b249e121fad0ff9971ba745a393f8
Ring signature verification failure
```

What did we miss?


## Comment by @davxy

> We got our FFI to work based on your example (thank you!), but in trying to verify a "tiny" extrinsic ticket signature of
> 
> https://github.com/w3f/jamtestvectors/blob/826e64f74a352a059f8b172447af7927f02e0fae/safrole/tiny/publish-tickets-no-mark-2.json#L8
> 
> we have not been able to verify. Here is our attempt:
> https://gist.github.com/sourabhniyogi/4adca06a3a7ccf8a88839fa6c4a49826
> Our expectation is that we build:
> 
>     * the ring_set from the Bandersnatch pub keys of `gamma_k`
> 
>     * build the vrf_input from
>       CONCAT( BYTES("jam_ticket_seal"), entropy[2] = "bb30a42c1e62f0afda5f0a4e8a562f7a13a24cea00ee81917b86b89e801314aa" , attempt = 1)
> 
>     * have an empty aux
>       and that we get a verification.  However we get this:
> 
> 
> ```
> # cargo test
>     Finished test [unoptimized + debuginfo] target(s) in 0.04s
>      Running unittests src/lib.rs (/root/go/src/github.com/colorfulnotion/jam/bandersnatch/target/debug/deps/bandersnatch-9fa1960326cf4d46)
> 
> running 1 test
> test tests::test_tiny_extrinsic ... FAILED
> 
> failures:
> 
> ---- tests::test_tiny_extrinsic stdout ----
> Verifier key: ae280c3b76fc731584540393a46a6b053b63a2f6f915c379e6a7813e14ff97d6f8ca26cbd65ae152f47f38a9415c860da00afa462227bf583e7016c295bb740324ae418936c1d217283b698f15f4c28b1f8d1151cae32f67a7fb4b8b558a76d413d733b534d86582edfc2b1aeb1b80e2e3e9229fc97c165a6987ca2a215c56aa33903702144be692c9a2ee2d0f5f82ae9951db4ac17c939c797fb4c754ca66ce8232a9c9acef5ce00d9942b745be318026992d6c2e10d6a80cbf510ae569019d0abad725f0cbbdbedcc414f05bb339106f65b73ade5039210d9ac3c8f35da09cd8803db067c2e0c23421d02fc6a01889a99db26eb19f668769a8b3f5c41420b6c336900aea2c04b0115befe6bb9136f8ff1fb24e61e9461c724e4f4ee6beb540b22b559d55a7532587166df1eda036043acdbfbebdd662317c46d987f831c6d443b4eb60fe439d0a204aae27d268b5249319559e826ecd057f57d56a87f94c1c6a56495d26b01c8168ba3a6de276165f43e2a2f5d8fb3a24571b00a5f7c41848
> Commitment: a99db26eb19f668769a8b3f5c41420b6c336900aea2c04b0115befe6bb9136f8ff1fb24e61e9461c724e4f4ee6beb540b22b559d55a7532587166df1eda036043acdbfbebdd662317c46d987f831c6d443b4eb60fe439d0a204aae27d268b5249319559e826ecd057f57d56a87f94c1c6a56495d26b01c8168ba3a6de276165f43e2a2f5d8fb3a24571b00a5f7c41848
> vrf_input_data: 6a616d5f7469636b65745f7365616cbb30a42c1e62f0afda5f0a4e8a562f7a13a24cea00ee81917b86b89e801314aa01
> aux_data: 
> signature: b342bf8f6fa69c745daad2e99c92929b1da2b840f67e5e8015ac22dd1076343ea95c5bb4b69c197bfdc1b7d2f484fe455fb19bba7e8d17fcaf309ba5814bf54f3a74d75b408da8d3b99bf07f7cde373e4fd757061b1c99e0aac4847f1e393e892b566c14a7f8643a5d976ced0a18d12e32c660d59c66c271332138269cb0fe9c2462d5b3c1a6e9f5ed330ff0d70f64218010ff337b0b69b531f916c67ec564097cd842306df1b4b44534c95ff4efb73b17a14476057fdf8678683b251dc78b0ba9517cca7f2d5c49396b5781a32d91c2b63a821394dd08cd086bf54360fb83bb4144c34d982b77058d32cdaafbd53e2b81d4c6439a61a2c9506d4f719f8d36c6aadfe615ee1c34d3eb378bbe5b9abc73717f0aaa138ae27b8c555a4360e3d9c592d011330b24d701fb70275912bd9373c286fbdda6680c0c9a7e1bfabaf41fb1a727424dd6f694c6d138b07ab9a952b4973a50e7f831e122a9a89d9d04a035481e834a91e175b076ea4b5f08077701c935380eafbbdee000c77855b584ca3527dd3479b5a1209c9be8b3c37100c45c364be6ce83de78d3b4d9f6bfff0fc90135f3aa81c9fac3c7b3c5d229144c9c77ec8c8f8f5de40bc219b447eeb607642733392f3e46d2478e184d1b7dd9e2dcd3090649ed4aef395ee0702736b2795a0e3ac44fb91e9d6f6ce158e7efda882ff7beab99e485c66d3527c4c7c72265e3a150f1329f2f24492d88458b76d329e232cfc5664677d748e62980e7873a2ea4464ccb4568d3dfe342876ada13a930f79bc4751ab108b53432176344f418b0c7e24504dd7e358f42eead9094157cc5f86870009c889f9aab8cf4cc27c5c865a5bb36827b2ceee575fdff5391a9e5a62f6cf8014098499feae2d55867e6b2e36e5499ff93085021c77c9deb170503903525de562206ee9e1b648b27220e2f8147233c914e027057478848501a82836982b932a01668959eab6f7c9aa09c02116bb4b42cc1061cf91fd73b7288c19c6b03a45e2b7bd90cc97b207b8084ce980250ce0fa48ce5d9eb53beabed87e939b24e9e00f016b6af49623616d36003b24b84c3ca776b249e121fad0ff9971ba745a393f8
> Ring signature verification failure
> ```
> 
> What did we miss?

The problem in your example is that you used a ring size of 6 to initialize the static ring context. 
I generated the context for the test vectors using 1023 (as the full version).
To avoid confusion I'll provide a binary file with the serialized ring context to use. Probably the one we intend to use in production.
(putting this PR to draft for the moment)


## Comment by @sourabhniyogi

>
> The problem in your example is that you used a ring size of 6 to initialize the static ring context. I generated the context for the test vectors using 1023 (as the full version). To avoid confusion I'll provide a binary file with the serialized ring context to use. Probably the one we intend to use in production. (putting this PR to draft for the moment)

Got it -- I got the new ring_context and am pulling the binary of "zcash-srs-2-11-uncompressed.bin" but still no verification yet: 
https://gist.github.com/sourabhniyogi/cc3d5f0cf8017f29e2ae29e16ab019d5
What did we miss?



## Comment by @davxy

> > The problem in your example is that you used a ring size of 6 to initialize the static ring context. I generated the context for the test vectors using 1023 (as the full version). To avoid confusion I'll provide a binary file with the serialized ring context to use. Probably the one we intend to use in production. (putting this PR to draft for the moment)
> 
> Got it -- I got the new ring_context and am pulling the binary of "zcash-srs-2-11-uncompressed.bin" but still no verification yet: https://gist.github.com/sourabhniyogi/cc3d5f0cf8017f29e2ae29e16ab019d5 What did we miss?

That in the meantime I fixed the 1023 vs 6 in the initialization of the context :-) 

For full: initialize the context with ring_size = 1023
For tiny: initialize the context with ring_size = 6


## Comment by @ec2

> > The problem in your example is that you used a ring size of 6 to initialize the static ring context. I generated the context for the test vectors using 1023 (as the full version). To avoid confusion I'll provide a binary file with the serialized ring context to use. Probably the one we intend to use in production. (putting this PR to draft for the moment)
> 
> Got it -- I got the new ring_context and am pulling the binary of "zcash-srs-2-11-uncompressed.bin" but still no verification yet: https://gist.github.com/sourabhniyogi/cc3d5f0cf8017f29e2ae29e16ab019d5 What did we miss?

You need to set RING_SIZE = 6


## Comment by @sourabhniyogi

@davxy We are succeeding with most of the STF successfully thanks to your example, but have a few outstanding cases in "tiny" to address:

1.  For `publish-tickets-no-mark-1.json` this is expected to fail ala `Fail: Submit an extrinsic with more tickets than allowed.` but we are not sure we could know that these come from 1 entity, or what is "allowed" exactly. 

2.  For `publish-tickets-no-mark-2.json` this is expected to fail ala `Re-submit tickets from authority 0.` but there is no way we could know that the ticket submission is from anyone let alone authority 0, and we see no ticketid _duplicates_ in the extrinsic.   Specifically, the existing tickets in the accumulator are 
```
 0x09a696b142112c0af1cd2b5f91726f2c050112078e3ef733198c5f43daa20d2b
 0x3a5d10abc80dda33fe3f40b3bb2e3eefd3e97dda3d617a860c9d94eb70b832ad
 0x5d91e5951d2b62c424b767220498e6d64280fc84ffb16951d93a00c009341498
 0xf28c553c54ea497bb39e20344e7a687523d06390bb8a24a919183599e584e813
```
and the 2 new tickets are 
```
 0x0b07226e17e82a9e447dd914d3a072fff7015c9f58681f7f5f4213487259891f (attempt 1)
 0x1ec38833e785b52adca8c791f8bf479c8cae805c93ce1ed245b32b273e3c9322 (attempt 1)
```
but we don't see evidence of _resubmission_ (in having the same ticket id) and there i-- what did we miss?

3. For `skip-epochs-1.json` it has a skip of three epochs going from 10 to 46.  What is happening in between , for slots 11 through 45?   


## Comment by @davxy

> 1. For `publish-tickets-no-mark-1.json` this is expected to fail ala `Fail: Submit an extrinsic with more tickets than allowed.` but we are not sure we could know that these come from 1 entity, or what is "allowed" exactly.

This test case is not about submitting "more tickets than allowed" (which is 16).
Here fails because there is one entry attempt value (`2`). Because the max tickets per validator is 2, attempt must be 0 or 1.
 
> 2. For `publish-tickets-no-mark-2.json` this is expected to fail ala `Re-submit tickets from authority 0.` 

This test is not supposed to fail. I guess you are referring to `publish-tickets-no-mark-3.json`?

Here you reported only:
```
0x0b07226e17e82a9e..7259891f
0x1ec38833e785b52a..3e3c9322
```

But there are 3 tickets in the extrinsic ;-)

> but there is no way we could know that the ticket submission is from anyone let alone authority 0, and we see no ticketid _duplicates_ in the extrinsic. 

The knowledge that the duplicate is from authority 0 comes from the fact that I generated the tickets, so I know who the author is :-). But indeed doesn't make much sense to write down who is the author. I removed this "hint" from the README (https://github.com/w3f/jamtestvectors/pull/5/commits/f03002563aeb336fe9f88549b9c950320f9b6215)

> 3. For `skip-epochs-1.json` it has a skip of three epochs going from 10 to 46.  What is happening in between , for slots 11 through 45?

This is a borderline case that we don't really expect in prod. It checks what happens when 1+ epochs are skipped (i.e. no block is produced for some reason) and then we see one from some epochs after the one we imported last. 
Nothing special, mostly we stick to equations 45, 57, 66, 67, 70) 




## Comment by @sourabhniyogi

> > 1. For `publish-tickets-no-mark-1.json` this is expected to fail ala `Fail: Submit an extrinsic with more tickets than allowed.` but we are not sure we could know that these come from 1 entity, or what is "allowed" exactly.
> 
> This test case is not about submitting "more tickets than allowed" (which is 16). Here fails because there is one entry attempt value (`2`). Because the max tickets per validator is 2, attempt must be 0 or 1.

Got it, I missed the "2", the README updated description of "Fail: Submit an extrinsic with a bad ticket attempt number." is clear, thank you!
 
> > 2. For `publish-tickets-no-mark-2.json` this is expected to fail ala `Re-submit tickets from authority 0.`
> 
> This test is not supposed to fail. I guess you are referring to `publish-tickets-no-mark-3.json`?
> 
> Here you reported only:
> 
> ```
> 0x0b07226e17e82a9e..7259891f
> 0x1ec38833e785b52a..3e3c9322
> ```
> 
> But there are 3 tickets in the extrinsic ;-)

Sorry about that! (I missed that our implementation was blocking the resubmission.)

> > but there is no way we could know that the ticket submission is from anyone let alone authority 0, and we see no ticketid _duplicates_ in the extrinsic.
> 
> The knowledge that the duplicate is from authority 0 comes from the fact that I generated the tickets, so I know who the author is :-). But indeed doesn't make much sense to write down who is the author. I removed this "hint" from the README ([f030025](https://github.com/w3f/jamtestvectors/commit/f03002563aeb336fe9f88549b9c950320f9b6215))

Thank you -- removing the authority "hints" from the README makes it clearer!

> > 3. For `skip-epochs-1.json` it has a skip of three epochs going from 10 to 46.  What is happening in between , for slots 11 through 45?
> 
> This is a borderline case that we don't really expect in prod. It checks what happens when 1+ epochs are skipped (i.e. no block is produced for some reason) and then we see one from some epochs after the one we imported last. Nothing special, mostly we stick to equations 45, 57, 66, 67, 70)

Alright, we have passed all tiny cases now.



## Comment by @davxy

@gavofyork I think we can merge this. I don't have the authority to do that in this repo.


## Comment by @ec2

Thanks for the tests! Just got all the full and tiny test cases passing late last week as well :) 


## Comment by @ggwpez

```suggestion
- [publish-tickets-with-mark-1](./tiny/publish-tickets-with-mark-1.json)
```
More occurrences below.


## Comment by @ggwpez

Is this:  
- Blake2 of some VRF output
- VRF output
- VRF output hash?

I cannot parse it as compact VRF output, hence i assume it is the first. I know that it does not really matter for the sake of Safrole, but would be still good to know.


## Comment by @davxy

These are 32 octets taken from the VRF output hash of the entropy source signature found in the header (H_v).

So in the "real" scenario, given the ietf-signature that you find in the header (H_v) you:
1) Deserialize it in a [`IetfVrfSignature`](https://github.com/davxy/bandersnatch-vrfs-spec/blob/a92814b468cf86bf17da6cab20321690ca9b545f/example/src/main.rs#L12) structure
2) `let entropy: [u8; 32] = signature.output.hash()[..32].try_into().unwrap();` (or something like that)
   (similar to [this](https://github.com/davxy/bandersnatch-vrfs-spec/blob/a92814b468cf86bf17da6cab20321690ca9b545f/example/src/main.rs#L196))
   
This is how the entropy is properly computed from the block header H_v component (GP expr 60).

As you mentioned, this is not the case in the test vectors as in this context the origin of the 32 octets is not really important. I guess we'll publish some blocks test vectors to verify / import. There you'll need this knowledge



## Comment by @ggwpez

(this comment is supposed to be on the `full` equivalent of this file, but the value is the same).

This is above my calculated ticket score threshold with SAFROLE parameters `r=2, s=600, a=2, v=1023` the cutoff is about `0x9623 << 240`.  
AFAIK `gamma_a` should always be valid, since it is the pre-state.


## Comment by @davxy

I'm not sure I understood your comment.
There is not threshold in Safrole. The threshold was in Sassafras (to allow the user to fine tune the params).


## Comment by @davxy

Here you submit your tickets as far as their score/id end up being in the state after the STF execution.
The rule when gamma_a is full, is that tickets with smaller score win. 
Tickets already in the state with bigger value are discarded.
 All new submitted tickets must be "consumed" (i.e. none of the new tickets is allowed to lose)


## Comment by @ggwpez

Ah, yea i looked at RFC26 🤦‍♂️ . Then that seems correct, thanks! (PS: I cant resolve discussions here)


## Comment by @davxy

No problem. I added this to the README: https://github.com/w3f/jamtestvectors/pull/5/commits/86c007a1e3a11da76c8b8f1f34a4e20992606c27

If you find any other discrepancy worth mentioning we can add it to the list
