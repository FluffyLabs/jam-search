---
type: page
url: 'https://github.com/tomusdrw/as-lan/pull/8'
title: Bump @biomejs/biome from 1.9.4 to 2.0.0
site: github.com/tomusdrw/as-lan
created_at: '2025-06-18T09:57:30.000Z'
last_modified: '2025-06-18T09:57:30.000Z'
content_kind: pr
---

# Bump @biomejs/biome from 1.9.4 to 2.0.0

## Pull Request by @dependabot[bot]

Bumps [@biomejs/biome](https://github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome) from 1.9.4 to 2.0.0.
<details>
<summary>Release notes</summary>
<p><em>Sourced from <a href="https://github.com/biomejs/biome/releases"><code>@​biomejs/biome</code>'s releases</a>.</em></p>
<blockquote>
<h2>Biome CLI v2.0.0</h2>
<h3>Major Changes</h3>
<ul>
<li>
<p>Biome now resolves globs and paths from the configuration. Before, paths and globs were resolved from the working directory.</p>
</li>
<li>
<p>Biome now raises a <strong>warning</strong> diagnostic for suppression comments that have <code>&lt;explanation&gt;</code> as reason.</p>
<p><code>&lt;explanation&gt;</code> is provided as a placeholder when applying the suppression code fix from LSP editors.</p>
</li>
<li>
<p>Removed the <code>--config-path</code> argument from the <code>biome lsp-proxy</code> and <code>biome start</code> commands.</p>
<p>The option was overriding the configuration path for all workspaces opened in the Biome daemon, which led to a configuration mismatch problem when multiple projects are opened in some editors or IDEs.</p>
<p>If you are using one of our official plugins for IDEs or editors, it is recommended to update it to the latest version of the plugin, or you will get unexpected behavior.</p>
<p>If you are a developer of a plugin, please update your plugin to use the <code>workspace/configuration</code> response instead of using the <code>--config-path</code> argument. Biome's LSP will resolve a configuration in the workspace automatically, so it is recommended to keep it empty unless you are using a custom configuration path.</p>
</li>
<li>
<p>Downgraded some code fixes to unsafe which were previously safe.</p>
<p>The following rules have now a unsafe fix:</p>
<ul>
<li><a href="https://biomejs.dev/linter/rules/no-flat-map-identity"><code>noFlatMapIdentity</code></a></li>
<li><a href="https://biomejs.dev/linter/rules/no-unused-imports"><code>noUnusedImports</code></a></li>
</ul>
<p>If you want to keep applying these fixes automatically, <a href="https://next.biomejs.dev/linter/#configure-the-code-fix">configure the rule fix</a> as safe:</p>
<pre lang="json"><code>{
  &quot;linter&quot;: {
    &quot;rules&quot;: {
      &quot;correctness&quot;: {
        &quot;noFlatMapIdentity&quot;: {
          &quot;level&quot;: &quot;error&quot;,
          &quot;fix&quot;: &quot;safe&quot;
        },
        &quot;noUnusedImports&quot;: {
          &quot;level&quot;: &quot;error&quot;,
          &quot;fix&quot;: &quot;safe&quot;
        }
      }
    }
  }
}
</code></pre>
</li>
<li>
<p>Previously the lint rules <code>noControlCharactersInRegex</code> and <code>noMisleadingCharacterClass</code> checked both regular expression literals like <code>/regex/</code> and dynamically built regular expressions like <code>new RegExp(&quot;regex&quot;)</code>.</p>
<p>Checking dynamically built regular expressions has many limitations, edge cases, and complexities.
In addition, other rules that lint regular expressions don't check dynamically built regular expressions.</p>
</li>
</ul>
<!-- raw HTML omitted -->
</blockquote>
<p>... (truncated)</p>
</details>
<details>
<summary>Changelog</summary>
<p><em>Sourced from <a href="https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md"><code>@​biomejs/biome</code>'s changelog</a>.</em></p>
<blockquote>
<h2>2.0.0</h2>
<h3>Major Changes</h3>
<ul>
<li>
<p>Biome now resolves globs and paths from the configuration. Before, paths and globs were resolved from the working directory.</p>
</li>
<li>
<p>Biome now raises a <strong>warning</strong> diagnostic for suppression comments that have <code>&lt;explanation&gt;</code> as reason.</p>
<p><code>&lt;explanation&gt;</code> is provided as a placeholder when applying the suppression code fix from LSP editors.</p>
</li>
<li>
<p>Removed the <code>--config-path</code> argument from the <code>biome lsp-proxy</code> and <code>biome start</code> commands.</p>
<p>The option was overriding the configuration path for all workspaces opened in the Biome daemon, which led to a configuration mismatch problem when multiple projects are opened in some editors or IDEs.</p>
<p>If you are using one of our official plugins for IDEs or editors, it is recommended to update it to the latest version of the plugin, or you will get unexpected behavior.</p>
<p>If you are a developer of a plugin, please update your plugin to use the <code>workspace/configuration</code> response instead of using the <code>--config-path</code> argument. Biome's LSP will resolve a configuration in the workspace automatically, so it is recommended to keep it empty unless you are using a custom configuration path.</p>
</li>
<li>
<p>Downgraded some code fixes to unsafe which were previously safe.</p>
<p>The following rules have now a unsafe fix:</p>
<ul>
<li><a href="https://biomejs.dev/linter/rules/no-flat-map-identity"><code>noFlatMapIdentity</code></a></li>
<li><a href="https://biomejs.dev/linter/rules/no-unused-imports"><code>noUnusedImports</code></a></li>
</ul>
<p>If you want to keep applying these fixes automatically, <a href="https://next.biomejs.dev/linter/#configure-the-code-fix">configure the rule fix</a> as safe:</p>
<pre lang="json"><code>{
  &quot;linter&quot;: {
    &quot;rules&quot;: {
      &quot;correctness&quot;: {
        &quot;noFlatMapIdentity&quot;: {
          &quot;level&quot;: &quot;error&quot;,
          &quot;fix&quot;: &quot;safe&quot;
        },
        &quot;noUnusedImports&quot;: {
          &quot;level&quot;: &quot;error&quot;,
          &quot;fix&quot;: &quot;safe&quot;
        }
      }
    }
  }
}
</code></pre>
</li>
<li>
<p>Previously the lint rules <code>noControlCharactersInRegex</code> and <code>noMisleadingCharacterClass</code> checked both regular expression literals like <code>/regex/</code> and dynamically built regular expressions like <code>new RegExp(&quot;regex&quot;)</code>.</p>
<p>Checking dynamically built regular expressions has many limitations, edge cases, and complexities.
In addition, other rules that lint regular expressions don't check dynamically built regular expressions.</p>
</li>
</ul>
<!-- raw HTML omitted -->
</blockquote>
<p>... (truncated)</p>
</details>
<details>
<summary>Commits</summary>
<ul>
<li><a href="https://github.com/biomejs/biome/commit/be9076b2c6714eb5f76ceff59881cdec48475067"><code>be9076b</code></a> chore: cleanup CHANGELOG</li>
<li><a href="https://github.com/biomejs/biome/commit/2b81d3ff891a3567ba25831f8652c0e9e7991d29"><code>2b81d3f</code></a> chore: fool release workflow step 2: reapply versions</li>
<li><a href="https://github.com/biomejs/biome/commit/a25996277e0e5f7f84b08b06dfd538645a42f949"><code>a259962</code></a> chore: fool release workflow step 1: revert versions</li>
<li><a href="https://github.com/biomejs/biome/commit/701c118ba0180c30d8d68036e007d6d0273f54a2"><code>701c118</code></a> Fool release workflow step 2: reapply versions</li>
<li><a href="https://github.com/biomejs/biome/commit/323a58094be62af98b104f8b2afdab1c54a461ac"><code>323a580</code></a> Fool release workflow step 1: revert versions</li>
<li><a href="https://github.com/biomejs/biome/commit/242f7393a59dfd3a8636b9e90f85856dbb5d9e4c"><code>242f739</code></a> Fool release workflow step 2: reapply versions</li>
<li><a href="https://github.com/biomejs/biome/commit/d3175b00825f490b167e877f884ee011a3b12081"><code>d3175b0</code></a> Fool release workflow step 1: revert versions</li>
<li><a href="https://github.com/biomejs/biome/commit/a711a3a67978720d60ae05d9186e0ef5819da8ea"><code>a711a3a</code></a> Fool release workflow step 2: reapply versions</li>
<li><a href="https://github.com/biomejs/biome/commit/c0b63165f70f883cea155133f5dab05067411fd6"><code>c0b6316</code></a> Fool release workflow step 1: revert versions</li>
<li><a href="https://github.com/biomejs/biome/commit/a56204c5df7b17781a72a9cbfba60abe2d3fb750"><code>a56204c</code></a> ci: release (<a href="https://github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome/issues/6351">#6351</a>)</li>
<li>Additional commits viewable in <a href="https://github.com/biomejs/biome/commits/@biomejs/biome@2.0.0/packages/@biomejs/biome">compare view</a></li>
</ul>
</details>
<br />


[![Dependabot compatibility score](https://dependabot-badges.githubapp.com/badges/compatibility_score?dependency-name=@biomejs/biome&package-manager=npm_and_yarn&previous-version=1.9.4&new-version=2.0.0)](https://docs.github.com/en/github/managing-security-vulnerabilities/about-dependabot-security-updates#about-compatibility-scores)

Dependabot will resolve any conflicts with this PR as long as you don't alter it yourself. You can also trigger a rebase manually by commenting `@dependabot rebase`.

[//]: # (dependabot-automerge-start)
[//]: # (dependabot-automerge-end)

---

<details>
<summary>Dependabot commands and options</summary>
<br />

You can trigger Dependabot actions by commenting on this PR:
- `@dependabot rebase` will rebase this PR
- `@dependabot recreate` will recreate this PR, overwriting any edits that have been made to it
- `@dependabot merge` will merge this PR after your CI passes on it
- `@dependabot squash and merge` will squash and merge this PR after your CI passes on it
- `@dependabot cancel merge` will cancel a previously requested merge and block automerging
- `@dependabot reopen` will reopen this PR if it is closed
- `@dependabot close` will close this PR and stop Dependabot recreating it. You can achieve the same result by closing it manually
- `@dependabot show <dependency name> ignore conditions` will show all of the ignore conditions of the specified dependency
- `@dependabot ignore this major version` will close this PR and stop Dependabot creating any more for this major version (unless you reopen the PR or upgrade to it yourself)
- `@dependabot ignore this minor version` will close this PR and stop Dependabot creating any more for this minor version (unless you reopen the PR or upgrade to it yourself)
- `@dependabot ignore this dependency` will close this PR and stop Dependabot creating any more for this dependency (unless you reopen the PR or upgrade to it yourself)


</details>


## Comment by @dependabot[bot]

Superseded by #9.
