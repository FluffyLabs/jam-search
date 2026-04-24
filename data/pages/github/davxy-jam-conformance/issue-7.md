---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/7'
title: Project-side reproduction of published fuzz-reports
site: github.com/davxy/jam-conformance
created_at: '2025-08-03T21:16:07.000Z'
last_modified: '2025-08-03T21:16:07.000Z'
content_kind: issue
---

# Project-side reproduction of published fuzz-reports

## Issue by @sierkov

My project has recenlty passed all 0.6.6 conformance tests, and I'm preparing a Docker image with a fuzzing API.

Before submitting it, I'd like to review the published ```fuzz-reports``` to ensure all known issues are not present in our implementation. However, I’ve had some difficulty parsing the existing data.

Could you clarify these points:
1) **Step file format:** Could you describe the format of the step files in ```fuzz-reports```? I tried decoding them as a pair of ```set_state``` and ```import_block``` messages, but wasn’t successful.
2) **Sufficiency of step files:** Are the two step files provided for each report sufficient to fully reproduce each failure, or are additional files or context required for project-side reproduction?
3) **Machine-readable reports:** Would it be possible to make the report files machine-readable, e.g., by converting them to JSON? This would make it much easier for projects to verify themselves against historical issues before submission.
4) **Access to the fuzzer binary:** I saw in the JAM chat that making the fuzzer binary available to projects is under discussion. If this happens, questions 1, 2 and 3 may become less relevant, but it would still be helpful to know the timeline or likelihood.


## Comment by @davxy

> Step file format

I'll provide the json format together with binary. But basically is the same struct we use for the traces. E.g https://github.com/davxy/jam-test-vectors/blob/master/traces/reports-l0/00000001.json
It is binary encoded usong jam-codec

> Sufficiency of step files

Yes the last steo should be sufficient

> Machine-readable reports

Can you propose a json or asn.1 structure for it? I can add it to the protocol and then provide both the json and binary within the report

> Access to the fuzzer binary

As you said, is under discussion. Highly likely to be released


## Comment by @sierkov

@davxy Thank you! I’m now able to parse the cases.

I’ll need some time to test them further and adapt the codebase to the new 0.6.7 test vectors. Once that’s done, I’ll get back to you with a proposal for a machine-readable report format.


## Comment by @davxy

Something like this?
https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/jamduna/jam-duna-target-v0.5-0.6.7_gp-0.6.7/report.json

I'll add the syntax to the spec

Are you on Matrix? If so, could you share your handle?  Alternatively, if you'd rather not post it here, feel free to DM me, I'm **davxy** in the **jam** channel.


## Comment by @sierkov

Looks good to me!

Regarding Matrix — I do check it, but only about once a week to scan the updates in the JAM and GP chats. GitHub is usually a quicker way to reach me.

Am I correct in understanding that you’d prefer these types of questions to be posted in the JAM chat? I’ve been considering this myself, but I lean toward GitHub issues because they allow deeper, more trackable discussions. Given that your repositories are known to all implementors, I believe this is within the rules of the JAM prize.

That said, I’m happy to post questions in the JAM chat if that works better for you. Let me know what you think.



