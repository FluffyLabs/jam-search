---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/99'
title: Logger improvements
site: github.com/FluffyLabs/typeberry
created_at: '2024-09-06T13:11:09.000Z'
last_modified: '2024-09-06T13:11:09.000Z'
content_kind: issue
---

# Logger improvements

## Issue by @tomusdrw

Follow up on #97 

- [ ] Consider adding timestamps - make sure to compare performance impact. It's not a hard requirement to have timestamps, but if it doesn't affect the performance too much let's do that.
- [ ] Spawn a separate worker thread that is only responsible for logging to console/file - the workers need to synchronize access to console anyway, so it actually makes sense to make it explicit. In such case the logging to console would actually be postMessage on some channel. We need to compare the performance though.
- [ ] Format the output with colors (`Colored` transport)
- [ ] Redirect the output to a file (rotating, etc; `File` transport).
- [ ] Improve how define the level of a module - currently we need to parse the module name and extract parent modules. Instead of having a global config, we could registers the loggers in some global array and each one of them could have a separate configuration. That should be faster (measure!) but we would need to make sure we never leak loggers (i.e. create some loggers dynamically and drop them).


## Comment by @tomusdrw

CC @skoszuta 



## Comment by @tomusdrw

Additional improvements:
- [ ] Emoji/extra string associated with a module, so that we always display `[<module>] <emoji> <rest...>`.
- [x] Lazy-evaluated logs - we currently always compute the string that is passed to the logger, even though it might not be displayed due to log not being enabled. For some heavy, low-level logs (for instance dumping socket payloads, etc) we should rather have the strings be lazy-evaluated only if they need to be displayed. I imagine we could have a separate method `lazyLog/lazyTrace` that takes a closure returning a string instead of a string itself. Would be good to also measure the performance of this. (related: #652)
