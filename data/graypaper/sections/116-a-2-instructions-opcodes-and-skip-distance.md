---
type: graypaper_section
title: 'A.2 Instructions, Opcodes and Skip-distance'
index: 116
---
The program blob $\mathbf{p}$ is split into a series of octets which make up the *instruction data* $\mathbf{c}$ and the *opcode bitmask* $\mathbf{k}$ as well as the *dynamic jump table*, $\mathbf{j}$. The former two imply an instruction sequence, and by extension a *basic-block sequence*, itself a sequence of indices of the instructions which follow a *block-termination* instruction.

The latter, dynamic jump table, is a sequence of indices into the instruction data blob and is indexed into when dynamically-computed jumps are taken. It is encoded as a sequence of natural numbers (i.e. non-negative integers) each encoded with the same length in octets. This length, term $z$ above, is itself encoded prior.

The PVM counts instructions in octet terms (rather than in terms of instructions) and it is thus necessary to define which octets represent the beginning of an instruction, i.e. the opcode octet, and which do not. This is the purpose of $\mathbf{k}$, the instruction-opcode bitmask. We assert that the length of the bitmask is equal to the length of the instruction blob.

We define the Skip function $\text{skip}$ which provides the number of octets, minus one, to the next instruction's opcode, given the index of instruction's opcode index into $\mathbf{c}$ (and by extension $\mathbf{k}$): $$\text{skip}\colon\abracegroup{
    \N &\to \N\\
    i &\mapsto \min(24,\ j \in \N : \tup{\mathbf{k} \concat \sq{1, 1, \dots}}_{i + 1 + j} = 1)
  }$$

The Skip function appends $\mathbf{k}$ with a sequence of set bits in order to ensure a well-defined result for the final instruction $\text{skip}(\len{\mathbf{c}} - 1)$.

Given some instruction-index $i$, its opcode is readily expressed as $\mathbf{c}_i$ and the distance in octets to move forward to the next instruction is $1 + \text{skip}(i)$. However, each instruction's "length" (defined as the number of contiguous octets starting with the opcode which are needed to fully define the instruction's semantics) is left implicit though limited to being at most 16.

We define $\zeta$ as being equivalent to the instructions $\mathbf{c}$ except with an indefinite sequence of zeroes suffixed to ensure that no out-of-bounds access is possible. This effectively defines any otherwise-undefined arguments to the final instruction and ensures that a trap will occur if the program counter passes beyond the program code. Formally: $$
  \zeta\equiv \mathbf{c} \concat \sq{0, 0, \dots}$$
