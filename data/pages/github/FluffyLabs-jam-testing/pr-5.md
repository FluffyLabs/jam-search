---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/pull/5'
title: 'JOTL: increase container memory to 2048m'
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-14T13:10:04.000Z'
last_modified: '2026-03-14T13:10:04.000Z'
---

# JOTL: increase container memory to 2048m

## Pull Request by @polykrate

SBCL needs a larger heap for 128 live states (fork support) and bounded GC pauses. The startup script auto-sizes the heap to 75% of the container limit.

Made with [Cursor](https://cursor.com)

<!-- This is an auto-generated comment: release notes by coderabbit.ai -->

## Summary by CodeRabbit

* **Chores**
  * Enhanced performance testing infrastructure by allocating additional memory resources to the Docker environment, enabling more stable and efficient test execution.

<!-- end of auto-generated comment: release notes by coderabbit.ai -->


## Comment by @coderabbitai[bot]

<!-- This is an auto-generated comment: summarize by coderabbit.ai -->
No actionable comments were generated in the recent review. 🎉

<details>
<summary>ℹ️ Recent review info</summary>

<details>
<summary>⚙️ Run configuration</summary>

**Configuration used**: Path: .coderabbit.yaml

**Review profile**: CHILL

**Plan**: Pro

**Run ID**: `cab37ef6-1a8e-401d-89f9-79cb85cc6353`

</details>

<details>
<summary>📥 Commits</summary>

Reviewing files that changed from the base of the PR and between 80864123626ef9336cc925d496fde5ecfdb45d3f and b00c8980ab14337ba6dc58110171163b7eb5966e.

</details>

<details>
<summary>📒 Files selected for processing (1)</summary>

* `.github/workflows/jotl-performance.yml`

</details>

</details>

---


<!-- walkthrough_start -->

<details>
<summary>📝 Walkthrough</summary>

## Walkthrough

This pull request increases Docker container memory allocation for the reusable-picofuzz workflow in the GitHub Actions performance testing pipeline by adding a `docker_memory: '2048m'` parameter to the workflow invocation.

## Changes

|Cohort / File(s)|Summary|
|---|---|
|**Workflow Configuration** <br> `.github/workflows/jotl-performance.yml`|Added `docker_memory: '2048m'` input parameter to the reusable-picofuzz workflow invocation to allocate 2GB of memory to the Docker container.|

## Estimated code review effort

🎯 1 (Trivial) | ⏱️ ~2 minutes

## Possibly related PRs

- **FluffyLabs/jam-testing#2** — Introduces the reusable-picofuzz workflow invocation that this PR now configures with the docker_memory parameter.

## Poem

> 🐰 A memory boost hops into view,
> Two gigs of RAM for fuzzing through,
> The Docker container grows more strong,
> Performance tests won't take as long! 💨

</details>

<!-- walkthrough_end -->


<!-- pre_merge_checks_walkthrough_start -->

<details>
<summary>🚥 Pre-merge checks | ✅ 3</summary>

<details>
<summary>✅ Passed checks (3 passed)</summary>

|     Check name     | Status   | Explanation                                                                                                                       |
| :----------------: | :------- | :-------------------------------------------------------------------------------------------------------------------------------- |
|  Description Check | ✅ Passed | Check skipped - CodeRabbit’s high-level summary is enabled.                                                                       |
|     Title check    | ✅ Passed | The title directly describes the main change: increasing container memory allocation to 2048m in the JOTL workflow configuration. |
| Docstring Coverage | ✅ Passed | No functions found in the changed files to evaluate docstring coverage. Skipping docstring coverage check.                        |

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

Thanks for using [CodeRabbit](https://coderabbit.ai?utm_source=oss&utm_medium=github&utm_campaign=FluffyLabs/jam-testing&utm_content=5)! It's free for OSS, and your support helps us grow. If you like it, consider giving us a shout-out.

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


<!-- 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 -->

<!-- internal state end -->


## Comment by @tomusdrw

Just out of curiosity: did you notice any failures, or do you intend to see better perf numbers because of this?


## Comment by @polykrate

Hello !
No failures, I'm trying to understand why it is so slow, could be ram, or unoptimized garbage collector on the lisp side. 


## Comment by @tomusdrw

Make sure to take a good look at the test data. AFAICT:
1. Storage & Storage_tiny should be dominated by PVM execution time / storage host calls.
2. Safrole is probably dominated by ticket verification
3. Fallback is probably dominated by signature verification.

Good luck with optimizing!
