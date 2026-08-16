---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/publish.yml#L115-L216
title: .github/workflows/publish.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 7debd6baca4a0d0f51d1f2a77c3fa4c74cce8f6bb7180cd5a1c3c8445d965266
language: yaml
---
`.github/workflows/publish.yml` (lines 115–216)

```yaml
    #   push to main         -> next + {version}-{sha}
    #   release (prerelease) -> next + {version}-{sha}
    #   release (final)      -> {version} + latest
    #   pull_request/dispatch -> no tags (no push)
    - name: Compute image tags and labels
      id: meta
      uses: docker/metadata-action@v6
      with:
        images: ghcr.io/${{ github.repository_owner }}/typeberry
        tags: |
          type=raw,value=next,enable=${{ github.event_name == 'push' || (github.event_name == 'release' && github.event.release.prerelease) }}
          type=raw,value=${{ steps.version.outputs.version }}-${{ steps.sha.outputs.short }},enable=${{ github.event_name == 'push' || (github.event_name == 'release' && github.event.release.prerelease) }}
          type=raw,value=${{ steps.version.outputs.version }},enable=${{ github.event_name == 'release' && !github.event.release.prerelease }}
          type=raw,value=latest,enable=${{ github.event_name == 'release' && !github.event.release.prerelease }}

    # Build once and load into the local daemon so we test the exact image we
    # push. No rebuild on push -> no cache-miss drift.
    - name: Build Docker image
      uses: docker/build-push-action@v7
      with:
        context: .
        push: false
        load: true
        tags: typeberry:test
        labels: ${{ steps.meta.outputs.labels }}
        build-args: |
          VERSION_SHA=${{ steps.vsha.outputs.value }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
        platforms: linux/amd64

    - name: Test Docker image
      run: docker run --rm typeberry:test --help

    # PRs: keep the image as an artifact for external/manual benchmarking.
    - name: Save Docker image
      if: github.event_name == 'pull_request'
      run: docker save typeberry:test | gzip > typeberry-image.tar.gz

    - name: Upload Docker image artifact
      if: github.event_name == 'pull_request'
      uses: actions/upload-artifact@v4
      with:
        name: typeberry-docker-image
        path: typeberry-image.tar.gz
        retention-days: 7

    # Non-PR events push the identical, already-tested image.
    - name: Log in to GitHub Container Registry
      if: github.event_name != 'pull_request'
      uses: docker/login-action@v4
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Push image tags
      if: github.event_name != 'pull_request'
      env:
        TAGS: ${{ steps.meta.outputs.tags }}
      run: |
        printf '%s\n' "$TAGS" | while IFS= read -r tag; do
          [ -z "$tag" ] && continue
          docker tag typeberry:test "$tag"
          docker push "$tag"
        done

    # main only: prune old pre-release images, keep the 10 newest. Release tags
    # (latest + pure semver) are excluded so they are never deleted. The moving
    # `next` tag shares a digest with the `{version}-{sha}` tag, so old builds
    # stay tagged and are governed by keep-n-tagged.
    - name: Mint token for cleanup
      if: github.event_name == 'push'
      id: cleanup-token
      uses: actions/create-github-app-token@v2
      with:
        app-id: ${{ vars.PR_APP_ID }}
        private-key: ${{ secrets.PR_APP_PRIVATE_KEY }}

    - name: Cleanup old pre-release images
      if: github.event_name == 'push'
      uses: dataaxiom/ghcr-cleanup-action@v1
      with:
        owner: ${{ github.repository_owner }}
        packages: 'typeberry'
        token: ${{ steps.cleanup-token.outputs.token }}
        use-regex: true
        keep-n-tagged: 10
        exclude-tags: '^latest$|^[0-9]+\.[0-9]+\.[0-9]+$'
        delete-untagged: true
        dry-run: true   # KEEP true until the first real run is reviewed, then flip to false

  update-release-notes:
    if: github.event_name == 'release'
    runs-on: ubuntu-latest
    needs: [publish-npm, docker]
    permissions:
      contents: write

    steps:
    - uses: actions/checkout@v6

```
