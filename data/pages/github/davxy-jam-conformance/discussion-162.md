---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/162'
title: Trace 1766479507_7943
site: github.com/davxy/jam-conformance
created_at: '2026-01-27T21:56:32.000Z'
last_modified: '2026-01-27T21:56:32.000Z'
---

# Trace 1766479507_7943

## Discussion by @mikirov

Block 18 of the trace has the following immediate and ready items:
```
{
  "order": "GP eq 88: justbecameavailable^! concat Q(q) — immediate first, then ready",
  "counts": {
    "immediateWorkReports": 2,
    "readyWorkReports": 1,
    "workResultsTotal": 13
  },
  "immediateItems": [
    {
      "workReportHash": "0xb11afb6699e9d827d6235e4fc3f6ce0f096c7288eacad9ba254106811f2ab2ea",
      "resultsLength": 5,
      "results": [
        {
          "service_id": "0",
          "accumulate_gas": "2000000"
        },
        {
          "service_id": "0",
          "accumulate_gas": "2000000"
        },
        {
          "service_id": "0",
          "accumulate_gas": "2000000"
        },
        {
          "service_id": "0",
          "accumulate_gas": "2000000"
        },
        {
          "service_id": "0",
          "accumulate_gas": "2000000"
        }
      ]
    },
    {
      "workReportHash": "0xf4494bb48a54778291aed4c9150a106536826cf60004b3c277d43f080aee0986",
      "resultsLength": 5,
      "results": [
        {
          "service_id": "0",
          "accumulate_gas": "2000000"
        },
        {
          "service_id": "0",
          "accumulate_gas": "2000000"
        },
        {
          "service_id": "0",
          "accumulate_gas": "2000000"
        },
        {
          "service_id": "0",
          "accumulate_gas": "2000000"
        },
        {
          "service_id": "0",
          "accumulate_gas": "2000000"
        }
      ]
    }
  ],
  "readyItems": [
    {
      "workReportHash": "0xd3894ebe424b48801f72e707b3b27743fbc17d72bdd6d1d40e08445a716b3c1f",
      "resultsLength": 3,
      "results": [
        {
          "service_id": "0",
          "accumulate_gas": "3333333"
        },
        {
          "service_id": "0",
          "accumulate_gas": "3333333"
        },
        {
          "service_id": "0",
          "accumulate_gas": "3333333"
        }
      ]
    }
  ]
}
```

Immediate items go first, then ready for accumulation from state. Then we need to pick which ones go into the first batch for accumulaiton. 
From accumulation.tex eq:accseq, line 163:
```
i = max(0..len(r))  such that  ∑_{r ∈ r[:i], d ∈ r.digests}(d.gaslimit) ≤ g
```
*NOTE* the <= in the formula.
So the way we compute order is:
1) Batch 1: Immediate report `0xb11a...` (5 results, 5×2M gas), Immediate report `0xf449...` (5 results, 5×2M gas) = 20M gas exactly
2) Batch 2: Ready report 0xd389... (3 results, 3×3333333 gas) = 9.99M gas

But for some reason the expected ordering is Immediate report + the ready report in Batch 1, then the immediate report `0xf449...`

