import FirecrawlApp from "firecrawl";
import { fetchAndStorePages } from "./fetchPages.js";

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Example usage using Firecrawl mapping:
// 1. Fetch from sitemap
// await fetchAndStorePages(
//   {
//     sitemapUrl: "https://docs.jamcha.in/sitemap.xml",
//   },
//   "docs.jamcha.in"
// );

// 2. Fetch from jam.web3.foundation using Firecrawl mapping
console.log("Mapping jam.web3.foundation to get all URLs...");
const jamMapResult = await firecrawl.mapUrl("https://jam.web3.foundation");
if (jamMapResult.success && jamMapResult.links) {
  console.log(
    `Found ${jamMapResult.links.length} URLs for jam.web3.foundation`
  );
  await fetchAndStorePages(jamMapResult.links, "jam.web3.foundation");
} else {
  console.error("Failed to map jam.web3.foundation:", jamMapResult.error);
}

// Alternative examples:
// 3. Fetch single URL (still supported)
// await fetchAndStorePages(
//   "https://jam-docs.onrender.com/advanced/rpc/jip2-node-rpc",
//   "jam-docs.onrender.com"
// );

// 4. Fetch multiple specific URLs (still supported)
// await fetchAndStorePages(
//   ["https://jam.web3.foundation", "https://jam.web3.foundation/rules"],
//   "jam.web3.foundation"
// );
