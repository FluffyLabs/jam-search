---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/pull/2'
title: Add JOTL (JAM On The Lisp) to conformance & performance testing
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-13T21:08:25.000Z'
last_modified: '2026-03-13T21:08:25.000Z'
content_kind: pr
---

# Add JOTL (JAM On The Lisp) to conformance & performance testing

## Pull Request by @polykrate

## Summary

- Add `jotl-performance.yml` workflow calling the reusable picofuzz workflow
- Docker image: `ghcr.io/polykrate/jotl:latest`
- Command: `{TARGET_SOCK}` (socket path passed as first argument)
- Readiness pattern: `Listening on`
- Memory: `2048m` — SBCL needs a larger heap for 128 live states (fork support) and bounded GC pauses

## About JOTL

JOTL is a Common Lisp (SBCL) implementation of the JAM protocol. It speaks the JAM Fuzz protocol v1 over Unix sockets. All 6 minifuzz suites pass locally (`no_forks`, `forks`, `fallback`, `safrole`, `storage`, `storage_light`).

## Test plan

- [x] All 6 minifuzz suites pass locally
- [x] Trigger `workflow_dispatch` to verify on self-hosted runner


## Comment by @coderabbitai[bot]

<!-- This is an auto-generated comment: summarize by coderabbit.ai -->
<!-- This is an auto-generated comment: skip review by coderabbit.ai -->

> [!IMPORTANT]
> ## Review skipped
> 
> Auto incremental reviews are disabled on this repository.
> 
> Please check the settings in the CodeRabbit UI or the `.coderabbit.yaml` file in this repository. To trigger a single review, invoke the `@coderabbitai review` command.
> 
> <details>
> <summary>⚙️ Run configuration</summary>
> 
> **Configuration used**: Organization UI
> 
> **Review profile**: CHILL
> 
> **Plan**: Pro
> 
> **Run ID**: `18c61a70-3cae-4f1d-bce9-a0e3f9acf67d`
> 
> </details>
> 
> You can disable this status message by setting the `reviews.review_status` to `false` in the CodeRabbit configuration file.
> 
> Use the checkbox below for a quick retry:
> - [ ] <!-- {"checkboxId": "e9bb8d72-00e8-4f67-9cb2-caf3b22574fe"} --> 🔍 Trigger review

<!-- end of auto-generated comment: skip review by coderabbit.ai -->

<!-- walkthrough_start -->

<details>
<summary>📝 Walkthrough</summary>

## Walkthrough

Added a new GitHub Actions workflow for performance testing of the "jotl" project, scheduled to run daily at 6 AM and on manual trigger. Also added a README file for the jotl team directory with a project title header.

## Changes

|Cohort / File(s)|Summary|
|---|---|
|**Jotl Infrastructure and Documentation** <br> `.github/workflows/jotl-performance.yml`, `teams/jotl/README.md`|Added new GitHub Actions workflow that reuses an existing picofuzz workflow to run performance tests for jotl with specified Docker image and readiness pattern. Added README header for jotl team directory.|

## Estimated code review effort

🎯 1 (Trivial) | ⏱️ ~3 minutes

</details>

<!-- walkthrough_end -->

<!-- pre_merge_checks_walkthrough_start -->

<details>
<summary>🚥 Pre-merge checks | ✅ 3</summary>

<details>
<summary>✅ Passed checks (3 passed)</summary>

|     Check name     | Status   | Explanation                                                                                                                                                                            |
| :----------------: | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     Title check    | ✅ Passed | The title accurately describes the main change: adding JOTL to conformance and performance testing through the new workflow file.                                                      |
| Docstring Coverage | ✅ Passed | No functions found in the changed files to evaluate docstring coverage. Skipping docstring coverage check.                                                                             |
|  Description check | ✅ Passed | The pull request description is directly related to the changeset, describing the addition of a performance workflow for JOTL and providing relevant context about the implementation. |

</details>

<sub>✏️ Tip: You can configure your own custom pre-merge checks in the settings.</sub>

</details>

<!-- pre_merge_checks_walkthrough_end -->

<!-- finishing_touch_checkbox_start -->

<details>
<summary>✨ Finishing Touches</summary>

<details>
<summary>🧪 Generate unit tests (beta)</summary>

- [ ] <!-- {"checkboxId": "f47ac10b-58cc-4372-a567-0e02b2c3d479", "radioGroupId": "utg-output-choice-group-unknown_comment_id"} -->   Create PR with unit tests
- [ ] <!-- {"checkboxId": "07f1e7d6-8a8e-4e23-9900-8731c2c87f58", "radioGroupId": "utg-output-choice-group-unknown_comment_id"} -->   Post copyable unit tests in a comment

</details>

</details>

<!-- finishing_touch_checkbox_end -->

<!-- pr_review_plan_action_start -->

<details>
<summary>📝 Coding Plan</summary>

- [ ] <!-- {"checkboxId": "6ad8a4e1-0b3a-4ea2-9b5b-d82c1f47d1f2"} --> Generate coding plan for human review comments

</details>

<!-- pr_review_plan_action_end -->

<!-- tips_start -->

---

Thanks for using [CodeRabbit](https://coderabbit.ai?utm_source=oss&utm_medium=github&utm_campaign=FluffyLabs/jam-testing&utm_content=2)! It's free for OSS, and your support helps us grow. If you like it, consider giving us a shout-out.

<details>
<summary>❤️ Share</summary>

- [X](https://twitter.com/intent/tweet?text=I%20just%20used%20%40coderabbitai%20for%20my%20code%20review%2C%20and%20it%27s%20fantastic%21%20It%27s%20free%20for%20OSS%20and%20offers%20a%20free%20trial%20for%20the%20proprietary%20code.%20Check%20it%20out%3A&url=https%3A//coderabbit.ai)
- [Mastodon](https://mastodon.social/share?text=I%20just%20used%20%40coderabbitai%20for%20my%20code%20review%2C%20and%20it%27s%20fantastic%21%20It%27s%20free%20for%20OSS%20and%20offers%20a%20free%20trial%20for%20the%20proprietary%20code.%20Check%20it%20out%3A%20https%3A%2F%2Fcoderabbit.ai)
- [Reddit](https://www.reddit.com/submit?title=Great%20tool%20for%20code%20review%20-%20CodeRabbit&text=I%20just%20used%20CodeRabbit%20for%20my%20code%20review%2C%20and%20it%27s%20fantastic%21%20It%27s%20free%20for%20OSS%20and%20offers%20a%20free%20trial%20for%20proprietary%20code.%20Check%20it%20out%3A%20https%3A//coderabbit.ai)
- [LinkedIn](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fcoderabbit.ai&mini=true&title=Great%20tool%20for%20code%20review%20-%20CodeRabbit&summary=I%20just%20used%20CodeRabbit%20for%20my%20code%20review%2C%20and%20it%27s%20fantastic%21%20It%27s%20free%20for%20OSS%20and%20offers%20a%20free%20trial%20for%20proprietary%20code)

</details>

<sub>Comment `@coderabbitai help` to get the list of available commands and usage tips.</sub>

<!-- tips_end -->

<!-- internal state start -->


<!-- DwQgtGAEAqAWCWBnSTIEMB26CuAXA9mAOYCmGJATmriQCaQDG+Ats2bgFyQAOFk+AIwBWJBrngA3EsgEBPRvlqU0AgfFwA6NPEgQAfACgjoCEYDEZyAAUASpETZWaCrKPR1AGxJcAgrXoAUgDy0AAykAAUAT4AspBBWHAkkKFI3ACUkAQKGABm+BTMmAzJAGQ8lPmFxck0iOIYRJCQBgByjgKUXABMzQYAqjahXLC4uNyIHAD0U0TqsNgCGkzMUwBiHti5ubKhKohTQmjMYHUNRFPc2B4eU70t/YhdPPgesgDWVDR9AMr42BQSpABFQMAxYFw0P4wEJ8LgPJBAEmEMGcpFwwNB4K4RXgWBaP1w1Gwk343DIfQAwhQSNQ6OhOJBugAGboANjATIAzGAAIyc6DdHkcJkADg43QArAAtIwAEWkDAo8G44nwGA4BigfloyDQkAABrD4WAyRQqkUwSQNLJmB59ZAAO4Fd65Dz4B1ZWDURhoG7IXCwZLU4kqLw8eBMXLYABe0cdztd7o0msgj2kkFl+AY70oKCKpANRFgio08Hwl1eHy+JEOcI8HA8tPq+uTUApLAt9G4aEQT3o2QDySYGEJuOe+oA3tAfDYAOIAUWgAH0fkEKQBpAC+9oiiCzOfR3YDPB7ffQyFy8Ao9XQFCIjnY6VbkBsNNoY97J7GlHVBtS9TIXEmjVFsU1afB7DJBh4F9SA2GYAp5AKSAyAkK81TYEd+CkCglSURAAG5IAobAMGQB15lxT1kiUXI0GudEJR5XoYgAIUgDx4GYdRkwMHwBH+dFgjCDUoGE8JUD1dtWDVFI0kiH5WIpUJMi47gvEwwlVSwfBcmoyBojiXg4SzV5nwASXRNSNPYZBDMgNYYzjYyCCYBEJB5bDc36DB4AAD3sfcSFwRBnx8G57H8uDcXgKNY3sbB1HTbtPzdBhfTeLh9QwfAlyqd5EH1AAaA18sKkr9Tom4BDQbNioNRA0FyChXhIer9XqAo0FIdrOqoUgl04otcFAgxoGkQ9G3VFNwoRRAou43y4rjBwkuQHDYvgOlshS5A0oy+QKOPWj6I8RjmMgNi4JIBCXEicFRBzWgnxTaAlSIUglUaA0nQoF03QdJd30QI9wXtWS9SeDxcjAWB8AA+gSIwcg+FQMkMHfRpeP0YxwCgMh6F0nACGIMhlBoegVk0rheH4YRRHEKQZHkJglCoVQeO0XQwEMEwoDgVBJKweiSdIFHaUpjt2C4KgPQcJw7rkBQ2ZUNRNC5nHcdMAwNDmANFimX7/vdA4jQ8E1KgKC0SmtW0NQAIkdgwLEgHxzNJ8WKYShWkL08FMFIRAjC1fw6T1cgPVndQAAlFldsQyzI+M/sTD1vV1+YDaN1PTbrC2zStmpbYRDBjjpe2rEt6pLS4M37efN74A+ygSUQB7aGuMP0SZSBWUgAAqAeh8wSnMGBZILWwA6snez66TQvVs4BoG0mocFn1fYl0zHkg/KQc5iJIEMBDDJf3UiDP9YEQ2EwBg5g0ak+SBNCNdKc4vMlItnIFhARIFLtg/YJrPisKedMuIrghSyBBQch9j6n1vu6DUzQoCEjvMFJcADvA/zrAYFBkBaBBQoEuLi3VsFFhLGWCsbxPi0lrPCBsTZcB4N0AQohS4GDMFoFwKcM4FzLlXBuTcLCoDUihB+RAS4jw0AoL+f8NBfLfTVEYYOkBwLkCMKkcgyB/aNDoFwAA1DyCUUwORGHnPUUhXtWZBhIGhEgHoSDbAKAyGIdB4COAMI7e2wdtY0GOLneEUwbDzh8LKGI84NBcIdk7F2bsPbkzpPLIod0ia6MDkYbU6hE78D0uHBxL5QnhPnJAS8YZvT+OYIE24ISwkRKiZLEc2hFFNEhkBMMMRnDvEIQ6LAgYoTPHtpYcSkBAAoBAZWI8REiBjkiDeuKjnaWHCjI6gid/QwJmUoBgjYvhrNyShPy3AXF0mQlcE+EYUIjmydIVR6iSDmEsJ0paE0HLwDDD4UubxoyUE0R+RgXo9HcMgEY0xTJzGWKKNYxQtj7GOOcRQBkoR3ReKdpqHmWt8YY32SLQgYtEmS1YNLYiaA5aOBSfIJWNj2Zqy0DoHGfMFCsHUCQnUS5qSwroEueozh0SawZTyHkuQBWcgELQTkTERQAHZWQSiFTyVkJBWS5BIDyAALFKugTIVCcmlYq7o4ruaGAMAyqmzL4CsvZVtB0nKCaGuNXjHg1IlxsHQRwwM2ZJHcoRXagwE4WH2yQLYViaUnrSU0lYeGFN7ZcCqk8Iq/qkBBBwnhJQGBo2lN9HG/1hCGD1C+kQdsOEyHmRHD+X0BJaTponJueNzR7Y2JsKrdQAB1FqNArAUHcPCEg6bY0kFrZAe2jZ6gUnde8V8DgzqIHTQAbRYc0P1zQl2DoetmVoZd032y7WGVd7x7YDuXfbbluBiTptwCRft86l3213upTAqy1SbqSFkTwyRaoMABLSN4BCFRKk6P6GZOIsDpOwVCTGTQRnZGHOaGo6AsWmhg5aLIE0gKehatgIs+kI7J2Nh6MpVp91XrrQhJQm6HTOBaYR5ddbqTQabgCHtMbM2Xuo4OgoTdcS+lHY9ddbBN3iG7T45dNar2Luo/WsdvHGODszLm89qHC3KFIFR8Tx7T1cHPdgFj4nb1TQfWmrg9twKlNIgnNUF5/hYqorAkD9B8PrJQhIX0U9vg5rzahpgRbSAaEgD8d4ypuCobc/J76nmlNDjHRoFTh7qR7k2NpTdrakpsLk/mizfBYFRjBNpZA3FeyocHMwaB9hVmIB2PpML/VaiwFi3DDwtAosHuvSR6T9tyOyKAtF697G5ifO42ujdhngtpaE0ukTy6xOHt3VJzd8o25KhVDk3dXW61qenRpi9TW626fvQlwzz6rgRWpAARy0zefCiplTaRQMgd8tH4TyGpI2L2A4ZkgaeLgEqF2/0FZmWB7JskiZ6gQ4XJDZ88PIRGSPR1+A0LgcPl4JzWFhw0D8uiFQgl9LWRuuwfTjWiODpa2RijnWtuDto2qS895qS9uY2T+2PXOMeH6+8GbQ3f1XcTqN5owjmgAF0B1Dp7LgWwc3LuLcfYZkUTjJVMVVaqyV8qRRoGYrQAQPIaQAE4mSsm6AwHXuQRRStFbkSVTIJQkElKqpkTIBC28leKjXtBFe5AYMYgQnImRqoYCpoX9RbDbtazyL3kr1WshKLkboUJw+SqhJr3I4rOTyrQEyTXEpbfx/StbtAJBbeshFAwBgAhJW5C1d0bYqhugilyOn1VKrNe+8QHDa4tBg37lsLTjwWa63vloDYUiYuFvaRZ2ezb2bzX94wIHkfG2tOC975P2TBI0sz5nlpgwwj7UQEdSQZ1lABq7skba+lDqcVSPok8LlWld9et5ei31fuRcX7oD4XAr4OW0DDeodspFcDRqZJvgymft2FvFfrSEuMfjzEAA=== -->

<!-- internal state end -->
<!-- usage_tips_start -->

> [!TIP]
> <details>
> <summary>You can customize the high-level summary generated by CodeRabbit.</summary>
> 
> Configure the `reviews.high_level_summary_instructions` setting to provide custom instructions for generating the high-level summary.
> 
> </details>

<!-- usage_tips_end -->


## Comment by @tomusdrw

Can you please add README.md badge for JOTL?


## Comment by @polykrate

Done.

BTW thanks for the tools in FluffyLabs it helped a lot.


## Comment by @polykrate

Could you also add JOTL to the dashboard's `client-metadata.json` (in the `paritytech/jam-conformance-dashboard` submodule)? Here's the entry:

```json
"jotl": {
  "displayName": "JOTL",
  "language": "Common Lisp",
  "languageColor": "#3fb68b",
  "author": "Community",
  "url": "https://github.com/polykrate/JOTL"
}
```

Currently JOTL shows up on the leaderboard without a language label. Happy to open a separate PR to the dashboard repo if preferred.


## Comment by @tomusdrw

It's a submodule, so the fix needs to be in https://github.com/paritytech/jam-conformance-dashboard/ and then feel free to create a PR to just bump the submodule version. Thanks! 
