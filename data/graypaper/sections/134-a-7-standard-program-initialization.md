---
type: graypaper_section
title: A.7 Standard Program Initialization
index: 134
---
The software programs which will run in each of the three instances where the PVM is utilized in the main document have a very typical setup pattern characteristic of an output of a compiler and linker. This means that RAM has sections for program-specific read-only data, read-write (heap) data and the stack. An adjunct to this, very typical of our usage patterns is an extra read-only section via which invocation-specific data may be passed (i.e. arguments). It thus makes sense to define this properly in a single initializer function. These sections are quantized into *major zones*, and one major zone is always left unallocated between sections in order to reduce accidental overrun. Sections are padded with zeroes to the nearest PVM memory page boundary.

We thus define the standard JAM program blob format $\jamNblob$, which includes not only the raw PVM program blob $\pvmNblob$, but also information on the state of the RAM at program start. Given JAM program blob $\jamNblob$ and argument data $\mathbf{a}$, we can decode the PVM program blob $\pvmNblob$, registers $\registers$, and RAM ${\memory}$ by invoking the standard initialization function $Y(\jamNblob, \mathbf{a})$: $$Y\colon\abracegroup{
  \tuple{\blob, \blob[:\Cpvminitinputsize]} &\to \tuple{\blob, \sequence[13]{\pvmreg}, \ram}? \\
  \tup{\jamNblob, \mathbf{a}} &\mapsto \begin{cases}
    \tup{\pvmNblob, \registers, {\memory}} &\when \exists! \tup{\pvmNblob, \mathbf{o}, \mathbf{w}, z, s} \text{ which satisfy equation \ref{eq:conditions}}\\
    \none &\otherwise
  \end{cases}
}$$ With conditions: $$\begin{aligned}

  &\using \mathcal{E}_3(\len{\mathbf{o}}) \concat \mathcal{E}_3(\len{\mathbf{w}}) \concat \mathcal{E}_2(z) \concat \mathcal{E}_3(s) \concat \mathbf{o} \concat \mathbf{w} \concat \mathcal{E}_4(\len{\pvmNblob}) \concat \pvmNblob = \jamNblob\\
  &\Cpvminitzonesize = 2^{16}\ ,\quad\Cpvminitinputsize = 2^{24}\\
  &\using \rnp{x \in \N} \equiv \Cpvmpagesize\ceil{ \frac{x}{\Cpvmpagesize} }\quad,\qquad\rnq{x \in \N} \equiv \Cpvminitzonesize\ceil{ \frac{x}{\Cpvminitzonesize} }\\
  &5\Cpvminitzonesize + \rnq{\len{\mathbf{o}}} + \rnq{\len{\mathbf{w}} + z\Cpvmpagesize} + \rnq{s} + \Cpvminitinputsize \leq 2^{32}\end{aligned}$$ Thus, if the above conditions cannot be satisfied with unique values, then the result is $\none$, otherwise it is a tuple of $\pvmNblob$ as above and ${\memory}$, $\registers$ such that: $$
  \forall i \in \Nbits{32} : (({\memory}_\ramNvalue)\sub{i}, ({\memory}_\ramNaccess)_{\floor{\nicefrac{i}{\Cpvmpagesize}}}) = \bracegroup{\begin{alignedat}{5}
    &\tup{\is{\ramNvalue}{\mathbf{o}_{i - \Cpvminitzonesize}},\,\is{\ramNaccess}{R}} &&\ \when
        \Cpvminitzonesize
            &\ \leq i < \ &&
                \Cpvminitzonesize + \len{\mathbf{o}}\\
    &\tup{0, R} &&\ \when
        \Cpvminitzonesize + \len{\mathbf{o}}
            &\ \leq i < \ &&
                \Cpvminitzonesize + \rnp{\len{\mathbf{o}}} \\
    &(\mathbf{w}_{i - (2\Cpvminitzonesize + \rnq{\len{\mathbf{o}}})}, W) &&\ \when
        2\Cpvminitzonesize + \rnq{\len{\mathbf{o}}}
            &\ \leq i < \ &&
                2\Cpvminitzonesize + \rnq{\len{\mathbf{o}}} + \len{\mathbf{w}}\\
    &\tup{0, W} &&\ \when
        2\Cpvminitzonesize + \rnq{\len{\mathbf{o}}} + \len{\mathbf{w}}
            &\ \leq i < \ &&
                2\Cpvminitzonesize + \rnq{\len{\mathbf{o}}} + \rnp{\len{\mathbf{w}}} + z\Cpvmpagesize\\
    &\tup{0, W} &&\ \when
        2^{32} - 2\Cpvminitzonesize - \Cpvminitinputsize - \rnp{s}
            &\ \leq i < \ &&
                2^{32} - 2\Cpvminitzonesize - \Cpvminitinputsize\\
    &(\mathbf{a}_{i - (2^{32} - \Cpvminitzonesize - \Cpvminitinputsize)}, R) &&\ \when
        2^{32} - \Cpvminitzonesize - \Cpvminitinputsize
            &\ \leq i < \ &&
                2^{32} - \Cpvminitzonesize - \Cpvminitinputsize + \len{\mathbf{a}}\\
    &\tup{0, R} &&\ \when
        2^{32} - \Cpvminitzonesize - \Cpvminitinputsize + \len{\mathbf{a}}
            &\ \leq i < \ &&
                2^{32} - \Cpvminitzonesize - \Cpvminitinputsize + \rnp{\len{\mathbf{a}}}\\
    &\tup{0, \none} &&\otherwise&&&
  \end{alignedat}}\\$$ $$
  \forall i \in \Nmax{13} : \registers\sub{i} = \begin{cases}
      2^{32} - 2^{16} &\when i = 0\\
      2^{32} - 2\Cpvminitzonesize - \Cpvminitinputsize &\when i = 1\\
      2^{32} - \Cpvminitzonesize - \Cpvminitinputsize &\when i = 7\\
      \len{\mathbf{a}}&\when i = 8\\
      0 &\otherwise
    \end{cases}$$
