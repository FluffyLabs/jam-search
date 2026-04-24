---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/pull/6'
title: Add jampy target to workflows
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-15T10:40:19.000Z'
last_modified: '2026-03-15T10:40:19.000Z'
content_kind: pr
---

# Add jampy target to workflows

## Pull Request by @dakk



<!-- This is an auto-generated comment: release notes by coderabbit.ai -->
## Summary by CodeRabbit

* **New Features**
  * Added automated performance testing for jampy with scheduled and manual run options.

* **Documentation**
  * Updated README to include jampy in the performance table and added a performance badge/link.
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

**Run ID**: `0ed6d60e-4afe-405b-8ac9-0a08ac2183e7`

</details>

<details>
<summary>📥 Commits</summary>

Reviewing files that changed from the base of the PR and between b1ca7e987de620ccd8604783dc487d9fdade66f5 and 5edc23cfc18208ef74e8e35b160454acfe61a579.

</details>

<details>
<summary>📒 Files selected for processing (1)</summary>

* `.github/workflows/jampy-performance.yml`

</details>

</details>

---


<!-- walkthrough_start -->

<details>
<summary>📝 Walkthrough</summary>

## Walkthrough

Adds a new GitHub Actions workflow "Performance: jampy" (scheduled and manual) that reuses an existing reusable workflow; updates the Deploy Dashboard workflow to trigger after this workflow; README gains a jampy entry in the Minifuzz + Performance table.

## Changes

|Cohort / File(s)|Summary|
|---|---|
|**Performance workflow** <br> `​.github/workflows/jampy-performance.yml`|New workflow "Performance: jampy" added; scheduled (cron: '0 6 * * *') and workflow_dispatch triggers; job reuses `.github/workflows/reusable-picofuzz.yml` with parameters: `target_name: jampy`, `docker_image: ghcr.io/dakk/jampy-target:0.7.2`, `docker_cmd: --socket-file {TARGET_SOCK}`.|
|**Deploy dashboard trigger** <br> `​.github/workflows/deploy-dashboard.yml`|Dashboard workflow updated to include `"Performance: jampy"` in the `workflow_run -> workflows` list so it runs after the jampy performance workflow completes.|
|**Documentation** <br> `README.md`|Added a new jampy entry/row in the Minifuzz + Performance table (performance badge/link).|

## Estimated code review effort

🎯 2 (Simple) | ⏱️ ~10 minutes

## Poem

> 🐰 I hopped to the CI with a squeak and a grin,  
> I added a jampy run to fuzz all the things within.  
> Scheduled at dawn, and hand-run by choice,  
> Reusing a workflow to keep the same voice.  
> Hop, hop — performance badges now gleam!

</details>

<!-- walkthrough_end -->


<!-- pre_merge_checks_walkthrough_start -->

<details>
<summary>🚥 Pre-merge checks | ✅ 3</summary>

<details>
<summary>✅ Passed checks (3 passed)</summary>

|     Check name     | Status   | Explanation                                                                                                                                                                                                          |
| :----------------: | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  Description Check | ✅ Passed | Check skipped - CodeRabbit’s high-level summary is enabled.                                                                                                                                                          |
|     Title check    | ✅ Passed | The title accurately summarizes the main change: adding jampy target to workflows across multiple files including the new jampy-performance.yml workflow, deploy-dashboard.yml trigger, and README.md documentation. |
| Docstring Coverage | ✅ Passed | No functions found in the changed files to evaluate docstring coverage. Skipping docstring coverage check.                                                                                                           |

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

Thanks for using [CodeRabbit](https://coderabbit.ai?utm_source=oss&utm_medium=github&utm_campaign=FluffyLabs/jam-testing&utm_content=6)! It's free for OSS, and your support helps us grow. If you like it, consider giving us a shout-out.

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

@dakk the image seems to be private / non-existent, can you check?


## Comment by @dakk

> @dakk the image seems to be private / non-existent, can you check?

Fixed now


## Comment by @tomusdrw

@dakk 
```
[jampy] [PYI-1:ERROR] Failed to load Python shared library '/opt/jampy-target-0.7.2_x86-64/_internal/libpython3.11.so.1.0': /lib/x86_64-linux-gnu/libm.so.6: version `GLIBC_2.38' not found (required by /opt/jampy-target-0.7.2_x86-64/_internal/libpython3.11.so.1.0)
```

https://github.com/FluffyLabs/jam-testing/actions/runs/23113614274/job/67135247558#step:5:33


## Comment by @dakk

I updated the docker image with a newer version of debian, and it seems to work now


## Comment by @dakk

@tomusdrw I don't get why at some point the ci hangs, and then timeout: https://github.com/FluffyLabs/jam-testing/actions/runs/23136052605/job/67200886358

for instance, in picofuzz - fallback it processed all the blocks and then hanged


## Comment by @tomusdrw

After the tests are finished we attempt to terminate the target first by sending SIGTERM and when that doesn't work we send SIGKILL. It seems to me that neither of this works for jampy after the 10x picofuzz runs.

Since it works fine for minifuzz, my guess is that the issue is casued by repeated runs. Each run closes and re-opens the socket. I'm running a test now to confirm my suspicion, see #10 


## Comment by @tomusdrw

Is this a hard requirement of your target? I'd prefer to test with lower values first if you don't mind.


## Comment by @dakk

Not an hard requirement, it's the value they're using to fuzz jampy for comformance; I removed the flag for now


## Comment by @tomusdrw

Thanks! Let's try with the defaults, I'm actually gauging all of the implementations right now to come up with some sensible default for everyone. This should define a proper experimentation boundary. I was thinking that 512M should be enough for everyone, but because we are running the picofuzz 10 times in a row some targets go OOM.
@coderabbitai please create an issue for making docker memory fixed for everyone. I'm leaning toward 2048m, but some of the targets might need to alter their code to support that.


## Comment by @coderabbitai[bot]

<details>
<summary>🧩 Analysis chain</summary>

🏁 Script executed:
```
#!/bin/bash
gh issue create \
  --repo FluffyLabs/jam-testing \
  --title "Standardize docker memory limit for all performance targets" \
  --body "## Context

This issue tracks the work to standardize docker memory limits across all performance workflow targets.

Currently, each team's \`*-performance.yml\` workflow can specify its own \`docker_memory\` value, which leads to inconsistency. The goal is to define a single, sensible default for everyone.

## Problem

- Running picofuzz 10 times in a row can cause some targets to go OOM at lower limits (e.g. 512M).
- Some targets have been setting their own values (e.g. \`8192m\`) based on their own fuzzing setup, rather than a shared standard.

## Proposal

- Set a fixed \`docker_memory\` default of \`2048m\` for all targets in the reusable workflow.
- Remove per-team \`docker_memory\` overrides.
- Teams whose targets exceed this limit should optimize their code to work within the \`2048m\` boundary.

## References

- PR: https://github.com/FluffyLabs/jam-testing/pull/6
- Comment: https://github.com/FluffyLabs/jam-testing/pull/6#discussion_r2936679001

/cc `@tomusdrw`" \
  --assignee tomusdrw
```

Length of output: 50

---

🏁 Script executed:
```
#!/bin/bash
gh issue list --repo FluffyLabs/jam-testing --state open --limit 5
```

Length of output: 137

---



</details>

`@tomusdrw`, I've created the issue here: **https://github.com/FluffyLabs/jam-testing/issues/7**

It captures the context around standardizing docker memory to `2048m` for all targets, the OOM problem with 10 sequential picofuzz runs, and the expectation that teams needing more memory should optimize their code to fit within that boundary.

<!-- This is an auto-generated reply by CodeRabbit -->
