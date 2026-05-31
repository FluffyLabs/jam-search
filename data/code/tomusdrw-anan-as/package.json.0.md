---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/package.json#L1-L104'
title: package.json
site: github.com/tomusdrw/anan-as
created_at: '2026-05-29T16:20:56+02:00'
last_modified: '2026-05-29T16:20:56+02:00'
chunk_index: 0
chunk_total: 2
content_sha: e64cf97112bdcef3f3c0c36645dba90a03c2b18cc1d619f7c4fabd425dde42e2
language: json
---
`package.json` (lines 1–104)

```json
{
	"name": "@fluffylabs/anan-as",
	"description": "AssemblyScript PVM interpreter.",
	"version": "1.4.0",
	"main": "./dist/bin/index.js",
	"bin": {
		"anan-as": "./dist/bin/index.js"
	},
	"repository": {
		"url": "https://github.com/tomusdrw/anan-as"
	},
	"scripts": {
		"asbuild": "npm run asbuild:debug && npm run asbuild:release",
		"asbuild:all": "npm run asbuild:debug && npm run asbuild:release && npm run asbuild:raw && npm run asbuild:release-mini && npm run asbuild:release-stub && npm run asbuild:compiler",
		"asbuild:debug": "asc assembly/index.ts --target debug",
		"asbuild:release": "asc assembly/index.ts --uncheckedBehavior=always --target release",
		"asbuild:release-mini": "asc assembly/index.ts --uncheckedBehavior=always --target release-mini",
		"asbuild:release-stub": "asc assembly/index.ts --uncheckedBehavior=always --target release-stub",
		"asbuild:raw": "asc assembly/index.ts --target raw",
		"asbuild:compiler": "asc assembly/index-compiler.ts --uncheckedBehavior=always --target compiler",
		"asbuild:test": "asc assembly/test-run.ts --target test",
		"build": "npm run asbuild:all && npm run asbuild:test && npm run tsbuild && npm run build:inline && npm run cp-build",
		"build:inline": "tsx ./bin/build-inline.ts",
		"cp-build": "rm -rf ./web/build; cp -r ./dist/build ./web/",
		"format": "biome format --write",
		"fuzz": "tsx ./bin/src/fuzz.ts",
		"lint": "biome lint --write; biome check --write",
		"prestart": "npm run build",
		"pretest:w3f": "npm run build",
		"pretest:gas-cost": "npm run build",
		"preweb": "npm run build",
		"qa": "biome ci",
		"qa-fix": "npm run format; npm run lint",
		"start": "tsx ./bin/index.ts",
		"test": "npm run asbuild:test && tsx ./test/test-as.ts && tsx ./test/test-trace-format.ts && tsx ./test/test-trace-replay.ts",
		"tsbuild": "tsc && npm run tsbuild:portable",
		"tsbuild:portable": "tsc --project portable/tsconfig.json && esbuild dist/build/js/portable/index.js --bundle --format=esm --platform=node --outfile=dist/build/js/portable-bundle.js",
		"test:w3f": "tsx ./test/test-w3f.ts",
		"test:w3f-portable": "tsx ./test/test-w3f-portable.ts",
		"test:gas-cost": "tsx ./test/test-gas-cost.ts",
		"update-version": "tsx ./web/bump-version.ts $GITHUB_SHA",
		"web": "npx live-server ./web",
		"bench": "tsx bench/run.ts --traces ./bench/traces --iterations 5 --warmup 1",
		"bench:ci": "tsx bench/run.ts --traces ./bench/traces --iterations 5 --warmup 1 --output ./bench/results.json",
		"bench:baseline": "tsx bench/run.ts --traces ./bench/traces --iterations 5 --warmup 1 --output ./bench/baseline.json",
		"bench:compare": "tsx bench/compare.ts"
	},
	"type": "module",
	"keywords": [],
	"author": "Fluffy Labs",
	"license": "MPL-2.0",
	"engines": {
		"node": ">=18.3.0"
	},
	"devDependencies": {
		"@biomejs/biome": "^2.4.10",
		"@typeberry/lib": "^0.8.0",
		"@types/node": "^25.3.3",
		"assemblyscript": "^0.28.9",
		"esbuild": "^0.28.0",
		"json-bigint-patch": "^0.0.8",
		"tsx": "^4.21.0",
		"typescript": "^6.0.2"
	},
	"files": [
		"dist/**/*.wasm",
		"dist/**/*.js",
		"dist/**/*.d.ts",
		"README.md",
		"LICENSE"
	],
	"exports": {
		".": {
			"import": "./dist/build/release.js",
			"types": "./dist/build/release.d.ts"
		},
		"./debug": {
			"import": "./dist/build/debug.js",
			"types": "./dist/build/debug.d.ts"
		},
		"./release": {
			"import": "./dist/build/release.js",
			"types": "./dist/build/release.d.ts"
		},
		"./release-mini": {
			"import": "./dist/build/release-mini.js",
			"types": "./dist/build/release-mini.d.ts"
		},
		"./release-stub": {
			"import": "./dist/build/release-stub.js",
			"types": "./dist/build/release-stub.d.ts"
		},
		"./raw": {
			"import": "./dist/build/debug-raw.js",
			"types": "./dist/build/debug-raw.d.ts"
		},
		"./debug-inline": {
			"import": "./dist/build/debug-inline.js",
			"types": "./dist/build/debug-inline.d.ts"
		},
		"./release-inline": {
			"import": "./dist/build/release-inline.js",
			"types": "./dist/build/release-inline.d.ts"
		},
```
