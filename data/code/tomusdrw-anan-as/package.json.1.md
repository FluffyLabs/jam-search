---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/package.json#L98-L127'
title: package.json
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 1
chunk_total: 2
content_sha: 721a85cbb7dfd2343342d81c2f40e6ebb6ecdf0ab1e5f50b64f8faafd1e05868
language: json
---
`package.json` (lines 98–127)

```json
			"import": "./dist/build/debug-inline.js",
			"types": "./dist/build/debug-inline.d.ts"
		},
		"./release-inline": {
			"import": "./dist/build/release-inline.js",
			"types": "./dist/build/release-inline.d.ts"
		},
		"./release-mini-inline": {
			"import": "./dist/build/release-mini-inline.js",
			"types": "./dist/build/release-mini-inline.d.ts"
		},
		"./release-stub-inline": {
			"import": "./dist/build/release-stub-inline.js",
			"types": "./dist/build/release-stub-inline.d.ts"
		},
		"./compiler": {
			"import": "./dist/build/compiler.js",
			"types": "./dist/build/compiler.d.ts"
		},
		"./debug.wasm": "./dist/build/debug.wasm",
		"./release.wasm": "./dist/build/release.wasm",
		"./release-mini.wasm": "./dist/build/release-mini.wasm",
		"./release-stub.wasm": "./dist/build/release-stub.wasm",
		"./compiler.wasm": "./dist/build/compiler.wasm",
		"./js": {
			"import": "./dist/build/js/portable-bundle.js",
			"types": "./dist/build/js/portable/index.d.ts"
		}
	}
}
```
