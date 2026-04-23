---
type: page
url: 'https://github.com/tomusdrw/as-lan/pull/9'
title: Bump @biomejs/biome from 1.9.4 to 2.0.4
site: github.com/tomusdrw/as-lan
created_at: '2025-06-23T11:28:44.000Z'
last_modified: '2025-06-23T11:28:44.000Z'
content_kind: pr
---

# Bump @biomejs/biome from 1.9.4 to 2.0.4

## Pull Request by @dependabot[bot]

Bumps [@biomejs/biome](https://github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome) from 1.9.4 to 2.0.4.
<details>
<summary>Release notes</summary>
<p><em>Sourced from <a href="https://github.com/biomejs/biome/releases"><code>@​biomejs/biome</code>'s releases</a>.</em></p>
<blockquote>
<h2><code>@​biomejs/biome</code><a href="https://github.com/2"><code>@​2</code></a>.0.4</h2>
<h2>2.0.4</h2>
<h3>Patch Changes</h3>
<ul>
<li><a href="https://redirect.github.com/biomejs/biome/pull/6450">#6450</a> <a href="https://github.com/biomejs/biome/commit/7472d9e07fd6e8afab385276678f3d39c7497bab"><code>7472d9e</code></a> Thanks <a href="https://github.com/ematipico"><code>@​ematipico</code></a>! - Fixed an issue where the binary wasn't correctly mapped.</li>
</ul>
<h2>What's Changed</h2>
<ul>
<li>ci: add permissions to release actions by <a href="https://github.com/ematipico"><code>@​ematipico</code></a> in <a href="https://redirect.github.com/biomejs/biome/pull/6436">biomejs/biome#6436</a></li>
<li>ci: release by <a href="https://github.com/github-actions"><code>@​github-actions</code></a> in <a href="https://redirect.github.com/biomejs/biome/pull/6437">biomejs/biome#6437</a></li>
<li>ci: use changests action for publishing by <a href="https://github.com/ematipico"><code>@​ematipico</code></a> in <a href="https://redirect.github.com/biomejs/biome/pull/6440">biomejs/biome#6440</a></li>
<li>ci: manually push tags and create release by <a href="https://github.com/ematipico"><code>@​ematipico</code></a> in <a href="https://redirect.github.com/biomejs/biome/pull/6439">biomejs/biome#6439</a></li>
<li>feat(biome_js_analyze): adds new lint rule useReadonlyClassProperties by <a href="https://github.com/vladimir-ivanov"><code>@​vladimir-ivanov</code></a> in <a href="https://redirect.github.com/biomejs/biome/pull/6297">biomejs/biome#6297</a></li>
<li>chore: update changeset to patch by <a href="https://github.com/siketyan"><code>@​siketyan</code></a> in <a href="https://redirect.github.com/biomejs/biome/pull/6449">biomejs/biome#6449</a></li>
<li>ci: release by <a href="https://github.com/github-actions"><code>@​github-actions</code></a> in <a href="https://redirect.github.com/biomejs/biome/pull/6444">biomejs/biome#6444</a></li>
<li>ci: skip release step if version not bumped by <a href="https://github.com/siketyan"><code>@​siketyan</code></a> in <a href="https://redirect.github.com/biomejs/biome/pull/6451">biomejs/biome#6451</a></li>
<li>fix: binary mapping by <a href="https://github.com/ematipico"><code>@​ematipico</code></a> in <a href="https://redirect.github.com/biomejs/biome/pull/6450">biomejs/biome#6450</a></li>
<li>ci: release by <a href="https://github.com/github-actions"><code>@​github-actions</code></a> in <a href="https://redirect.github.com/biomejs/biome/pull/6454">biomejs/biome#6454</a></li>
</ul>
<p><strong>Full Changelog</strong>: <a href="https://github.com/biomejs/biome/compare/@biomejs/biome@2.0.1...@biomejs/biome@v2.0.4">https://github.com/biomejs/biome/compare/<code>@​biomejs/biome</code><code>@​2.0.1...</code><code>@​biomejs/biome</code><code>@​v2.0.4</code></a></p>
<h2><code>@​biomejs/biome</code><a href="https://github.com/2"><code>@​2</code></a>.0.1</h2>
<blockquote>
<p>[!WARNING]
Biome v2.0.1 and v2.0.2 are currently broken, please use v2.0.0 in the meantime. See <a href="https://github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome/issues/6435">#6435</a> for details.</p>
</blockquote>
<h2>Patch Changes</h2>
<ul>
<li>
<p><a href="https://redirect.github.com/biomejs/biome/pull/6425">#6425</a> <a href="https://github.com/biomejs/biome/commit/00e97aded825e72e63db7827de20dc84ac8a123b"><code>00e97ad</code></a> Thanks <a href="https://github.com/siketyan"><code>@​siketyan</code></a>! - Fixed <a href="https://redirect.github.com/biomejs/biome/issues/6391">#6391</a>: the rule <a href="https://biomejs.dev/linter/rules/no-useless-fragments/"><code>noUselessFragments</code></a> no longer reports a fragment that contains whitespaces which aren't trimmed by the runtime.</p>
</li>
<li>
<p><a href="https://redirect.github.com/biomejs/biome/pull/6417">#6417</a> <a href="https://github.com/biomejs/biome/commit/dd885655b576869eb624d4a31d2d09bcb6c623a4"><code>dd88565</code></a> Thanks <a href="https://github.com/ematipico"><code>@​ematipico</code></a>! - Fixed <a href="https://redirect.github.com/biomejs/biome/issues/6360">#6360</a>: The following pseudo classes and elements are no longer reported by <code>noUnknownPseudoClass</code> or <code>noUnknownPseudoElement</code> rules.</p>
<ul>
<li><code>:open</code></li>
<li><code>::details-content</code></li>
<li><code>::prefix</code></li>
<li><code>::search-text</code></li>
<li><code>::suffix</code></li>
</ul>
</li>
<li>
<p><a href="https://redirect.github.com/biomejs/biome/pull/6417">#6417</a> <a href="https://github.com/biomejs/biome/commit/dd885655b576869eb624d4a31d2d09bcb6c623a4"><code>dd88565</code></a> Thanks <a href="https://github.com/ematipico"><code>@​ematipico</code></a>! - Fixed <a href="https://redirect.github.com/biomejs/biome/issues/6357">#6357</a>, where the boolean values weren't correctly merged when using the <code>extends</code> functionality. Now Biome correctly merges the values.</p>
</li>
<li>
<p><a href="https://redirect.github.com/biomejs/biome/pull/6417">#6417</a> <a href="https://github.com/biomejs/biome/commit/dd885655b576869eb624d4a31d2d09bcb6c623a4"><code>dd88565</code></a> Thanks <a href="https://github.com/ematipico"><code>@​ematipico</code></a>! - Fixed <a href="https://redirect.github.com/biomejs/biome/issues/6341">#6341</a>: Fixed an issue where Biome would throw an error for the language tags <code>nb</code> and <code>nn</code>.</p>
</li>
<li>
<p><a href="https://redirect.github.com/biomejs/biome/pull/6385">#6385</a> <a href="https://github.com/biomejs/biome/commit/94142dd84b3a4b680c08007cd4947ca7d44273a8"><code>94142dd</code></a> Thanks <a href="https://github.com/siketyan"><code>@​siketyan</code></a>! - Fixed <a href="https://redirect.github.com/biomejs/biome/issues/6377">#6377</a>: The rule <a href="https://biomejs.dev/linter/rules/no-self-compare/">noSelfCompare</a> now correctly compares two function calls with different arguments.</p>
</li>
<li>
<p><a href="https://redirect.github.com/biomejs/biome/pull/6417">#6417</a> <a href="https://github.com/biomejs/biome/commit/dd885655b576869eb624d4a31d2d09bcb6c623a4"><code>dd88565</code></a> Thanks <a href="https://github.com/ematipico"><code>@​ematipico</code></a>! - Fixed <a href="https://redirect.github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome/blob/HEAD/redirect.github.com/biomejs/biome/issues/6278">#6278</a>: <code>useExhaustiveDependencies</code> no longer adds duplicated dependencies into the list.</p>
</li>
<li>
<p><a href="https://redirect.github.com/biomejs/biome/pull/6417">#6417</a> <a href="https://github.com/biomejs/biome/commit/dd885655b576869eb624d4a31d2d09bcb6c623a4"><code>dd88565</code></a> Thanks <a href="https://github.com/ematipico"><code>@​ematipico</code></a>! - Fix <a href="https://github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome/issues/6396">#6396</a>, where <code>vi.useFakeTimers()</code> and <code>vi.useRealTimers()</code> incorrectly triggered React Hooks-related rules</p>
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
<h2>2.0.4</h2>
<h3>Patch Changes</h3>
<ul>
<li><a href="https://redirect.github.com/biomejs/biome/pull/6450">#6450</a> <a href="https://github.com/biomejs/biome/commit/7472d9e07fd6e8afab385276678f3d39c7497bab"><code>7472d9e</code></a> Thanks <a href="https://github.com/ematipico"><code>@​ematipico</code></a>! - Fixed an issue where the binary wasn't correctly mapped.</li>
</ul>
<h2>2.0.3</h2>
<h3>Patch Changes</h3>
<ul>
<li>
<p><a href="https://redirect.github.com/biomejs/biome/pull/6439">#6439</a> <a href="https://github.com/biomejs/biome/commit/7e4da4edb811f9598e446c77fd26bc3802b6d3dd"><code>7e4da4e</code></a> Thanks <a href="https://github.com/ematipico"><code>@​ematipico</code></a>! - Fixed an issue where the correct rights aren't added to the binary during publishing</p>
</li>
<li>
<p><a href="https://redirect.github.com/biomejs/biome/pull/6297">#6297</a> <a href="https://github.com/biomejs/biome/commit/cc4b8c90017f9c04eab393abc60b3f94a35e3cfa"><code>cc4b8c9</code></a> Thanks <a href="https://github.com/vladimir-ivanov"><code>@​vladimir-ivanov</code></a>! - Added a new lint <code>useReadonlyClassProperties</code> rule.
This rule is a port of ESLint's <a href="https://typescript-eslint.io/rules/prefer-readonly/">prefer-readonly</a> rule.</p>
<p>Example:</p>
<pre lang="ts"><code>class Example {
  // All properties below can be marked as readonly
  public constantValue = 42;
  protected initializedInConstructor: string;
  private privateField = true;
<p>constructor(initializedInConstructor: string) {
this.initializedInConstructor = initializedInConstructor;
}
}
</code></pre></p>
</li>
</ul>
<h2>2.0.2</h2>
<h3>Patch Changes</h3>
<ul>
<li><a href="https://redirect.github.com/biomejs/biome/pull/6436">#6436</a> <a href="https://github.com/biomejs/biome/commit/ec7c63df520103b5d8ea0090c59486574e7370dd"><code>ec7c63d</code></a> Thanks <a href="https://github.com/ematipico"><code>@​ematipico</code></a>! - Fixed an issue where binaries weren't copied anymore inside the <code>@biomejs/cli-*</code> packages.</li>
</ul>
<h2>2.0.1</h2>
<h3>Patch Changes</h3>
<ul>
<li>
<p><a href="https://redirect.github.com/biomejs/biome/pull/6425">#6425</a> <a href="https://github.com/biomejs/biome/commit/00e97aded825e72e63db7827de20dc84ac8a123b"><code>00e97ad</code></a> Thanks <a href="https://github.com/siketyan"><code>@​siketyan</code></a>! - Fixed <a href="https://redirect.github.com/biomejs/biome/issues/6391">#6391</a>: the rule <a href="https://biomejs.dev/linter/rules/no-useless-fragments/"><code>noUselessFragments</code></a> no longer reports a fragment that contains whitespaces which aren't trimmed by the runtime.</p>
</li>
<li>
<p><a href="https://redirect.github.com/biomejs/biome/pull/6417">#6417</a> <a href="https://github.com/biomejs/biome/commit/dd885655b576869eb624d4a31d2d09bcb6c623a4"><code>dd88565</code></a> Thanks <a href="https://github.com/ematipico"><code>@​ematipico</code></a>! - Fixed <a href="https://redirect.github.com/biomejs/biome/issues/6360">#6360</a>: The following pseudo classes and elements are no longer reported by <code>noUnknownPseudoClass</code> or <code>noUnknownPseudoElement</code> rules.</p>
<ul>
<li><code>:open</code></li>
<li><code>::details-content</code></li>
<li><code>::prefix</code></li>
<li><code>::search-text</code></li>
<li><code>::suffix</code></li>
</ul>
</li>
</ul>
<!-- raw HTML omitted -->
</blockquote>
<p>... (truncated)</p>
</details>
<details>
<summary>Commits</summary>
<ul>
<li><a href="https://github.com/biomejs/biome/commit/4595a7c3e975783b4b61e4fc66862741fd118937"><code>4595a7c</code></a> ci: release (<a href="https://github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome/issues/6454">#6454</a>)</li>
<li><a href="https://github.com/biomejs/biome/commit/7472d9e07fd6e8afab385276678f3d39c7497bab"><code>7472d9e</code></a> fix: binary mapping (<a href="https://github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome/issues/6450">#6450</a>)</li>
<li><a href="https://github.com/biomejs/biome/commit/2c9cdd5860954292dbeefa1162d19f4bae23c859"><code>2c9cdd5</code></a> ci: release (<a href="https://github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome/issues/6444">#6444</a>)</li>
<li><a href="https://github.com/biomejs/biome/commit/cc4b8c90017f9c04eab393abc60b3f94a35e3cfa"><code>cc4b8c9</code></a> feat(biome_js_analyze): adds new lint rule useReadonlyClassProperties (<a href="https://github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome/issues/6297">#6297</a>)</li>
<li><a href="https://github.com/biomejs/biome/commit/ecd0b5defa4665d027c23494b9cf1e1d2e94e299"><code>ecd0b5d</code></a> ci: release (<a href="https://github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome/issues/6437">#6437</a>)</li>
<li><a href="https://github.com/biomejs/biome/commit/ec7c63df520103b5d8ea0090c59486574e7370dd"><code>ec7c63d</code></a> ci: add permissions to release actions (<a href="https://github.com/biomejs/biome/tree/HEAD/packages/@biomejs/biome/issues/6436">#6436</a>)</li>
<li><a href="https://github.com/biomejs/biome/commit/6d2b50b7ec1a7664a90cc25c1d3eb5ba716924dd"><code>6d2b50b</code></a> chore: restore version</li>
<li><a href="https://github.com/biomejs/biome/commit/ef6db789c7f481fb9c086caecb478261042ebdbc"><code>ef6db78</code></a> chore: revert version</li>
<li><a href="https://github.com/biomejs/biome/commit/60d7b20e6eceff0f82629fbdd27844cde69cc127"><code>60d7b20</code></a> chore: restore version</li>
<li><a href="https://github.com/biomejs/biome/commit/cb19a5ab72d1b3a0162ad211d07c673dff0a7f5d"><code>cb19a5a</code></a> chore: revert version</li>
<li>Additional commits viewable in <a href="https://github.com/biomejs/biome/commits/@biomejs/biome@2.0.4/packages/@biomejs/biome">compare view</a></li>
</ul>
</details>
<br />


[![Dependabot compatibility score](https://dependabot-badges.githubapp.com/badges/compatibility_score?dependency-name=@biomejs/biome&package-manager=npm_and_yarn&previous-version=1.9.4&new-version=2.0.4)](https://docs.github.com/en/github/managing-security-vulnerabilities/about-dependabot-security-updates#about-compatibility-scores)

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

Superseded by #10.
