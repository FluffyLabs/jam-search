---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/49'
title: JAM test vectors runner - problem with json file recognition
site: github.com/FluffyLabs/typeberry
created_at: '2024-07-29T15:00:24.000Z'
last_modified: '2024-07-29T15:00:24.000Z'
content_kind: issue
---

# JAM test vectors runner - problem with json file recognition

## Issue by @mateuszsikora

I noticed a small problem in our test runner. The command that we have in README.md: 
```
npm run run-tests --  ../jamtestvectors/**/*.json
```
matches all json files (not only test data) - for example `schema.json` (pvm test vectors) is matched but it isn't a test case. I have a few ideas how we can fix that:
1. use `asn` files to recognise a correct test case based on file content 
2. blocklist some filenames in our test runner
3. pass only path to jamtestvectors root to our test runner and in each handler (safrole, pvm, ...) hardcode a path to test vectors - for example `pvm/programs` in case of pvm tests


## Comment by @tomusdrw

To complicate things a bit more: EC tests don't even have `.json` extension.

My idea how to solve that would be to specify a part of the file path that needs to match in the test definition, like so:
```js
const runners = [
    tryToPrepareTestRunner(testContent, 'safrole', SafroleTest.fromJson, runSafroleTest, handleError),
    tryToPrepareTestRunner(testContent, 'pvm/programs', PvmTest.fromJson, runPvmTest, handleError),
    tryToPrepareTestRunner(testContent, 'trie', trieTestSuiteFromJson, runTrieTest, handleError),
    tryToPrepareTestRunner(testContent, 'ec/vectors', EcTest.fromJson, runEcTest, handleError),
  ];
```

That will optimize the "try to parse" as we have currently, since we will only attempt to parse if the path matches.



## Comment by @tomusdrw

We currently match the schema file as well and ignore it. If it ever causes any issues we can re-open.
