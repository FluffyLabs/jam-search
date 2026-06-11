---
type: graypaper_section
title: A.4 Single-Step State Transition
index: 118
---
We must now define the single-step PVM state-transition function $\Psi_1$: $$\Psi_1\colon \abracegroup{
    \tuple{\blob, \bitstring, \sequence{\pvmreg}, \pvmreg, \gas, \bool, \sequence[13]{\pvmreg}, \ram} &\to \tuple{\set{\panic, \halt, \blacktriangleright} \cup \set{\fault, \host} \times \pvmreg, \pvmreg, \gas, \bool, \sequence[13]{\pvmreg}, \ram}\\
    \tup{\pvmNblob, \mathbf{k}, \mathbf{j}, \imath, \gascounter, \gaschargedflag, \registers, {\memory}} &\mapsto \tup{\varepsilon^*, \imath^*, \gascounter^*, \gaschargedflag^*, \registers^*, {\memory}^*}
  }$$

On the very first step of execution, and every time the execution enters a new basic block or jumps back to the beginning of the current basic block, the gas counter of the machine is updated according to the gas cost function $\gascounter^{\Delta}$ ([eq:gascostforblock]) of the target basic block. No instruction is allowed to execute within a basic block unless the gas cost for the entire basic block has been charged in advance. In case there's not enough gas remaining to cover the full gas cost, the execution is interrupted and the gas counter remains unchanged. Formally:

$$\tup{\varepsilon^{\gascounter}, \gascounter^*, \gaschargedflag'} = \begin{cases}
    \tup{\blacktriangleright, \gascounter, \top} &\when \gaschargedflag = \top \\
    \tup{\blacktriangleright, \gascounter - \gascounter^{\Delta}(\mathbf{c}, \mathbf{k}, \mathfrak{L}(\imath)), \top} &\otherwhen \gascounter \ge \gascounter^{\Delta}(\mathbf{c}, \mathbf{k}, \mathfrak{L}(\imath)) \\
    \tup{\oog, \gascounter, \bot} &\otherwise
  \end{cases}$$

During the course of executing instructions RAM may be accessed. When an index of RAM below $2^{16}$ is required, the machine always panics immediately without further changes to its state regardless of the apparent (in)accessibility of the value. Otherwise, should the given index of RAM not be accessible then machine state remains unchanged and the exit reason is a fault with the lowest inaccessible *page address* to be read. Similarly, where RAM must be mutated and yet mutable access is not possible, then machine state is unchanged, and the exit reason is a fault with the lowest page address to be written which is inaccessible.

Formally, let $\mathbf{r}$ and $\mathbf{w}$ be the set of indices by which ${\memory}$ must be subscripted for inspection and mutation respectively in order to calculate the result of $\Psi_1$. We define the memory-access exceptional execution state $\varepsilon^\mu$ as following: $$\begin{aligned}
    \varepsilon^{\mu} &= \begin{cases}
      \blacktriangleright&\when \mathbf{x} = \emptyset \\
      \panic &\when \min(\mathbf{x}) \bmod 2^{32} < 2^{16} \\
      \fault \times \Cpvmpagesize\floor{\min(\mathbf{x}) \bmod 2^{32} \div \Cpvmpagesize} &\otherwise
    \end{cases}\\
    \where \mathbf{x} &= \set{\build{x}{x \in \mathbf{r} \wedge x \bmod 2^{32} \not\in \readable{\memory}\ \vee\ x \in \mathbf{w} \wedge x \bmod 2^{32} \not\in \writable{\memory}}}
  \end{aligned}$$

We define the final execution state, the value of the instruction counter, the values of the registers and the memory as follows: $$\begin{aligned}
  \tup{\varepsilon^*, \imath^*, \registers^*, {\memory}^*} &= \begin{cases}
    \tup{\varepsilon^{\gascounter}, \imath, \registers, {\memory}} &\when \varepsilon^{\gascounter} \neq \blacktriangleright\\
    \tup{\varepsilon^{\mu}, \imath, \registers, {\memory}} &\otherwhen \varepsilon^{\mu} \neq \blacktriangleright\\
    \tup{\varepsilon, \imath', \registers', {\memory}'} &\otherwise
  \end{cases}\end{aligned}$$

We also have to adjust the state based on the executed instruction, to force a gas charge on the next step when necessary: $$\gaschargedflag^* = \begin{cases}
    \bot &\when \gaschargedflag' = \bot \lor (\mathbf{c}_\imath \in T \land \varepsilon^* \in \set{\blacktriangleright} \cup \set{\host} \times \pvmreg) \\
    \top &\otherwise
  \end{cases}$$

We define $\varepsilon$ together with the posterior values of regular execution (denoted as prime) of each of the items of the machine state as being in accordance with the table below. When transitioning machine state for an instruction, a number of conditions typically hold true and instructions are defined essentially by their exceptions to these rules. Specifically, the machine does not halt, the instruction counter increments by one and RAM & registers are unchanged. Formally: $$\varepsilon = \blacktriangleright,\quad \imath' = \imath + 1 + \text{skip}(\imath),\quad \registers' = \registers,\quad{\memory}' = {\memory}\text{ except as indicated }$$

We define signed/unsigned transitions for various octet widths: $$\begin{aligned}
  
  \signfunc{n \in \N}&\colon\abracegroup{
    \Nbits{8n} &\to \Z_{-2^{8n-1}\dots2^{8n-1}}\\
    a &\mapsto \begin{cases}
      a &\when a < 2^{8n-1} \\
      a -\ 2^{8n} &\otherwise
    \end{cases}
  }\\
  \unsignfunc{n \in \N}&\colon\abracegroup{
    \Z_{-2^{8n-1}\dots2^{8n-1}} &\to \Nbits{8n}\\
    a &\mapsto (2^{8n} + a) \bmod 2^{8n}
  }\\
  
  \fnoctetstobits_{n\in\N}&\colon\abracegroup{
    \Nbits{8n} &\to \bitstring[8n]\\
    x &\mapsto \mathbf{y}: \forall i \in \Nmax{8n} : \mathbf{y}\subb{i} \Leftrightarrow \ffrac{x}{2^i}\bmod 2
  }\\
  \fnoctetstobits_{n\in\N}^{-1}&\colon\abracegroup{
    \bitstring[8n] &\to \Nbits{8n}\\
    \mathbf{x} &\mapsto y: \sum_{i \in \Nmax{8n}} \mathbf{x}\sub{i} \cdot 2^i
  }\\
  
  \overleftarrow{\fnoctetstobits}_{n\in\N}&\colon\abracegroup{
    \Nbits{8n} &\to \bitstring[8n]\\
    x &\mapsto \mathbf{y}: \forall i \in \Nmax{8n} : \mathbf{y}[8n - 1 - i] \Leftrightarrow \ffrac{x}{2^i}\bmod 2
  }\\
  \overleftarrow{\fnoctetstobits}_{n\in\N}^{-1}&\colon\abracegroup{
    \bitstring[8n] &\to \Nbits{8n}\\
    \mathbf{x} &\mapsto y: \sum_{i \in \Nmax{8n}} \mathbf{x}\sub{8n - 1 - i} \cdot 2^i
  }\end{aligned}$$

Immediate arguments are encoded in little-endian format with the most-significant bit being the sign bit. They may be compactly encoded by eliding more significant octets. Elided octets are assumed to be zero if the MSB of the value is zero, and 255 otherwise. This allows for compact representation of both positive and negative encoded values. We thus define the signed extension function operating on an input of $n$ octets as $\fnsext{n}$: $$\begin{aligned}

  \fnsext{n \in \set{0, 1, 2, 3, 4, 8}}\colon\abracegroup{
    \Nbits{8n} &\to \pvmreg\\
    x &\mapsto x + \ffrac{x}{2^{8n-1}}(2^{64}-2^{8n})
  }\end{aligned}$$

Any alterations of the program counter stemming from an unconditional static jump must be to the start of a basic block or else a panic occurs. Formally: $$\token{sjump}(b) \implies \tup{\varepsilon, \imath'} = \begin{cases}
    \tup{\panic, \imath} &\when b \not\in \varpi\\
    \tup{\blacktriangleright, b} &\otherwise
  \end{cases}$$

Similarly, conditional jumps are valid if and only if both branches point to the start of a basic block (regardless of whether a branch is taken), otherwise a panic occurs: $$\token{branch}(b, C) \implies \tup{\varepsilon, \imath'} = \begin{cases}
    \tup{\panic, \imath} &\when b \not\in \varpi\lor \imath + 1 + \text{skip}(\imath) \not\in \varpi\\
    \tup{\blacktriangleright, \imath + 1 + \text{skip}(\imath)} &\otherwhen \lnot C \\
    \tup{\blacktriangleright, b} &\otherwise
  \end{cases}$$

Jumps whose next instruction is dynamically computed must use an address which may be indexed into the jump-table $\mathbf{j}$. Through a quirk of tooling[^18], we define the dynamic address required by the instructions as the jump table index incremented by one and then multiplied by our jump alignment factor $\Cpvmdynaddralign = 2$.

As with other irregular alterations to the program counter, target code index must be the start of a basic block or else a panic occurs. Formally: $$
  \token{djump}(a) \implies \tup{\varepsilon, \imath'} = \begin{cases}
    \tup{\halt, \imath} &\when a = 2^{32} - 2^{16}\\
    \tup{\panic, \imath} &\otherwhen a = 0 \vee a > \len{\mathbf{j}}\cdot\Cpvmdynaddralign \vee a \bmod \Cpvmdynaddralign \ne 0 \vee \mathbf{j}_{(\nicefrac{a}{\Cpvmdynaddralign}) - 1} \not\in \varpi\\
    (\blacktriangleright, \mathbf{j}_{(\nicefrac{a}{\Cpvmdynaddralign}) - 1}) &\otherwise
  \end{cases}$$
