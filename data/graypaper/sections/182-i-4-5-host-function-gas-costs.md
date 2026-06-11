---
type: graypaper_section
title: I.4.5 Host-function gas costs
index: 182
---
These constants are used in the host function gas cost equations in appendix 25. The constant term for the host function $\Omega_\square$ is denoted $\mathsf{M}_{\square,c}$, or simply $\mathsf{M}_\square$ if there are no other terms. The octet-linear term, if there is one, is denoted $\mathsf{M}_{\square,\ell}$ and specifies gas per 1024 octets. The page-linear term, again optional, is denoted $\mathsf{M}_{\square,p}$ and specifies gas per page. The gas for a host call with constant term $c$ and octet-linear term $L$ with $\ell$ octets is $c + \fnmemgas(L, \ell)$ (see equation [eq:fnmemgas]).

$\Cgasunknown = 1000$

:   Gas cost charged for an unknown host-call.

$\CgasA = 1818$

:   $\Omega_A$ (`assign`) base gas cost.

$\CgasBconst = 422$

:   $\Omega_B$ (`bless`) base gas cost.

$\CgasBlinear = 20$

:   $\Omega_B$ (`bless`) gas per item.

$\CgasC = 103$

:   $\Omega_C$ (`checkpoint`) base gas cost.

$\CgasDconst = 1100$

:   $\Omega_D$ (`designate`) base gas cost.

$\CgasDlinear = 302$

:   $\Omega_D$ (`designate`) gas per validator.

$\CgasE = 3521$

:   $\Omega_E$ (`export`) base gas cost.

$\CgasF = 3250$

:   $\Omega_F$ (`forget`) base gas cost.

$\CgasG = 48$

:   $\Omega_G$ (`gas`) base gas cost.

$\CgasHconst = 1125$

:   $\Omega_H$ (`historical_lookup`) base gas cost.

$\CgasHlinear = 264$

:   $\Omega_H$ (`historical_lookup`) gas per 1024 octets ($\fnmemgas(\CgasHlinear, \ell)$).

$\CgasI = 703$

:   $\Omega_I$ (`info`) base gas cost.

$\CgasJ = 458$

:   $\Omega_J$ (`eject`) base gas cost.

$\CgasK = 968$

:   $\Omega_K$ (`invoke`) base gas cost.

$\CgasLconst = 600$

:   $\Omega_L$ (`lookup`) base gas cost.

$\CgasLlinear = 248$

:   $\Omega_L$ (`lookup`) gas per 1024 octets ($\fnmemgas(\CgasLlinear, \ell)$).

$\CgasMconst = 1862$

:   $\Omega_M$ (`machine`) base gas cost.

$\CgasMlinear = 112$

:   $\Omega_M$ (`machine`) gas per 1024 octets, program size ($\fnmemgas(\CgasMlinear, \ell)$).

$\CgasN = 3855$

:   $\Omega_N$ (`new`) base gas cost.

$\CgasOconst = 297$

:   $\Omega_O$ (`poke`) base gas cost.

$\CgasOlinear = 224$

:   $\Omega_O$ (`poke`) gas per 1024 octets ($\fnmemgas(\CgasOlinear, \ell)$).

$\CgasPconst = 377$

:   $\Omega_P$ (`peek`) base gas cost.

$\CgasPlinear = 336$

:   $\Omega_P$ (`peek`) gas per 1024 octets ($\fnmemgas(\CgasPlinear, \ell)$).

$\CgasQ = 643$

:   $\Omega_Q$ (`query`) base gas cost.

$\CgasRconst = 2407$

:   $\Omega_R$ (`read`) base gas cost.

$\CgasRkeylinear = 1736$

:   $\Omega_R$ (`read`) key gas per 1024 octets ($\fnmemgas(\CgasRkeylinear, \ell)$).

$\CgasRvallinear = 248$

:   $\Omega_R$ (`read`) value gas per 1024 octets ($\fnmemgas(\CgasRvallinear, \ell)$).

$\CgasS = 2193$

:   $\Omega_S$ (`solicit`) base gas cost.

$\CgasT = 575$

:   $\Omega_T$ (`transfer`) base gas cost.

$\CgasU = 1028$

:   $\Omega_U$ (`upgrade`) base gas cost.

$\CgasWconst = 2442$

:   $\Omega_W$ (`write`) base gas cost.

$\CgasWvallinear = 216$

:   $\Omega_W$ (`write`) gas per 1024 octets ($\fnmemgas(\CgasWvallinear, \ell)$).

$\CgasWkeylinear = 3358$

:   $\Omega_W$ (`write`) key gas per 1024 octets ($\fnmemgas(\CgasWkeylinear, \ell)$).

$\CgasX = 335$

:   $\Omega_X$ (`expunge`) base gas cost.

$\CgasYc{0} = 390, \CgasYl{0} = 0$

:   $\Omega_Y$ (`fetch`) case 0: protocol parameters.

$\CgasYc{1} = 103, \CgasYl{1} = 0$

:   $\Omega_Y$ (`fetch`) case 1: entropy.

$\CgasYc{2} = 80, \CgasYl{2} = 96$

:   $\Omega_Y$ (`fetch`) case 2: auth trace.

$\CgasYc{3} = 85, \CgasYl{3} = 96$

:   $\Omega_Y$ (`fetch`) case 3: any extrinsic, by index.

$\CgasYc{4} = 85, \CgasYl{4} = 96$

:   $\Omega_Y$ (`fetch`) case 4: our extrinsic, by index.

$\CgasYc{5} = 171, \CgasYl{5} = 0$

:   $\Omega_Y$ (`fetch`) case 5: any import, by index.

$\CgasYc{6} = 171, \CgasYl{6} = 0$

:   $\Omega_Y$ (`fetch`) case 6: our import, by index.

$\CgasYc{7} = 85, \CgasYl{7} = 96$

:   $\Omega_Y$ (`fetch`) case 7: encoded work-package.

$\CgasYc{8} = 84, \CgasYl{8} = 0$

:   $\Omega_Y$ (`fetch`) case 8: auth config.

$\CgasYc{9} = 88, \CgasYl{9} = 0$

:   $\Omega_Y$ (`fetch`) case 9: auth token.

$\CgasYc{10} = 111, \CgasYl{10} = 0$

:   $\Omega_Y$ (`fetch`) case 10: refine context.

$\CgasYc{11} = 317, \CgasYl{11} = 0$

:   $\Omega_Y$ (`fetch`) case 11: items summary.

$\CgasYc{12} = 250, \CgasYl{12} = 0$

:   $\Omega_Y$ (`fetch`) case 12: any item summary.

$\CgasYc{13} = 95, \CgasYl{13} = 96$

:   $\Omega_Y$ (`fetch`) case 13: any payload.

$\CgasYc{14} = 287, \CgasYl{14} = 400$

:   $\Omega_Y$ (`fetch`) case 14: accumulate items.

$\CgasYc{15} = 355, \CgasYl{15} = 344$

:   $\Omega_Y$ (`fetch`) case 15: any accumulate item.

$\CgasYc{\none} = 80, \CgasYl{\none} = 0$

:   $\Omega_Y$ (`fetch`) otherwise: nothing.

$\CgasZallocconst = 275$

:   $\Omega_Z$ (`pages`) alloc base gas cost.

$\CgasZalloclinear = 121$

:   $\Omega_Z$ (`pages`) alloc gas per page.

$\CgasZfreeconst = 212$

:   $\Omega_Z$ (`pages`) free base gas cost.

$\CgasZfreelinear = 118$

:   $\Omega_Z$ (`pages`) free gas per page.

$\CgasZsetmodeconst = 130$

:   $\Omega_Z$ (`pages`) setmode base gas cost.

$\CgasZsetmodelinear = 29$

:   $\Omega_Z$ (`pages`) setmode gas per page.

$\CgasZinvalid = 80$

:   $\Omega_Z$ (`pages`) invalid-$r$ base gas cost.

$\CgasTaurus = 98$

:   $\Omega_\Taurus$ (`yield`) base gas cost.

$\CgasAriesconst = 3980$

:   $\Omega_\Aries$ (`provide`) base gas cost.

$\CgasArieslinear = 2264$

:   $\Omega_\Aries$ (`provide`) gas per 1024 octets ($\fnmemgas(\CgasArieslinear, \ell)$).

$\CgasGeminiconst = 275$

:   $\Omega_\Gemini$ (`grow_heap`) base gas cost.

$\CgasGeminilinear = 121$

:   $\Omega_\Gemini$ (`grow_heap`) gas per additional page.
