---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/pull/4'
title: Add jotl
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-14T13:07:44.000Z'
last_modified: '2026-03-14T13:07:44.000Z'
---

# Add jotl

## Pull Request by @polykrate

Update memory limit from 512 MB to 2048MB

<!-- This is an auto-generated comment: release notes by coderabbit.ai -->

## Summary by CodeRabbit

* **Documentation**
  * Added project documentation for JOTL (JAM On The Lisp).
  * Included new performance monitoring entry with associated badge in the main documentation.

* **New Features**
  * Enabled automated daily performance testing for JOTL with configurable execution parameters.

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

**Run ID**: `ba3a7d03-e0ca-4743-ab99-5c8abdce77dc`

</details>

<details>
<summary>📥 Commits</summary>

Reviewing files that changed from the base of the PR and between 80864123626ef9336cc925d496fde5ecfdb45d3f and 69067f9c1a0f277fc5c7d37b284c780e341186f9.

</details>

<details>
<summary>📒 Files selected for processing (3)</summary>

* `.github/workflows/jotl-performance.yml`
* `README.md`
* `teams/jotl/README.md`

</details>

</details>

---


<!-- walkthrough_start -->

<details>
<summary>📝 Walkthrough</summary>

## Walkthrough

Introduces a new GitHub Actions workflow for performance testing of the jotl target, configured to run on a daily schedule and reuse the existing reusable-picofuzz workflow. Accompanying documentation updates in the root README and a new team-specific README entry are included.

## Changes

|Cohort / File(s)|Summary|
|---|---|
|**Performance Workflow Configuration** <br> `.github/workflows/jotl-performance.yml`|New workflow file that triggers daily or on-demand, delegating to reusable-picofuzz with jotl-specific inputs: docker image (ghcr.io/polykrate/jotl:latest), memory (2048m), and readiness pattern configuration.|
|**Documentation Updates** <br> `README.md`, `teams/jotl/README.md`|Root README updated with jotl performance badge and workflow link in the Minifuzz + Performance table. New team README file created with jotl project header.|

## Estimated code review effort

🎯 2 (Simple) | ⏱️ ~10 minutes

## Possibly related PRs

- [FluffyLabs/jam-testing#2](https://github.com/FluffyLabs/jam-testing/pull/2): Introduces identical changes to jotl-performance.yml workflow configuration and teams/jotl README, directly paralleling this PR.

## Poem

> 🐰 A JAM upon the Lisp so grand,  
> Now dancing in our test command!  
> With JOTL added to the fold,  
> Performance stories to be told. ✨

</details>

<!-- walkthrough_end -->


<!-- pre_merge_checks_walkthrough_start -->

<details>
<summary>🚥 Pre-merge checks | ✅ 2 | ❌ 1</summary>

### ❌ Failed checks (1 inconclusive)

|  Check name | Status         | Explanation                                                                                                                                                                                                     | Resolution                                                                                                                                                         |
| :---------: | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title check | ❓ Inconclusive | The title 'Add jotl' is vague and generic, providing minimal information about what is being added and why, lacking specificity about the actual changes (workflow, performance testing, memory configuration). | Consider a more descriptive title such as 'Add JOTL performance testing workflow with 2048MB memory' to better convey the main purpose and context of the changes. |

<details>
<summary>✅ Passed checks (2 passed)</summary>

|     Check name     | Status   | Explanation                                                                                                |
| :----------------: | :------- | :--------------------------------------------------------------------------------------------------------- |
|  Description Check | ✅ Passed | Check skipped - CodeRabbit’s high-level summary is enabled.                                                |
| Docstring Coverage | ✅ Passed | No functions found in the changed files to evaluate docstring coverage. Skipping docstring coverage check. |

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

Thanks for using [CodeRabbit](https://coderabbit.ai?utm_source=oss&utm_medium=github&utm_campaign=FluffyLabs/jam-testing&utm_content=4)! It's free for OSS, and your support helps us grow. If you like it, consider giving us a shout-out.

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


## Comment by @polykrate

Superseded by #2 (merged) and #5 (memory increase).
