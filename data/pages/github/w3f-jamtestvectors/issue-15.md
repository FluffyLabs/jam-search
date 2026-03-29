---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/15'
title: Optimizing Erasure coding parameters
site: github.com/w3f/jamtestvectors
created_at: '2024-10-10T17:11:10.000Z'
last_modified: '2024-10-10T17:11:10.000Z'
---

# Optimizing Erasure coding parameters

## Issue by @drskalman

These are the benches for encoding and decoding fixed size data packages of size

[4KB, 8KB, 32KB, 64KB, 128KB, 256KB, 512KB, 1024KB, 2048KB, 4096KB]

using `reed-solomon-simd` library using the following "data:recovery shards" scheme:

- 256:768
- 342:682
- 512:1024
- 1024:2048
- 2048:4096
- 4096:8192

```
256:768 (4 KB)                    108          1412
342:682 (4 KB)                    120          1521
512:1024 (4 KB)                   162          1591
1024:2048 (4 KB)                  353          2059
2048:4096 (4 KB)                  758          3086
4096:8192 (4 KB)                 1626          5259

256:768 (8 KB)                    107          1413
342:682 (8 KB)                    119          1523
512:1024 (8 KB)                   161          1592
1024:2048 (8 KB)                  354          2054
2048:4096 (8 KB)                  760          3090
4096:8192 (8 KB)                 1626          5237

256:768 (16 KB)                   107          1461
342:682 (16 KB)                   137          1521
512:1024 (16 KB)                  162          1591
1024:2048 (16 KB)                 354          2056
2048:4096 (16 KB)                 761          3083
4096:8192 (16 KB)                1634          5247

256:768 (32 KB)                   151          1528
342:682 (32 KB)                   176          1705
512:1024 (32 KB)                  164          1591
1024:2048 (32 KB)                 357          2062
2048:4096 (32 KB)                 772          3086
4096:8192 (32 KB)                1651          5599

256:768 (64 KB)                   257          1804
342:682 (64 KB)                   242          1916
512:1024 (64 KB)                  237          1816
1024:2048 (64 KB)                 359          2067
2048:4096 (64 KB)                 766          3086
4096:8192 (64 KB)                1643          5255

256:768 (128 KB)                  456          2329
342:682 (128 KB)                  434          2568
512:1024 (128 KB)                 410          2332
1024:2048 (128 KB)                526          2568
2048:4096 (128 KB)                773          3106
4096:8192 (128 KB)               1651          5281

256:768 (256 KB)                  900          3448
342:682 (256 KB)                  842          3887
512:1024 (256 KB)                 754          3314
1024:2048 (256 KB)                904          3602
2048:4096 (256 KB)               1136          4173
4096:8192 (256 KB)               1650          5233

256:768 (512 KB)                 1759          5614
342:682 (512 KB)                 1656          6515
512:1024 (512 KB)                1458          5278
1024:2048 (512 KB)               1641          5669
2048:4096 (512 KB)               1959          6440
4096:8192 (512 KB)               2399          7508

256:768 (1024 KB)                3778         10024
342:682 (1024 KB)                3531         12054
512:1024 (1024 KB)               3024          9493
1024:2048 (1024 KB)              3368         10113
2048:4096 (1024 KB)              3798         11285
4096:8192 (1024 KB)              4404         12529

256:768 (2048 KB)                7963         20322
342:682 (2048 KB)                7195         24780
512:1024 (2048 KB)               6000         18725
1024:2048 (2048 KB)              6595         19798
2048:4096 (2048 KB)              7429         21929
4096:8192 (2048 KB)              8366         23538

256:768 (4096 KB)               19512         48677
342:682 (4096 KB)               16277         59787
512:1024 (4096 KB)              13059         40794
1024:2048 (4096 KB)             14424         42718
2048:4096 (4096 KB)             16234         48517
4096:8192 (4096 KB)             17996         51084
```

Accordingly, we know that EC decoding for a 4K segment is about 25% faster using 384 data shards instead of 1024 data shard. In contrast if we are erasure coding 128KB of data or more, using 1024 data shard scheme performs better than all other options (excluding 512 data shard scheme but that is off the table  because there is no clear way of distributing the data shards between validators evenly while maintaining availability with any subset of 384 honest live validators). This is expected as FFT has $n * log(n)$ complexity so it slows down more rapidly than $n$. However, because 384 is not a power of 2, the algorithm builds a polynomial of 512 degree but only uses 384 of its coefficients to store data shards (and waste the other coefficients). As such when we lose the advantage of higher parallerization due to size of the data, the 384 data shards scheme falls behind all other scheme we tested.

So it is clear that for bigger size data such as those used for reconstruction of work packages (10MB+) we should use the 1024 shards scheme.

The question is if the advantage of 384 scheme for segments of 4KB, worth having two different erasure coding schemes, or we should just use 1024 data shard scheme for both cases.

We'll bench mark the advantage using 384 data shard scheme for segments in the real scenario and decide about having a 384 data shard scheme for segment reconstruction.

Another possibility is to use 256 data shard scheme with 768 recovery (redundant) shards, which is more efficient than 384 scheme for 4KB but it uses slightly more storage (because of the 256 extra recovery shards) but it makes the segment available even if only 1/4 validators are honest and available.

