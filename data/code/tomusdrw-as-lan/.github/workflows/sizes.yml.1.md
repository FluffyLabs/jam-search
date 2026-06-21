---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/sizes.yml#L121-L181
title: .github/workflows/sizes.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: a0445db759311f61a0eba6a07b7f35ba7c85367189185d32c9fc499c42cd40b4
language: yaml
---
`.github/workflows/sizes.yml` (lines 121–181)

```yaml
              results[name] = data;
            }
            return results;
          }

          function formatBytes(bytes) {
            if (bytes === 0) return 'N/A';
            if (bytes < 1024) return `${bytes} B`;
            return `${(bytes / 1024).toFixed(2)} KiB`;
          }

          function formatDiff(current, base) {
            if (base === 0 && current === 0) return '—';
            if (base === 0) return '🆕 new';
            const diff = current - base;
            if (diff === 0) return '✅ ±0';
            const pct = ((diff / base) * 100).toFixed(1);
            const sign = diff > 0 ? '+' : '';
            const arrow = diff > 0 ? '📈' : '📉';
            return `${arrow} ${sign}${diff} B (${sign}${pct}%)`;
          }

          const prData = readSizes('/tmp/sizes/pr');
          const baseData = readSizes('/tmp/sizes/base');
          const allExamples = [...new Set([...Object.keys(prData), ...Object.keys(baseData)])].sort();

          let table = '| Example | WASM (release) | PVM | WASM diff | PVM diff |\n';
          table += '|---------|---------------|-----|-----------|----------|\n';

          let details = '';

          for (const name of allExamples) {
            const pr = prData[name] || { wasm: 0, pvm: 0, pvmOutput: '' };
            const base = baseData[name] || { wasm: 0, pvm: 0, pvmOutput: '' };

            table += `| \`${name}\` | ${formatBytes(pr.wasm)} | ${formatBytes(pr.pvm)} | ${formatDiff(pr.wasm, base.wasm)} | ${formatDiff(pr.pvm, base.pvm)} |\n`;

            if (pr.pvmOutput) {
              details += `<details>\n<summary><code>${name}</code> — wasm-pvm compilation output</summary>\n\n\`\`\`\n${pr.pvmOutput}\n\`\`\`\n\n</details>\n\n`;
            }
          }

          const body = `## Artifact Sizes Report\n\n${table}\n${details}`;

          core.setOutput('body', body);

    - name: Find existing comment
      uses: peter-evans/find-comment@v4
      id: find_comment
      with:
        issue-number: ${{ github.event.pull_request.number }}
        comment-author: 'github-actions[bot]'
        body-includes: '## Artifact Sizes Report'

    - name: Create or update PR comment
      uses: peter-evans/create-or-update-comment@v5
      with:
        comment-id: ${{ steps.find_comment.outputs.comment-id }}
        issue-number: ${{ github.event.pull_request.number }}
        body: ${{ steps.comment.outputs.body }}
        edit-mode: replace
```
