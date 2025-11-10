import { Source } from "./sources.js";

export const PAGES: Page[] = [
  {
    source: Source.Jamchain,
    kind: "sitemap",
    dbId: "docs.jamcha.in",
    link: "https://docs.jamchain.in",
    sitemapUrl: "https://docs.jamcha.in/sitemap.xml",
  },
  {
    source: Source.JamWeb3Foundation,
    kind: "url",
    dbId: "jam.web3.foundation",
    link: "https://jam.web3.foundation",
    url: "https://jam.web3.foundation",
  },
];

type Common = {
  /** Database identifier (not readable name) */
  dbId: string;
  source: Source;
  link: string;
};
export type Page = Common &
  (
    | {
        kind: "sitemap";
        sitemapUrl: string;
      }
    | {
        kind: "url";
        url: string;
      }
  );
