---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/982'
title: Flip ghcr-cleanup-action dry-run to false after first run review
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-27T20:33:42.000Z'
last_modified: '2026-05-27T20:33:42.000Z'
content_kind: issue
---

# Flip ghcr-cleanup-action dry-run to false after first run review

## Issue by @coderabbitai[bot]

## Follow-up from #972

After the Docker publishing workflow (#972) is merged and the first real push-to-main run completes, the `Cleanup old pre-release images` step in `.github/workflows/publish.yml` should be reviewed and the `dry-run` flag flipped from `true` to `false`.

### Steps

1. Merge PR #972.
2. Let a push-to-main event trigger the `docker` job.
3. Review the dry-run output of the `dataaxiom/ghcr-cleanup-action` step (check which images *would* have been deleted).
4. Confirm the exclusion regex `^latest$|^[0-9]+\.[0-9]+\.[0-9]+$` correctly protects release tags.
5. If the output looks correct, change `dry-run: true` to `dry-run: false` in `.github/workflows/publish.yml`.

### Reference

- Relevant line: `.github/workflows/publish.yml` — `dry-run: true   # KEEP true until the first real run is reviewed, then flip to false`
- PR: https://github.com/FluffyLabs/typeberry/pull/972
- Review comment: https://github.com/FluffyLabs/typeberry/pull/972#discussion_r3313675010

Requested by @tomusdrw.
