---
type: graypaper_section
title: 6.3 Key Rotation
index: 47
---
In addition to the active sequence of validator keys $\activeset$ and staging sequence $\stagingset$, internal to the Safrole state we retain a pending sequence $\pendingset$. The active validator keys identifies the nodes which are currently privileged to author blocks and carry out the validation processes, whereas the pending keys $\pendingset$, which is reset to $\stagingset$ at the beginning of each epoch, is the sequence of keys which will be active in the next epoch and which determine the Bandersnatch ring root which authorizes tickets into the slot-sealer contest for the next epoch. The length of each sequence is always a multiple of 3 between 6 and $3\Ccorecount$. $$\begin{gathered}
  
  \stagingset \in \allvalkeys \;,\quad
  \pendingset \in \allvalkeys \;,\quad
  \activeset \in \allvalkeys \;,\quad
  \previousset \in \allvalkeys \\
  
  \valcount \equiv \set{\build{3c}{c \in \Nclamp{2}{\Ccorecount+1}}}\end{gathered}$$

We must introduce $\valkey$, the set of validator key tuples. This is a combination of a set of cryptographic public keys and metadata which is an opaque octet sequence, but utilized to specify practical identifiers for the validator, not least a hardware address.

The set of validator keys itself is equivalent to the set of 336-octet sequences. However, for clarity, we divide the sequence into four easily denoted components. For any validator key $k$, the Bandersnatch key is denoted $k_\vkNbs$, and is equivalent to the first 32-octets; the Ed25519 key, $k_\vkNed$, is the second 32 octets; the BLS key denoted $k_\vkNbls$ is equivalent to the following 144 octets, and finally the metadata $k_\vkNmetadata$ is the last 128 octets. Formally: $$\begin{aligned}
  \valkey &\equiv \blob[336] \\
  \forall \vkX \in \valkey : \vkX_\vkNbs \in \bskey &\equiv \vkX\subrange{0}{32} \\
  \forall \vkX \in \valkey : \vkX_\vkNed \in \edkey &\equiv \vkX\subrange{32}{32} \\
  \forall \vkX \in \valkey : \vkX_\vkNbls \in \blskey &\equiv \vkX\subrange{64}{144} \\
  \forall \vkX \in \valkey : \vkX_\vkNmetadata \in \metadatakey &\equiv \vkX\subrange{208}{128}\end{aligned}$$

With a new epoch under regular conditions, validator keys get rotated and the epoch's Bandersnatch ring root is updated into $\epochroot'$: $$\begin{aligned}
  \tup{\pendingset', \activeset', \previousset', \epochroot'} &\equiv \begin{cases}
    (\Phi(\stagingset), \pendingset, \activeset, z) &\when e' > e \\ \tup{\pendingset, \activeset, \previousset, \epochroot} &\otherwise
  \end{cases} \\
  \nonumber \where z &= \getringroot{\sq{\build{k_\vkNbs}{k \orderedin \pendingset'}}} \\
   \Phi(\mathbf{k}) &\equiv \sq{
    \build{
      \begin{rcases}
        \sq{0, 0, \dots} &\when \vkX_\vkNed \in \offenders' \\
        \vkX &\otherwise
      \end{rcases}
    }{
      \vkX \orderedin \mathbf{k}
    }
  }\end{aligned}$$

Note that on epoch changes the posterior queued validator key sequence $\pendingset'$ is defined such that incoming keys belonging to the offenders $\offenders'$ are replaced with a null key containing only zeroes. The origin of the offenders is explained in section 10.
