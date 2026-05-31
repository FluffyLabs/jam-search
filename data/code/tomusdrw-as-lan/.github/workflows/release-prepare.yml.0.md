---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/release-prepare.yml#L1-L116
title: .github/workflows/release-prepare.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 0ebb86eaf67e7031382372fe632c41f0dcb9fb8c3bf46eef4c6b287c251cd998
language: yaml
---
`.github/workflows/release-prepare.yml` (lines 1–116)

```yaml
name: "Release: Prepare"

on:
  workflow_dispatch:
    inputs:
      version:
        description: "New version (e.g. 0.1.0 or 0.1.0-rc.1)"
        required: true
        type: string

permissions:
  contents: write
  pull-requests: write

concurrency:
  group: release-prepare
  cancel-in-progress: false

jobs:
  prepare:
    runs-on: ubuntu-latest
    steps:
      - name: Validate version input
        run: |
          VERSION="${{ inputs.version }}"
          if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9.-]+)?$ ]]; then
            echo "::error::Version '$VERSION' does not match semver pattern X.Y.Z or X.Y.Z-prerelease"
            exit 1
          fi
          echo "VERSION=$VERSION" >> "$GITHUB_ENV"

      - name: Checkout main
        uses: actions/checkout@v6
        with:
          ref: main
          fetch-depth: 0

      - name: Configure git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24.x
          cache: "npm"

      - name: Bump versions
        run: |
          npm version "$VERSION" --no-git-tag-version --allow-same-version=false
          (cd sdk && npm version "$VERSION" --no-git-tag-version --allow-same-version=false)
          (cd sdk-ecalli-mocks && npm version "$VERSION" --no-git-tag-version --allow-same-version=false)

      - name: Regenerate lockfiles
        # Each example depends on sdk and sdk-ecalli-mocks via `file:` and
        # embeds their versions in its own package-lock.json, so every
        # example's lockfile has to be refreshed alongside the three
        # published manifests.
        run: |
          npm install --package-lock-only --ignore-scripts
          (cd sdk && npm install --package-lock-only --ignore-scripts)
          (cd sdk-ecalli-mocks && npm install --package-lock-only --ignore-scripts)
          for d in examples/*/; do
            (cd "$d" && npm install --package-lock-only --ignore-scripts)
          done

      - name: Create release branch and commit
        run: |
          BRANCH="release/v$VERSION"
          git checkout -b "$BRANCH"
          git add \
            package.json sdk/package.json sdk-ecalli-mocks/package.json \
            package-lock.json sdk/package-lock.json sdk-ecalli-mocks/package-lock.json \
            examples/*/package-lock.json
          git commit -m "chore(release): v$VERSION"
          git push -u origin "$BRANCH"
          echo "BRANCH=$BRANCH" >> "$GITHUB_ENV"

      - name: Open pull request
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh pr create \
            --base main \
            --head "$BRANCH" \
            --title "chore(release): v$VERSION" \
            --body "Automated version bump for release \`v$VERSION\`.

          Packages to be published after merging this PR and publishing the draft GitHub release:
          - \`@fluffylabs/as-lan@$VERSION\`
          - \`@fluffylabs/as-lan-ecalli-mocks@$VERSION\`

          Next steps:
          1. Review and merge this PR.
          2. Open the draft release \`v$VERSION\`, edit notes if needed, and click **Publish release**.
          3. The \`Release: Publish\` workflow will build, test, and publish both packages to npm."

      - name: Create draft GitHub release
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh release create "v$VERSION" \
            --draft \
            --target main \
            --generate-notes \
            --title "v$VERSION"

      - name: Write job summary
        run: |
          {
            echo "## Release v$VERSION prepared"
            echo ""
            echo "### Next steps"
            echo "1. Review and merge PR: $BRANCH"
            echo "2. Publish draft release: v$VERSION"
```
