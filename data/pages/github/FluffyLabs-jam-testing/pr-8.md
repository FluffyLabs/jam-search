---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/pull/8'
title: 'feat: add new-jamneration team'
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-15T14:10:48.000Z'
last_modified: '2026-03-15T14:10:48.000Z'
content_kind: pr
---

# feat: add new-jamneration team

## Pull Request by @YCC3741

## Summary

- Add `new-jamneration` team to the JAM testing suite
- Docker image: `ghcr.io/new-jamneration/new-jamneration-target:latest`
- Source: https://github.com/New-JAMneration/JAM-Protocol

## Changes

- `.github/workflows/new-jamneration-performance.yml` — team workflow file
- `README.md` — add badge row
- `teams/new-jamneration/` — team directory
- `.github/workflows/deploy-dashboard.yml` — add workflow trigger

## Checklist

- [x] Workflow file follows the pattern of existing ones
- [x] Badge row added to `README.md`
- [x] `teams/new-jamneration/` directory created
- [x] Workflow name matches `"Performance: new-jamneration"`
- [x] `deploy-dashboard.yml` updated with workflow trigger
- [x] Docker image is publicly pullable
- [x] Source repo is public
- [x] No changes to shared infrastructure


<!-- This is an auto-generated comment: release notes by coderabbit.ai -->

## Summary by CodeRabbit

* **Chores**
  * Established a new automated performance testing workflow that executes daily at 06:00 UTC with support for manual on-demand triggering
  * Integrated the performance testing workflow into the continuous deployment pipeline to automatically run upon completion of other workflows
  * Updated project documentation to reflect the new performance testing feature

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

**Run ID**: `d0115c30-b604-4c12-90ca-c27b198c1cda`

</details>

<details>
<summary>📥 Commits</summary>

Reviewing files that changed from the base of the PR and between ca4f3f424d556b479609ae1e2bcf469cf46883cc and 25501f8def7e90ffb358fa7cce195b0afee3d19f.

</details>

<details>
<summary>📒 Files selected for processing (4)</summary>

* `.github/workflows/deploy-dashboard.yml`
* `.github/workflows/new-jamneration-performance.yml`
* `README.md`
* `teams/new-jamneration/.gitkeep`

</details>

</details>

---


<!-- walkthrough_start -->

<details>
<summary>📝 Walkthrough</summary>

## Walkthrough

This pull request adds a new performance testing workflow for the "new-jamneration" target, including the workflow definition that runs daily and can be triggered manually, integration with the deployment dashboard via workflow_run triggers, and documentation in the README.

## Changes

|Cohort / File(s)|Summary|
|---|---|
|**GitHub Workflows** <br> `​.github/workflows/deploy-dashboard.yml`, `​.github/workflows/new-jamneration-performance.yml`|Adds "Performance: new-jamneration" to workflow_run triggers in deploy-dashboard.yml and creates a new scheduled performance testing workflow that reuses the picofuzz template with new-jamneration-specific configuration.|
|**Documentation** <br> `README.md`|Adds new-jamneration entry to the Performance table with its associated badge and link.|

## Estimated code review effort

🎯 2 (Simple) | ⏱️ ~8 minutes

## Possibly related PRs

- **#6**: Follows the same pattern of adding a new "Performance: <target>" workflow file and updating the deploy-dashboard.yml trigger list.

## Poem

> 🐰 A new target hops into the race,
> Daily performance tests to check its pace,
> Jamneration swift with metrics so fine,
> The dashboard now watches this fuzzy line! ✨

</details>

<!-- walkthrough_end -->


<!-- pre_merge_checks_walkthrough_start -->

<details>
<summary>🚥 Pre-merge checks | ✅ 3</summary>

<details>
<summary>✅ Passed checks (3 passed)</summary>

|     Check name     | Status   | Explanation                                                                                                                                                                                                      |
| :----------------: | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  Description Check | ✅ Passed | Check skipped - CodeRabbit’s high-level summary is enabled.                                                                                                                                                      |
|     Title check    | ✅ Passed | The title clearly summarizes the main change: adding a new team (new-jamneration) to the testing suite, which is the primary objective reflected in the workflow files, README updates, and directory structure. |
| Docstring Coverage | ✅ Passed | No functions found in the changed files to evaluate docstring coverage. Skipping docstring coverage check.                                                                                                       |

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

Thanks for using [CodeRabbit](https://coderabbit.ai?utm_source=oss&utm_medium=github&utm_campaign=FluffyLabs/jam-testing&utm_content=8)! It's free for OSS, and your support helps us grow. If you like it, consider giving us a shout-out.

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
> <summary>You can enable review details to help with troubleshooting, context usage and more.</summary>
> 
> Enable the `reviews.review_details` setting to include review details such as the model used, the time taken for each step and more in the review comments.
> 
> </details>

<!-- usage_tips_end -->


## Comment by @tomusdrw

@YCC3741 seems the image is private or non-existent, can you check?


## Comment by @YCC3741

Sure. I'll check it



## Comment by @YCC3741

<img width="932" height="58" alt="image" src="https://github.com/user-attachments/assets/6300c559-b7cb-4cc6-8602-c96517f06e3d" />
Done. Thanks a lot.


## Comment by @YCC3741

@tomusdrw 
Hi, the previous run of new-jamneration-performance.yml failed because our Docker image (ghcr.io/new-jamneration/new-jamneration-target) was set to private. We've updated the visibility to public now. Could you please re-run the workflow? Thank you!


## Comment by @tomusdrw

@YCC3741 Seems to be running fine now, but the tests are failing, because we expect exit code 0, however your client returns exit code 2 for some reason. Note we do send SIGTERM to the process after the tests are finished - maybe that's related? Could you inspect that and let me know if you are able to return exit code 0 in such case? See logs here: https://github.com/FluffyLabs/jam-testing/actions/runs/23130924250/job/67183937459


## Comment by @YCC3741

I've fixed the issue mentioned. The client now handles SIGTERM properly and returns exit code 0 when the tests finish. 


## Comment by @YCC3741

Hi @tomusdrw, we've updated our Docker image with graceful SIGTERM handling (exit code 0). The performance workflow is already passing. Could you re-run this fuzz workflow? Thanks!


## Comment by @tomusdrw

Running: https://github.com/FluffyLabs/jam-testing/actions/runs/23196256146

