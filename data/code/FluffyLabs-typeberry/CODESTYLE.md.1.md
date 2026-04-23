---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/CODESTYLE.md#L85-L168'
title: CODESTYLE.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 2e8038353bc9536f1e543b139806f57ac625496dbdadc828f1588f2753600c70
language: markdown
---
`CODESTYLE.md` (lines 85–168)

```markdown
1. Prefer using `Opaque` types, like `U32/U16/U8` to represent fixed-size numbers.
2. Cast using `as` ONLY when there is no other option, since over time the `as`
   cast might be easily broken.
3. When you have a function that converts between one type to another use `ensure`
   or `check` to verify that the value is correct.
4. Use `tryAs*` convention to indicate that there might be exception being thrown
   (however never rely on the exception - do any checks BEFORE attempting to cast).

# Exceptions

1. Usage of exceptions should be rare - it should indicate development bug not
   regular behaviour.
2. You should not rely on specific exceptions to be thrown and caught in other
   places - rather use explicit return types for this.
3. Especially avoid catching exceptions coming from `check` and `ensure` since
   these might be removed in the production code.
4. Do not create sub-classes of `Error` type to distinguish errors. Use `Result`
   instead.

# Dos and Don'ts

## Dos

1. Use `Result` type for returning errors, not exceptions.
2. Use tagged unions for multiple different values.
3. Separate data from logic - use dumb containers and standalone functions.
4. Use `static` builder methods and keep constructors private.
5. Use sized integer types (`U16`, `U32`, etc).

## Don'ts

1. Do not use `instanceof`.
2. Avoid using property existence (`in` operator) to detect types.
3. Do not add methods to data objects.

# Reviews

The point of the review is not to show off your skills or prove that you are
smarter than the reviewee. The point is to make them a better programmer
and ensure that the code that's going to be included is:
1. Correct
2. High quality

It doesn't need to be perfect, and may inhibit signs of individual coder's style.
That's okay.

Performance critical code should be measured (micro benchmarked) and only then
some controversial perf-related suggestions should be applied.

## Merge Pull Request Process

1. The PR is **opened** by the author and is _no longer a draft_.
2. Draft PRs _can be_ reviewed, but the _comments do not need to be addressed_ if
    the code is subject to change anyway.
3. The author **requests 1 or more** reviewers to review the PR.
4. **At least two _requested_** reviewers **must approve** the PR (unless only one was
    requested). No unresolved discussions may remain.
5. Non-requested core devs may still volunteer a review. **If they leave any comments,
    their explicit approval is required before merging.**
6. If a reviewer **does not leave comments**, the review status **must be** **`Approve`**.
7. If **any comments** are left, the status may be one of:
    1. **`Approve`** - **re-review is not required**, the reviewer trusts the author to
        fix all the issues at their free discretion. Reply comments are not required.
        If the PR is all-approved, author **can resolve** comments under **approved review**
        and merge PR after CI passes.
    2. **`Comment`** - reviewer is opening a discussion with the author to address
        some of the issues. Addressing _DOES not necessarily mean fixing_ as reviewer
        requested, but rather might just require a _reply comment_ with justification
        for the code in question. **Re-review** of addressed issues is **required**.
        The author **does not resolve discussions**.
    3. **`Request Changes`** - the reviewer has a strong opinion that the code should
        not be merged in its current form. The author MUST consider either changing
        the code or persuading the reviewer that their view is wrong.
        The author **does not resolve discussions**.

8. At any point in time, when the PR is all-approved it can be merged. To simplify
    the process, the **last reviewer to approve a PR is requested to merge** it immediately
    after approval.

# Priorities

To ensure a smooth development process and a positive experience for contributors,
repository maintainers should follow these priorities:

```
