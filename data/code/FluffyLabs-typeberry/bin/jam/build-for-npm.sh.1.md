---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/build-for-npm.sh#L75-L141
title: bin/jam/build-for-npm.sh
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 0042abbf283139b871cb55dabfdc918f91ee2f0d5e9a889d3dc84f4c67f599b0
language: bash
---
`bin/jam/build-for-npm.sh` (lines 75–141)

```bash
$BUILD ./packages/workers/jam-network/bootstrap-main.ts -o $DIST_FOLDER/jam-network
$BUILD ./packages/workers/block-authorship/bootstrap-main.ts -o $DIST_FOLDER/block-authorship

# copy some files that should be there
cp ./LICENSE $DIST_FOLDER/
cp ./README.md $DIST_FOLDER/

# Flatten one worker build into dist/jam: rename its index.js -> $2.mjs (and map),
# repoint the trailing sourceMappingURL (last line, via the `$` address) at the
# renamed map so worker crash traces resolve to the right TS source, then move
# everything up a level. $1 = worker subdir, $2 = bootstrap file basename.
flatten_worker() {
  cd "./$1"
  rm *.mjs || true
  mv index.js "$2.mjs"
  mv index.js.map "$2.mjs.map"
  # Portable in-place edit (BSD `sed -i` differs from GNU and breaks on macOS):
  # rewrite via a temp file instead of relying on `-i`.
  sed "\$ s|sourceMappingURL=index.js.map|sourceMappingURL=$2.mjs.map|" "$2.mjs" > "$2.mjs.tmp" && mv "$2.mjs.tmp" "$2.mjs"
  # Move the bundle up one level into $DIST_FOLDER. We can't use `mv * ../`:
  # workers that pull in telemetry also emit gRPC asset directories (proto/,
  # protoc-gen-validate/, xds/) that the main bundle - and earlier workers -
  # already created up there, and `mv` refuses to merge into a non-empty dir.
  tar cf - . | ( cd ../ && tar xf - )
  cd ../
  rm -rf "./$1"
}

# Flatten the workers structure
cd $DIST_FOLDER
flatten_worker importer bootstrap-importer
flatten_worker jam-network bootstrap-network
flatten_worker block-authorship bootstrap-authorship

# copy worker wasm files
cp **/*.wasm ./ || true # ignore overwrite errors

# Make index.js executable and insert shebang with 7GB heap size limit
echo '#!/usr/bin/env -S node --max-old-space-size=7168' > ./temp.js && cat ./index.js >> ./temp.js && mv ./temp.js ./index.js
chmod +x ./index.js

# build package.json file
cat > ./package.json << EOF
{
  "name": "@typeberry/jam",
  "version": "$VERSION",
  "description": "$DESCRIPTION",
  "main": "./index.js",
  "bin": {
    "jam": "./index.js"
  },
  "dependencies": {
    "lmdb": "$LMDB_VERSION",
    "@matrixai/quic": "$QUIC_VERSION",
    "@fjall-js/fjall": "$FJALL_VERSION",
    "@typeberry/native": "$NATIVE_VERSION"
  },
  "homepage": "https://typeberry.dev",
  "repository": {
    "type": "git",
    "url": "https://github.com/FluffyLabs/typeberry"
  },
  "author": "Fluffy Labs <hello@fluffylabs.dev>",
  "license": "MPL-2.0",
  "type": "module"
}
EOF
```
