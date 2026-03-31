---
type: graypaper_section
title: 5.1 The Markers
index: 43
---
If not $\none$, then the epoch marker specifies key and entropy relevant to the following epoch in case the ticket contest does not complete adequately (a very much unexpected eventuality). Similarly, the winning-tickets marker, if not $\none$, provides the series of 600 slot sealing "tickets" for the next epoch (see the next section). Finally, the offenders marker is the sequence of Ed25519 keys of newly misbehaving validators, to be fully explained in section 10. Formally: $$\H_\Nepochmark \in \optional{\tuple{\hash, \hash, \sequence[\Cvalcount]{\tuple{\bskey, \edkey}}}}\,,\quad
  \H_\Nwinnersmark \in \optional{\sequence[\Cepochlen]{\safroleticket}}\,,\quad
  \H_\Noffendersmark \in \sequence{\edkey}$$

The terms are fully defined in sections 6.6 and 10.
