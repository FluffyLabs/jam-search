---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/pull/3'
title: Add jamzilla and jamzilla-int performance workflows
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-13T23:49:05.000Z'
last_modified: '2026-03-13T23:49:05.000Z'
---

# Add jamzilla and jamzilla-int performance workflows

## Pull Request by @ascrivener

Adds two new team entries for jamzilla (JIT mode) and jamzilla-int (interpreter mode):

- **Workflow files**: `jamzilla-performance.yml` and `jamzilla-int-performance.yml`
- **Docker image**: `ghcr.io/ascrivener/jamzilla-tiny:edge`
- **Command**: `-socket {TARGET_SOCK}`
- **Env**: `PVM_MODE=jit` (jamzilla) / `PVM_MODE=interpreter` (jamzilla-int)
- **Team directories**: `teams/jamzilla/` and `teams/jamzilla-int/`
- **README**: Updated status table with both entries


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
> **Run ID**: `f7dcb83f-22e2-460c-b8e6-633e8b2441fa`
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

Two new GitHub Actions workflows are introduced for scheduled performance testing of jamzilla and jamzilla-int, each configured to run daily and on manual dispatch. The README is updated to document these new performance monitoring entries in the Minifuzz + Performance team table.

## Changes

|Cohort / File(s)|Summary|
|---|---|
|**Performance Workflows** <br> `.github/workflows/jamzilla-int-performance.yml`, `.github/workflows/jamzilla-performance.yml`|Two new workflow files configured to run performance tests on a daily schedule (06:00 UTC) with manual dispatch capability. Both delegate to the reusable-picofuzz workflow with target-specific parameters (jamzilla-int uses interpreter mode, jamzilla uses JIT mode).|
|**Documentation** <br> `README.md`|Two new entries added to the Minifuzz + Performance team table for jamzilla and jamzilla-int, each with corresponding performance badge links.|

## Estimated code review effort

🎯 2 (Simple) | ⏱️ ~8 minutes

</details>

<!-- walkthrough_end -->

<!-- pre_merge_checks_walkthrough_start -->

<details>
<summary>🚥 Pre-merge checks | ✅ 3</summary>

<details>
<summary>✅ Passed checks (3 passed)</summary>

|     Check name     | Status   | Explanation                                                                                                                                                                                |
| :----------------: | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     Title check    | ✅ Passed | The title accurately describes the main change: adding two new performance workflows for jamzilla and jamzilla-int, which matches the changeset contents.                                  |
|  Description check | ✅ Passed | The description is directly related to the changeset, providing clear details about the workflow files, Docker image, commands, environment variables, and README updates that were added. |
| Docstring Coverage | ✅ Passed | No functions found in the changed files to evaluate docstring coverage. Skipping docstring coverage check.                                                                                 |

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

Thanks for using [CodeRabbit](https://coderabbit.ai?utm_source=oss&utm_medium=github&utm_campaign=FluffyLabs/jam-testing&utm_content=3)! It's free for OSS, and your support helps us grow. If you like it, consider giving us a shout-out.

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
<!-- usage_tips_start -->

> [!TIP]
> <details>
> <summary>Migrating from UI to YAML configuration.</summary>
> 
> Use the `@coderabbitai configuration` command in a PR comment to get a dump of all your UI settings in YAML format. You can then edit this YAML file and upload it to the root of your repository to configure CodeRabbit programmatically.
> 
> </details>

<!-- usage_tips_end -->
