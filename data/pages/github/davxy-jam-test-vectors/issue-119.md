---
type: page
url: 'https://github.com/jam-conformance/jam-test-vectors/issues/119'
title: >-
  Many mismatches in stf/reports between declared lookup anchor slots and the
  actual block slots in history
site: github.com/davxy/jam-test-vectors
created_at: '2026-11-02T02:27:01.000Z'
last_modified: '2026-11-02T02:27:01.000Z'
content_kind: issue
---

# Many mismatches in stf/reports between declared lookup anchor slots and the actual block slots in history

## Issue by @sierkov

For example, in ```stf/reports/tiny/report_curr_rotation-1.json```, the guaranteed report for work package 0x63c03371b9dad9f1c60473ec0326c970984e9c90c0b5ed90eba6ada471ba4d86 contains:
```json
"lookup_anchor": "0x16bda47e5a68daf53c39ddee8af4ecaced7e87f3f0ac9da5a6f4f9e41350d319",
"lookup_anchor_slot": 6,
```

However, the respective history element has ```slot``` 10:
```json
{
    "header_hash": "0x16bda47e5a68daf53c39ddee8af4ecaced7e87f3f0ac9da5a6f4f9e41350d319",
    "beefy_root": "0xd258abca9b31d614536825b71c5190e5677f9a42770fee159a543ec961f41e99",
    "state_root": "0x833233f94a4fe86915a06f463953199b02d051af90b62da1a7ccb436550e2ec0",
    "slot": 10,
    "reported": []
}
```

This test vector is expected to pass, but this configuration should fail (11.36)
<img width="467" height="52" alt="Image" src="https://github.com/user-attachments/assets/956e9539-cfac-4298-912d-6cd68a252fba" />
