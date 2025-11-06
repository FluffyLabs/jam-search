import FirecrawlApp from "firecrawl";
import { db } from "../db/db.js";
import { env } from "../env.js";
import { fetchAndStorePages } from "../scripts/fetchPages.js";

const FIRECRAWL_API_KEY = env.FIRECRAWL_API_KEY;

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in docs pages job:", error);
  process.exit(1);
}

async function main() {
  console.log("Running docs pages fetch job at", new Date().toISOString());

  // Keep original sitemap approach for docs.jamcha.in
  await fetchAndStorePages(
    {
      sitemapUrl: "https://docs.jamcha.in/sitemap.xml",
    },
    "docs.jamcha.in"
  );

  // Use Firecrawl to map jam.web3.foundation and get all URLs
  const firecrawl = new FirecrawlApp({
    apiKey: FIRECRAWL_API_KEY,
  });

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

  console.log("Docs pages fetch job completed successfully");
  await db.$client.end();
}
