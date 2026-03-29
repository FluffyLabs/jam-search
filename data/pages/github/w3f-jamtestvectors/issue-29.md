---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/29'
title: Potential wrong data in safrol tests
site: github.com/w3f/jamtestvectors
created_at: '2024-12-12T16:23:33.000Z'
last_modified: '2024-12-12T16:23:33.000Z'
---

# Potential wrong data in safrol tests

## Issue by @xDimon

During implement tests, was figured out incorrect test data: 

- In some tests `state.gamma_k[].attempt` has incorrect values == 2 (by gray-paper it must be less then N=2, see 3rd paragraph of section 6.7. "The Extrinsic and Tickets"). 
Because that more tests fail immediately with such error-code, although other results are expected.

- In expected result state all newly added tickets `state.gamma_k[].attempt` have value == 0, but some original value from `input.extrinsics[].attempt` has not-zero value.



## Comment by @davxy

@xDimon 

> In some tests state.gamma_k[].attempt has incorrect values == 2 

If you are referring to `tiny` vectors, this config has max attempts set to 3 (see https://docs.jamcha.in/basics/chain-spec/Tiny)

Regarding your second point, I'll need to look into that. Is there a specific vector you'd like to highlight?


## Comment by @xDimon

@davxy 
> If you are referring to tiny vectors, this config has max attempts set to 3 (see https://docs.jamcha.in/basics/chain-spec/Tiny)

The constant `tickets_per_validator` is not presented in `*-const.asn`. I think presented `max-tickets-per-block` means some different.

I opened PR https://github.com/davxy/jam-test-vectors/pull/4 for add it.


## Comment by @xDimon

@davxy 
> Is there a specific vector you'd like to highlight?

Sure:
```
tiny/publish-tickets-no-mark-2
tiny/publish-tickets-no-mark-6
tiny/publish-tickets-with-mark-2
tiny/publish-tickets-with-mark-3
full/publish-tickets-no-mark-2
full/publish-tickets-no-mark-6
full/publish-tickets-with-mark-2
full/publish-tickets-with-mark-3
```


## Comment by @davxy

gamma_k are not the tickets, but the validator key set scheduled or the next session (this is the same type as base state lamba, kappa, iota).

The attempt number is registered with the `gamma_a`, which has the `attempt` number together with the ticket `id` (function of the signature from in the `extrinsic`)

![screenshot-2024-12-13-10-35-20](https://github.com/user-attachments/assets/e87d5e5e-cbb3-4773-833b-9bf7d24451b0)





## Comment by @xDimon

Yes, I meant `gamma_a` of cause. And yes, there are not mistake in data. One mistake is figured out in our implementation. Already fixed.

But I found another problem: some output data, namely the error code, is implementation-dependent in the case where the input data contains more than exactly one invalid case.

For example, currently `tiny/publish-tickets-no-mark-1` 
- `input.extrinsic[2].attempt` has value `3`, such must be less N=3. 
Result is error "bad-ticket-attempt"
- `TicketId` of `input.extrinsic[1]` less then `TicketId` of `input.extrinsic[0]`
Result is error "bad-ticket-order"
Output data expects error "bad-ticket-attempt", but our implementation output error "bad-ticket-order".

I could reorder the checks, but another test stats to fail - `tiny/publish-tickets-no-mark-1`. It has both violations: `input.extrinsic[1]` has invalid `attempts` and it's `TicketId` less then of previous one.

Hotfix for this cases is swap first and second element `input.extrinsic`. 

I suggest to change **data as presenting exactly one invalid case or none**. It makes test data implementation independent.


## Comment by @davxy

> Yes, I meant `gamma_a` of cause. And yes, there are not mistake in data. One mistake is figured out in our implementation. Already fixed.
> 
> But I found another problem: some output data, namely the error code, is implementation-dependent in the case where the input data contains more than exactly one invalid case.
> 
> For example, currently `tiny/publish-tickets-no-mark-1`
> 
>     * `input.extrinsic[2].attempt` has value `3`, such must be less N=3.
>       Result is error "bad-ticket-attempt"
> 
>     * `TicketId` of `input.extrinsic[1]` less then `TicketId` of `input.extrinsic[0]`
>       Result is error "bad-ticket-order"
>       Output data expects error "bad-ticket-attempt", but our implementation output error "bad-ticket-order".
> 
> 
> I could reorder the checks, but another test stats to fail - `tiny/publish-tickets-no-mark-1`. It has both violations: `input.extrinsic[1]` has invalid `attempts` and it's `TicketId` less then of previous one.
> 
> Hotfix for this cases is swap first and second element `input.extrinsic`.
> 
> I suggest to change **data as presenting exactly one invalid case or none**. It makes test data implementation independent.

You're right; I'll make that change. If you come across any other instances, please let me know. 
For the moment you can ignore the error code (as it is not in the spec)
Thanks!


## Comment by @davxy

@xDimon I guess tgis can be closes now? I can't close issues here


## Comment by @xDimon

> [@xDimon](https://github.com/xDimon)Думаю, tgis теперь можно закрыть? Я не могу закрыть вопросы здесь

sure
