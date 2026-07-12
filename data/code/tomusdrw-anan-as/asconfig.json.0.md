---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/asconfig.json#L1-L73'
title: asconfig.json
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 0
chunk_total: 1
content_sha: 0f49d7ea236ae80a812487cbd4802b6c2cf3b3fbc7d1319d449ec05fcfd1f9a5
language: json
---
`asconfig.json` (lines 1–73)

```json
{
	"targets": {
		"raw": {
			"bindings": "raw",
			"outFile": "dist/build/debug-raw.wasm",
			"textFile": "dist/build/debug-raw.wat",
			"sourceMap": true,
			"debug": true
		},
		"debug": {
			"bindings": "esm",
			"outFile": "dist/build/debug.wasm",
			"textFile": "dist/build/debug.wat",
			"sourceMap": true,
			"debug": true
		},
		"release": {
			"bindings": "esm",
			"outFile": "dist/build/release.wasm",
			"textFile": "dist/build/release.wat",
			"sourceMap": true,
			"optimizeLevel": 3,
			"shrinkLevel": 0,
			"converge": true,
			"noAssert": true
		},
		"release-mini": {
			"bindings": "esm",
			"outFile": "dist/build/release-mini.wasm",
			"textFile": "dist/build/release-mini.wat",
			"sourceMap": true,
			"optimizeLevel": 3,
			"shrinkLevel": 0,
			"converge": true,
			"noAssert": true,
			"runtime": "minimal",
			"exportRuntime": true
		},
		"release-stub": {
			"bindings": "esm",
			"outFile": "dist/build/release-stub.wasm",
			"textFile": "dist/build/release-stub.wat",
			"sourceMap": true,
			"optimizeLevel": 3,
			"shrinkLevel": 0,
			"converge": true,
			"noAssert": true,
			"runtime": "stub",
			"exportRuntime": true
		},
		"test": {
			"bindings": "esm",
			"outFile": "dist/build/test.wasm",
			"textFile": "dist/build/test.wat",
			"sourceMap": true,
			"debug": true
		},
		"compiler": {
			"bindings": "esm",
			"debug": true,
			"outFile": "dist/build/compiler.wasm",
			"textFile": "dist/build/compiler.wat",
			"sourceMap": true,
			"optimizeLevel": 3,
			"shrinkLevel": 0,
			"converge": true,
			"noAssert": true,
			"runtime": "stub",
			"exportRuntime": true
		}
	},
	"options": {}
}
```
