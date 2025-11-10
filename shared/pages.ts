export const PAGES: Page[] = [
  {
    kind: "sitemap",
    name: "docs.jamcha.in",
    sitemapUrl: "https://docs.jamcha.in/sitemap.xml",
  },
  {
    kind: "url",
    name: "jam.web3.foundation",
    url: "https://jam.web3.foundation",
  },
];

export type Page =
  | {
      kind: "sitemap";
      name: string;
      sitemapUrl: string;
    }
  | {
      kind: "url";
      name: string;
      url: string;
    };
