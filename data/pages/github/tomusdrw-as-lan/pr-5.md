---
type: page
url: 'https://github.com/tomusdrw/as-lan/pull/5'
title: Bump assemblyscript from 0.27.35 to 0.28.0
site: github.com/tomusdrw/as-lan
created_at: '2025-05-29T10:02:47.000Z'
last_modified: '2025-05-29T10:02:47.000Z'
content_kind: pr
---

# Bump assemblyscript from 0.27.35 to 0.28.0

## Pull Request by @dependabot[bot]

Bumps [assemblyscript](https://github.com/AssemblyScript/assemblyscript) from 0.27.35 to 0.28.0.
<details>
<summary>Release notes</summary>
<p><em>Sourced from <a href="https://github.com/AssemblyScript/assemblyscript/releases">assemblyscript's releases</a>.</em></p>
<blockquote>
<h2>v0.28.0</h2>
<h3>Breaking changes</h3>
<ul>
<li><strong>bump supported Node.js version to v20+ (<a href="https://redirect.github.com/AssemblyScript/assemblyscript/issues/2925">#2925</a>)</strong> (a6de4c3c7c895b07f974e5f4402a850fc7484296)</li>
</ul>
<h3>Bug fixes</h3>
<ul>
<li><strong>remove unused tmp local in array literal generated code (<a href="https://redirect.github.com/AssemblyScript/assemblyscript/issues/2917">#2917</a>)</strong> (da776308805411ab87565f74e983fb980596a3f0)</li>
<li><strong><code>builtin_call_indirect</code> does not manage GC obj correctly (<a href="https://redirect.github.com/AssemblyScript/assemblyscript/issues/2924">#2924</a>)</strong> (91976df32e8790a40bafa4ab946850bac2c17e8e)</li>
</ul>
<h2>v0.27.37</h2>
<h3>Bug fixes</h3>
<ul>
<li><strong><code>Math.pow</code> constant optimization behaves inconsistently in different versions of node (<a href="https://redirect.github.com/AssemblyScript/assemblyscript/issues/2920">#2920</a>)</strong> (ae8c46cd5690b8f14fc915606ab9ab2a0794434f)
use the pow function compiled by AS bootstrap to optimize the constant propagation of pow</li>
</ul>
<h2>v0.27.36</h2>
<h3>Bug fixes</h3>
<ul>
<li><strong>remove erroneous <code>declare</code> for <code>inline.always</code> (<a href="https://redirect.github.com/AssemblyScript/assemblyscript/issues/2916">#2916</a>)</strong> (f16b08f691cd0002c0a5d303c5f290904d22cb68)</li>
</ul>
</blockquote>
</details>
<details>
<summary>Commits</summary>
<ul>
<li><a href="https://github.com/AssemblyScript/assemblyscript/commit/da776308805411ab87565f74e983fb980596a3f0"><code>da77630</code></a> fix: remove unused tmp local in array literal generated code (<a href="https://redirect.github.com/AssemblyScript/assemblyscript/issues/2917">#2917</a>)</li>
<li><a href="https://github.com/AssemblyScript/assemblyscript/commit/91976df32e8790a40bafa4ab946850bac2c17e8e"><code>91976df</code></a> fix: <code>builtin_call_indirect</code> does not manage GC obj correctly (<a href="https://redirect.github.com/AssemblyScript/assemblyscript/issues/2924">#2924</a>)</li>
<li><a href="https://github.com/AssemblyScript/assemblyscript/commit/a6de4c3c7c895b07f974e5f4402a850fc7484296"><code>a6de4c3</code></a> breaking: bump supported Node.js version to v20+ (<a href="https://redirect.github.com/AssemblyScript/assemblyscript/issues/2925">#2925</a>)</li>
<li><a href="https://github.com/AssemblyScript/assemblyscript/commit/ae8c46cd5690b8f14fc915606ab9ab2a0794434f"><code>ae8c46c</code></a> fix: <code>Math.pow</code> constant optimization behaves inconsistently in different ver...</li>
<li><a href="https://github.com/AssemblyScript/assemblyscript/commit/f16b08f691cd0002c0a5d303c5f290904d22cb68"><code>f16b08f</code></a> fix: remove erroneous <code>declare</code> for <code>inline.always</code> (<a href="https://redirect.github.com/AssemblyScript/assemblyscript/issues/2916">#2916</a>)</li>
<li>See full diff in <a href="https://github.com/AssemblyScript/assemblyscript/compare/v0.27.35...v0.28.0">compare view</a></li>
</ul>
</details>
<br />


[![Dependabot compatibility score](https://dependabot-badges.githubapp.com/badges/compatibility_score?dependency-name=assemblyscript&package-manager=npm_and_yarn&previous-version=0.27.35&new-version=0.28.0)](https://docs.github.com/en/github/managing-security-vulnerabilities/about-dependabot-security-updates#about-compatibility-scores)

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

Superseded by #6.
