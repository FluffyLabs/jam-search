---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/123'
title: New-JAMneration
site: github.com/davxy/jam-conformance
created_at: '2025-12-07T05:26:14.000Z'
last_modified: '2025-12-07T05:26:14.000Z'
---

# New-JAMneration

## Issue by @YuChunTsao

Hello @davxy 

This is a tracking issue for the **New-JAMneration** client.

I have opened a PR (https://github.com/davxy/jam-conformance/pull/122) to add our target release to `jam-conformance`.  
The current release supports GP version `0.7.0` and includes fork support.  
All test vectors in the Minifuzz examples folder are passing.

```bash
# jam-conformance/scripts
python target.py get new_jamneration
python target.py run --no-docker new_jamneration
```

I would appreciate it if you could help review and test this update when you have time.  
Thank you very much for your assistance!



## Comment by @davxy

Hey. This is your summary https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.7.0/summaries/summary_new_jamneration.txt


## Comment by @YuChunTsao

@davxy 
Thank you for your assistance.

Over the past few days, I have been trying to resolve these issues. It seems that the errors are all related to forks. I have also reviewed the discussions in #71 and #72 , but I am still a bit confused.

For example, in our case of [`1757422771`](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.7.0/reports/new_jamneration/1757422771/report.json), I understand that my target seem to have encountered an error after step 1 (`00..31`), but both `state_diff` and `import_diff` are `null`. What does this indicate?
(When I look at the diff information for other teams, it clearly shows which parts are different.)




## Comment by @davxy

Starting from **0.7.1**, errors are clearer and are represented as an enum with the following variants:
1. **state-diff**: a mismatch in the state root  
2. **import-diff**: a success was expected, but the target reported an error (or vice versa)  
3. **protocol-fail**: the target did not reply to a request (potentially due to a crash or protocol failure)

In **0.7.0**, this distinction was not available. When both `state_diff` and `import_diff` are `null`, the termination is likely due to a protocol failure (variant 3).

I recommend upgrading to at least **0.7.1**, as support for **0.7.0** is limited due to known issues in the fuzzer tooling.



## Comment by @YuChunTsao

Thank you for your response. I later discovered a potential bug that might cause a connection termination. We will update to 0.7.1 as soon as possible. Thank you!


## Comment by @YuChunTsao

@davxy 

We have published our release of **0.7.1**. I have opened a PR (#138) to update `targets.json`.
Thank you for your assistance. Merry Christmas! 🎄 



## Comment by @YuChunTsao

@davxy 

Version **0.7.2** has been released, and I’ve opened a PR (https://github.com/davxy/jam-conformance/pull/140) to update `targets.json`. Thanks for your help!





## Comment by @YuChunTsao

@davxy 

I noticed that my previous environment variable configuration in `targets.json` was incorrect, which caused Redis to fail to start properly in the Docker environment (when running `python target.py run new-jamneration`) and resulted in the same error appearing in version 0.7.2. I have corrected the `ENV` settings in `targets.json` (PR #142). Could you please help merge the changes? Thank you very much for your assistance. 🙏🏻 



## Comment by @YuChunTsao

hi @davxy 

We have addressed the issues reported in the previous `report.json` files in the latest release. 
We will review the next report to confirm that the issues have been resolved. Thank you for your help. 

Happy New Year 🎉 


## Comment by @YuChunTsao

Hi @davxy,

We have addressed the issues from the previous reports and implemented several performance improvements in the latest release.

When you have a moment, could you please help us run the tool again and provide a new report? We’d like to confirm the fixes and verify the performance gains.

Thank you for your continued help


## Comment by @YCC3741

@davxy We have implemented some new optimizations and would like to see the impact. Could you please re-run the process and update the dsahboard?
https://paritytech.github.io/jam-conformance-dashboard/
