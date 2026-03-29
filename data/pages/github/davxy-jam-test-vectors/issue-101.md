---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/101'
title: transfer_for_ejected_service-1 wrong statistics
site: github.com/davxy/jam-test-vectors
created_at: '2025-10-09T11:59:27.000Z'
last_modified: '2025-10-09T11:59:27.000Z'
---

# transfer_for_ejected_service-1 wrong statistics

## Issue by @vekexasia

<img width="891" height="215" alt="Image" src="https://github.com/user-attachments/assets/8e8a054b-37d2-4c41-a61f-f4c53df3a9f2" />

Accumulation statistics should not include service 2 (even if all zeros) because service 2 is not in R* at all in GP0.7.1


## Comment by @jaymansfield

This one is also not listed in the accumulate README (@davxy).


## Comment by @davxy

@vekexasia why service 2 is not in R*?

Let's focus on [`work_for_ejected_service-3`](https://github.com/davxy/jam-test-vectors/blob/372204dfba44c5652fbccd974d2da596a2352205/stf/accumulate/tiny/work_for_ejected_service-3.json):

1. Service 2 is in the [queue](https://github.com/davxy/jam-test-vectors/blob/372204dfba44c5652fbccd974d2da596a2352205/stf/accumulate/tiny/work_for_ejected_service-3.json#L85) and depends on a work package (`d54f42578...`) that will be accumulated in this [block](https://github.com/davxy/jam-test-vectors/blob/372204dfba44c5652fbccd974d2da596a2352205/stf/accumulate/tiny/work_for_ejected_service-3.json#L7).
2. When `d54f42578` is accumulated, it unlocks service 2.
3. Consequently, the work of service 2 becomes part of R* (as defined in [§12.12](https://graypaper.fluffylabs.dev/#/1c979cb/161303161303?v=0.7.1) and related expressions).

---

Edit:

It should be noted that, at the time of execution, the code cannot be loaded since the entire account structure has been ejected. Statistics are still updated according to ${R^{*}}_{..n}$ regardless.

We're currently treating this "*missing account*" structure the same way we would handle "*missing code*" ([GP ref](https://graypaper.fluffylabs.dev/#/1c979cb/2f5e022f6502?v=0.7.1)).  
However, this situation currently constitutes **undefined behavior**, as the GP idoesn't specify what to do here - it assumes the service account should still exist at this point ([GP ref](https://graypaper.fluffylabs.dev/#/1c979cb/2f7e022f8602?v=0.7.1)).  
But in this case, we have **e_d[s] = ∅**. I plan to propose an amendment to the GP to address this with the behavior just described



## Comment by @vekexasia

Hello @davxy sorry I only found out after that there were multiple new tests with similar names. I am talking about [transfer_for_ejected_service-1](https://github.com/davxy/jam-test-vectors/blob/v0.7.1/stf/accumulate/tiny/transfer_for_ejected_service-1.json).

Service id 2 exists but is not in the queue like in `-3`. Instead in this service i can see a transfer + eject. when executing `∆+`, the inner call to `∆*` yields **t*** which contains service 2.

But service 2 is not included in R* because:

- given reports do not contain any digest/result of service id =2
- R! is based on R above
- the ready Queue does not contain sid =2. So neither should RQ




## Comment by @jaymansfield

Just asked the same question here https://github.com/davxy/jam-test-vectors/pull/102#issuecomment-3387046802


## Comment by @davxy

@vekexasia @jaymansfield probably you are right. I'll have a look


## Comment by @HanaYukii

+1, we ran into the same issue with service ID 2 .


## Comment by @davxy

Should be fixed
