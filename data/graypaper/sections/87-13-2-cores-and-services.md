---
type: graypaper_section
title: 13.2 Cores and Services
index: 87
---
The other two components of statistics are the core and service activity statistics. These are tracked only on a per-block basis unlike the validator statistics which are tracked over the whole epoch. $$\begin{aligned}
  \corestats &\in \sequence[\Ccorecount]{\tuple{
    \begin{alignedat}{7}
      \isa{\csNdaload&}{\N}\,,\;
      \isa{&\csNpopularity&}{\N}\,,\;
      \isa{&\csNimportcount&}{\N}\,,\;
      \isa{&\csNxtcount&}{\N}\,,\;\\
      \isa{\csNxtsize&}{\N}\,,\;
      \isa{&\csNexportcount&}{\N}\,,\;
      \isa{&\csNbundlelen&}{\N}\,,\;
      \isa{&\csNgasused&}{\gas}
    \end{alignedat}
  }}\\
  \servicestats &\in \dictionary{\serviceid}{\tuple{
    \begin{alignedat}{3}
      \isa{\ssNprovision&}{\tup{\N, \N}}\,,\;
      \isa{&\ssNrefinement&}{\tup{\N, \gas}}\,,\;\\
      \isa{\ssNimportcount&}{\N}\,,\;
      \isa{\ssNxtcount}{\N}\,,\;
      \isa{&\ssNxtsize&}{\N}\,,\;
      \isa{\ssNexportcount}{\N}\,,\;\\
      \isa{\ssNaccumulation&}{\tup{\N, \gas}}
    \end{alignedat}
  }}\end{aligned}$$

The core statistics are updated using several intermediate values from across the overall state-transition function; $\incomingreports$, the incoming work-reports, as defined in [eq:incomingworkreports] and $\justbecameavailable$, the newly available work-reports, as defined in [eq:availableworkreports]. We define the statistics as follows: $$\begin{aligned}
  \forall c \in \coreindex : \corestats'\subb{c} &\equiv \tup{
    \begin{alignedat}{5}
      \is{\csNimportcount&}{R(c)_\Nimportcount}\,,\;
      \is{&\csNxtcount&}{R(c)_\Nxtcount}\,,\;
      \is{&\csNxtsize&}{R(c)_\Nxtsize}\,,\\
      \is{\csNexportcount&}{R(c)_\Nexportcount}\,,\;
      \is{&\csNgasused&}{R(c)_\Ngasused}\,,\;
      \is{&\csNbundlelen&}{L(c)}\,,\\
      \is{\csNdaload&}{D(c)}\,,\;
      \is{&\csNpopularity&}{\span\span \textstyle \sum_{a \in \xtassurances} a_\xaNavailabilities\subb{c}\qquad}
    \end{alignedat}
  }\!\!\!\!\\
  \where R(c \in \coreindex) &\equiv
    \!\!\!\!\!\!\!\!\!\!\!
    \sum_{\wdX \in \wrX_\wrNdigests, \wrX \in \incomingreports, \wrX_\wrNcore = c}
    \!\!\!\!\!\!\!\!\!\!\!
    \tup{
      \wdX_\Nimportcount,
      \wdX_\Nxtcount,
      \wdX_\Nxtsize,
      \wdX_\Nexportcount,
      \wdX_\Ngasused,
    }\\
  \also L(c \in \coreindex) &\equiv
    \!\!\!\!\!\!\!
    \sum_{\wrX \in \incomingreports, \wrX_\wrNcore = c}
    \!\!\!\!\!\!\!
    (\wrX_\wrNavspec)_\asNbundlelen\\
  \also D(c \in \coreindex) &\equiv
    \!\!\!\!\!\!
    \sum_{\wrX \in \justbecameavailable, \wrX_\wrNcore = c}
    \!\!\!\!\!\!
    (\wrX_\wrNavspec)_\asNbundlelen +
    \Csegmentsize\ceil{(\wrX_\wrNavspec)_\asNsegcount\nicefrac{65}{64}}\end{aligned}$$

Finally, the service statistics are updated using the same intermediate values as the core statistics, but with a different set of calculations: $$\begin{aligned}
  \forall s \in \mathbf{s}: \servicestats'\subb{s} &\equiv \tup{
    \begin{alignedat}{5}
      \is{\ssNimportcount&}{R(s)_\Nimportcount}\,,\;
      \is{&\ssNxtcount&}{R(s)_\Nxtcount}\,,\;
      \is{&\ssNxtsize&}{R(s)_\Nxtsize}\,,\\
      \is{\ssNexportcount&}{R(s)_\Nexportcount}\,,\;
      \is{&\ssNrefinement&}{\span\span\tup{R(s)_n, R(s)_\Ngasused}}\,,\;\\
      \is{\ssNprovision&}{
        \span\span\textstyle
        \sum_{\tup{\xpNserviceindex, \xpNdata}\,\in \xtpreimages}\tup{1, \len{\xpNdata}}
      }\,,\;\\
      \is{\ssNaccumulation&}{
        \span\span
        \subifnone{\accumulationstatistics\subb{s}, \tup{0, 0}}
      }
    \end{alignedat}
  }\!\!\!\!\\
  \where \mathbf{s}&=
    \mathbf{s}^R\cup
    \mathbf{s}^P\cup
    \keys{\accumulationstatistics}\\
  \also \mathbf{s}^R&= \set{
    \build{\wdX_\wdNserviceindex}{\wdX \in \wrX_\wrNdigests, \wrX \in \incomingreports}
  }\\
  \also \mathbf{s}^P&= \set{
    \build{s}{\exists x: \tup{s, x} \in \xtpreimages}
  }\\
  \also R(s \in \serviceid) &\equiv
    \!\!\!\!\!\!\!\!\!\!\!
    \sum_{\wdX \in \wrX_\wrNdigests, \wrX \in \incomingreports, \wdX_\wdNserviceindex = s}
    \!\!\!\!\!\!\!\!\!\!\!
    \tup{
      \is{n}{1},
      \wdX_\wdNgasused,
      \wdX_\wdNimportcount,
      \wdX_\wdNxtcount,
      \wdX_\wdNxtsize,
      \wdX_\wdNexportcount
    }\end{aligned}$$
