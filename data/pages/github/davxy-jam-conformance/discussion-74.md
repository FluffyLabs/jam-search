---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/74'
title: '1757406598'
site: github.com/davxy/jam-conformance
created_at: '2025-09-11T13:07:32.000Z'
last_modified: '2025-09-11T13:07:32.000Z'
---

# 1757406598

## Discussion by @sierkov

I observe a different set of MMR peaks compared to the expected values, which leads to a different ```beefy_root```.
The value of ```theta``` (the list of service commitments from accumulation) matches what the fuzzer expects:
```
service 306895876: 0x7079B9F32C7A6AD71072D367277C80D4473E9517D53595BC11B3F989ACC215FD
service 3406277994: 0x6790891C04EE66AF8CCC61FE232EB374427810FDEB3A5F974BE76035D9A2F991
```

Given that ```theta``` matches, I am now suspecting **Merkle root computation** as the likely cause.

After reviewing the available ```accumulate``` and ```traces``` test vectors, it appears that all of them compute accumulate roots from an empty list of service commitments (all services return empty commitments).

For this reason, I’d like to request the computed ```accumulation_root``` for this trace.
I cannot infer it from the expected MMR peaks because the value is combined with a previous record to form a new peak.

Expected MMR peaks:
```
empty
0x4ABFFEBD18DC4A8E7E87F60A38D362ACDC2C10735C582D73C233222E99997CA1,
0x4BEBAC8EBC0C117690C1C2987388D72DA201E1571957820C1691541B74F850E8,
0x8A600CAEC569C90A3D8D34AB0CA199D6303A6B6EB356017EEA611AF52EAEDA71,
0x65C3B194F6910870ED1089730A2A70F60F8CEA24675CE5946ECAFB69456A4954,
0x44CF06DD58140FC47A44D2950AF3366568029A422AFBAC9A3254BBA88FA8C17E,
empty,
0x12C6A3318C7F39B36694A39FB1A3846796B8E97F1D70ED141DB7B0851C28640E,
```

Observed MMR peaks (my implementation):
```
empty,
0x5563062EDF791DC50BD2858897FFDCDA1FDE260E7AB2C59D14DB440E50124E0E,
0x4BEBAC8EBC0C117690C1C2987388D72DA201E1571957820C1691541B74F850E8,
0x8A600CAEC569C90A3D8D34AB0CA199D6303A6B6EB356017EEA611AF52EAEDA71,
0x65C3B194F6910870ED1089730A2A70F60F8CEA24675CE5946ECAFB69456A4954,
0x44CF06DD58140FC47A44D2950AF3366568029A422AFBAC9A3254BBA88FA8C17E,
empty,
0x12C6A3318C7F39B36694A39FB1A3846796B8E97F1D70ED141DB7B0851C28640E
```

Previous MMR peaks:
```
0x894CB8F97515D2D693F347A82B496363D64FD7DF55829EF6D0688BDECC03E99A,
empty,
0x4BEBAC8EBC0C117690C1C2987388D72DA201E1571957820C1691541B74F850E8,
0x8A600CAEC569C90A3D8D34AB0CA199D6303A6B6EB356017EEA611AF52EAEDA71,
0x65C3B194F6910870ED1089730A2A70F60F8CEA24675CE5946ECAFB69456A4954,
0x44CF06DD58140FC47A44D2950AF3366568029A422AFBAC9A3254BBA88FA8C17E,
empty,
0x12C6A3318C7F39B36694A39FB1A3846796B8E97F1D70ED141DB7B0851C28640E
```

Observed accumulation root:
```
0x38BBF549E5A294EF5F39EF8648BB7787EA10F949EB855BF2C546C09FA429A551
```

To the best of my knowledge my code is conformant with the following Merkle root computation algorithm: 
<img width="1059" height="881" alt="image" src="https://github.com/user-attachments/assets/76c616c6-e318-4699-8d8c-61a94939a164" />

and the following process for constructing the merkle commitment:
<img width="363" height="51" alt="image" src="https://github.com/user-attachments/assets/342b2258-17c8-4455-9b26-4e5c33f930c6" />




## Comment by @vekexasia

Not sure if itis the same case or not (but it looks like something very similar to what I faced).

In my case theta contained the proper data but elements in it were not properly "sorted" as requested by 7.6. 



## Comment by @clearloop

facing the same problem today, it happens across 3 traces, match the acc log but not the MMR

however, I don't see sorting required in (7.6), I have a default sort by service Id, at the case there are only two pairs in `1757422178`, could not match the accumulation root even reverse my pairings 

<img width="765" height="374" alt="Screenshot 2025-09-11 at 22 39 50" src="https://github.com/user-attachments/assets/61b3f1c7-eda2-4d57-9543-a9d42eece501" />




## Comment by @vekexasia

The sorting is required by the "angled" $\in$ symbol



## Comment by @sierkov

@vekexasia Thank you for the tip. My ```theta``` is already sorted, so I suspect the issue lies elsewhere — likely in Merkle root computation. 

Were you able to get this trace to pass? If so, could you share the ```accumulation_root``` your implementation computed for it? That would help me narrow down the discrepancy.


## Comment by @clearloop

I'm now thinking about that we my have sort of inner sorts in our MMR/Merkle root calculation... (haven't checked yet)


## Comment by @sierkov

I was able to pass this trace. The correct ```accumulate_root``` is ```3DB8AECACB42DF7136B67EE7CF581EC55E718505F1285474A8B3138059E5B0FE```

Here are a couple of things to double-check:
1. **Merkle root input format (GP 0.7.0)**:
    The Merkle root definition in GP 0.7.0 expects raw values, not pre-hashed inputs.
    In my case, I was mistakenly hashing the items of ```s``` in step (7.6) before building the Merkle tree.
    The correct input should be an array of two 36-byte elements.
2. **Midpoint rounding (E.1)**:
    GP 0.7.0 rounds the midpoint up when splitting. My implementation was rounding down.
    This doesn’t affect this particular trace but can lead to discrepancies when computing a Merkle root from an odd number of commitments greater than two.


## Comment by @clearloop

can verify `1.` hits my case as well! thanks for the information! 

the main issue in our case is not `pre-hashing` but the node prefix, looks like we previously didn't meet this issue is caused by that there were no accumulation in parallel, e.g. pairs never exceed `1`
