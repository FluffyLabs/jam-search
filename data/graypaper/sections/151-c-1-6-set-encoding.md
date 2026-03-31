---
type: graypaper_section
title: C.1.6 Set Encoding
index: 151
---
For any values which are sets and don't already have a defined encoding above, we define the serialization of a set as the serialization of the set's elements in proper order. Formally: $$\encode{\set{a, b, c, \dots}} \equiv \encode{a} \concat \encode{b} \concat \encode{c} \concat \dots \where a < b < c < \dots$$
