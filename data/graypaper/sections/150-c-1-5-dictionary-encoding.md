---
type: graypaper_section
title: C.1.5 Dictionary Encoding
index: 150
---
In general, dictionaries are placed in the Merkle trie directly (see appendix 28 for details). However, small dictionaries may reasonably be encoded as a sequence of pairs ordered by the key. Formally: $$\forall K, V: \encode{d \in \dictionary{K}{V}} \equiv
    \encode{
      \var{\sq{
        \orderby{k}{
          \build{
            \tup{\encode{k}, \encode{d\subb{k}}}
          }{
            k \in \keys{d}
          }
        }
      }}
    }$$
