---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/144'
title: PeanutButterAndJAM
site: github.com/davxy/jam-conformance
created_at: '2025-12-29T17:24:48.000Z'
last_modified: '2025-12-29T17:24:48.000Z'
content_kind: issue
---

# PeanutButterAndJAM

## Issue by @mikirov

This is a tracking issue for the PeanutButterAndJAM client (TypeScript/Assemblyscript) waiting to be added in https://github.com/davxy/jam-conformance/pull/143.

The current release supports GP 0.7.2

# Usage:

## Docker
```bash
# Pull the image (Docker Hub)
docker pull shimonchick/pbnjam-fuzzer-target:latest

# Run a test
docker run --rm \
  -v /tmp:/tmp \
  pbnjam-fuzzer-target:latest \
  --socket /tmp/jam_target.sock
```

## Binary (linux only):
```bash
TAG=$(curl -sL "https://api.github.com/repos/Esscrypt/pbnj-fuzzer-releases/releases?per_page=1" | grep '"tag_name"' | head -1 | sed 's/.*"tag_name": "\([^"]*\)".*/\1/')
echo "Latest tag: $TAG"

curl -sL -o fuzzer-target-bin.tar.gz \
  "https://github.com/Esscrypt/pbnj-fuzzer-releases/releases/download/${TAG}/fuzzer-target-bin.tar.gz"
tar xzvf fuzzer-target-bin.tar.gz
./fuzzer-target --socket /tmp/jam_target.sock --spec tiny
```
## Running directly:
```bash
git clone https://github.com/Esscrypt/peanutbutterandjam
cd peanutbutterandjam
bun i && bun run build
bun run infra/node/fuzzer-target.ts --socket /tmp/jam_target.sock --spec tiny
```




## Comment by @mikirov

Hey @davxy . Yes, we can get the PR merged so we can know where we fail. Very soon i will be updating the docker image itself to have the latest implementation


## Comment by @davxy

@mikirov Looks like the image is not provided for amd64 ?
We need a amd64 image. Can you please provide one? 

```
❯ ./target.py get pbnjam
Downloading pbnjam for linux...
Pulling Docker image: shimonchick/pbnjam-fuzzer-target:latest
latest: Pulling from shimonchick/pbnjam-fuzzer-target
no matching manifest for linux/amd64 in the manifest list entries
Error: Failed to pull Docker image shimonchick/pbnjam-fuzzer-target:latest
```


## Comment by @mikirov

@davxy i just updated the pipeline fo build for both amd64 and arm64, it should be available now


## Comment by @davxy

This is the log I get from your target when it tries to process any of the traces we have  (for example 1766241814)

```log
{"level":30,"time":1767606288744,"pid":7,"hostname":"d622acbd01c9","msg":"LoggerProvider initialized"}
{"level":30,"time":1767606288745,"pid":7,"hostname":"d622acbd01c9","msg":"Starting fuzzer target..."}
{"level":30,"time":1767606288745,"pid":7,"hostname":"d622acbd01c9","msg":"Socket path: /tmp/jam_fuzz_1767606287.sock"}
{"level":30,"time":1767606288745,"pid":7,"hostname":"d622acbd01c9","msg":"Spec: tiny"}
{"level":30,"time":1767606288745,"pid":7,"hostname":"d622acbd01c9","msg":"Initializing services..."}
{"level":30,"time":1767606288746,"pid":7,"hostname":"d622acbd01c9","msg":"Loading SRS file..."}
{"level":30,"time":1767606288746,"pid":7,"hostname":"d622acbd01c9","msg":"SRS file path: /app/packages/bandersnatch-vrf/test-data/srs/zcash-srs-2-11-uncompressed.bin"}
{"level":30,"time":1767606288747,"pid":7,"hostname":"d622acbd01c9","msg":"SRS file exists"}
{"level":30,"time":1767606288748,"pid":7,"hostname":"d622acbd01c9","msg":"Initializing ring prover..."}
{"level":20,"time":1767606288748,"pid":7,"hostname":"d622acbd01c9","msg":"Starting ring prover init promise..."}
using deprecated parameters for the initialization function; pass a single object instead
{"level":20,"time":1767606288748,"pid":7,"hostname":"d622acbd01c9","msg":"Racing init promise against timeout..."}
{"level":30,"time":1767606288764,"pid":7,"hostname":"d622acbd01c9","msg":"Ring prover initialized in 16ms, result:"}
{"level":30,"time":1767606288764,"pid":7,"hostname":"d622acbd01c9","msg":"Initializing ring verifier..."}
{"level":20,"time":1767606288764,"pid":7,"hostname":"d622acbd01c9","msg":"Starting ring verifier init promise..."}
{"level":20,"time":1767606288764,"pid":7,"hostname":"d622acbd01c9","msg":"Racing init promise against timeout..."}
{"level":30,"time":1767606288764,"pid":7,"hostname":"d622acbd01c9","msg":"Ring verifier initialized in 0ms, result:"}
{"level":30,"time":1767606288764,"pid":7,"hostname":"d622acbd01c9","msg":"Ring VRF initialized successfully"}
{"level":30,"time":1767606288765,"pid":7,"hostname":"d622acbd01c9","msg":"AuthPoolService subscribed to block processed events"}
{"level":30,"time":1767606288770,"pid":7,"hostname":"d622acbd01c9","0":{"total":0,"processed":0,"skipped":0,"breakdown":{"chapters":{},"csh":{"storage":0,"preimage":0,"request":0}},"skippedKeys":[]},"msg":"[StateService] setState processing summary"}
{"level":30,"time":1767606288770,"pid":7,"hostname":"d622acbd01c9","msg":"Starting entropy service..."}
{"level":30,"time":1767606288770,"pid":7,"hostname":"d622acbd01c9","msg":"Starting validator set manager..."}
{"level":30,"time":1767606288770,"pid":7,"hostname":"d622acbd01c9","msg":"Starting block importer service..."}
{"level":30,"time":1767606288770,"pid":7,"hostname":"d622acbd01c9","msg":"All services started successfully"}
{"level":30,"time":1767606288770,"pid":7,"hostname":"d622acbd01c9","msg":"Services initialized successfully"}
{"level":30,"time":1767606288770,"pid":7,"hostname":"d622acbd01c9","msg":"Ensured socket directory exists: /tmp"}
{"level":30,"time":1767606288771,"pid":7,"hostname":"d622acbd01c9","msg":"No existing socket found at /tmp/jam_fuzz_1767606287.sock"}
{"level":30,"time":1767606288771,"pid":7,"hostname":"d622acbd01c9","msg":"Creating Unix domain socket server..."}
{"level":30,"time":1767606288775,"pid":7,"hostname":"d622acbd01c9","msg":"✅ Fuzzer target listening on /tmp/jam_fuzz_1767606287.sock"}
{"level":30,"time":1767606288775,"pid":7,"hostname":"d622acbd01c9","msg":"Spec: tiny"}
{"level":30,"time":1767606288775,"pid":7,"hostname":"d622acbd01c9","msg":"Features: ancestry=true, forks=true"}
{"level":30,"time":1767606288775,"pid":7,"hostname":"d622acbd01c9","msg":"Ready to accept connections (press Ctrl+C to stop)"}
{"level":30,"time":1767606288775,"pid":7,"hostname":"d622acbd01c9","msg":"Server is listening for connections"}
{"level":30,"time":1767606289172,"pid":7,"hostname":"d622acbd01c9","msg":"Fuzzer connected [unknown-1767606289172]"}
{"level":30,"time":1767606289173,"pid":7,"hostname":"d622acbd01c9","msg":"JAM version from fuzzer: 0.7.2"}
{"level":30,"time":1767606289179,"pid":7,"hostname":"d622acbd01c9","msg":"Received message: 1528306 bytes, discriminant: 0x01"}
{"level":40,"time":1767606289179,"pid":7,"hostname":"d622acbd01c9","msg":"⚠  Initialize message size mismatch: received 1528306 bytes, expected 177945 bytes (from test file)"}
{"level":20,"time":1767606289241,"pid":7,"hostname":"d622acbd01c9","msg":"Decoded message type: Initialize"}
{"level":30,"time":1767606289241,"pid":7,"hostname":"d622acbd01c9","msg":"Initialize message decoded: 99 keyvals, 0 ancestry items"}
{"level":20,"time":1767606289241,"pid":7,"hostname":"d622acbd01c9","msg":"First keyval - key: 0x004400b500a400aaa0d7f8eab5ca1cca4a0472988422febc..., value: 0x5d25ae56... (4 bytes)"}
{"level":50,"time":1767606289241,"pid":7,"hostname":"d622acbd01c9","args":"[ undefined ]","msg":"❌ Expected 21 keyvals but decoded 99 keyvals - this indicates a decoding issue!"}
{"level":50,"time":1767606289241,"pid":7,"hostname":"d622acbd01c9","args":"[ undefined ]","msg":"   Message data length: 1528306 bytes"}
{"level":50,"time":1767606289241,"pid":7,"hostname":"d622acbd01c9","args":"[ undefined ]","msg":"   First 20 bytes: 0x01 0xf3 0x31 0x9c 0x23 0xb8 0x09 0x6e 0xde 0xd3 0xfd 0x30 0x5f 0xb6 0x71 0xc4 0xc1 0x4b 0x47 0xd2"}
{"level":20,"time":1767606289241,"pid":7,"hostname":"d622acbd01c9","msg":"Handling Initialize message"}
{"level":20,"time":1767606289242,"pid":7,"hostname":"d622acbd01c9","msg":"Initialize: Setting state with 99 keyvals"}
{"level":20,"time":1767606289794,"pid":7,"hostname":"d622acbd01c9","0":{"key":"0x00cc007a00980005854520370befe282935ed398114c060b435946c98d4fc1","serviceId":"0","preimageHash":"0xf8d86b97d65319a078e5840f1614c296a5254217794dcc910e72ca174e3c2e86","blobLength":50},"msg":"Request key verified against preimage"}
{"level":20,"time":1767606289794,"pid":7,"hostname":"d622acbd01c9","0":{"key":"0x00d600fb00da00359bb76e590150f6a2913b66485dedbce71b8a11bb94f5e9","serviceId":"0","preimageHash":"0xd1b097b4410b3a63446d7c57d093972a9744fcd2d74f4a5e2ec163610e6d6327","blobLength":137056},"msg":"Request key verified against preimage"}
{"level":20,"time":1767606289794,"pid":7,"hostname":"d622acbd01c9","0":{"key":"0x012cacff71302544aa84f31be60f9d7ed87eaef9dbb83ab9b4db18c1148396","serviceId":"628206593","preimageHash":"0xbb8648e2eb5cab1ebb8129eca29c8af2e5155fe1ac9400ab01852a1e0cc82b1e","blobLength":145725},"msg":"Request key verified against preimage"}
{"level":20,"time":1767606289794,"pid":7,"hostname":"d622acbd01c9","0":{"key":"0x312c76ff7930d444aa84f31be60f9d7ed87eaef9dbb83ab9b4db18c1148396","serviceId":"3564729905","preimageHash":"0xbb8648e2eb5cab1ebb8129eca29c8af2e5155fe1ac9400ab01852a1e0cc82b1e","blobLength":145725},"msg":"Request key verified against preimage"}
{"level":20,"time":1767606289794,"pid":7,"hostname":"d622acbd01c9","0":{"key":"0x5c2c50ff29300644aa84f31be60f9d7ed87eaef9dbb83ab9b4db18c1148396","serviceId":"103370844","preimageHash":"0xbb8648e2eb5cab1ebb8129eca29c8af2e5155fe1ac9400ab01852a1e0cc82b1e","blobLength":145725},"msg":"Request key verified against preimage"}
{"level":20,"time":1767606289794,"pid":7,"hostname":"d622acbd01c9","0":{"key":"0x5d2c25ffae305644aa84f31be60f9d7ed87eaef9dbb83ab9b4db18c1148396","serviceId":"1454253405","preimageHash":"0xbb8648e2eb5cab1ebb8129eca29c8af2e5155fe1ac9400ab01852a1e0cc82b1e","blobLength":145725},"msg":"Request key verified against preimage"}
{"level":20,"time":1767606289794,"pid":7,"hostname":"d622acbd01c9","0":{"key":"0xaa2cc1ff1730a544aa84f31be60f9d7ed87eaef9dbb83ab9b4db18c1148396","serviceId":"2769797546","preimageHash":"0xbb8648e2eb5cab1ebb8129eca29c8af2e5155fe1ac9400ab01852a1e0cc82b1e","blobLength":145725},"msg":"Request key verified against preimage"}
{"level":20,"time":1767606289794,"pid":7,"hostname":"d622acbd01c9","0":{"key":"0xc52c05ffd5300744aa84f31be60f9d7ed87eaef9dbb83ab9b4db18c1148396","serviceId":"131401157","preimageHash":"0xbb8648e2eb5cab1ebb8129eca29c8af2e5155fe1ac9400ab01852a1e0cc82b1e","blobLength":145725},"msg":"Request key verified against preimage"}
```

So, apparently the initial set state message is not processed as expected. Indeed we receive back an invalid state root


## Comment by @mikirov

@davxy thanks. i managed to reproduce the issue. I also see a lot of debug logs. Working on a fix


## Comment by @davxy

@mikirov I have published the performance report for your implementation [here](https://github.com/davxy/jam-conformance/blob/perf-round/fuzz-perf/0.7.2/pbnjam/storage_light.json).

The main bottleneck appears to be the PVM implementation. I was unable to complete a full benchmark of the `storage` vector because it consistently timed out while waiting for a target response. As shown in the `storage_light` results, some blocks take an unreasonably long time to process. For context, you may want to compare these timings with those reported by the other teams.


## Comment by @mikirov

@davxy I tested out the minifuzz locally and was able to run all 100 blocks properly for 0.7.2 config, running the binary directly.

 However, i was unable to reproduce the socket connection through the docker container. Local binary build was fine: https://github.com/Esscrypt/pbnj-fuzzer-releases/releases/tag/fuzzer-target-6d4aa1e30ab7fd9f62e806d614ad2a4ca61a0c98

What command do you use to connect the minifuzz process to the container? On Mac i am having some troubles


## Comment by @mikirov

> [@mikirov](https://github.com/mikirov) I have published the performance report for your implementation [here](https://github.com/davxy/jam-conformance/blob/perf-round/fuzz-perf/0.7.2/pbnjam/storage_light.json).
> 
> The main bottleneck appears to be the PVM implementation. I was unable to complete a full benchmark of the `storage` vector because it consistently timed out while waiting for a target response. As shown in the `storage_light` results, some blocks take an unreasonably long time to process. For context, you may want to compare these timings with those reported by the other teams.

In that case i will spend more time on the wasm pvm implementation, which seems to be significantly faster than typescript. thanks for the heads up.


## Comment by @davxy

> What command do you use to connect the minifuzz process to the container? On Mac i am having some troubles

@alxmirap 


## Comment by @mikirov

@davxy compiled PVM implementation is now complete and we now pass all fuzzy test vectors. Now `storage-light` and `storage` test vectors should be significantly faster to execute.


## Comment by @davxy

@mikirov  target now fails to start

```log
❯ ./target.py run pbnjam
Running 'pbnjam' on docker image
Command: '--socket /tmp/jam_target.sock'
Container: 'pbnjam-767ahh'
Image: shimonchick/pbnjam-fuzzer-target:latest
Image ID: 36bbecd5c0a5
Created: 2026-01-24T16:03:23.987906968Z
Container temp dir: /tmp/jam_pbnjam-767ahh_m7ad_hx_
Socket symlink: /tmp/jam_target.sock -> /tmp/jam_pbnjam-767ahh_m7ad_hx_/jam_target.sock
Ensuring no leftover container with name pbnjam-767ahh...
Waiting for target termination (pid=11031)
{"level":30,"time":1769354161342,"pid":7,"hostname":"fe9a427d2ab9","msg":"LoggerProvider initialized"}
{"level":30,"time":1769354161343,"pid":7,"hostname":"fe9a427d2ab9","msg":"Starting fuzzer target..."}
{"level":30,"time":1769354161343,"pid":7,"hostname":"fe9a427d2ab9","msg":"Socket path: /tmp/jam_target.sock"}
{"level":30,"time":1769354161343,"pid":7,"hostname":"fe9a427d2ab9","msg":"Spec: tiny"}
{"level":30,"time":1769354161343,"pid":7,"hostname":"fe9a427d2ab9","msg":"Loading SRS file..."}
{"level":30,"time":1769354161343,"pid":7,"hostname":"fe9a427d2ab9","msg":"SRS file path: /app/packages/bandersnatch-vrf/test-data/srs/zcash-srs-2-11-uncompressed.bin"}
using deprecated parameters for the initialization function; pass a single object instead
{"level":30,"time":1769354161362,"pid":7,"hostname":"fe9a427d2ab9","msg":"AuthPoolService subscribed to block processed events"}
{"level":50,"time":1769354161366,"pid":7,"hostname":"fe9a427d2ab9","err":{"type":"Error","message":"ENOENT: no such file or directory, open '/app/pvm-assemblyscript/build/pvm.wasm'","stack":"Error: ENOENT: no such file or directory, open '/app/pvm-assemblyscript/build/pvm.wasm'\n    at readFileSync (unknown)\n    at new h5 (/$bunfs/root/fuzzer-target:29:25566)\n    at new Q4 (/$bunfs/root/fuzzer-target:29:31355)\n    at cD (/$bunfs/root/fuzzer-target:42:2625)\n    at async rD (/$bunfs/root/fuzzer-target:46:5557)\n    at processTicksAndRejections (native:7:39)","code":"ENOENT","path":"/app/pvm-assemblyscript/build/pvm.wasm","syscall":"open","errno":-2},"args":"[\n  24 | ${C}`,R=\"\",_=\"\",B=Math.min(F,q);if(r6(V))R+=LZ(V,A,q),P=P.slice(V.length),B-=V.length,_=A;if(W)P=a6(P,X);N.push(V);for(let k=0;k<B;k++){let y=P[k],g=Z(y,V[y],N,H,C);if(g!==void 0)R+=`${_}${b8(y)}: ${g}`,_=A}if(F>q){let k=F-q;R+=`${_}\"...\": \"${PQ(k)} not stringified\"`,_=A}if(_!==\"\")R=`\n25 | ${C}${R}\n26 | ${T}`;return N.pop(),`{${R}}`}case\"number\":return isFinite(V)?String(V):J?J(V):\"null\";case\"boolean\":return V===!0?\"true\":\"false\";case\"undefined\":return;case\"bigint\":if(Y)return String(V);default:return J?J(V):void 0}}function z(w,V,N){switch(typeof V){case\"string\":return b8(V);case\"object\":{if(V===null)return\"null\";if(typeof V.toJSON===\"function\"){if(V=V.toJSON(w),typeof V!==\"object\")return z(w,V,N);if(V===null)return\"null\"}if(N.indexOf(V)!==-1)return Q;let H=\"\",C=V.length!==void 0;if(C&&Array.isArray(V)){if(V.length===0)return\"[]\";if(G<N.length+1)return'\"[Array]\"';N.push(V);let R=Math.min(V.length,q),_=0;for(;_<R-1;_++){let k=z(String(_),V[_],N);H+=k!==void 0?k:\"null\",H+=\",\"}let B=z(String(_),V[_],N);if(H+=B!==void0?B:\"null\",V.length-1>q){let k=V.length-q-1;H+=`,\"... ${PQ(k)} not stringified\"`}return N.pop(),`[${H}]`}let T=Object.keys(V),P=T.length;if(P===0)return\"{}\";if(G<N.length+1)return'\"[Object]\"';let F=\"\",A=Math.min(P,q);if(C&&r6(V))H+=LZ(V,\",\",q),T=T.slice(V.length),A-=V.length,F=\",\";if(W)T=a6(T,X);N\n27 | `:`\n28 | `),b=kO.bind(null,{[RZ]:\"\",[kZ]:G,[SZ]:v,[EZ]:$X,[JX]:k,[bZ]:y}),h=\"\";if(z!==null)if(K===void 0)h=b(z);else h=b(Object.assign({},z,{name:K}));let l=q instanceof Function?q:q?gZ:rO,p=l().indexOf(\":\")+1;if(T&&!V)throw Error(\"customLevels is required if useOnlyCustomLevels is set true\");if(H&&typeof H!==\"function\")throw Error(`Unknown mixin type \"${typeof H}\" - expected \"function\"`);if(B&&typeof B!==\"string\")throw Error(`Unknown msgPrefix type \"${typeof B}\" - expected \"string\"`);FO(w,V,T);let i=yZ(V,T);if(typeof Y.emit===\"function\")Y.emit(\"message\",{code:\"PINO_CONFIG\",config:{levels:i,messageKey:U,errorKey:j}});_O(N);let d=IO(N);return Object.assign(J,{levels:i,[cO]:d,[iO]:T,[yO]:Y,[hO]:l,[fO]:p,[EZ]:$X,[JX]:k,[SZ]:v,[gO]:I,[mO]:O,[pO]:U,[uO]:j,[lO]:Z,[oO]:Z?`,${JSON.stringify(Z)}:{`:\"\",[kZ]:G,[dO]:H,[sO]:C,[RZ]:h,[bZ]:y,[nO]:F,silent:SO,onChild:_,[aO]:B}),Object.setPrototypeOf(J,PO()),BO(J),J[xO](w),J}jJ.exports=QX;jJ.exports.destination=($=process.stdout.fd)=>{if(typeof $===\"object\")return $.dest=AZ($.dest||pr\n29 | `,\"utf-8\"),q&&q.length>0){let P=C.replace(\".log\",\"-accumulate_input.bin\"),F=B7(w,P);E5(F,q),D.debug(`[TraceDump] Wrote accumulate_input to: ${F}`)}if(j&&j.length>0){let P=C.replace(\".log\",\"-output.bin\"),F=B7(w,P);E5(F,j),D.debug(`[TraceDump] Wrote output to: ${F}`)}else if(Z!==void 0){let P=C.replace(\".log\",\"-err.bin\"),F=B7(w,P);E5(F,new Uint8Array([Z])),D.debug(`[TraceDump] Wrote err to: ${F}`)}return T}catch(V){D.error(\"Failed to write trace dump\",{error:V instanceof Error?V.message:String(V)});return}}import{dirname as CD,join as b5}from\"path\";import{fileURLToPath as DD}from\"url\";var __dirname=\"/app/packages/pvm-invocations/src\";class v5 extends FY{accumulateHostFunctionRegistry;configService;entropyService;workspaceRoot;traceSubfolder;accumulateInputs=null;traceHostFunctionLogs=[];constructor($,J,Q,Y,W,X){super($,W);this.accumulateHostFunctionRegistry=J,this.configService=Q,this.entropyService=Y;let G=typeof __dirname<\"u\"?__dirname:CD(DD(import.meta.url)),q=b5(G,\"..\",\"..\");this.workspaceRoot=b5(q,\"..\"),th\n\nENOENT: no such file or directory, open '/app/pvm-assemblyscript/build/pvm.wasm'\n    path: \"/app/pvm-assemblyscript/build/pvm.wasm\",\n syscall: \"open\",\n   errno: -2,\n    code: \"ENOENT\"\n\n      at new h5 (/$bunfs/root/fuzzer-target:29:25566)\n      at new Q4 (/$bunfs/root/fuzzer-target:29:31349)\nat cD (/$bunfs/root/fuzzer-target:42:2619)\n      at async rD (/$bunfs/root/fuzzer-target:46:5557)\n\n]","msg":"Failed to start services:"}
{"level":50,"time":1769354161366,"pid":7,"hostname":"fe9a427d2ab9","err":{"type":"Error","message":"ENOENT: no such file or directory, open '/app/pvm-assemblyscript/build/pvm.wasm'","stack":"Error: ENOENT: no such file or directory, open '/app/pvm-assemblyscript/build/pvm.wasm'\n    at readFileSync (unknown)\n    at new h5 (/$bunfs/root/fuzzer-target:29:25566)\n    at new Q4 (/$bunfs/root/fuzzer-target:29:31355)\n    at cD (/$bunfs/root/fuzzer-target:42:2625)\n    at async rD (/$bunfs/root/fuzzer-target:46:5557)\n    at processTicksAndRejections (native:7:39)","code":"ENOENT","path":"/app/pvm-assemblyscript/build/pvm.wasm","syscall":"open","errno":-2},"args":"[\n  24 | ${C}${R}\n25 | ${T}`;return N.pop(),`{${R}}`}case\"number\":return isFinite(V)?String(V):J?J(V):\"null\";case\"boolean\":return V===!0?\"true\":\"false\";case\"undefined\":return;case\"bigint\":if(Y)return String(V);default:return J?J(V):void 0}}function z(w,V,N){switch(typeof V){case\"string\":return b8(V);case\"object\":{if(V===null)return\"null\";if(typeof V.toJSON===\"function\"){if(V=V.toJSON(w),typeof V!==\"object\")return z(w,V,N);if(V===null)return\"null\"}if(N.indexOf(V)!==-1)return Q;let H=\"\",C=V.length!==void 0;if(C&&Array.isArray(V)){if(V.length===0)return\"[]\";if(G<N.length+1)return'\"[Array]\"';N.push(V);let R=Math.min(V.length,q),_=0;for(;_<R-1;_++){let k=z(String(_),V[_],N);H+=k!==void 0?k:\"null\",H+=\",\"}let B=z(String(_),V[_],N);if(H+=B!==void 0?B:\"null\",V.length-1>q){let k=V.length-q-1;H+=`,\"... ${PQ(k)} not stringified\"`}return N.pop(),`[${H}]`}let T=Object.keys(V),P=T.length;if(P===0)return\"{}\";if(G<N.length+1)return'\"[Object]\"';let F=\"\",A=Math.min(P,q);if(C&&r6(V))H+=LZ(V,\",\",q),T=T.slice(V.length),A-=V.length,F=\",\";if(W)T=a6(T,X);N\n26 | `:`\n27 | `),b=kO.bind(null,{[RZ]:\"\",[kZ]:G,[SZ]:v,[EZ]:$X,[JX]:k,[bZ]:y}),h=\"\";if(z!==null)if(K===void 0)h=b(z);else h=b(Object.assign({},z,{name:K}));let l=q instanceof Function?q:q?gZ:rO,p=l().indexOf(\":\")+1;if(T&&!V)throw Error(\"customLevels is required if useOnlyCustomLevels is set true\");if(H&&typeof H!==\"function\")throw Error(`Unknown mixin type \"${typeof H}\" - expected \"function\"`);if(B&&typeof B!==\"string\")throw Error(`Unknown msgPrefix type \"${typeof B}\" - expected \"string\"`);FO(w,V,T);let i=yZ(V,T);if(typeof Y.emit===\"function\")Y.emit(\"message\",{code:\"PINO_CONFIG\",config:{levels:i,messageKey:U,errorKey:j}});_O(N);let d=IO(N);return Object.assign(J,{levels:i,[cO]:d,[iO]:T,[yO]:Y,[hO]:l,[fO]:p,[EZ]:$X,[JX]:k,[SZ]:v,[gO]:I,[mO]:O,[pO]:U,[uO]:j,[lO]:Z,[oO]:Z?`,${JSON.stringify(Z)}:{`:\"\",[kZ]:G,[dO]:H,[sO]:C,[RZ]:h,[bZ]:y,[nO]:F,silent:SO,onChild:_,[aO]:B}),Object.setPrototypeOf(J,PO()),BO(J),J[xO](w),J}jJ.exports=QX;jJ.exports.destination=($=process.stdout.fd)=>{if(typeof $===\"object\")return $.dest=AZ($.dest||pr\n28 | `)}\n29 | `,\"utf-8\"),q&&q.length>0){let P=C.replace(\".log\",\"-accumulate_input.bin\"),F=B7(w,P);E5(F,q),D.debug(`[TraceDump] Wrote accumulate_input to: ${F}`)}if(j&&j.length>0){let P=C.replace(\".log\",\"-output.bin\"),F=B7(w,P);E5(F,j),D.debug(`[TraceDump] Wrote output to: ${F}`)}else if(Z!==void 0){let P=C.replace(\".log\",\"-err.bin\"),F=B7(w,P);E5(F,new Uint8Array([Z])),D.debug(`[TraceDump] Wrote err to: ${F}`)}return T}catch(V){D.error(\"Failed to write trace dump\",{error:V instanceof Error?V.message:String(V)});return}}import{dirname as CD,join as b5}from\"path\";import{fileURLToPath as DD}from\"url\";var __dirname=\"/app/packages/pvm-invocations/src\";class v5 extends FY{accumulateHostFunctionRegistry;configService;entropyService;workspaceRoot;traceSubfolder;accumulateInputs=null;traceHostFunctionLogs=[];constructor($,J,Q,Y,W,X){super($,W);this.accumulateHostFunctionRegistry=J,this.configService=Q,this.entropyService=Y;let G=typeof __dirname<\"u\"?__dirname:CD(DD(import.meta.url)),q=b5(G,\"..\",\"..\");this.workspaceRoot=b5(q,\"..\"),th\n\nENOENT: no such file or directory, open '/app/pvm-assemblyscript/build/pvm.wasm'\n    path: \"/app/pvm-assemblyscript/build/pvm.wasm\",\n syscall: \"open\",\n   errno: -2,\n    code: \"ENOENT\"\n\n      at readFileSync (unknown:1:1)\n      at new h5 (/$bunfs/root/fuzzer-target:29:25566)\n      at new Q4 (/$bunfs/root/fuzzer-target:29:31355)\n      at cD (/$bunfs/root/fuzzer-target:42:2625)\n      at rD (/$bunfs/root/fuzzer-target:46:5557)\n      at processTicksAndRejections (native:7:39)\n\n]","msg":"Failed to start fuzzer target:"}
{"level":50,"time":1769354161366,"pid":7,"hostname":"fe9a427d2ab9","err":"Error: ENOENT: no such file or directory, open '/app/pvm-assemblyscript/build/pvm.wasm'\n    at readFileSync (unknown)\n    at new h5 (/$bunfs/root/fuzzer-target:29:25566)\nat new Q4 (/$bunfs/root/fuzzer-target:29:31355)\n    at cD (/$bunfs/root/fuzzer-target:42:2625)\n    at async rD (/$bunfs/root/fuzzer-target:46:5557)\n    at processTicksAndRejections (native:7:39)","args":"[ \"Error: ENOENT: no such file or directory, open '/app/pvm-assemblyscript/build/pvm.wasm'\\n    at readFileSync (unknown)\\n    at new h5 (/$bunfs/root/fuzzer-target:29:25566)\\n    at new Q4 (/$bunfs/root/fuzzer-target:29:31355)\\n    at cD (/$bunfs/root/fuzzer-target:42:2625)\\n    at async rD (/$bunfs/root/fuzzer-target:46:5557)\\n    at processTicksAndRejections (native:7:39)\" ]","msg":"Error stack:"}
Target process exited with status: 1
Cleaning up Docker container pbnjam-767ahh...
Cleaned up container temp dir: /tmp/jam_pbnjam-767ahh_m7ad_hx_
```


## Comment by @mikirov

Apologies, should be fixed now


## Comment by @mikirov

@davxy now PBNJ has its own Rust PVM implementation that was 3-5X faster testing internally. Could you help me verify the new docker target is connecting properly or share the command used to run the minifuzz with docker images (i am struggling to connect to Unix socket through docker on Mac). Otherwise one can run the fuzzer through Bun as described here: https://github.com/Esscrypt/peanutbutterandjam?tab=readme-ov-file#running-the-fuzzer


## Comment by @davxy

@mikirov 

```
❯ ./target.py run pbnjam
Running 'pbnjam' on docker image
Command: '--socket /tmp/jam_target.sock'
Container: 'pbnjam-r7jeai'
Image: shimonchick/pbnjam-fuzzer-target:latest
Image ID: d14c1e4decb1
Created: 2026-02-22T11:04:48.893204539Z
Container temp dir: /tmp/jam_pbnjam-r7jeai__dgvka96
Socket symlink: /tmp/jam_target.sock -> /tmp/jam_pbnjam-r7jeai__dgvka96/jam_target.sock
Ensuring no leftover container with name pbnjam-r7jeai...
Waiting for target termination (pid=163808)
2 | #!/usr/bin/env bun
3 | // @bun
4 | var vH=Object.create;var{getPrototypeOf:fH,defineProperty:iW,getOwnPropertyNames:yH}=Object;var gH=Object.prototype.hasOwnProperty;var A0=($,J,Q)=>{Q=$!=null?vH(fH($)):{};let Y=J||!$||!$.__esModule?iW(Q,"default",{value:$,enumerable:!0}):Q;for(let W of yH($))if(!gH.call(Y,W))iW(Y,W,{get:()=>$[W],enumerable:!0});return Y};var x$=($,J)=>()=>(J||$((J={exports:{}}).exports,J),J.exports);var mH=($,J)=>{for(var Q inJ)iW($,Q,{get:J[Q],enumerable:!0,configurable:!0,set:(Y)=>J[Q]=()=>Y})};var e$=($,J)=>()=>($&&(J=$($=0)),J);var r$=import.meta.require;var Sq=x$((h_,pH)=>{pH.exports={name:"dotenv",version:"17.2.3",description:"Loads environment variables from .env file",main:"lib/main.js",types:"lib/main.d.ts",exports:{".":{types:"./lib/main.d.ts",require:"./lib/main.js",default:"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.
5 | `);let Y;while((Y=oH.exec(Q))!=null){let W=Y[1],X=Y[2]||"";X=X.trim();let G=X[0];if(X=X.replace(/^(['"`])([\s\S]*)\1$/mg,"$2"),G==='"')X=X.replace(/\\n/g,`
6 | `);super(X,J.cause?{cause:J.cause}:void 0);Object.defineProperty(this,"details",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"docsPath",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"metaMessages",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"shortMessage",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"version",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"BaseError"}),this.details=Q,this.docsPath=Y,this.metaMessages=J.metaMessages,this.name=J.name??this.name,this.shortMessage=$,this.version=j9}walk($){return _Z(this,$)}}});var E5;var RZ=e$(()=>{k5();E5=class E5 extends O8{constructor({size:$,targetSize:J,type:Q}){super(`${Q.charAt(0).toUpperCase()}${Q.slice(1).toLowerCase()} size (${$}) exceeds padding size (${J}).`,{name:"SizeExceedsPaddingSizeError"})}}});f

ENOENT: no such file or directory, open '/app/node_modules/.bun/@pbnjam+bandersnatch-vrf@0.7.2-rc12+5ea7192035fa5684/node_modules/@pbnjam/bandersnatch-vrf/wasm-ark-vrf/ark_vrf_wasm_bg.wasm'
    path: "/app/node_modules/.bun/@pbnjam+bandersnatch-vrf@0.7.2-rc12+5ea7192035fa5684/node_modules/@pbnjam/bandersnatch-vrf/wasm-ark-vrf/ark_vrf_wasm_bg.wasm",
 syscall: "open",
   errno: -2,
    code: "ENOENT"

      at <anonymous> (/$bunfs/root/fuzzer-target:6:6342)
      at <anonymous> (/$bunfs/root/fuzzer-target:3:347)
      at /$bunfs/root/fuzzer-target:30:111622
      at loadAndEvaluateModule (2:1)

Bun v1.3.9 (Linux x64 baseline)
Target process exited with status: 1
Cleaning up Docker container pbnjam-r7jeai...
Cleaned up container temp dir: /tmp/jam_pbnjam-r7jeai__dgvka96
```


## Comment by @mikirov

@davxy Would it be possible to try with the binary released (linux only) that might work better [Here](https://github.com/Esscrypt/pbnj-fuzzer-releases/releases/tag/fuzzer-target-c1fa3b35bccb9e00bb003f706cd7fd42d91cba98)


## Comment by @mikirov

@davxy also the docker image should have all dependancies bundled now and they should resolve at runtime


## Comment by @mikirov

@davxy we conform to the docker spec now
