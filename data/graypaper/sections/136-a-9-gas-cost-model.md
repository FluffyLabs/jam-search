---
type: graypaper_section
title: A.9 Gas Cost Model
index: 136
---
The gas cost model for the PVM is a simplified model of a modern CPU microarchitecture, heavily inspired by what's used by production-grade compilers to predict how much time a given piece of code will take. For each basic block in the program the model simulates its execution flow and computes the required number of virtual CPU cycles that would be needed to execute it.

A gas simulation state, of set $\mathbb{S}$, contains the current instruction counter $\imath$, a cycle counter $c$, the number of decode slots $d$ remaining in the current cycle, the maximum number of instructions $e$ which are still allowed to start execution in the current cycle, the remaining available execution units $t$, and the reorder buffer $\mathbf{r}$. Formally:

$$\mathbb{S}\equiv \tuple{
    \isa{\imath}{\pvmreg \cup \set{\none}},
    \isa{c}{\N},
    \isa{d}{\N},
    \isa{e}{\N},
    \isa{t}{\mathbb{E}},
    \isa{\mathbf{r}}{\sequence{\mathbb{R}}}
  }\\$$

A reorder buffer entry, of set $\mathbb{R}$, contains its current state $s$, the number of cycles left $c$, a set of reorder buffer indices considered its dependencies $p$, a set of clobbered registers $r$, and the execution units used $t$. Formally:

$$\mathbb{R}\equiv \tuple{
    \isa{s}{\set{\text{DEC}, \text{WAIT}, \text{EXE}, \text{FIN}, \none}},
    \isa{c}{\N},
    p\subseteq \N,
    r\subseteq \Nmax{13},
    \isa{t}{\mathbb{E}}
  }\\$$

A tuple of the set $\mathbb{E}$ maps each execution unit kind (${\text{A}, \text{L}, \text{S}, \text{M}, \text{D}}$) into a number:

$$\mathbb{E}\equiv \tuple{
    \isa{\text{A}}{\N},
    \isa{\text{L}}{\N},
    \isa{\text{S}}{\N},
    \isa{\text{M}}{\N},
    \isa{\text{D}}{\N}
  }$$

For convenience we define addition and subtraction of two tuples of the set $\mathbb{E}$ to be equivalent to the memberwise operation of the same kind; formally:

$$\begin{aligned}
  \forall a,b \in \mathbb{E};\forall \oplus \in \set{+, -}&: a \oplus b \equiv c\\
  \where c \in \mathbb{E}, \forall k \in \set{\text{A}, \text{L}, \text{S}, \text{M}, \text{D}}&:c_k \equiv a_k \oplus b_k\\
\end{aligned}$$

Similarly, a comparison between two tuples of the set $\mathbb{E}$ is true if and only if the chosen comparison holds for all corresponding members:

$$\begin{aligned}
  &\forall a,b \in \mathbb{E};\forall \oplus \in \set{<, >, \le, \ge}: \\
  &\quad a \oplus b \equiv \bigwedge_{k \in \set{\text{A}, \text{L}, \text{S}, \text{M}, \text{D}}} a_k \oplus b_k
\end{aligned}$$

We define the function $\check{s}(\mathbf{c}, \mathbf{k}, \imath)$ which returns the set of source registers read by the instruction at $\imath$, and the function $\check{r}(\mathbf{c}, \mathbf{k}, \imath)$ which returns the set of destination registers written by the instruction at $\imath$, as described by the equations in 24.5. This is regardless of whether those registers would actually have been modified by that instruction when executed at runtime. is assumed to neither read nor write to any registers in this model.

We also define the function $\check{c}(\mathbf{c}, \mathbf{k}, \imath)$ which returns the number of cycles the instruction at $\imath$ needs to finish execution, $\check{d}(\mathbf{c}, \mathbf{k}, \imath)$ which returns the number of decoding slots necessary to decode it, and $\check{x}(\mathbf{c}, \mathbf{k}, \imath)$ which returns the number of virtual CPU execution units required to start its execution. These simply return the values as specified in 24.10.

The gas cost of a given basic block starting at instruction opcode index $\imath \in \varpi$ and given the instruction data $\mathbf{c}$ and the opcode bitmask $\mathbf{k}$ is defined by the number of virtual CPU cycles as determined by the gas cost model transition function, up until every instruction of the basic block it has ingested has been retired and the simulation has converged. Formally:

$$
  \gascounter^{\Delta}\colon \abracegrouptwo{
    \tup{\blob, \bitstring, \pvmreg} &\to \N\\
    \tup{\mathbf{c}, \mathbf{k}, \imath} &\mapsto \max(\mathbf{x}^{\text{final}}_{c} - 3, 1)\\
  }{
    \where &\mathbf{x}^{\text{final}} &=&\text{ }\mathfrak{X}(\mathbf{c}, \mathbf{k}, \mathbf{x}^{\text{init}})\\
      &\mathbf{x}^{\text{init}} &=&\text{ }\tup{\imath, 0, 4, 5, \tup{4, 4, 4, 1, 1}, \sq{}}
  }$$

The gas cost model simulation function $\mathfrak{X}$ is defined as follows:

$$\mathfrak{X}\colon \abracegroup{
    \tup{\blob, \bitstring, \mathbb{S}} &\to \mathbb{S}\\
    \tup{\mathbf{c}, \mathbf{k}, \mathbf{x}} &\mapsto \begin{cases}
      \mathfrak{X}(\mathbf{c}, \mathbf{k}, \mathfrak{X}'(\mathbf{c}, \mathbf{k}, \mathbf{x})) &\when \mathbf{x}_{\imath} \neq \none \land \check{d}(\mathbf{c}, \mathbf{k}, \mathbf{x}_{\imath}) \leq \mathbf{x}_{d} \land l < 32 \\
      \mathfrak{X}(\mathbf{c}, \mathbf{k}, \mathfrak{X}''(\mathbf{x})) &\otherwhen \mathfrak{S}(\mathbf{x}) \neq \none \land \mathbf{x}_{e} > 0 \\
      \mathbf{x}&\otherwhen \mathbf{x}_{\imath} = \none \land l = 0 \\
      \mathfrak{X}(\mathbf{c}, \mathbf{k}, \mathfrak{X}'''(\mathbf{x})) &\otherwise \\
    \end{cases}\\
    \where l &= \len{\sq{\build{r}{ r \orderedin {\mathbf{x}_{\mathbf{r}}}, r_{s} \neq \none }}}
  }$$

The state transition function $\mathfrak{X}'$ which decodes the instructions without triggering the virtual CPU pipeline simulation is defined as follows:

$$\mathfrak{X}'\colon \abracegroup{
    \tup{\blob, \bitstring, \mathbb{S}} &\to \mathbb{S}\\
    \tup{\mathbf{c}, \mathbf{k}, \mathbf{x}} &\mapsto \begin{cases}
      \mathfrak{X}^{\text{mov}}(\mathbf{c}, \mathbf{k}, \mathbf{x}) &\when \imath < \len{\mathbf{c}} \land \mathbf{c}_{\imath} = \token{move\_reg} \\
      \mathfrak{X}^{\text{dec}}(\mathbf{c}, \mathbf{k}, \mathbf{x}) &\otherwise
    \end{cases}
  }$$

The instruction is special-cased to be handled by the frontend of our virtual CPU, without being added to the reorder buffer:

$$\mathfrak{X}^{\text{mov}}\colon \abracegrouptwo{
    \tup{\blob, \bitstring, \mathbb{S}} &\to \mathbb{S}\\
    \tup{\mathbf{c}, \mathbf{k}, \mathbf{x}} &\mapsto \mathbf{x}'
  }{
    \where \mathbf{x}' &= \mathbf{x}\text{ except:}\\
      \mathbf{x}'_{\imath} &= \mathbf{x}_{\imath} + 1 + \text{skip}(\mathbf{x}_{\imath}) \\
      \mathbf{x}'_{d} &= \mathbf{x}_{d} - 1 \\
      \mathbf{x}'_{\mathbf{r}} &= {\mathbf{x}_{\mathbf{r}}}\text{ except:}\\
      &\begin{aligned}
        \forall j &\in \N_{\len{{\mathbf{x}_{\mathbf{r}}}}}: \mathbf{x}'_{\mathbf{r}}\subb{j}_{r} &= \begin{cases}
          {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{r} \cup \check{r}(\mathbf{c}, \mathbf{k}, \mathbf{x}_{\imath}) &\when {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{r} \cap \check{s}(\mathbf{c}, \mathbf{k}, \mathbf{x}_{\imath}) \neq \emptyset \\
          {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{r} \setminus \check{r}(\mathbf{c}, \mathbf{k}, \mathbf{x}_{\imath}) &\otherwise
        \end{cases} \\
      \end{aligned}
  }$$

Every other instruction is fully decoded and added to the reorder buffer as follows:

$$\mathfrak{X}^{\text{dec}}\colon \abracegrouptwo{
    \tup{\blob, \bitstring, \mathbb{S}} &\to \mathbb{S}\\
    \tup{\mathbf{c}, \mathbf{k}, \mathbf{x}} &\mapsto \mathbf{x}'
  }{
    \where \mathbf{x}' &= \mathbf{x}\text{ except:}\\
    \mathbf{x}'_{\imath} &= \begin{cases}
      \none &\when \zeta_{\imath} \in T \\
      \mathbf{x}_{\imath} + 1 + \text{skip}(\mathbf{x}_{\imath}) &\otherwise
    \end{cases}\\
    \mathbf{c} &\mapsto \zeta\text{ according to \ref{eq:instructions}}\\
    \mathbf{x}'_{d} &= \mathbf{x}_{d} - \check{d}(\mathbf{c}, \mathbf{k}, \mathbf{x}_{\imath}) \\
    \mathbf{r}&= {\mathbf{x}_{\mathbf{r}}}\text{ except: } \forall j \in \N_{\len{{\mathbf{x}_{\mathbf{r}}}}}: \mathbf{r}\subb{j}_{r} = {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{r} \setminus r\\
    r&= \check{r}(\mathbf{c}, \mathbf{k}, \mathbf{x}_{\imath}) \\
    c&= \check{c}(\mathbf{c}, \mathbf{k}, \mathbf{x}_{\imath}) \\
    t&= \check{x}(\mathbf{c}, \mathbf{k}, \mathbf{x}_{\imath}) \\
    p&= \set{\build{i}{ i \in \N_{\len{{\mathbf{x}_{\mathbf{r}}}}}, \check{s}(\mathbf{c}, \mathbf{k}, \mathbf{x}_{\imath}) \cap {{\mathbf{x}_{\mathbf{r}}}\subb{i}}_{r} \neq \emptyset }} \\
    \mathbf{x}'_{\mathbf{r}} &= \mathbf{r}\append \tuple{\text{DEC}, c, p, r, t} \\
  }$$

The state transition function $\mathfrak{X}''$ which starts the execution of the next pending instruction is defined as follows:

$$\mathfrak{X}''\colon \abracegrouptwo{
    \mathbb{S}&\to \mathbb{S}\\
    \mathbf{x}&\mapsto \mathbf{x}'\\
  }{
    \where \mathbf{x}' &= \mathbf{x}\text{ except:}\\
    \mathbf{x}'_{e} &= \mathbf{x}_{e} - 1\\
    n &= \mathfrak{S}(\mathbf{x})\\
    \mathbf{x}'_{t} &= \mathbf{x}_{t} - {{\mathbf{x}_{\mathbf{r}}}\subb{n}}_{t}\\
    \mathbf{x}'_{\mathbf{r}} &= {\mathbf{x}_{\mathbf{r}}}\text{ except: } \mathbf{x}'_{\mathbf{r}}\subb{n}_{s} = \text{EXE}
  }$$

The function $\mathfrak{S}$ which checks which instruction inside of the reorder buffer is ready to start executing (and whether such an instruction even exists) is defined as follows:

$$\mathfrak{S}\colon \abracegrouptwo{
    \mathbb{S}&\to \N \cup \set{\none}\\
    \mathbf{x}&\mapsto \begin{cases}
      \none &\when s = \none\\
      \min(s) &\otherwise
    \end{cases}\\
  }{
    \[0.2pt]
    \where s &= \set{\build{j \in \N_{\len{{\mathbf{x}_{\mathbf{r}}}}}}{{{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{s} = \text{WAIT}\land {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{t} \leq \mathbf{x}_{t} \land (\forall k \in {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{p} : {{\mathbf{x}_{\mathbf{r}}}\subb{k}}_{c} = 0)}}
  }$$

The state transition function $\mathfrak{X}'''$ which simulates the rest of the virtual CPU pipeline is defined as follows:

$$\mathfrak{X}'''\colon \abracegrouptwo{
    \mathbb{S}&\to \mathbb{S}\\
    \mathbf{x}&\mapsto \mathbf{x}'\\
  }{
    \where \mathbf{x}' &= \mathbf{x}\text{ except:}\\
    \mathbf{x}'_{d} &= 4, \mathbf{x}'_{e} = 5, \mathbf{x}'_{c} = \mathbf{x}_{c} + 1\\
    \mathbf{x}'_{t} &= \mathbf{x}_{t} + \sum_{n \in \N_{\len{{\mathbf{x}_{\mathbf{r}}}}}, {{\mathbf{x}_{\mathbf{r}}}\subb{n}}_{s} = \text{EXE}\land {{\mathbf{x}_{\mathbf{r}}}\subb{n}}_{c} = 1} {{\mathbf{x}_{\mathbf{r}}}\subb{n}}_{t} \\
    \mathbf{x}'_{\mathbf{r}} &= {\mathbf{x}_{\mathbf{r}}}\text{ except } \forall j \in \N_{\len{{\mathbf{x}_{\mathbf{r}}}}}: \\
    &\begin{aligned}
      \mathbf{x}'_{\mathbf{r}}\subb{j}_{s} &= \begin{cases}
        \none &\when \forall k \in \N_{j+1} : {{\mathbf{x}_{\mathbf{r}}}\subb{k}}_{s} \in \set{\text{FIN}, \none} \\
        \text{WAIT}&\when {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{s} = \text{DEC}\\
        \text{FIN}&\when {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{s} = \text{EXE}\land {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{c} = 0 \\
        {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{s} &\otherwise \\
      \end{cases} \\
      \mathbf{x}'_{\mathbf{r}}\subb{j}_{c} &= \begin{cases}
        {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{c} - 1 &\when {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{s} = \text{EXE}\land {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{c} > 0 \\
        {{\mathbf{x}_{\mathbf{r}}}\subb{j}}_{c} &\otherwise \\
      \end{cases} \\
    \end{aligned}
  }$$
