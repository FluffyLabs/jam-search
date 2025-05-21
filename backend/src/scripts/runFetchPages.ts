import { fetchAndStorePages } from "./fetchPages.js";

// Example usage:
// 1. Fetch from sitemap
await fetchAndStorePages(
  {
    sitemapUrl: "https://docs.jamcha.in/sitemap.xml",
  },
  "https://docs.jamcha.in"
);

// 2. Fetch single URL
// await fetchAndStorePages(
//   "https://jam-docs.onrender.com/advanced/rpc/jip2-node-rpc"
// );

// 3. Fetch multiple URLs
// await fetchAndStorePages([
//   "https://docs.jamcha.in/basics/chain-spec",
//   "https://docs.jamcha.in/basics/cli-args",
//   "https://docs.jamcha.in/basics/dev-accounts"
// ]);
