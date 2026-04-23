---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/462'
title: >-
  Address unresolved discussions from PR #451 - Accumulate externalities
  implementation
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-07T15:31:00.000Z'
last_modified: '2025-07-07T15:31:00.000Z'
content_kind: issue
---

# Address unresolved discussions from PR #451 - Accumulate externalities implementation

## Issue by @coderabbitai[bot]

# Unresolved discussions from PR #451

This issue tracks the unresolved discussions and feedback from PR #451 (Accumulate externalities implementation).

**Reference PR:** https://github.com/FluffyLabs/typeberry/pull/451
**Original request:** https://github.com/FluffyLabs/typeberry/pull/451#issuecomment-2293887393

## Major architectural improvements needed

### 1. Interface design and abstraction improvements
- [ ] **Add CurrentServiceNewBalanceProvider interface** - tomusdrw suggested adding this interface to handle balance updates during accumulation:
  ```typescript
  /**
   * During accumulation, the balance of currently accumulated service may change (transfers, etc).
   * That info is stored in `PartialState`, yet we need the most recent balance here as well.
   * The abstraction is introduced to avoid depending directly on `PartialState` (because it makes no sense outside of accumulation).
   */
  interface CurrentServiceNewBalanceProvider {
    getNewBalance(): U64 | null;
  }
  ```

### 2. Service state reflection improvements  
- [ ] **Reflect new balance and storage entries for current service** - The system should reflect updated balance and storage entries when the current service is requested
- [ ] **Return preimages provided using `providePreimage`** - The lookup functionality should return preimages provided using `providePreimage` for the currently accumulated service

### 3. Better abstraction for PartialState integration
- [ ] **Consider returning entire Service instead of just balance** - tomusdrw suggested having a custom function that returns the entire `Service` instead of just the balance, which might be less error prone
- [ ] **Evaluate extending PartialState** - Consider extending `PartialState` and using the extended version in all places during accumulation, or create an issue to figure out better abstraction in the future

## Code quality improvements

### 4. Test improvements
- [ ] **Change test descriptions from 'it' to 'check'** - Update test method calls as suggested in review
- [ ] **Add safety comment for Number conversion** - Add explanation comment for `Number(this.entrypoint)` conversion in `packages/jam/transition/accumulate/pvm-executor.ts`

### 5. Minor code quality fixes
- [ ] **Verify large balance values in tests** - Review if `2 ** 32` balance values in tests are appropriate or should use more realistic values
- [ ] **Update test descriptions** - Change "should not be implemented yet" to "should return null for snapshot length" to match actual implementation
- [ ] **Consider more realistic test values** - Review test balance and utilization values for better test clarity

## General feedback to address

**From tomusdrw's review:**
> I feel like there is quite some room for improvement.
> 
> General thoughts:
> 1. I reckon the externalities are spread too thin (we have read, write, info, lookup) that have very similar logic and because of that read/write just delegate to a more abstract `StorageManager`.
> 2. AFAICT we need to distinguish better the context where `read/write` are being used. In case of `accumulate` we are pretty much focused on a single service and there might be multiple changes to that service (for instance `balance`) that may be affecting `read/write`. In case of `refine/is_authorized` storage changes are possible, but I guess they are not translated into `StateUpdate` and we also know that other things about the account do not change.
> 3. We should alter `write-externalities` interface to have the current service id be implicit. Otherwise we are unnecessarily handling cases where potentially some other services are being modified which is not necessary.

### 6. Architectural refactoring (follow-up work)
- [x] **Consolidate externalities classes** - Consider reducing the separation between read, write, info, and lookup externalities since they share similar logic
- [ ] **Improve context distinction** - Better distinguish between accumulate context vs refine/is_authorized context usage
- [x] **Make current service ID implicit** - Alter write-externalities interface to have the current service ID be implicit rather than explicit parameter

---

/cc @tomusdrw @mateuszsikora
